'use client'

import { useState } from 'react'
import { Instrument, Segmented, useInstrument } from '@/components/instruments/instrument'
import type { Project } from '@/lib/content'
import { cn } from '@/lib/utils'

/*
 * B2 Research Agent, search time before and after. Two measured comparisons, each on its own
 * linear scale: the long search that stalled 24+ minutes and crashed, then finished in 47.7 s after
 * the five-bug fix; and two slow queries, 185.2 s before the embedding backfill, 14.3 s and 10.4 s
 * after. Source: the portfolio context file, section 5.2 (verified metrics table).
 *
 * "24+ minutes" is open ended, so that bar is solid to the 24-minute mark and dashed past it, and the
 * 47.7 s bar is drawn against the 24-minute mark. The bars are drawn at their final lengths with no
 * growth animation, so no value between the measured ones is ever shown.
 */

type Bar = {
  label: string
  value: string
  /** Seconds on the view's scale. */
  seconds: number
  tone: 'before' | 'after'
  /** True when the measured value is a floor ("24+ minutes"): the bar continues dashed past it. */
  open?: boolean
}

type View = { id: string; label: string; bars: Bar[]; note: string; status: string }

const VIEWS: View[] = [
  {
    id: 'crash',
    label: 'Long search',
    bars: [
      { label: 'Before the fixes', value: '24+ minutes, then a crash', seconds: 24 * 60, tone: 'before', open: true },
      { label: 'After the fixes', value: '47.7 s, zero errors', seconds: 47.7, tone: 'after' },
    ],
    note: 'The stall and crash traced to five bugs in LLM timeouts and connection pooling.',
    status: 'Long search: stalled 24+ minutes and crashed before the fixes, 47.7 s with zero errors after.',
  },
  {
    id: 'backfill',
    label: 'Slow queries',
    bars: [
      { label: 'Before the embedding backfill', value: '185.2 s', seconds: 185.2, tone: 'before' },
      { label: 'After, query 1', value: '14.3 s', seconds: 14.3, tone: 'after' },
      { label: 'After, query 2', value: '10.4 s', seconds: 10.4, tone: 'after' },
    ],
    note: '50.8% of the corpus had no embeddings. A 14-hour checkpointed backfill filled 196,082 rows.',
    status: 'Two slow queries: 185.2 s before the embedding backfill, 14.3 s and 10.4 s after.',
  },
]

/** Share of the track the 24-minute mark takes in a view with an open bar, leaving room for the dashed run past it. */
const OPEN_MARK = 0.84

function BarRow({ bar, scale }: { bar: Bar; scale: number }) {
  const share = Math.max(bar.seconds / scale, 0.004)
  const fill = bar.tone === 'before' ? 'bg-ink-2' : 'bg-accent'
  return (
    <li>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <span className="text-ink-2">{bar.label}</span>
        <span className={cn('text-metric', bar.tone === 'after' ? 'text-accent' : 'text-ink')}>{bar.value}</span>
      </div>
      <div className="relative mt-1.5 h-3" aria-hidden="true">
        <span className={cn('absolute inset-y-0 left-0 block', fill)} style={{ width: `${share * 100}%`, minWidth: 2 }} />
        {bar.open ? (
          <svg
            className="absolute inset-y-0 h-full text-ink-2"
            style={{ left: `${share * 100}%`, width: `${(1 - share) * 100}%` }}
            viewBox="0 0 100 12"
            preserveAspectRatio="none"
            focusable="false"
          >
            <line x1="0" y1="6" x2="100" y2="6" stroke="currentColor" strokeWidth="12" strokeDasharray="5 4" />
          </svg>
        ) : null}
      </div>
    </li>
  )
}

function Body({ view, onSelect }: { view: View; onSelect: (id: string) => void }) {
  const open = view.bars.some((b) => b.open)
  const longest = Math.max(...view.bars.map((b) => b.seconds))
  // With an open bar the measured floor sits at OPEN_MARK of the track; otherwise the longest bar fills it.
  const scale = open ? longest / OPEN_MARK : longest
  return (
    <div>
      <Segmented
        label="Comparison"
        options={VIEWS.map((v) => ({ id: v.id, label: v.label }))}
        value={view.id}
        onChange={onSelect}
      />
      <figure className="mt-5">
        <ul className="space-y-4">
          {view.bars.map((bar) => (
            <BarRow key={bar.label} bar={bar} scale={scale} />
          ))}
        </ul>
        <figcaption className="text-status mt-4">
          One linear scale per comparison.
          {open ? ' The dashed run marks a stall past 24 minutes that ended in a crash.' : ''}
        </figcaption>
      </figure>
      <p className="mt-4 max-w-[52ch] text-ink-2">{view.note}</p>
    </div>
  )
}

function Interactive({ id, setId }: { id: string; setId: (id: string) => void }) {
  const { interact } = useInstrument()
  const view = VIEWS.find((v) => v.id === id) ?? VIEWS[0]
  return (
    <Body
      view={view}
      onSelect={(next) => {
        interact()
        setId(next)
      }}
    />
  )
}

export default function B2Latency({ project }: { project: Project }) {
  const [id, setId] = useState(VIEWS[0].id)
  const view = VIEWS.find((v) => v.id === id) ?? VIEWS[0]
  return (
    <Instrument title="Search time, before and after" status={view.status} slug={project.slug}>
      <Interactive id={id} setId={setId} />
    </Instrument>
  )
}
