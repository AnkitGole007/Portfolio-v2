'use client'

import { useState, type KeyboardEvent } from 'react'
import { Instrument, useInstrument } from '@/components/instruments/instrument'
import type { Metric, Project } from '@/lib/content'
import { cn } from '@/lib/utils'

/*
 * Metric explorer, the shared instrument for projects without a bespoke one. It renders
 * project.metrics from profile.json as a selectable list and prints the chosen value as written.
 * The value is never counted up or tweened: a count-up would show numbers that were never
 * measured on the way to the real one.
 */

type MetricLike = Metric & { note?: string }

function Body({ metrics }: { metrics: MetricLike[] }) {
  const { interact } = useInstrument()
  const [index, setIndex] = useState(0)
  const current = metrics[index] ?? metrics[0]

  const select = (i: number) => {
    interact()
    setIndex(i)
  }
  const onGroupKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const delta = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    let next = -1
    if (delta) next = (index + delta + metrics.length) % metrics.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = metrics.length - 1
    if (next < 0) return
    e.preventDefault()
    select(next)
    e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next]?.focus()
  }

  return (
    <div className="grid gap-6 md:grid-cols-12 md:gap-8">
      <div role="radiogroup" aria-label="Reported metric" onKeyDown={onGroupKey} className="flex flex-col gap-1 md:col-span-6">
        {metrics.map((m, i) => {
          const checked = i === index
          return (
            <button
              key={`${m.label}-${i}`}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked ? 0 : -1}
              onClick={() => select(i)}
              className={cn(
                'press flex min-h-11 items-center justify-between gap-4 px-4 py-2 text-left text-sm transition-[background-color,color] duration-200',
                checked ? 'bg-accent text-accent-ink' : 'bg-surface text-ink hover:bg-surface-sunken',
              )}
            >
              <span className="min-w-0">{m.label}</span>
              {/* The value may wrap inside its own share of the row, so a long one never squeezes the label to a word a line. */}
              <span className={cn('text-metric max-w-[45%] text-right', checked ? 'text-accent-ink' : 'text-ink-2')}>{m.value}</span>
            </button>
          )
        })}
      </div>
      <div className="md:col-span-6">
        <p className="text-sm text-ink-2">{current.label}</p>
        <p aria-hidden="true" className="text-metric mt-2 text-4xl text-ink md:text-6xl">
          {current.value}
        </p>
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {current.label}: {current.value}
        </p>
        {current.note ? <p className="mt-3 max-w-[48ch] text-sm text-ink-2">{current.note}</p> : null}
      </div>
    </div>
  )
}

export default function MetricExplorer({ project }: { project: Project }) {
  const metrics = project.metrics as MetricLike[]
  if (metrics.length === 0) return null
  return (
    <Instrument
      title="Reported numbers"
      status={`${metrics.length} ${metrics.length === 1 ? 'metric' : 'metrics'} from the project write-up`}
      slug={project.slug}
    >
      <Body metrics={metrics} />
    </Instrument>
  )
}
