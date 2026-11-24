#!/usr/bin/env node
// Builds the markdown mirror of the site from content/profile.json into public/md/:
// index.md, projects.md, projects/<slug>.md, about.md and resume.md, plus research.md while a paper or
// a research role is on record (the /research page is a 404 otherwise).
// proxy.ts serves these files to clients that ask for text/markdown, /llms.txt links them
// and /llms-full.txt concatenates them at build time. Runs on prebuild; the output is committed.
// The mirrors never carry the email address: the contact paths are LinkedIn, the scheduling
// link and the vCard, which is the one attachment that includes the address.
// Every optional field is gated: a missing value or an empty list leaves its line or section out.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public', 'md')
const profile = JSON.parse(readFileSync(join(ROOT, 'content', 'profile.json'), 'utf8'))
const { identity, links, meta, now } = profile
// The public origin, the same rule as lib/content.ts SITE_URL: NEXT_PUBLIC_SITE_URL, then the deployment's own
// VERCEL_URL on a Vercel preview or development build, then the placeholder default until the domain is live.
const UNNAMED_PREVIEW =
  Boolean(process.env.VERCEL_ENV) && process.env.VERCEL_ENV !== 'production' && !process.env.NEXT_PUBLIC_SITE_URL
const PREVIEW_ORIGIN = UNNAMED_PREVIEW && process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || PREVIEW_ORIGIN || 'https://ankitgole.dev').replace(/\/+$/, '')
// lib/content.ts hasResearch: the /research page, its mirror and every link to them depend on it.
const hasResearch = profile.publications.length > 0 || profile.research.length > 0
// The vCard route, lib/content.ts VCARD_PATH.
const VCARD = '/vcard.vcf'

// Kept in sync with lib/content.ts, which is TypeScript and cannot be imported from a plain Node script.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const KIND_LABEL = {
  research: 'Research',
  production: 'Production system',
  'computer-vision': 'Computer vision',
  'generative-ai': 'Generative AI',
  mlops: 'MLOps',
  'llm-systems': 'LLM systems',
  tooling: 'Developer tooling',
  robotics: 'Robotics',
  nlp: 'NLP',
  ml: 'Machine learning',
  'reinforcement-learning': 'Reinforcement learning',
  ar: 'Augmented reality',
  web: 'Web',
  evaluation: 'AI evaluation',
  other: 'Other',
}
const LINK_LABEL = {
  paper: 'Paper (PDF)',
  openreview: 'OpenReview',
  projectPage: 'Project page',
  code: 'Code',
  demo: 'Live demo',
  api: 'Inference API',
  marketplace: 'VS Code Marketplace',
}
const PROFILE_LINKS = [
  ['linkedin', 'LinkedIn'],
  ['github', 'GitHub'],
  ['medium', 'Medium'],
  ['orcid', 'ORCID'],
  ['huggingface', 'Hugging Face'],
  ['googleDev', 'Google Developers'],
  ['devto', 'Dev.to'],
  ['hackerrank', 'HackerRank'],
  ['vscodeMarketplace', 'VS Code Marketplace'],
]
// The kinds lib/content.ts RECOGNITION_KINDS counts as awards and honors; certificates live in their own list.
const HONOR_KINDS = new Set(['award', 'honor', 'fellowship', 'competition'])

// lib/content.ts isEarlierWork(): marked `earlier`, or ended in EARLIER_WORK_LAST_YEAR or before. The year is read
// from that file so the mirrors group projects exactly as /projects does.
const EARLIER_WORK_LAST_YEAR = Number(
  /EARLIER_WORK_LAST_YEAR = (\d{4})/.exec(readFileSync(join(ROOT, 'lib', 'content.ts'), 'utf8'))?.[1] ?? 2021,
)
const isEarlierWork = (p) => Boolean(p.earlier) || (p.end !== null && Number(p.end.slice(0, 4)) <= EARLIER_WORK_LAST_YEAR)

// The nominal pitch length lives in components/reel/pitch-slugs.ts (PITCH_SECONDS); read it so the two never drift.
const PITCH_SECONDS = Number(
  /PITCH_SECONDS = (\d+)/.exec(readFileSync(join(ROOT, 'components', 'reel', 'pitch-slugs.ts'), 'utf8'))?.[1] ?? 25,
)

/** "2026-05" -> "May 2026", "2025" -> "2025", missing -> "present". */
function formatMonth(ym) {
  if (!ym) return 'present'
  const [y, m] = ym.split('-')
  const idx = Number(m) - 1
  return MONTHS[idx] ? `${MONTHS[idx]} ${y}` : y
}
/** "Aug 2024 to May 2026"; equal ends collapse ("2025"); an undated entry gives an empty string. */
const formatRange = (start, end) => {
  if (!start) return ''
  if (end && end === start) return formatMonth(start)
  return `${formatMonth(start)} to ${formatMonth(end)}`
}
const abs = (path) => `${SITE}${path}`
const list = (items) => items.map((item) => `- ${item}`).join('\n')
const kind = (p) => KIND_LABEL[p.kind] ?? p.kind
/** The kind where it tells the reader something; "Other" says nothing (lib/content.ts informativeKind). */
const informativeKind = (p) => (p.kind === 'other' ? null : kind(p))
/** Only a project with an outcome on record has three different pitch cells (lib/content.ts hasDistinctPitch). */
const distinctPitch = (p) => !p.earlier && p.metrics.length > 0
const EARLIER_LINE = 'Listed for completeness. No outcome is on record for this build.'
const linkList = (obj) => Object.entries(obj).map(([key, url]) => `${LINK_LABEL[key] ?? key}: ${url}`)
const metrics = (p) => p.metrics.map((m) => `${m.label}: ${m.value}`)
const pitch = (p) =>
  distinctPitch(p)
    ? list([`Problem: ${p.pitch.problem}`, `What was done: ${p.pitch.action}`, `What changed: ${p.pitch.change}`])
    : p.earlier
      ? EARLIER_LINE
      : null
const publication = (id) => profile.publications.find((p) => p.id === id)
const experience = (id) => profile.experience.find((e) => e.id === id)
// Only the links profile.json carries; a missing key is left out rather than printed as undefined.
const profileLinks = () => PROFILE_LINKS.filter(([key]) => links[key]).map(([key, label]) => `${label}: ${links[key]}`)
const joinPresent = (parts, sep) => parts.filter(Boolean).join(sep)
/** A heading followed by its body, or nothing when the body is empty. */
const section = (heading, body) => (body && (!Array.isArray(body) || body.flat(Infinity).some(Boolean)) ? [heading, body] : null)
const projectPage = (p) => `${abs(`/projects/${p.slug}`)} (markdown: ${abs(`/md/projects/${p.slug}.md`)})`
const contact = () =>
  `Contact: ${joinPresent(
    [
      links.linkedin && `LinkedIn ${links.linkedin}`,
      links.scheduling && `Book a call: ${links.scheduling}`,
      `Contact card (vCard, includes the email address): ${abs(VCARD)}`,
    ],
    '. ',
  )}.`
// Work authorization is printed only when the profile opts in, with its stated wording.
const authorization = () => (identity.showWorkAuthorization && identity.availability.workAuthorization) || null
/** "Open to ... roles. Start date: june 2027." The start date is left out until it is on record. */
const availabilityLine = () => {
  const a = identity.availability
  return `${a.display}.${a.startDate ? ` Start date: ${a.startDate.toLowerCase()}.` : ''}`
}
/** "Subtitle. Kind, period, affiliation. Recognition." with the parts that exist. */
const projectFacts = (p) => {
  const facts = joinPresent([informativeKind(p), formatRange(p.start, p.end), p.earlier ? null : p.affiliation], ', ')
  return joinPresent([`${p.subtitle}.`, facts && `${facts}.`, p.recognition && `${p.recognition}.`], ' ')
}
const keyNumbers = (p) => (p.metrics.length ? `Key numbers: ${metrics(p).join('; ')}.` : null)
const gpa = (e) => (e.gpa ? `GPA ${e.gpa}/${e.gpaScale}.` : null)
const certification = (c) =>
  `${joinPresent([c.title, c.issuer, c.date && formatMonth(c.date)], ', ')}${c.credentialId ? ` (credential ${c.credentialId})` : ''}`
const writingLine = (w) => `${w.title} (${joinPresent([w.kind, w.platform, w.date && formatMonth(w.date)], ', ')})${w.url ? `: ${w.url}` : ''}`
const honors = () => profile.recognition.filter((r) => HONOR_KINDS.has(r.kind))
const researchProjects = () => profile.projects.filter((p) => p.kind === 'research')

// Pitch videos live in public/videos/<slug>.mp4 with a WebP poster; a project lists one when the file exists.
const pitchVideo = (p) => (existsSync(join(ROOT, 'public', 'videos', `${p.slug}.mp4`)) ? `/videos/${p.slug}.mp4` : null)
const pitchPoster = (video) => video.replace(/\.mp4$/, '.webp')
const videoLine = (p) => {
  const video = pitchVideo(p)
  return video ? `Pitch video (${PITCH_SECONDS} seconds): ${abs(video)} (poster: ${abs(pitchPoster(video))}).` : null
}

/** Joins blocks (strings or nested arrays, empty values dropped) with blank lines and adds a provenance footer. */
function doc(title, blocks, pagePath, mdPath) {
  const body = blocks
    .flat(Infinity)
    .filter((block) => typeof block === 'string' && block.trim().length > 0)
    .join('\n\n')
  const footer = `Canonical page: ${abs(pagePath)}. This markdown: ${abs(mdPath)}. Written by ${identity.name}; generated from the site content model, last updated ${meta.lastUpdated}.`
  return `# ${title}\n\n${body}\n\n${footer}\n`
}

function educationLines(e, { withUrl }) {
  return [
    `### ${e.degree} in ${e.field}`,
    joinPresent(
      [`${e.institution} (${e.abbr}), ${e.location}, ${formatRange(e.start, e.end)}.`, gpa(e), withUrl && e.url],
      ' ',
    ),
    e.coursework.length ? `Coursework: ${e.coursework.join(', ')}.` : null,
    e.honors.length ? `Honors: ${e.honors.join('. ')}.` : null,
    e.activities?.length ? `Activities: ${e.activities.join(', ')}.` : null,
  ]
}

function indexMd() {
  const a = identity.availability
  const featured = profile.projects.filter((p) => p.featured)
  const research = [...profile.publications, ...profile.research]
  return doc(
    identity.name,
    [
      `${identity.headline}.`,
      `> ${identity.summary}`,
      identity.tagline,
      `## Now (${now.date})`,
      list(now.lines),
      '## At a glance',
      list(
        [
          `Title: ${identity.title}`,
          `Location: ${identity.location.display}`,
          `Availability: ${availabilityLine()}`,
          authorization() && `Work authorization: ${authorization()}`,
          `Target roles: ${a.roles.join(', ')}`,
          `Target locations: ${a.locations.join(', ')}`,
          `Contact: ${joinPresent([links.linkedin && `LinkedIn ${links.linkedin}`, links.scheduling && `book a call ${links.scheduling}`, `contact card (vCard) ${abs(VCARD)}`], ', ')}`,
          `Resume: ${joinPresent([links.resumePdf && `${abs(links.resumePdf)} (PDF)`, `${abs('/resume')} (HTML)`, `${abs('/md/resume.md')} (markdown)`], ', ')}`,
        ].filter(Boolean),
      ),
      section(
        '## Recognition',
        honors().length ? list(honors().map((r) => `${r.title}, ${r.org}, ${formatMonth(r.date)}.${r.note ? ` ${r.note}` : ''}`)) : null,
      ),
      '## Featured projects',
      featured.map((p) => [
        `### ${p.name}`,
        projectFacts(p),
        pitch(p),
        p.summary,
        keyNumbers(p),
        videoLine(p),
        `Details: ${projectPage(p)}.${p.repo ? ` Code: ${p.repo}` : ''}`,
      ]),
      `All ${profile.projects.length} projects: ${abs('/projects')} (markdown: ${abs('/md/projects.md')}).`,
      section(
        '## Research',
        research.length
          ? [
              list(
                profile.publications.map(
                  (p) => `${p.title}. ${p.displayString}, ${formatMonth(p.date)}. ${p.tldr} ${p.links.paper ?? p.venueUrl}`,
                ),
              ),
              `Full detail: ${abs('/research')} (markdown: ${abs('/md/research.md')}).`,
            ]
          : null,
      ),
      '## Experience',
      list(
        profile.experience.map(
          (e) =>
            `${joinPresent([e.role, e.org, formatRange(e.start, e.end), e.location], ', ')}. ${e.summary}${e.award ? ` Award: ${e.award}.` : ''}`,
        ),
      ),
      '## Education',
      list(
        profile.education.map((e) =>
          joinPresent([`${e.degree} in ${e.field}, ${e.institution}, ${formatRange(e.start, e.end)}.`, gpa(e)], ' '),
        ),
      ),
      '## Skills',
      list(Object.entries(profile.skills).map(([group, items]) => `${group}: ${items.join(', ')}`)),
      section('## Writing', profile.writing?.length ? list(profile.writing.map(writingLine)) : null),
      '## Elsewhere',
      list(profileLinks()),
      contact(),
    ],
    '/',
    '/md/index.md',
  )
}

function projectsMd() {
  const kinds = [...new Set(profile.projects.map(kind))]
  const pitched = profile.projects.filter((p) => pitchVideo(p)).length
  const main = profile.projects.filter((p) => !isEarlierWork(p))
  const earlier = profile.projects.filter(isEarlierWork)
  const entry = (p, level) => [
    `${level} ${p.name}`,
    projectFacts(p),
    pitch(p),
    p.summary,
    keyNumbers(p),
    p.tags.length ? `Stack: ${p.tags.join(', ')}.` : null,
    videoLine(p),
    `Details: ${projectPage(p)}.${p.repo ? ` Code: ${p.repo}` : ''}`,
  ]
  return doc(
    `Projects by ${identity.name}`,
    [
      `${profile.projects.length} projects, featured work first${earlier.length ? `, then ${earlier.length} older and minor projects under Earlier work` : ''}. Kinds: ${kinds.join(', ')}. Each entry with an outcome on record opens with the three-second strip (problem, what was done, what changed), and every entry links to a full page with the approach, results and stack.${pitched > 0 ? ` ${pitched} ${pitched === 1 ? 'project carries' : 'projects carry'} a ${PITCH_SECONDS}-second pitch video.` : ''}`,
      main.map((p) => entry(p, '##')),
      section('## Earlier work', earlier.map((p) => entry(p, '###'))),
    ],
    '/projects',
    '/md/projects.md',
  )
}

function projectMd(p) {
  const pub = publication(p.publicationId)
  const role = experience(p.experienceId)
  const video = pitchVideo(p)
  const period = formatRange(p.start, p.end)
  const facts = [
    informativeKind(p) ? `Kind: ${informativeKind(p)}` : null,
    period ? `Period: ${period} (${p.status})` : null,
    p.affiliation && !p.earlier ? `Affiliation: ${p.affiliation}` : null,
    p.role ? `Role: ${p.role}` : null,
    p.team.length ? `Team: ${identity.name} with ${p.team.join(', ')}` : null,
    p.recognition ? `Recognition: ${p.recognition}` : null,
    p.repo ? `Repository: ${p.repo}` : null,
    ...linkList(p.links),
  ].filter(Boolean)
  return doc(
    p.name,
    [
      `${p.subtitle}.`,
      pitch(p),
      `> ${p.summary}`,
      facts.length ? list(facts) : null,
      // An earlier build's problem and approach restate its subtitle and name, so they are left out.
      p.earlier ? null : ['## Problem', p.problem, '## Approach', p.approach],
      section(
        '## Pipeline',
        p.pipeline?.length
          ? list(p.pipeline.map((s) => (s.count === null ? s.label : `${s.label}: ${s.count.toLocaleString('en-US')}`)))
          : null,
      ),
      section('## Results', distinctPitch(p) && p.highlights.length ? list(p.highlights) : null),
      section('## Key numbers', p.metrics.length ? list(metrics(p)) : null),
      section('## Stack', p.tags.length ? p.tags.join(', ') : null),
      pub
        ? [
            '## Publication',
            `${pub.title}. ${pub.displayString}, ${formatMonth(pub.date)}. Authors: ${pub.authors.join(', ')}. ${pub.tldr}`,
            list(linkList(pub.links)),
          ]
        : null,
      role ? ['## Role', `${role.role}, ${role.org}, ${formatRange(role.start, role.end)}. ${role.summary}`] : null,
      video
        ? [
            '## Pitch video',
            `${PITCH_SECONDS} seconds, built from the real repository: ${abs(video)} (poster: ${abs(pitchPoster(video))}; thumbnail: ${abs(video.replace(/\.mp4$/, '-thumb.webp'))}).`,
          ]
        : null,
      p.visual ? ['## Image', `![${p.visual.alt}](${abs(p.visual.src)})`] : null,
    ],
    `/projects/${p.slug}`,
    `/md/projects/${p.slug}.md`,
  )
}

function researchMd() {
  const pubs = profile.publications
  const positions = profile.research
  const counts = joinPresent(
    [
      pubs.length && `${pubs.length} ${pubs.length === 1 ? 'paper' : 'papers'}`,
      positions.length && `${positions.length} research ${positions.length === 1 ? 'position' : 'positions'}`,
    ],
    ' and ',
  )
  const projects = researchProjects()
  return doc(
    `Research by ${identity.name}`,
    [
      counts ? `${counts}.${pubs.some((p) => p.equalContribution.length) ? ' Equal contribution is marked with an asterisk.' : ''}` : null,
      section(
        '## Publications',
        pubs.map((p) => [
          `### ${p.title}`,
          `${p.displayString} (${p.status}), ${formatMonth(p.date)}. Venue: ${p.venueFull}. ${p.venueUrl}`,
          `Authors: ${p.authors.map((a) => (p.equalContribution.includes(a) ? `${a}*` : a)).join(', ')}. Affiliations: ${p.affiliations.join(', ')}.`,
          `Role: ${p.role}.${p.review ? ` Review: ${p.review}.` : ''}`,
          `Summary: ${p.tldr}`,
          '#### Abstract',
          p.abstract,
          '#### Findings',
          list(p.findings),
          '#### By the numbers',
          list(p.stats),
          '#### Links',
          list(linkList(p.links)),
          p.figures.length ? ['#### Figures', p.figures.map((f) => `![${f.alt}](${abs(f.src)})\n\n${f.caption}`)] : null,
          `Keywords: ${p.tags.join(', ')}.`,
        ]),
      ),
      section(
        '## Research positions',
        positions.map((r) => [
          `### ${r.title}`,
          `${r.role}, ${r.org}, ${formatRange(r.start, r.end)}.${r.advisor ? ` Advisor: ${r.advisor}.` : ''}${r.grant ? ` Grant: ${r.grant}.` : ''}`,
          r.summary,
          list(r.highlights),
          `Methods and tools: ${r.tags.join(', ')}. Project page: ${abs(`/projects/${r.projectSlug}`)}`,
        ]),
      ),
      section(
        '## Research projects',
        projects.map((p) => [`### ${p.name}`, projectFacts(p), p.summary, `Details: ${projectPage(p)}.`]),
      ),
      section('## Writing', profile.writing?.length ? list(profile.writing.map(writingLine)) : null),
    ],
    '/research',
    '/md/research.md',
  )
}

function aboutMd() {
  const a = identity.availability
  return doc(
    `About ${identity.name}`,
    [
      `${identity.fullName}${identity.pronouns ? ` (${identity.pronouns})` : ''}, ${identity.title}, ${identity.location.display}.`,
      // The /about letter when profile.json has one, else the summary and tagline it falls back to.
      identity.story?.length ? identity.story : [identity.summary, identity.tagline],
      `## Now (${now.date})`,
      list(now.lines),
      '## Availability',
      joinPresent([availabilityLine(), authorization()], ' '),
      `Roles: ${a.roles.join(', ')}.`,
      `Locations: ${a.locations.join(', ')}.`,
      '## Education',
      profile.education.map((e) => educationLines(e, { withUrl: true })),
      section('## Leadership', profile.leadership.length ? list(profile.leadership.map((l) => `${l.title}, ${l.org}, ${l.date}. ${l.note}`)) : null),
      section(
        '## Activity',
        profile.activity.length
          ? list(
              profile.activity.map(
                (x) => `${formatMonth(x.date)}: ${x.title}${x.location ? `, ${x.location}` : ''}.${x.note ? ` ${x.note}` : ''}`,
              ),
            )
          : null,
      ),
      section('## Recognition', honors().length ? list(honors().map((r) => `${r.title}, ${r.org}, ${formatMonth(r.date)}.${r.note ? ` ${r.note}` : ''}`)) : null),
      section(
        '## Certifications',
        profile.certifications.length
          ? list(profile.certifications.map((c) => `${certification(c)}${c.image ? `. Image: ${abs(c.image)}` : ''}`))
          : null,
      ),
      section('## Writing', profile.writing?.length ? list(profile.writing.map(writingLine)) : null),
      '## Languages',
      identity.languages.join(', '),
      '## Elsewhere',
      list(profileLinks()),
      contact(),
    ],
    '/about',
    '/md/about.md',
  )
}

/**
 * What /resume prints, in its order and selection (app/resume/page.tsx): with `resumeMaster`, only the
 * roles and projects it lists, each with its own bullets; without it, every role with its highlights and
 * every project that has no role of its own and is not earlier work, with its pitch.
 */
function resumeSelection() {
  const master = profile.resumeMaster
  if (master) {
    return {
      roles: master.experience.flatMap((r) => {
        const entry = experience(r.id)
        return entry ? [{ entry, bullets: r.bullets }] : []
      }),
      projects: master.projects.flatMap((r) => {
        const entry = profile.projects.find((x) => x.slug === r.slug)
        return entry ? [{ entry, bullets: r.bullets }] : []
      }),
    }
  }
  return {
    roles: profile.experience.map((entry) => ({ entry, bullets: entry.highlights })),
    projects: profile.projects
      .filter((x) => !x.experienceId && !isEarlierWork(x))
      .map((entry) => ({ entry, bullets: entry.featured ? [entry.pitch.action, entry.pitch.change] : [entry.pitch.change] })),
  }
}

// The /resume page as markdown: the header, then Summary, Education, Experience, Projects and Technical
// skills, with the same entries and bullets the page prints. About and /md/projects.md carry the rest.
function resumeMd() {
  const { roles, projects } = resumeSelection()
  return doc(
    identity.name,
    [
      `${identity.title}. ${identity.location.display}. ${SITE}`,
      list(profileLinks()),
      contact(),
      joinPresent([availabilityLine(), authorization(), links.resumePdf && `PDF version: ${abs(links.resumePdf)}.`], ' '),
      '## Summary',
      identity.summary,
      '## Education',
      profile.education.map((e) => [
        `### ${e.institution}`,
        joinPresent([`${e.degree} in ${e.field}. ${e.location}. ${formatRange(e.start, e.end)}.`, gpa(e)], ' '),
        e.coursework.length ? `Coursework: ${e.coursework.join(', ')}.` : null,
        e.activities?.length ? `Leadership: ${e.activities.join(', ')}.` : null,
        e.honors.length ? list(e.honors) : null,
      ]),
      '## Experience',
      roles.map(({ entry: e, bullets }) => [
        `### ${e.role}`,
        `${joinPresent([e.org, e.location], ', ')}. ${e.type}. ${formatRange(e.start, e.end)}.${e.award ? ` ${e.award}.` : ''}${bullets.length ? '' : ` ${e.summary}`}`,
        bullets.length ? list(bullets) : null,
        e.advisors?.length ? `Advisor: ${e.advisors.join(', ')}.` : null,
      ]),
      section(
        '## Projects',
        projects.map(({ entry: p, bullets }) => [
          `### ${p.name}`,
          joinPresent([`${joinPresent([p.subtitle, p.role], '. ')}.`, p.start && `${formatRange(p.start, p.end)}.`, p.recognition && `${p.recognition}.`], ' '),
          bullets.length ? list(bullets) : null,
          `Page: ${projectPage(p)}.`,
        ]),
      ),
      '## Technical skills',
      list(Object.entries(profile.skills).map(([group, items]) => `${group}: ${items.join(', ')}`)),
    ],
    '/resume',
    '/md/resume.md',
  )
}

rmSync(OUT, { recursive: true, force: true })
mkdirSync(join(OUT, 'projects'), { recursive: true })

const files = new Map([
  ['index.md', indexMd()],
  ['projects.md', projectsMd()],
  ...(hasResearch ? [['research.md', researchMd()]] : []),
  ['about.md', aboutMd()],
  ['resume.md', resumeMd()],
  ...profile.projects.map((p) => [`projects/${p.slug}.md`, projectMd(p)]),
])

// En dash (U+2013) and em dash (U+2014), built from code points so this source stays free of them.
const DASHES = new RegExp('[' + String.fromCharCode(0x2013, 0x2014) + ']')
const EMAIL = (identity.email || links.email || '').replace(/^mailto:/i, '')
// A value that leaked through as text: "undefined", "null" or "NaN" as a word, or a label with nothing after it.
const LEAK = /\b(undefined|null|NaN)\b|: \.$/m

let bytes = 0
for (const [relative, content] of files) {
  if (DASHES.test(content)) {
    console.error(`build-markdown: em or en dash in generated ${relative}`)
    process.exit(1)
  }
  if ((EMAIL && content.includes(EMAIL)) || /mailto:/i.test(content)) {
    console.error(`build-markdown: email address in generated ${relative}; the mirrors must point at LinkedIn, the scheduling link and the vCard instead`)
    process.exit(1)
  }
  const leak = LEAK.exec(content)
  if (leak) {
    console.error(`build-markdown: "${leak[0]}" printed in generated ${relative}; gate the missing field`)
    process.exit(1)
  }
  writeFileSync(join(OUT, relative), content, 'utf8')
  bytes += Buffer.byteLength(content)
}
console.log(`markdown ok: ${files.size} files, ${Math.round(bytes / 1024)} KB written to public/md`)
