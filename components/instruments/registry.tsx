'use client'

import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'
import type { Project } from '@/lib/content'
import { BESPOKE_SLUGS, hasBespokeInstrument, type BespokeSlug } from './bespoke'

type InstrumentComponent = ComponentType<{ project: Project }>

const B2Pipeline = dynamic(() => import('./b2-pipeline'), { ssr: false })
const B2Latency = dynamic(() => import('./b2-latency'), { ssr: false })
const PrisemBudget = dynamic(() => import('./prisem-budget'), { ssr: false })
const FairnessSweep = dynamic(() => import('./fairness-sweep'), { ssr: false })
const PaypalMatched = dynamic(() => import('./paypal-matched'), { ssr: false })
const EvalWorkflow = dynamic(() => import('./eval-workflow'), { ssr: false })

/**
 * Bespoke instruments by project slug for the home page's lazy lead slot (project pages render theirs on
 * the server through ./project-instruments), keyed by the server-safe list in ./bespoke so the lists
 * cannot drift: add the slug there, its dynamic import here and its import in ./project-instruments. A project page shows every instrument in
 * its list, in order. Everything else falls back to a figure switcher or the metric explorer.
 */
const bespoke: Record<BespokeSlug, InstrumentComponent[]> = {
  'b2-research-agent': [B2Pipeline, B2Latency],
  prisem: [PrisemBudget],
  'fairness-em': [FairnessSweep],
  'paypal-gqp-credit-risk': [PaypalMatched],
  'handshake-eval': [EvalWorkflow],
}

/**
 * The one instrument a project shows where only one fits (the home page's lead slot), as an index
 * into its list. B2 leads with search time: the hero above it already draws the retrieval stages.
 */
const LEAD: Partial<Record<BespokeSlug, number>> = { 'b2-research-agent': 1 }

const FigureSwitcher = dynamic(() => import('./figure-switcher'), { ssr: false })
const MetricExplorer = dynamic(() => import('./metric-explorer'), { ssr: false })

export { BESPOKE_SLUGS, hasBespokeInstrument }

/**
 * The instruments for a project: its bespoke list when one exists (only the lead one with `lead`),
 * otherwise the figure switcher (when a visual exists) or the metric explorer.
 */
export function InstrumentFor({ project, lead = false }: { project: Project; lead?: boolean }) {
  if (hasBespokeInstrument(project.slug)) {
    const list = bespoke[project.slug]
    if (lead) {
      const One = list[LEAD[project.slug] ?? 0]
      return One ? <One project={project} /> : null
    }
    return (
      <div className="space-y-6 md:space-y-8">
        {list.map((Instrument, i) => (
          <Instrument key={i} project={project} />
        ))}
      </div>
    )
  }
  if (project.visual) return <FigureSwitcher project={project} />
  if (project.metrics.length > 0) return <MetricExplorer project={project} />
  return null
}
