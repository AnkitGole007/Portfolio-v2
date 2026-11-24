import type { Metadata } from 'next'
import { RECOGNITION_KINDS, listJoin, profile, recognitionCounts, recognitionTotal, SITE_URL, year } from '@/lib/content'
import { JsonLd, breadcrumbJsonLd } from '@/lib/jsonld'
import { fitDescription, ownerLine } from '@/lib/seo'
import { CredentialWallet } from '@/components/credentials'
import { Block } from '@/components/about/block'
import { PortraitCard } from '@/components/about/portrait-card'
import { Facts, Story } from '@/components/about/story'
import { ActivityTimeline, EducationTimeline } from '@/components/about/timelines'
import { RecognitionTable } from '@/components/about/recognition-table'
import { Rows, WritingList, leadershipRows } from '@/components/about/lists'
import { Availability } from '@/components/about/availability'

const { identity, education, recognition, certifications, activity, writing } = profile
const leadership = leadershipRows()

// 150 to 160 characters from the content model: who, the first degree, then awards, certifications and
// languages as room allows. The title reaches the social card through Next's fallback.
const degree = education[0]
const DESCRIPTION = fitDescription(
  [`${ownerLine}.`, ...(degree ? [`${degree.degree} in ${degree.field}, ${degree.abbr}${degree.gpa ? `, GPA ${degree.gpa}` : ''}.`] : [])],
  [
    recognitionTotal()
      ? { lead: 'Awards: ', partial: 'Awards include ', items: recognition.filter((r) => r.kind !== 'certification').map((r) => r.title) }
      : null,
    certifications.length ? `${certifications.length} ${certifications.length === 1 ? 'certification' : 'certifications'}.` : null,
    `Languages: ${listJoin(identity.languages)}.`,
  ],
)

export const metadata: Metadata = {
  title: 'About',
  description: DESCRIPTION,
  alternates: { canonical: '/about', types: { 'text/markdown': '/md/about.md' } },
  openGraph: {
    type: 'website',
    url: '/about',
    description: DESCRIPTION,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: `${identity.name}, ${identity.title}` }],
  },
}

/** The Person node lives in the layout (lib/jsonld.tsx); this page is a ProfilePage about it. */
function aboutPageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${SITE_URL}/about#profilepage`,
    url: `${SITE_URL}/about`,
    name: `About ${identity.name}`,
    dateModified: profile.meta.lastUpdated,
    mainEntity: { '@id': `${SITE_URL}/#person` },
  }
}

/** Labels for the kinds the shared grouping leaves out; they still appear as rows in the table. */
const OTHER_KIND: Record<string, { one: string; many: string }> = {
  publication: { one: 'publication', many: 'publications' },
  certification: { one: 'certification', many: 'certifications' },
}

const andList = (parts: string[]) =>
  parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}` : (parts[0] ?? '')

/**
 * "16 awards and honors, 2017 to 2026: 6 awards, 4 honors, 2 fellowships and 4 contest results. The table also
 * lists 1 publication and 2 certifications." Totals come from recognitionCounts(), the same grouping the home page uses.
 */
function recognitionIntro(): string {
  const counted = new Set<string>(RECOGNITION_KINDS.map((k) => k.kind))
  const list = andList(recognitionCounts().map((c) => `${c.count} ${c.label}`))
  const years = recognition.filter((r) => counted.has(r.kind)).map((r) => year(r.date)).sort()
  const others = new Map<string, number>()
  for (const r of recognition) if (!counted.has(r.kind)) others.set(r.kind, (others.get(r.kind) ?? 0) + 1)
  const extra = andList(
    [...others.entries()].map(([kind, n]) => {
      const label = OTHER_KIND[kind] ?? { one: kind, many: kind }
      return `${n} ${n === 1 ? label.one : label.many}`
    }),
  )
  const first = years[0]
  const last = years[years.length - 1]
  const span = first === last ? first : `${first} to ${last}`
  // One kind only ("2 awards, 2025."): the breakdown would repeat the total.
  const head = recognitionCounts().length === 1 ? `${list}, ${span}.` : `${recognitionTotal()} awards and honors, ${span}: ${list}.`
  return extra ? `${head} The table also lists ${extra}.` : head
}

function educationIntro(): string {
  const starts = education.map((e) => e.start).sort()
  const ends = education.map((e) => e.end).sort()
  return `${education.length} ${education.length === 1 ? 'degree' : 'degrees'}, ${year(starts[0])} to ${year(ends[ends.length - 1])}.`
}

function certificationsIntro(): string {
  const issuers = new Set(certifications.flatMap((c) => (c.issuer ? [c.issuer] : []))).size
  const dated = certifications.some((c) => c.date)
  const from = issuers ? ` from ${issuers} ${issuers === 1 ? 'issuer' : 'issuers'}` : ''
  return `${certifications.length} ${certifications.length === 1 ? 'certification' : 'certifications'}${from}${dated ? ', newest first' : ''}.`
}

export default function AboutPage() {
  // One set for the whole opening, so a glossary term is explained once across the letter and the facts.
  const seen = new Set<string>()
  const sideLists = leadership.length > 0 || writing.length > 0
  // A wallet of scans needs the full width; a list of titles shares the row with leadership and writing.
  const wide = !sideLists || certifications.some((c) => c.image)

  return (
    <div className="container-site py-12 md:py-16">
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])} />
      <JsonLd data={aboutPageJsonLd()} />

      {/* Phones read the h1 and headline, the portrait, the letter, then the facts and actions. From md the letter
          holds the left columns and the portrait, with the facts under it, the right ones, both from the top. From lg
          the portrait takes half the row, so the person is the one large thing on the first screen. */}
      <header className="grid gap-y-8 md:grid-cols-12 md:grid-rows-[auto_auto_1fr] md:gap-x-6 md:gap-y-0">
        <div className="md:col-span-7 md:row-start-1 lg:col-span-6">
          <h1 className="text-display">About</h1>
          <p className="text-title mt-3 max-w-[34ch] text-ink-2">{identity.headline}</p>
        </div>
        <div className="md:col-span-5 md:col-start-8 md:row-span-2 md:row-start-1 lg:col-span-6 lg:col-start-7">
          {/* Half the column on phones (160 to 240 px), so the letter starts near the first screen's edge; the column's full width from md. */}
          <PortraitCard
            loading="eager"
            sizes="(min-width: 1440px) 660px, (min-width: 1024px) 46vw, (min-width: 768px) 40vw, 50vw"
            className="w-1/2 max-w-60 min-w-40 md:w-full md:max-w-none md:min-w-0"
          />
        </div>
        <div className="md:col-span-7 md:row-span-2 md:row-start-2 md:mt-10 md:pr-4 lg:col-span-6">
          <Story seen={seen} />
        </div>
        <div className="md:col-span-5 md:col-start-8 md:row-start-3 md:mt-8 lg:col-span-6 lg:col-start-7">
          <Facts seen={seen} />
        </div>
      </header>

      <div className="mt-12 md:mt-20">
        <Block id="education" title="Education" intro={educationIntro()}>
          <EducationTimeline />
        </Block>

        {recognition.length > 0 ? (
          // No cv-auto here: its paint containment would clip the table's toned rows where they reach into the gutter.
          <Block id="recognition" title="Recognition" intro={recognitionIntro()}>
            <RecognitionTable />
          </Block>
        ) : null}

        {/* Certifications at the left, leadership and writing stacked at the right from md; blocks with nothing on record are left out. */}
        <div className="grid md:grid-cols-12 md:gap-x-6">
          {certifications.length > 0 ? (
            <Block
              id="certifications"
              title="Certifications"
              intro={certificationsIntro()}
              className={wide ? 'md:col-span-12' : 'md:col-span-6 lg:col-span-7'}
            >
              <CredentialWallet />
            </Block>
          ) : null}
          {sideLists ? (
            <div className={wide ? 'md:col-span-12 md:grid md:grid-cols-2 md:gap-x-6' : 'md:col-span-6 lg:col-span-5'}>
              {leadership.length > 0 ? (
                <Block id="leadership" title="Leadership">
                  <Rows rows={leadership} />
                </Block>
              ) : null}
              {writing.length > 0 ? (
                <Block id="writing" title="Writing">
                  <WritingList />
                </Block>
              ) : null}
            </div>
          ) : null}
        </div>

        {activity.length > 0 ? (
          <Block id="activity" title="Activity" className="cv-auto">
            <ActivityTimeline />
          </Block>
        ) : null}

        <Block id="availability" title="Availability">
          <Availability />
        </Block>
      </div>
    </div>
  )
}
