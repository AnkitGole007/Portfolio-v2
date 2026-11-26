import { nameParts, orgKey, profile, profileLinks, repoStats, SITE_URL, VCARD_PATH, type Experience, type Project, type Publication } from '@/lib/content'
import { PITCH_SECONDS, hasPitch, pitchPosterSrc, pitchThumbSrc, pitchVideoSrc } from '@/components/reel/pitch-slugs'
import { publicImageSize } from '@/components/projects/figure'

const { identity, links, meta } = profile
const PERSON_ID = `${SITE_URL}/#person`
const WEBSITE_ID = `${SITE_URL}/#website`
const PROFILE_PAGE_ID = `${SITE_URL}/#profilepage`

/** The owner's portrait from profile.json, or null when the profile carries none. */
const PORTRAIT = identity.portrait?.src ?? null

const abs = (path: string) => `${SITE_URL}${path}`
const projectUrl = (slug: string) => abs(`/projects/${slug}`)
const pitchId = (slug: string) => `${projectUrl(slug)}#pitch`
const projectId = (slug: string) => `${projectUrl(slug)}#project`
/** "2025-08" -> "2025-08-01"; a year-only "2025" stays a valid ISO 8601 year, with no month invented. */
const isoDate = (ym: string) => (/^\d{4}$/.test(ym) ? ym : `${ym}-01`)

/** The three-second strip as one paragraph: problem, what the owner did, what changed. */
export function pitchText(p: Project): string {
  return `${p.pitch.problem} ${p.pitch.action} ${p.pitch.change}`
}

export function JsonLd({ data }: { data: unknown }) {
  if (!data) return null
  // Escape "<" so a value can never close the script tag.
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}

/**
 * The portrait as an ImageObject, shared by Person, WebSite and ProfilePage so every surface names the
 * same picture. Spread into those objects: an empty object when the profile has no portrait.
 */
function portraitImage() {
  if (!PORTRAIT) return {}
  const size = publicImageSize(PORTRAIT)
  const image = {
    '@type': 'ImageObject',
    '@id': `${SITE_URL}/#portrait`,
    url: abs(PORTRAIT),
    contentUrl: abs(PORTRAIT),
    width: size.width,
    height: size.height,
    caption: `${identity.name}, ${identity.title}`,
  }
  return { image }
}

const organization = (e: Experience) => ({ '@type': 'Organization', name: e.org, ...(e.orgUrl ? { url: e.orgUrl } : {}) })
/** One entry per organization (orgKey), in profile order. */
const distinctOrgs = (roles: Experience[]) => roles.filter((e, i) => roles.findIndex((x) => orgKey(x.org) === orgKey(e.org)) === i)

/** A role at a school the owner studied at (a teaching or lab position while enrolled): alumniOf already names the school. */
const atOwnSchool = (e: Experience) => profile.education.some((ed) => orgKey(ed.institution) === orgKey(e.org))
const isVolunteer = (e: Experience) => /volunteer/i.test(e.type)

/**
 * Who the owner works for today and who he contributes to. worksFor holds the ongoing roles that are not
 * volunteer work (the Handshake AI contract); affiliation holds the ongoing volunteer roles (the B2
 * Foundation). An ongoing role at his own school (the GLA) is left to alumniOf rather than listed as an employer.
 */
function currentOrganizations() {
  const ongoing = profile.experience.filter((e) => e.status === 'ongoing' && !atOwnSchool(e))
  return {
    employers: distinctOrgs(ongoing.filter((e) => !isVolunteer(e))).map(organization),
    affiliations: distinctOrgs(ongoing.filter(isVolunteer)).map(organization),
  }
}

/** Documents about the owner that a visitor can download: the contact card (the only machine surface that carries the email) and the resume when one is linked. */
function personDocuments() {
  const docs = [
    {
      '@type': 'DigitalDocument',
      name: `${identity.name}, contact card (vCard)`,
      url: abs(VCARD_PATH),
      encodingFormat: 'text/vcard',
      about: { '@id': PERSON_ID },
    },
  ]
  if (links.resumePdf) {
    docs.push({
      '@type': 'DigitalDocument',
      name: `${identity.name}, resume (PDF)`,
      url: abs(links.resumePdf),
      encodingFormat: 'application/pdf',
      about: { '@id': PERSON_ID },
    })
  }
  return docs
}

/** The owner's awards as "title, org", or nothing when none is on record. */
function awards() {
  const list = profile.recognition.filter((r) => r.kind !== 'certification').map((r) => `${r.title}, ${r.org}`)
  return list.length ? { award: list } : {}
}

// No email or phone on purpose: the address is assembled on the client when a visitor asks for it,
// and the vCard route is the one attachment that carries it.
export function personJsonLd() {
  const { employers, affiliations } = currentOrganizations()
  const { given, family } = nameParts(identity.name)
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: identity.name,
    alternateName: identity.fullName,
    givenName: given,
    familyName: family,
    url: SITE_URL,
    ...portraitImage(),
    jobTitle: identity.title,
    description: identity.summary,
    knowsLanguage: identity.languages,
    address: {
      '@type': 'PostalAddress',
      addressLocality: identity.location.city,
      addressRegion: identity.location.region,
      addressCountry: identity.location.country,
    },
    hasOccupation: {
      '@type': 'Occupation',
      name: identity.title,
      occupationLocation: { '@type': 'City', name: identity.location.city },
    },
    alumniOf: profile.education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.institution, ...(e.url ? { url: e.url } : {}) })),
    hasCredential: profile.education.map((e) => ({
      '@type': 'EducationalOccupationalCredential',
      name: `${e.degree} in ${e.field}`,
      credentialCategory: 'degree',
      recognizedBy: { '@type': 'CollegeOrUniversity', name: e.institution, ...(e.url ? { url: e.url } : {}) },
    })),
    ...awards(),
    knowsAbout: Object.values(profile.skills).flat(),
    sameAs: profileLinks().map((l) => l.url),
    ...(employers.length ? { worksFor: employers } : {}),
    ...(affiliations.length ? { affiliation: affiliations } : {}),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'professional inquiries',
      url: links.scheduling || links.linkedin,
      availableLanguage: identity.languages,
    },
    subjectOf: personDocuments(),
    mainEntityOfPage: { '@id': PROFILE_PAGE_ID },
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: identity.name,
    alternateName: SITE_URL.replace(/^https?:\/\//, ''),
    url: SITE_URL,
    description: `Portfolio of ${identity.name}, ${identity.headline}.`,
    inLanguage: 'en-US',
    ...portraitImage(),
    dateModified: meta.lastUpdated,
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
    copyrightHolder: { '@id': PERSON_ID },
    about: { '@id': PERSON_ID },
  }
}

export function profilePageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': PROFILE_PAGE_ID,
    url: SITE_URL,
    name: `${identity.name}, ${identity.title}`,
    description: identity.headline,
    inLanguage: 'en-US',
    dateModified: meta.lastUpdated,
    ...portraitImage(),
    ...(PORTRAIT ? { primaryImageOfPage: { '@id': `${SITE_URL}/#portrait` } } : {}),
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: { '@id': PERSON_ID },
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  }
}

/** One paper. A submitted paper gets dateCreated and its status; only an accepted or published one gets datePublished. */
export function scholarlyArticleJsonLd(p: Publication) {
  const published = /accepted|published/i.test(p.status)
  const date = `${p.date}-01`
  const identities = ['paper', 'openreview', 'projectPage'].map((key) => p.links[key]).filter(Boolean)
  return {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    '@id': abs(`/research#${p.id}`),
    headline: p.title,
    name: p.title,
    description: p.tldr,
    abstract: p.abstract,
    ...(published ? { datePublished: date } : { dateCreated: date }),
    creativeWorkStatus: p.status,
    url: p.links.paper ?? p.venueUrl,
    ...(identities.length ? { sameAs: identities } : {}),
    mainEntityOfPage: { '@type': 'WebPage', '@id': abs('/research') },
    author: p.authors.map((a) =>
      a === identity.fullName ? { '@id': PERSON_ID, '@type': 'Person', name: a } : { '@type': 'Person', name: a },
    ),
    publisher: { '@type': 'Organization', name: p.venue },
    publication: { '@type': 'PublicationEvent', name: p.venueFull, url: p.venueUrl },
    isAccessibleForFree: true,
    inLanguage: 'en',
    ...(p.tags.length ? { keywords: p.tags.join(', ') } : {}),
  }
}

export function projectJsonLd(p: Project) {
  const pitch = hasPitch(p.slug)
  const images = [...(pitch ? [abs(pitchPosterSrc(p.slug))] : []), ...(p.visual ? [abs(p.visual.src)] : [])]
  const base = {
    '@context': 'https://schema.org',
    '@id': projectId(p.slug),
    name: p.name,
    ...(p.subtitle ? { alternativeHeadline: p.subtitle } : {}),
    description: p.summary,
    abstract: pitchText(p),
    url: projectUrl(p.slug),
    mainEntityOfPage: { '@type': 'WebPage', '@id': projectUrl(p.slug) },
    author: { '@id': PERSON_ID },
    ...(p.start ? { dateCreated: isoDate(p.start) } : {}),
    ...(p.end ? { dateModified: isoDate(p.end) } : {}),
    ...(p.tags.length ? { keywords: p.tags.join(', ') } : {}),
    inLanguage: 'en',
    ...(images.length ? { image: images } : {}),
    ...(pitch ? { video: { '@id': pitchId(p.slug) } } : {}),
    ...(p.recognition ? { award: p.recognition } : {}),
  }
  if (p.repo) {
    const language = repoStats(p.repo)?.language
    return {
      ...base,
      '@type': 'SoftwareSourceCode',
      codeRepository: p.repo,
      ...(language ? { programmingLanguage: language } : {}),
    }
  }
  return { ...base, '@type': 'CreativeWork' }
}

/**
 * The 25-second pitch of a project as a VideoObject, with the WebP poster and thumbnail.
 * Null when no pitch video exists for the slug (and the project carries no video of its own).
 */
export function videoJsonLd(p: Project) {
  if (!hasPitch(p.slug) && !p.video) return null
  const contentUrl = p.video ? abs(p.video) : abs(pitchVideoSrc(p.slug))
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    '@id': pitchId(p.slug),
    name: `${p.name}: ${PITCH_SECONDS}-second pitch`,
    description: pitchText(p),
    thumbnailUrl: [abs(pitchPosterSrc(p.slug)), abs(pitchThumbSrc(p.slug))],
    contentUrl,
    url: projectUrl(p.slug),
    mainEntityOfPage: { '@type': 'WebPage', '@id': projectUrl(p.slug) },
    uploadDate: meta.lastUpdated,
    duration: `PT${PITCH_SECONDS}S`,
    inLanguage: 'en',
    isFamilyFriendly: true,
    author: { '@id': PERSON_ID },
    about: { '@id': projectId(p.slug) },
  }
}

/** The projects index as a summary list: one ListItem per project pointing at its page. */
export function itemListJsonLd(projects: Project[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': abs('/projects#list'),
    name: `Projects by ${identity.name}`,
    numberOfItems: projects.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: projects.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: projectUrl(p.slug),
    })),
  }
}

/**
 * ItemList of the pitch reel (home page). Pass the ordered slugs; slugs without a pitch video are skipped.
 * Each entry points at the project page and references that page's VideoObject by its @id, which
 * videoJsonLd() defines in full there, so the home page does not repeat every video's metadata.
 */
export function reelItemListJsonLd(slugs: readonly string[]) {
  const pitched = slugs.flatMap((slug) => {
    const p = profile.projects.find((x) => x.slug === slug)
    return p && videoJsonLd(p) ? [p] : []
  })
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_URL}/#pitch-reel`,
    name: `Pitch reel: ${PITCH_SECONDS}-second project pitches by ${identity.name}`,
    numberOfItems: pitched.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: pitched.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${p.name}: ${PITCH_SECONDS}-second pitch`,
      url: projectUrl(p.slug),
      item: { '@id': pitchId(p.slug) },
    })),
  }
}
