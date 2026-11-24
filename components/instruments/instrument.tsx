'use client'

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  type ReactNode,
} from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/utils'
import type { Metric, Project } from '@/lib/content'

/**
 * Shared shell for every project instrument (small interactive demo).
 *
 * Contract (see docs/superpowers/agent-brief-v2.md):
 *   <Instrument title status slug className? minHeight? onFirstInteraction?>{children}</Instrument>
 *
 * - Renders a square shell on the raised tone (no outline) with a small Franklin title top
 *   left, the children, and a `text-status` line on a sunken band underneath. The status
 *   line is a polite live region, so each change of state is read out once.
 * - Children render at once, on the server as well, so the page HTML holds every instrument at its
 *   real size and nothing below it moves when the client code arrives (no placeholder, no lazy mount).
 *   The home page's lead slot (components/sections/instrument-slot.tsx) is the one lazy caller: it
 *   reserves its own height and mounts the instrument 200 px before it enters the viewport.
 * - `useInstrument()` gives children `{ reduced, interact }`. `reduced` mirrors
 *   `useReducedMotion()`. `interact()` fires one `instrument_use` analytics event per
 *   mounted instrument, then becomes a no-op.
 * - Instruments swap measured states at once. None tweens or counts up a number, so no
 *   value that was not measured is ever on screen, with or without reduced motion.
 */

export type InstrumentContextValue = {
  /** True when the visitor prefers reduced motion. Skip non-essential animation. */
  reduced: boolean
  /** Call on the first real interaction (drag, key press, toggle). Fires analytics once. */
  interact: () => void
}

const InstrumentContext = createContext<InstrumentContextValue>({
  reduced: false,
  interact: () => {},
})

export function useInstrument(): InstrumentContextValue {
  return useContext(InstrumentContext)
}

export type InstrumentProps = {
  /** Short instrument name, in the small-print face at the top left. */
  title: string
  /** Status line under the instrument. Pass the live value here when it changes. */
  status: string
  /** Project slug, sent with the `instrument_use` event. */
  slug: string
  className?: string
  /** Optional callback alongside the analytics event. */
  onFirstInteraction?: () => void
  children: ReactNode
}

export function Instrument({
  title,
  status,
  slug,
  className,
  onFirstInteraction,
  children,
}: InstrumentProps) {
  const fired = useRef(false)
  const titleId = useId()
  const prefersReduced = useReducedMotion()
  const reduced = prefersReduced === true

  const interact = useCallback(() => {
    if (fired.current) return
    fired.current = true
    track('instrument_use', { slug })
    onFirstInteraction?.()
  }, [slug, onFirstInteraction])

  const value = useMemo<InstrumentContextValue>(() => ({ reduced, interact }), [reduced, interact])

  return (
    <div
      role="group"
      aria-labelledby={titleId}
      data-instrument={slug}
      className={cn(
        // Square, on the raised tone, no outline: the panel is a tone step from the page, not a drawn box.
        'panel hud-frame relative flex flex-col overflow-hidden bg-surface-raised',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 px-4 pt-3 sm:px-5">
        <p id={titleId} className="text-label text-ink-2">
          {title}
        </p>
      </div>
      <div className="relative px-4 py-3 sm:px-5">
        <InstrumentContext.Provider value={value}>{children}</InstrumentContext.Provider>
      </div>
      <p
        className="text-status bg-surface-sunken px-4 py-2.5 sm:px-5"
        aria-live="polite"
        aria-atomic="true"
      >
        {/* The sunken band spans the panel; the text keeps a 75-character measure on wide screens. */}
        <span className="block max-w-[75ch]">{status}</span>
      </p>
    </div>
  )
}

/** First metric whose label matches, so instruments never hardcode a number. */
export function findMetric(project: Project, pattern: RegExp): Metric | undefined {
  return project.metrics.find((metric) => pattern.test(metric.label))
}

export type SegmentedOption = { id: string; label: string }

/**
 * Square segmented control with radio semantics: arrow keys move the selection,
 * Home and End jump, every target is at least 44 px tall.
 */
export function Segmented({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string
  options: SegmentedOption[]
  value: string
  onChange: (id: string) => void
  className?: string
}) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const index = options.findIndex((option) => option.id === value)
    let next = -1
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % options.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + options.length) % options.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = options.length - 1
    if (next < 0 || !options[next]) return
    event.preventDefault()
    onChange(options[next].id)
    buttons.current[next]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn('flex max-w-full flex-wrap gap-2', className)}
    >
      {options.map((option, index) => {
        const checked = option.id === value
        return (
          <button
            key={option.id}
            ref={(el) => {
              buttons.current[index] = el
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            onClick={() => onChange(option.id)}
            className={cn(
              'press min-h-11 whitespace-nowrap px-4 text-base leading-none transition-colors duration-200',
              checked ? 'bg-accent text-accent-ink' : 'bg-surface text-ink hover:bg-surface-sunken',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default Instrument
