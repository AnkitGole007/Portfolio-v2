import type { ReactNode } from 'react'
import Link from 'next/link'
import { featuredProjects, KIND_LABEL, profile, projectYear, type Pitch, type Project } from '@/lib/content'
import { cn } from '@/lib/utils'
import { Prose } from '@/components/glossary/prose'
import { ButtonLink } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { Section } from '@/components/ui/section'
import { InstrumentSlot } from './instrument-slot'

// research-section.tsx and credentials/wallet-data.tsx import the helper from here; it lives in projects/figure.tsx.
export { publicImageSize } from '@/components/projects/figure'

/**
 * A number in a sentence, with its %, x or + suffix when attached: "93%", "1.5x", "5,000+".
 * The first group captures the boundary character, so digits glued to letters or hyphens
 * (p95, 3D, GPT-2, INT8) stay part of their word.
 */
const NUMBER = /(^|[^\w.-])(\d+(?:[.,]\d+)*(?:%|x(?!\d))?\+?)(?!\w)/g

/** "Research Agent: open-source paper search" -> "Research Agent", so the row heading holds two lines at 320 px. */
const shortName = (p: Project) => p.name.split(':')[0].trim()

/** The outcome sentence with every number in lining tabular figures and the words between them through the glossary. */
function MetricProse({ text, seen }: { text: string; seen: Set<string> }) {
  const parts: ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(NUMBER)) {
    const start = (m.index ?? 0) + m[1].length
    if (start > last) parts.push(<Prose key={`t${last}`} as="span" text={text.slice(last, start)} seen={seen} />)
    parts.push(
      <span key={`n${start}`} className="text-metric">
        {m[2]}
      </span>,
    )
    last = start + m[2].length
  }
  if (last < text.length) parts.push(<Prose key={`t${last}`} as="span" text={text.slice(last)} seen={seen} />)
  return <>{parts}</>
}

/** The three-second strip: the problem, what was done and what changed, all in the full ink. */
function Cells({ pitch, seen, className }: { pitch: Pitch; seen: Set<string>; className?: string }) {
  const cell = 'mt-1.5 text-base leading-snug text-ink'
  return (
    <dl className={cn('grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6', className)}>
      <div>
        <dt className="text-label text-ink-2">Problem</dt>
        <Prose as="dd" text={pitch.problem} className={cell} seen={seen} />
      </div>
      <div>
        <dt className="text-label text-ink-2">What was done</dt>
        <Prose as="dd" text={pitch.action} className={cell} seen={seen} />
      </div>
      <div>
        <dt className="text-label text-ink-2">What changed</dt>
        <dd className={cell}>
          <MetricProse text={pitch.change} seen={seen} />
        </dd>
      </div>
    </dl>
  )
}

/**
 * One ledger row. From 1024 px the name block holds the first four columns and the three cells the
 * other eight, so every row shares the same two left edges and nothing is drawn between rows. Phones
 * stack the name block over the cells.
 */
function Row({ project, seen }: { project: Project; seen: Set<string> }) {
  const href = `/projects/${project.slug}`
  const kind = KIND_LABEL[project.kind] ?? project.kind
  const when = projectYear(project)
  return (
    <div data-project={project.slug} className="grid grid-cols-1 gap-y-5 lg:grid-cols-12 lg:gap-x-6">
      <div className="min-w-0 lg:col-span-4">
        <h3 className="text-title">
          <Link
            href={href}
            className="inline-flex min-h-11 items-center text-ink underline decoration-rule-strong decoration-1 underline-offset-[5px] transition-colors hover:text-accent hover:decoration-accent"
          >
            {shortName(project)}
          </Link>
        </h3>
        <p className="mt-1.5 max-w-[40ch] text-ink-2">{project.subtitle}</p>
        <p className="text-status mt-2">
          {kind}
          {when ? `, ${project.status === 'ongoing' ? `since ${when}` : when}` : ''}
        </p>
        {project.recognition ? <p className="mt-2 max-w-[40ch] text-sm leading-snug text-ink">{project.recognition}</p> : null}
      </div>
      <Cells pitch={project.pitch} seen={seen} className="lg:col-span-8" />
    </div>
  )
}

/**
 * Featured work as a quiet ledger: one row per featured project in profile.json order, each with its
 * three-second strip. The lead project carries its instrument under its cells (the registry's
 * metric explorer until its bespoke instrument exists). There are no project pictures on record, so
 * no frame or tile stands in for one.
 */
export function FeaturedWork() {
  const total = profile.projects.length
  const featured = featuredProjects
  if (featured.length === 0) return null
  // One glossary popover per term across the whole section.
  const seen = new Set<string>()
  return (
    <Section
      id="work"
      title="Selected work"
      intro={`${featured.length} of ${total} projects, each with the problem, what was done and what changed.`}
    >
      <ol className="space-y-14 md:space-y-20">
        {featured.map((project, i) => (
          <Reveal as="li" key={project.slug} delay={Math.min(i * 30, 90)}>
            <Row project={project} seen={seen} />
            {i === 0 ? (
              <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-x-6">
                <InstrumentSlot project={project} className="lg:col-span-8 lg:col-start-5" />
              </div>
            ) : null}
          </Reveal>
        ))}
      </ol>
      <div className="mt-14 md:mt-16">
        <ButtonLink href="/projects" variant="secondary">
          All {total} projects
        </ButtonLink>
      </div>
    </Section>
  )
}
