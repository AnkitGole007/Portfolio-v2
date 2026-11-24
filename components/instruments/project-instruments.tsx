import type { ComponentType } from 'react'
import type { Project } from '@/lib/content'
import { hasBespokeInstrument, type BespokeSlug } from './bespoke'
import B2Pipeline from './b2-pipeline'
import B2Latency from './b2-latency'
import PrisemBudget from './prisem-budget'
import FairnessSweep from './fairness-sweep'
import PaypalMatched from './paypal-matched'
import EvalWorkflow from './eval-workflow'
import FigureSwitcher from './figure-switcher'
import MetricExplorer from './metric-explorer'

type InstrumentComponent = ComponentType<{ project: Project }>

/**
 * A project page's instruments, chosen on the server. Each instrument is a client component, so the
 * page HTML carries it at its real size (nothing below it moves when its code arrives), and only the
 * instruments a page renders are in that page's client payload. The home page's lazy lead slot keeps
 * using `InstrumentFor` in ./registry. Keep the bespoke lists here and in ./registry the same.
 */
const BESPOKE: Record<BespokeSlug, InstrumentComponent[]> = {
  'b2-research-agent': [B2Pipeline, B2Latency],
  prisem: [PrisemBudget],
  'fairness-em': [FairnessSweep],
  'paypal-gqp-credit-risk': [PaypalMatched],
  'handshake-eval': [EvalWorkflow],
}

export function ProjectInstruments({ project }: { project: Project }) {
  if (hasBespokeInstrument(project.slug)) {
    return (
      <div className="space-y-6 md:space-y-8">
        {BESPOKE[project.slug].map((Instrument, i) => (
          <Instrument key={i} project={project} />
        ))}
      </div>
    )
  }
  if (project.visual) return <FigureSwitcher project={project} />
  if (project.metrics.length > 0) return <MetricExplorer project={project} />
  return null
}
