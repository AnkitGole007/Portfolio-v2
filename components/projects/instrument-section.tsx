import { hasBespokeInstrument, type BespokeSlug } from '@/components/instruments/bespoke'
import { ProjectInstruments } from '@/components/instruments/project-instruments'
import type { Project } from '@/lib/content'

/** Section heading per bespoke instrument (slug from components/instruments/bespoke): what the visitor can do with it. */
const PURPOSE: Record<BespokeSlug, string> = {
  'b2-research-agent': 'Step through a search, then compare search times',
  prisem: 'Switch between the two measured budgets',
  'fairness-em': 'Compare the three points on record',
  'paypal-gqp-credit-risk': 'Check the match, the stability tests and the re-check',
  'handshake-eval': 'Step through how a session pair is evaluated',
}

/**
 * The instrument block of a project page: a heading that names the instrument's purpose and the
 * instruments themselves, rendered on the server. The page HTML holds them at their real size at every
 * width, so the text under them never moves when their code arrives, however the visitor got there
 * (scroll, Tab, a jump) and however late the code is. Renders nothing when there is nothing to show
 * (no bespoke instrument, no visual, no metrics). The project's visual is not repeated here: the
 * figure switcher shows it, and beside a bespoke instrument the page body places it as a captioned
 * figure (see `visualNeedsFigure` in components/instruments/bespoke).
 */
export function InstrumentSection({ project }: { project: Project }) {
  const bespoke = hasBespokeInstrument(project.slug)
  if (!bespoke && !project.visual && project.metrics.length === 0) return null

  const title = bespoke ? PURPOSE[project.slug as BespokeSlug] : project.visual ? 'Figures' : 'Explore the numbers'
  const headingId = `instruments-${project.slug}`

  return (
    <section aria-labelledby={headingId} className="mt-10 md:mt-14">
      <h2 id={headingId} className="text-title">
        {title}
      </h2>
      <div className="mt-4">
        <ProjectInstruments project={project} />
      </div>
    </section>
  )
}
