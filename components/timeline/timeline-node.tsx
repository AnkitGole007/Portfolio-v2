'use client'

import { useId } from 'react'
import { ArrowUpRight, CaretDown } from '@/components/ui/icons'
import { Logo } from '@/components/ui/logo'
import { cx } from '@/lib/cx'
import type { TimelineEntry, TimelineProps } from './timeline'

type Props = {
  entry: TimelineEntry
  density: NonNullable<TimelineProps['density']>
  open: boolean
  /** Play the open animation (true once the visitor has toggled a node; the panel open on load stays still). */
  animate: boolean
  onToggle: (id: string) => void
  nodeRef: (id: string, el: HTMLElement | null) => void
}

/** One node on the rail: marker, logo, title, org, dates, tags and a disclosure for the detail. */
export function TimelineNode({ entry, density, open, animate, onToggle, nodeRef }: Props) {
  const uid = useId()
  const headerId = `${uid}-header`
  const panelId = `${uid}-panel`
  const compact = density === 'compact'
  const metrics = !compact && entry.metrics && entry.metrics.length > 0 ? entry.metrics : null
  const expandable = entry.lines.length > 0 || metrics !== null || Boolean(entry.href)
  const logoName = entry.logoName ?? entry.org

  const headerClass = cx('group flex w-full min-h-11 items-start gap-4 py-2 text-left', expandable && 'cursor-pointer')

  const header = (
    <>
      <span className="min-w-0 flex-1">
        {/* The date, then the kind of involvement as plain words: no chips, no outlines. */}
        <span className="text-status flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <span>{entry.dateText}</span>
          {entry.tags?.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </span>
        <span
          className={cx(
            'mt-1 block text-ink transition-colors duration-200',
            expandable && 'group-hover:text-accent',
            // The full-size title is the 20 px step in the display face at the house 500 weight.
            compact ? 'leading-snug font-medium' : 'font-display text-lg leading-snug font-medium',
          )}
        >
          {entry.title}
        </span>
        {entry.detail && <span className="mt-0.5 block text-ink">{entry.detail}</span>}
        {entry.org && (
          <span className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-ink-2">
            <Logo name={logoName} height={18} />
            <span>{entry.org}</span>
          </span>
        )}
      </span>
      {expandable && (
        <CaretDown
          size={18}
          aria-hidden="true"
          className={cx('mt-3 shrink-0 text-ink-2 transition-transform duration-300', open && 'rotate-180')}
        />
      )}
    </>
  )

  return (
    <div ref={(el) => nodeRef(entry.id, el)} data-timeline-id={entry.id} className="relative pl-7 md:pl-10">
      {/* A filled dot in the rail's channel, like a stage mark in the hero funnel: the accent while the
          role runs, the soft ink once it has ended. */}
      <span
        aria-hidden="true"
        className={cx('absolute top-[14px] left-0 size-2 -translate-x-1/2 rounded-full', entry.ongoing ? 'bg-accent' : 'bg-ink-3')}
      />

      <h3 className="m-0 font-sans text-base font-normal text-pretty">
        {expandable ? (
          <button
            type="button"
            id={headerId}
            data-timeline-header=""
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => onToggle(entry.id)}
            className={headerClass}
          >
            {header}
          </button>
        ) : (
          <span id={headerId} className={headerClass}>
            {header}
          </span>
        )}
      </h3>

      {expandable && (
        <div id={panelId} hidden={!open} className="pb-1">
          {/* panel-in (globals.css): 280 ms fade and 6 px drop each time the panel is shown, none with reduced motion. */}
          <div className={cx('max-w-[68ch] pt-1', animate && 'panel-in')}>
            {compact ? (
              <p className="text-ink">{entry.lines.join(' ')}</p>
            ) : (
              <ul className="m-0 list-none space-y-2.5 p-0 text-ink">
                {entry.lines.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            )}

            {metrics && (
              <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
                {metrics.map((m) => (
                  <div key={m.label} className="min-w-0">
                    <dt className="text-sm text-ink-2">{m.label}</dt>
                    <dd className="text-metric mt-0.5 text-ink">{m.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {entry.href && (
              <a
                href={entry.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm text-ink-2 underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                {entry.org}
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
