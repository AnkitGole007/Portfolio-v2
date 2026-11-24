'use client'

import type { ReactNode } from 'react'
import { ArrowUpRight, Play } from '@/components/ui/icons'
import { track } from '@/lib/analytics'
import { cx } from '@/lib/cx'

export type PillVariant = 'primary' | 'secondary' | 'text'

/**
 * Mirrors components/ui/button.tsx so client-side actions match the server ButtonLink. Buttons are
 * square-cornered (the art direction decides one shape for the site); `text` is an underlined link
 * with the same 44 px target, for the actions next to the one filled button.
 */
export const pill: Record<PillVariant | 'base', string> = {
  base: 'press inline-flex min-h-11 items-center justify-center gap-2 text-sm font-medium whitespace-nowrap transition-[background-color,color,opacity,border-color,text-decoration-color] duration-200',
  primary: 'px-5 bg-accent text-accent-ink hover:opacity-90',
  secondary: 'px-5 bg-surface-sunken text-ink hover:bg-rule',
  text: 'px-0.5 text-ink underline decoration-rule-strong decoration-1 underline-offset-[5px] hover:text-accent hover:decoration-accent',
}

type LinkProps = {
  href: string
  /** cta_click id, for example "resume" or "call". */
  id: string
  /** cta_click location, for example "hero" or "island". */
  location: string
  variant?: PillVariant
  download?: boolean
  className?: string
  children: ReactNode
}

/** Anchor that reports a cta_click before the browser follows it. http(s) URLs open in a new tab. */
export function TrackLink({ href, id, location, variant = 'primary', download, className, children }: LinkProps) {
  const external = /^https?:/i.test(href)
  return (
    <a
      href={href}
      download={download}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onClick={() => track('cta_click', { id, location })}
      className={cx(pill.base, pill[variant], className)}
    >
      {children}
      {external && <ArrowUpRight size={16} aria-hidden="true" />}
    </a>
  )
}

type PitchProps = {
  slug: string
  location: string
  label?: string
  variant?: PillVariant
  className?: string
}

/** Opens the shared pitch lightbox (components/reel/reel-provider.tsx listens for reel:open). */
export function WatchPitch({ slug, location, label = 'Watch the 25 s pitch', variant = 'secondary', className }: PitchProps) {
  const open = () => {
    track('cta_click', { id: 'pitch', location })
    window.dispatchEvent(new CustomEvent('reel:open', { detail: { slug, location } }))
  }
  return (
    <button type="button" onClick={open} className={cx(pill.base, pill[variant], className)}>
      <Play size={16} aria-hidden="true" />
      {label}
    </button>
  )
}
