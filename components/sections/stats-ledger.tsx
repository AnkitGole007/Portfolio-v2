import Link from 'next/link'
import { outcomeMetrics, type Metric, type Project } from '@/lib/content'
import { Reveal } from '@/components/ui/reveal'

type Row = {
  id: string
  /** The "before" half of a change ("24+ min to"), set in the soft ink; empty for a single figure. */
  before: string
  /** The figure itself ("47.7 s"). */
  after: string
  caption: string
  /** The project the number comes from. */
  source: { label: string; href: string }
}

/** "Project name: what it is" -> "Project name". */
const shortName = (p: Project) => p.name.split(':')[0].trim()

/** "24+ min to 47.7 s" -> before "24+ min to", after "47.7 s"; a value without " to " is all "after". */
function splitChange(value: string): { before: string; after: string } {
  const to = value.indexOf(' to ')
  if (to > 0) return { before: value.slice(0, to + ' to'.length), after: value.slice(to + ' to '.length) }
  return { before: '', after: value }
}

function toRow({ project, metric }: { project: Project; metric: Metric }): Row {
  return {
    id: project.slug,
    ...splitChange(metric.value),
    caption: metric.label,
    source: { label: shortName(project), href: `/projects/${project.slug}` },
  }
}

/**
 * Outcome numbers only: the first before-and-after metric of each featured project, verbatim from
 * profile.json (lib/content.ts outcomeMetrics), each with the project it comes from. The section is the
 * page's one field of the accent green; the heading sits at the left, the ledger at the right.
 */
export function StatsLedger() {
  const list = outcomeMetrics().map(toRow)
  if (list.length === 0) return null
  return (
    <section id="numbers" aria-labelledby="numbers-title" className="cv-auto bg-accent text-accent-ink">
      <Reveal className="container-site grid gap-10 py-20 md:grid-cols-12 md:gap-x-6 md:py-28">
        <h2 id="numbers-title" className="text-headline md:col-span-5">
          <span className="block">The work</span>
          <span className="block text-accent-ink-2">in numbers</span>
        </h2>
        <ul className="space-y-10 md:col-span-7 md:space-y-12">
          {list.map((row) => (
            <li key={row.id}>
              <p className="text-headline">
                {/* Each half stays whole, so a long change breaks between "before" and "after", never inside one. */}
                {row.before ? <span className="text-metric whitespace-nowrap text-accent-ink-2">{row.before}</span> : null}
                {row.before ? ' ' : null}
                <span className="text-metric text-accent-ink">{row.after}</span>
              </p>
              <p className="mt-2 max-w-[56ch] text-base leading-snug text-accent-ink">{row.caption}</p>
              <p className="text-base leading-snug">
                <Link
                  href={row.source.href}
                  className="inline-flex min-h-11 items-center text-accent-ink underline decoration-accent-ink-2 decoration-1 underline-offset-[5px] transition-colors hover:decoration-accent-ink focus-visible:outline-accent-ink"
                >
                  {row.source.label}
                </Link>
              </p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
