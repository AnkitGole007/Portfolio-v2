import type { Metadata } from 'next'
import { Suspense } from 'react'
import { KIND_LABEL, earlierLine, informativeKind, isEarlierWork, profile, projectYear, year, type Project } from '@/lib/content'
import { JsonLd, breadcrumbJsonLd, itemListJsonLd } from '@/lib/jsonld'
import { fitDescription } from '@/lib/seo'
import { PITCH_SECONDS, hasPitch, pitchThumbSrc } from '@/components/reel/pitch-slugs'
import type { KindOption } from '@/components/projects/filter-bar'
import { publicImageSize } from '@/components/projects/figure'
import { ProjectIndex } from '@/components/projects/project-ledger'
import type { StripFrame, StripItem } from '@/components/projects/project-strip'
import { ProjectFilter } from './project-filter'

const { projects, identity } = profile
const count = projects.length
const firstYear = projects.flatMap((p) => (p.start ? [year(p.start)] : [])).sort()[0]
// "since <year>" only when every project is dated: undated earlier work may be older than the first dated one.
const since = firstYear && projects.every((p) => p.start) ? ` since ${firstYear}` : ''
const pitched = projects.filter((p) => hasPitch(p.slug)).length

// 150 to 160 characters from the content model: the count and owner, then the featured names (short form,
// before any colon) and the city as room allows.
const DESCRIPTION = fitDescription(
  [`${count} projects by ${identity.name}, ${identity.title}${since}.`],
  [
    { lead: 'Highlights include ', items: projects.filter((p) => p.featured).map((p) => p.name.split(':')[0]) },
    `Based in ${identity.location.city}, ${identity.location.region}.`,
    pitched ? `${pitched} carry a ${PITCH_SECONDS}-second pitch video.` : null,
    'Each page gives the problem, the approach and the stack.',
  ],
)

export const metadata: Metadata = {
  title: 'Projects',
  description: DESCRIPTION,
  alternates: { canonical: '/projects', types: { 'text/markdown': '/md/projects.md' } },
  // A page-level openGraph object replaces the layout's, so the card image is restated here.
  openGraph: {
    type: 'website',
    title: `Projects by ${identity.name}`,
    description: DESCRIPTION,
    url: '/projects',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: `${identity.name}, ${identity.title}` }],
  },
}

/** The metric that stands in for a picture: the first one short enough to read as a number. */
function tileMetric(p: Project) {
  return p.metrics.find((m) => m.value.length <= 12) ?? p.metrics[0]
}

/** Pitch thumbnail when a video exists, else the project visual, else a typographic metric tile. */
function frameFor(p: Project): StripFrame {
  if (hasPitch(p.slug)) return { type: 'thumb', src: pitchThumbSrc(p.slug) }
  if (p.visual) {
    const { width, height } = publicImageSize(p.visual.src)
    return { type: 'visual', src: p.visual.src, alt: p.visual.alt, width, height }
  }
  const m = tileMetric(p)
  const kind = informativeKind(p.kind)
  return m
    ? { type: 'metric', value: m.value, label: m.label }
    : projectYear(p)
      ? { type: 'metric', value: projectYear(p), label: kind ?? '' }
      : // Undated and without metrics: the kind fills the tile and the affiliation labels it. A kind that
        // says nothing ("Other") gives the tile to the affiliation instead.
        kind
        ? { type: 'metric', value: kind, label: p.affiliation ?? '' }
        : { type: 'metric', value: p.affiliation ?? p.subtitle, label: '' }
}

const items: StripItem[] = projects.map((p) => ({
  slug: p.slug,
  name: p.name,
  kind: p.kind,
  // Empty for a kind that says nothing ("Other"); the filter bar still names it.
  kindLabel: informativeKind(p.kind) ?? '',
  year: projectYear(p),
  // An older build marked `earlier` has no outcome on record, so its line says where it was made and with what.
  change: p.earlier ? earlierLine(p) : p.pitch.change,
  hasPitch: hasPitch(p.slug),
  frame: frameFor(p),
  // Set here too, not only in ProjectFilter, so the page-level Suspense fallback groups earlier work the same way.
  earlier: isEarlierWork(p),
}))

const options: KindOption[] = [{ kind: 'all', label: 'All', count }]
for (const p of projects) {
  const existing = options.find((o) => o.kind === p.kind)
  if (existing) existing.count += 1
  else options.push({ kind: p.kind, label: KIND_LABEL[p.kind] ?? p.kind, count: 1 })
}

export default function ProjectsPage() {
  return (
    <div className="container-site py-16 md:py-24">
      <JsonLd data={itemListJsonLd(projects)} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Work', path: '/projects' }])} />

      <header className="max-w-[64ch]">
        <h1 className="text-display">Work</h1>
        <p className="text-lead mt-5 text-ink-2">
          All {count} projects{since}, each with the problem, what was done and what changed.
          {pitched > 0 && ` ${pitched} of them carry a ${PITCH_SECONDS}-second pitch.`}
        </p>
      </header>

      <div className="mt-10 md:mt-14">
        {/* The fallback is the full sheet, so the static HTML carries every project even before hydration. */}
        <Suspense fallback={<ProjectIndex items={items} options={options} active="all" />}>
          <ProjectFilter items={items} options={options} />
        </Suspense>
      </div>
    </div>
  )
}
