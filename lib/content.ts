import raw from '@/content/profile.json'
import githubRaw from '@/content/github.json'
import { repoKey } from './repo-key'

export type Metric = { label: string; value: string }
/** Three-second strip: one sentence each, 24 words or fewer, enforced by scripts/check-profile.mjs. */
export type Pitch = { problem: string; action: string; change: string }
export type Figure = { src: string; alt: string; caption: string }
export type Visual = { src: string; alt: string } | null

export type Education = {
  id: string
  institution: string
  abbr: string
  degree: string
  field: string
  location: string
  start: string
  end: string
  status: string
  /** Null when no GPA is on record for the degree. */
  gpa: string | null
  gpaScale: string | null
  url?: string
  coursework: string[]
  honors: string[]
  /** Clubs and teams held during the degree, without dates (none are on record). */
  activities?: string[]
}

export type Publication = {
  id: string
  title: string
  venue: string
  venueFull: string
  venueUrl: string
  status: string
  displayString: string
  date: string
  authors: string[]
  equalContribution: string[]
  affiliations: string[]
  role: string
  review: string | null
  tldr: string
  abstract: string
  findings: string[]
  stats: string[]
  links: Record<string, string>
  figures: Figure[]
  tags: string[]
}

export type Research = {
  id: string
  title: string
  org: string
  role: string
  advisor: string | null
  grant: string | null
  start: string
  end: string | null
  status: string
  publicationId: string | null
  projectSlug: string
  summary: string
  highlights: string[]
  tags: string[]
}

export type Experience = {
  id: string
  role: string
  org: string
  orgUrl: string | null
  /** Left out when the record does not say. */
  location?: string
  type: string
  start: string
  end: string | null
  status: string
  award: string | null
  summary: string
  highlights: string[]
  tags: string[]
  team?: string[]
  advisors?: string[]
  presented?: string
  /** Title steps inside one employer, oldest first, when the role changed title. */
  titles?: { title: string; start: string; end: string; location?: string }[]
}

/** One stage of a retrieval pipeline: what is left after it, and how many (null when no verified number exists). */
export type PipelineStage = { label: string; count: number | null }

export type Project = {
  slug: string
  name: string
  subtitle: string
  kind: string
  featured: boolean
  /** "YYYY-MM", or "YYYY" when only the year is on record, or null when the project is undated. */
  start: string | null
  end: string | null
  status: string
  /** Who the work was for; left out when the record does not say. */
  affiliation?: string
  team: string[]
  /** The owner's role, set only where the data states it (publication, research or experience role). */
  role?: string
  /** An outside user or a public release: the sponsor handoff, a marketplace listing, a live Space or site. */
  shipped?: { label: string }
  summary: string
  pitch: Pitch
  problem: string
  approach: string
  highlights: string[]
  metrics: Metric[]
  tags: string[]
  repo: string | null
  links: Record<string, string>
  visual: Visual
  video: string | null
  recognition: string | null
  publicationId: string | null
  experienceId: string | null
  /** Retrieval stages in order, for projects that narrow a corpus to a short list. */
  pipeline?: PipelineStage[]
  /** An older or minor build kept for the record: folds into "Earlier work" on /projects whatever its dates. */
  earlier?: boolean
}

export type Recognition = { id: string; kind: string; title: string; org: string; date: string; note: string | null }
/** issuer and date are null when the record holds only the title. */
export type Certification = { title: string; issuer: string | null; date: string | null; image: string | null; credentialId: string | null }
export type Activity = { date: string; type: string; title: string; location: string | null; note: string | null }
export type Leadership = { title: string; org: string; date: string; note: string }
export type Recommendation = { name: string; role: string; org: string; quote: string; person?: string }
/** A post or article the owner wrote; `url` stays null until a link is confirmed. */
export type Writing = { title: string; kind: string; platform: string; date: string | null; url: string | null }
/** Dated "what is true today" lines for the home page and the markdown index. */
export type Now = { date: string; lines: string[] }

/**
 * A picture of the owner under public/ (leading slash path) at its largest width. A sibling file with
 * the width 480 in its name (ankit-gole-960.webp next to ankit-gole-480.webp) is the small source.
 */
export type Portrait = { src: string; alt: string }

export type Profile = {
  meta: { version: string; lastUpdated: string; sources: string[] }
  identity: {
    name: string
    fullName: string
    pronouns?: string
    title: string
    headline: string
    tagline: string
    /** The tools the owner would defend in an interview, in display order; each one is in `skills`. */
    tools?: string[]
    /** One measured result for the first screen, a full sentence. */
    result?: string
    /** Up to four proof chips, each naming the owner's relation to it ("AI Trainer, Handshake AI"). */
    proof?: string[]
    summary: string
    /** The About letter in the owner's voice, one string per paragraph; the page falls back to summary and tagline. */
    story?: string[]
    location: { city: string; region: string; country: string; display: string }
    /** Not set: the address lives only in links.email, and the site carries no phone number. */
    email?: string
    phone?: string
    languages: string[]
    /** Shows availability.workAuthorization on the site; scripts/check-profile.mjs fixes the wording. */
    showWorkAuthorization: boolean
    /** The hero and about portrait; when absent the pages render without one. */
    portrait?: Portrait | null
    availability: {
      status: string
      display: string
      workAuthorization: string
      /** Left out until a start date is confirmed; every surface that prints it is gated on presence. */
      startDate?: string
      roles: string[]
      locations: string[]
    }
  }
  links: Record<string, string>
  now: Now
  education: Education[]
  publications: Publication[]
  research: Research[]
  experience: Experience[]
  projects: Project[]
  recognition: Recognition[]
  certifications: Certification[]
  activity: Activity[]
  leadership: Leadership[]
  recommendations: Recommendation[]
  writing: Writing[]
  skills: Record<string, string[]>
  /** GitHub repositories (names without the owner) kept out of the snapshot, the panel and the live feed. */
  hiddenRepos?: string[]
  /** The five skills per group the owner would defend first, a subset of `skills`, checked by scripts/check-profile.mjs. */
  coreSkills: Record<string, string[]>
  /**
   * The resume master (context section 10): which roles and projects /resume prints, in this order, with
   * the bullets each one carries. `max` is the master's bullet cap; scripts/check-profile.mjs fails when
   * an entry exceeds it, names an unknown id, or carries a bullet that is not one of the entry's own
   * highlights (or, for a project, its pitch action or change). Without it /resume prints everything.
   */
  resumeMaster?: {
    experience: ResumeEntry<{ id: string }>[]
    projects: ResumeEntry<{ slug: string }>[]
  }
}

/** One resume line item: the entry it points at, its bullet cap and the bullets, verbatim from the entry. */
export type ResumeEntry<Key> = Key & { max: number; bullets: string[] }

export const profile = raw as unknown as Profile

/**
 * A Vercel build that is not the production deployment (VERCEL_ENV "preview" or "development") and has
 * no NEXT_PUBLIC_SITE_URL. Its pages carry noindex (app/layout.tsx), next.config.ts adds an X-Robots-Tag
 * header, and its URLs follow the deployment's own VERCEL_URL. Setting NEXT_PUBLIC_SITE_URL on such a
 * build is the override (a branch deployment serving the real domain stays indexable). A local build
 * has no VERCEL_ENV and stays indexable, so a local Lighthouse run sees the production setup.
 */
const UNNAMED_PREVIEW =
  Boolean(process.env.VERCEL_ENV) && process.env.VERCEL_ENV !== 'production' && !process.env.NEXT_PUBLIC_SITE_URL

/** The deployment's own address on such a build. */
const PREVIEW_ORIGIN = UNNAMED_PREVIEW && process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null

/**
 * The one public origin, no trailing slash. It drives canonicals, the sitemap, OG images, JSON-LD,
 * the llms files and the markdown mirrors (scripts/build-markdown.mjs repeats this rule). Order:
 * NEXT_PUBLIC_SITE_URL, then a preview's own VERCEL_URL, so a preview never points canonicals at the
 * production domain, then the placeholder default until the domain is live.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || PREVIEW_ORIGIN || 'https://ankitgole.dev').replace(/\/+$/, '')

/** False on a preview or development deployment without NEXT_PUBLIC_SITE_URL: search engines are asked not to index it. */
export const INDEXABLE = !UNNAMED_PREVIEW

/** The vCard route (app/vcard.vcf/route.ts), the one download that carries the email address. */
export const VCARD_PATH = '/vcard.vcf'

/** "Ankit Gole" -> given "Ankit", family "Gole"; middle names go to `additional`. */
export function nameParts(fullName: string): { given: string; family: string; additional: string } {
  const names = fullName.trim().split(/\s+/)
  return {
    given: names[0] ?? '',
    family: names.length > 1 ? names[names.length - 1] : '',
    additional: names.slice(1, -1).join(' '),
  }
}

/**
 * GitHub login from `links.github` ("https://github.com/AnkitGole007" -> "AnkitGole007"), empty
 * when the link is missing. scripts/sync-github.mjs derives the same value from profile.json.
 */
export const githubLogin = (profile.links.github ?? '').match(/github\.com\/([^/?#]+)/i)?.[1] ?? ''

/**
 * Profile links that identify the owner elsewhere, in display order, with their labels. Only the keys
 * present in `links` are used. The website, scheduling page, email and resume file are not identities.
 */
export const PROFILE_LINKS: { key: string; label: string }[] = [
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'github', label: 'GitHub' },
  { key: 'medium', label: 'Medium' },
  { key: 'orcid', label: 'ORCID' },
  { key: 'huggingface', label: 'Hugging Face' },
  { key: 'googleDev', label: 'Google Developers' },
  { key: 'devto', label: 'Dev.to' },
  { key: 'hackerrank', label: 'HackerRank' },
  { key: 'vscodeMarketplace', label: 'VS Code Marketplace' },
]

/** PROFILE_LINKS narrowed to the links this profile carries, with their URLs. */
export function profileLinks(): { key: string; label: string; url: string }[] {
  return PROFILE_LINKS.flatMap(({ key, label }) => (profile.links[key] ? [{ key, label, url: profile.links[key] }] : []))
}

export type GithubRepoStats = { stars: number; pushedAt: string; language: string | null; description: string | null }
/**
 * Build-time snapshot written by scripts/sync-github.mjs; keys are "owner/name". `user` and
 * `fetchedAt` are null until the first successful fetch.
 */
export type GithubSnapshot = {
  fetchedAt: string | null
  user: { publicRepos: number; followers: number } | null
  repos: Record<string, GithubRepoStats>
}
export const github = githubRaw as GithubSnapshot

/** Stars, last push and language for a GitHub repo URL, or undefined when the snapshot lacks it. */
export function repoStats(repoUrl: string | null | undefined): { stars: number; pushedAt: string; language: string | null } | undefined {
  if (!repoUrl) return undefined
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/#?]+)/i)
  if (!match) return undefined
  const key = `${match[1]}/${match[2].replace(/\.git$/, '')}`.toLowerCase()
  for (const [name, stats] of Object.entries(github.repos)) {
    if (name.toLowerCase() === key) return { stars: stats.stars, pushedAt: stats.pushedAt, language: stats.language }
  }
  return undefined
}

const HIDDEN_REPOS = new Set((profile.hiddenRepos ?? []).map((n) => n.toLowerCase()))

/** True for an "owner/name" (or bare name) listed in profile.hiddenRepos, case-insensitive. */
export function isHiddenRepo(fullName: string): boolean {
  const name = fullName.split('/').pop() ?? fullName
  return HIDDEN_REPOS.has(name.toLowerCase())
}

/** The hidden names as repoKey() hashes, for the client feed: the page never carries the names. */
export const hiddenRepoKeys = (profile.hiddenRepos ?? []).map(repoKey)

export const featuredProjects = profile.projects.filter((p) => p.featured)
export const projectSlugs = profile.projects.map((p) => p.slug)

/** True when a paper or a research role is on record: the /research page and every link to it depend on it. */
export const hasResearch = profile.publications.length > 0 || profile.research.length > 0

/**
 * One organization per employer or institution, whatever unit the role names: the text before the
 * first comma, without a parenthetical, lowercased. "Worcester Polytechnic Institute, YOSSI Lab" and
 * "Worcester Polytechnic Institute" are one; "Larsen & Toubro (Defence)" is "larsen & toubro".
 */
export function orgKey(org: string): string {
  return org.split(',')[0].replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase()
}

/** Distinct organizations across the roles, counted by orgKey. */
export function organizationCount(roles: Pick<Experience, 'org'>[] = profile.experience): number {
  return new Set(roles.map((e) => orgKey(e.org))).size
}

/**
 * The first before-and-after metric ("X to Y") of each featured project, verbatim from profile.json,
 * in featured order: the outcome numbers the home ledger prints. Single figures are left out.
 */
export function outcomeMetrics(): { project: Project; metric: Metric }[] {
  return featuredProjects.flatMap((project) => {
    const metric = project.metrics.find((m) => / to /.test(m.value))
    return metric ? [{ project, metric }] : []
  })
}

/** "a, b and c" without a serial comma. */
export function listJoin(items: string[]): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

/**
 * One plain line for an older build marked `earlier`, from what the record holds and nothing more:
 * what kind of build it was (its subtitle) and the tools named in its tags that its name does not
 * already say. "StyleGAN2 with WGAN-GP" reads "Coursework build."; "Map.AR: AR navigation" reads
 * "Undergraduate project, made with Unity and Firebase." Its three-second strip has no outcome to
 * report, so the index shows this line instead.
 */
export function earlierLine(p: Pick<Project, 'name' | 'subtitle' | 'tags'>): string {
  const name = p.name.toLowerCase()
  const tools = p.tags.filter((tag) => !name.includes(tag.toLowerCase()))
  return tools.length > 0 ? `${p.subtitle}, made with ${listJoin(tools)}.` : `${p.subtitle}.`
}

export function getProject(slug: string): Project | undefined {
  return profile.projects.find((p) => p.slug === slug)
}

export function getPublication(id: string | null | undefined): Publication | undefined {
  if (!id) return undefined
  return profile.publications.find((p) => p.id === id)
}

export function getExperience(id: string | null | undefined): Experience | undefined {
  if (!id) return undefined
  return profile.experience.find((e) => e.id === id)
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "2026-05" -> "May 2026" */
export function formatMonth(ym: string | null | undefined): string {
  if (!ym) return 'present'
  const [y, m] = ym.split('-')
  const idx = Number(m) - 1
  return MONTHS[idx] ? `${MONTHS[idx]} ${y}` : y
}

/** "2024-08", "2026-05" -> "Aug 2024 to May 2026"; "2025", "2025" -> "2025". */
export function formatRange(start: string, end: string | null | undefined): string {
  if (end && end === start) return formatMonth(start)
  return `${formatMonth(start)} to ${formatMonth(end)}`
}

/** Year-only, used for compact ledgers. */
export function year(ym: string | null | undefined): string {
  return ym ? ym.slice(0, 4) : 'now'
}

/** The year a project ended, or started while it runs; empty for an undated project, never "now". */
export function projectYear(p: Pick<Project, 'start' | 'end'>): string {
  const ym = p.end ?? p.start
  return ym ? ym.slice(0, 4) : ''
}

/** All tags across projects, most frequent first. */
export function allProjectTags(): string[] {
  const counts = new Map<string, number>()
  for (const p of profile.projects) for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t)
}

export const KIND_LABEL: Record<string, string> = {
  research: 'Research',
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

/** The kind's label where it tells the visitor something. "Other" says nothing about a project, so it gives null. */
export function informativeKind(kind: string): string | null {
  if (kind === 'other') return null
  return KIND_LABEL[kind] ?? kind
}

/**
 * True when the project's three-second pitch says three different things. Only a project with an
 * outcome on record has a distinct "what changed"; for the earlier builds and the projects without
 * metrics the three cells restate one sentence, so their pages print one plain line instead.
 */
export function hasDistinctPitch(p: Pick<Project, 'earlier' | 'metrics'>): boolean {
  return !p.earlier && p.metrics.length > 0
}

/** Projects that ended in this year or earlier fold into the "Earlier work" row on /projects. */
export const EARLIER_WORK_LAST_YEAR = 2021

/** True for projects marked `earlier`, and for finished projects whose end date falls in EARLIER_WORK_LAST_YEAR or before. */
export function isEarlierWork(p: Pick<Project, 'end' | 'earlier'>): boolean {
  if (p.earlier) return true
  return p.end !== null && Number(p.end.slice(0, 4)) <= EARLIER_WORK_LAST_YEAR
}

export type SkillItem = { name: string; core: boolean }
export type SkillGroup = { name: string; items: SkillItem[] }

/** Skills by group with the five core skills first, then the rest in profile.json order. */
export function skillGroups(): SkillGroup[] {
  return Object.entries(profile.skills).map(([name, list]) => {
    const core = new Set(profile.coreSkills?.[name] ?? [])
    const items = list.map((skill) => ({ name: skill, core: core.has(skill) }))
    return { name, items: [...items.filter((s) => s.core), ...items.filter((s) => !s.core)] }
  })
}

/**
 * The one grouping of profile.recognition every surface counts from, in display order. The poster is
 * counted with the papers and the certificates with the wallet, so neither kind is in here.
 */
export const RECOGNITION_KINDS = [
  { kind: 'award', one: 'award', many: 'awards' },
  { kind: 'honor', one: 'honor', many: 'honors' },
  { kind: 'fellowship', one: 'fellowship', many: 'fellowships' },
  { kind: 'competition', one: 'contest result', many: 'contest results' },
] as const

export type RecognitionCount = { kind: string; label: string; count: number }

/** Count per kind in RECOGNITION_KINDS order, kinds with no entries left out: "6 awards", "4 honors", ... */
export function recognitionCounts(): RecognitionCount[] {
  return RECOGNITION_KINDS.flatMap(({ kind, one, many }) => {
    const count = profile.recognition.filter((r) => r.kind === kind).length
    return count > 0 ? [{ kind, label: count === 1 ? one : many, count }] : []
  })
}

/** Sum of recognitionCounts(): awards, honors, fellowships and contest results. */
export function recognitionTotal(): number {
  return recognitionCounts().reduce((sum, c) => sum + c.count, 0)
}

/** "2 awards" when only one kind is on record, else "16 awards and honors"; never claims a kind that is absent. */
export function recognitionPhrase(): string {
  const counts = recognitionCounts()
  return counts.length === 1 ? `${counts[0].count} ${counts[0].label}` : `${recognitionTotal()} awards and honors`
}
