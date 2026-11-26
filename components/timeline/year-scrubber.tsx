'use client'

import { cx } from '@/lib/cx'

type Props = {
  /** Distinct years in list order, one button each. */
  years: string[]
  /** The year currently in view; its button carries aria-current. */
  current: string | null
  onSelect: (year: string) => void
  label?: string
  className?: string
}

/** Sticky year list beside a Timeline on wide screens. Hidden on phones by the rail. */
export function YearScrubber({ years, current, onSelect, label = 'Jump to year', className }: Props) {
  return (
    <div role="group" aria-label={label} className={cx('flex flex-col', className)}>
      {years.map((y) => {
        const active = y === current
        return (
          <button
            key={y}
            type="button"
            aria-current={active ? 'true' : undefined}
            onClick={() => onSelect(y)}
            className={cx(
              'group flex min-h-11 items-center gap-3 pr-3 text-left transition-colors duration-200',
              active ? 'text-ink' : 'text-ink-2 hover:text-ink',
            )}
          >
            {/* A dot like the rail's, filled in the accent for the year in view. */}
            <span
              aria-hidden="true"
              className={cx(
                'size-2 rounded-full transition-[transform,background-color] duration-300',
                active ? 'scale-125 bg-accent' : 'bg-rule-strong group-hover:bg-ink-2',
              )}
            />
            <span className="text-metric text-sm">{y}</span>
          </button>
        )
      })}
    </div>
  )
}
