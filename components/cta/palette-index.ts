import { featuredProjects, formatRange, KIND_LABEL, outcomeMetrics, profile, skillGroups, VCARD_PATH } from '@/lib/content'
import { PITCH_SECONDS, hasPitch } from '@/components/reel/pitch-slugs'
import type { PaletteEntry } from './palette-types'

// Server only: reads profile.json. Client code imports the types and group order from ./palette-types.
export { PALETTE_GROUPS, type PaletteEntry, type PaletteGroup } from './palette-types'

/**
 * The home page sections in page order, each listed only when the content that renders it exists, so
 * every row lands on a section that is there (scripts/check-links.mjs checks the anchors).
 */
function sections(): [title: string, href: string][] {
  const { experience, recognition, education, certifications, writing } = profile
  const rows: [string, string, boolean][] = [
    ['Work', '/#work', featuredProjects.length > 0],
    ['Experience', '/#experience', experience.length > 0],
    ['Numbers', '/#numbers', outcomeMetrics().length > 0],
    ['Skills', '/#skills', skillGroups().length > 0],
    ['Recognition and education', '/#recognition', recognition.length + education.length + certifications.length > 0],
    ['Writing', '/#writing', writing.length > 0],
    ['Contact', '/#contact', true],
  ]
  return rows.filter(([, , present]) => present).map(([title, href]) => [title, href])
}

const text = (parts: (string | null | undefined)[]) => parts.filter(Boolean).join(' ').toLowerCase()

/**
 * Built on the server from profile.json at build time and served as the static
 * /palette-index.json route. The client fetches only these compact rows when the palette is
 * first needed, so the full profile (and its phone number) never enters the browser bundle.
 */
export function buildPaletteIndex(): PaletteEntry[] {
  const { projects, publications, experience, certifications, skills, links } = profile
  // The palette's pitch action opens the first project in profile.json order that has a pitch video.
  const pitchSlug = projects.find((p) => hasPitch(p.slug))?.slug
  // Actions whose destination the profile does not carry are left out.
  const optional = (entry: PaletteEntry, present: unknown): PaletteEntry[] => (present ? [entry] : [])
  return [
    ...sections().map(
      ([title, href]): PaletteEntry => ({
        id: `section-${href.slice(2)}`,
        group: 'Sections',
        title,
        hint: 'Home page',
        keywords: text([title, 'section', 'home', 'go to']),
        href,
      }),
    ),
    { id: 'email', group: 'Actions', title: 'Copy email', keywords: 'email contact copy mail address', action: 'email' },
    ...optional({ id: 'resume', group: 'Actions', title: 'Download resume', hint: 'PDF', keywords: 'resume cv pdf download', href: links.resumePdf, download: true }, links.resumePdf),
    { id: 'vcard', group: 'Actions', title: 'Download vCard', hint: 'Contact card', keywords: 'vcard contact card vcf save', href: VCARD_PATH, download: true },
    ...optional({ id: 'call', group: 'Actions', title: 'Book a call', hint: 'Scheduling link', keywords: 'call meeting schedule calendar book', href: links.scheduling }, links.scheduling),
    ...optional({ id: 'linkedin', group: 'Actions', title: 'Open LinkedIn', keywords: 'linkedin profile social', href: links.linkedin }, links.linkedin),
    ...optional({ id: 'github', group: 'Actions', title: 'Open GitHub', keywords: 'github code repositories source', href: links.github }, links.github),
    ...optional(
      { id: 'pitch', group: 'Actions', title: 'Watch a pitch', hint: `${PITCH_SECONDS} s video`, keywords: 'pitch video reel watch play', action: 'pitch', slug: pitchSlug },
      pitchSlug,
    ),
    ...projects.map(
      (p): PaletteEntry => ({
        id: `project-${p.slug}`,
        group: 'Work',
        title: p.name,
        hint: p.subtitle,
        keywords: text([p.subtitle, p.affiliation, KIND_LABEL[p.kind] ?? p.kind, ...p.tags]),
        href: `/projects/${p.slug}`,
      }),
    ),
    ...publications.map(
      (p): PaletteEntry => ({
        id: `publication-${p.id}`,
        group: 'Research',
        title: p.title,
        hint: p.displayString,
        keywords: text([p.venue, 'paper', 'publication', ...p.tags]),
        href: '/research',
      }),
    ),
    ...experience.map(
      (e): PaletteEntry => ({
        id: `role-${e.id}`,
        group: 'Experience',
        title: e.role,
        hint: `${e.org}, ${formatRange(e.start, e.end)}`,
        keywords: text([e.org, e.type, e.location, ...e.tags]),
        href: '/#experience',
      }),
    ),
    ...Object.entries(skills).flatMap(([category, list], ci) =>
      list.map(
        (skill, si): PaletteEntry => ({
          id: `skill-${ci}-${si}`,
          group: 'Skills',
          title: skill,
          hint: category,
          keywords: text([category, 'skill']),
          href: '/#skills',
        }),
      ),
    ),
    ...certifications.map(
      (c, i): PaletteEntry => ({
        id: `certification-${i}`,
        group: 'Certifications',
        title: c.title,
        hint: [c.issuer, c.date?.slice(0, 4)].filter(Boolean).join(', ') || 'Certification',
        keywords: text([c.issuer, 'certificate', 'certification', 'badge']),
        href: '/about#certifications',
      }),
    ),
  ]
}
