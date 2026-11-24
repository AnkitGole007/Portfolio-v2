'use client'

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { usePathname } from 'next/navigation'
import { useMotionValueEvent, useScroll } from 'motion/react'
import { ArrowRight, CalendarBlank, DownloadSimple, MagnifyingGlass, X } from '@/components/ui/icons'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { track } from '@/lib/analytics'
import { CopyEmail, useEmailCopyEvent } from './copy-email'
import type { EmailParts } from './email'

const DISMISS_KEY = 'island:dismissed'
const FALLBACK_OFFSET = 600
/** From md up the island returns this long after the last scroll event, when nothing is under it. */
const SETTLE_MS = 600
/** Below md (48rem): the island shows only after a scroll up and hides on the next scroll down. */
const PHONE_QUERY = '(max-width: 47.99rem)'
/** Where the bar sits from md up before it has been measured: 24 px from the right and bottom edges. */
const DESKTOP_ESTIMATE = { width: 432, height: 58, inset: 24 }
/** Content the bar must not cover: text blocks, controls and media. Containers such as a list row are not on it. */
const CONTENT = 'p, h1, h2, h3, h4, h5, h6, dt, dd, td, th, a, button, label, figcaption, blockquote, img, picture, video, canvas, svg, input, select, textarea'

/**
 * True when a text block, a control or a picture lies under the rectangle the bar takes. The rectangle
 * is sampled every 16 px across and every 12 px down (about 130 points, read once when scrolling
 * settles), finer than the shortest line of text; at each, the topmost element outside the bar is
 * read. A list row or a section only counts where it carries its own text, so the empty space between
 * rows stays usable.
 */
function contentUnder(rect: { left: number; top: number; right: number; bottom: number }, bar: HTMLElement | null): boolean {
  const xs: number[] = []
  const ys: number[] = []
  for (let x = rect.left + 4; x <= rect.right - 4; x += 16) xs.push(x)
  for (let y = rect.top + 4; y <= rect.bottom - 4; y += 12) ys.push(y)
  for (const x of xs) {
    for (const y of ys) {
      const hit = document.elementsFromPoint(x, y).find((el) => !bar?.contains(el))
      if (!hit || hit === document.documentElement || hit === document.body) continue
      if (hit.closest(CONTENT)) return true
      if ([...hit.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim())) return true
    }
  }
  return false
}
/** Enter and exit: opacity and a 12 px rise, 280 ms (the CSS transition below). */
const EXIT_MS = 280
const item =
  'press inline-flex h-11 min-w-11 items-center justify-center gap-2 px-3 text-sm font-medium text-ink transition-colors hover:bg-surface'

/** callHref is absent while no scheduling link exists; resumeIsFile marks a PDF download rather than the /resume page. */
type Props = { resumeHref: string; resumeIsFile: boolean; callHref?: string; email: EmailParts }

/**
 * Floating quick actions after the hero: progress ring, Resume, Email, Call, Search, dismiss.
 * Loaded after the first paint by island-loader.tsx. Only motion's scroll values are used here;
 * the enter and exit fade is a CSS transition (with @starting-style for the entry) so the motion
 * component runtime stays out of every page.
 *
 * It never sits on what the visitor is reading. Below md it shows only after a scroll up and hides on
 * the next scroll down; it does not return on its own. From md up it hides while the page scrolls and
 * returns once scrolling settles, and only when no text, control or picture lies under its place. It
 * stays put while it holds keyboard focus, so focus is never dropped.
 */
export function IslandBar({ resumeHref, resumeIsFile, callHref, email }: Props) {
  const pathname = usePathname()
  const reduce = useReducedMotion() === true
  const { scrollY, scrollYProgress } = useScroll()
  const ring = useRef<SVGCircleElement>(null)
  const [past, setPast] = useState(false)
  const [dismissed, setDismissed] = useState(true)
  const [overlays, setOverlays] = useState<Record<string, boolean>>({})
  // From md up: true from the first scroll event until scrolling settles.
  const [moving, setMoving] = useState(false)
  // Phones: set by a scroll up, cleared by a scroll down, never by time.
  const [revealed, setRevealed] = useState(false)
  // From md up: false while content lies under the bar's place, read when scrolling settles. False
  // until first read, so a page opened part way down never shows the bar over its text.
  const [clear, setClear] = useState(false)
  const [phone, setPhone] = useState(false)
  const hasSentinel = useRef(false)
  const toolbar = useRef<HTMLDivElement>(null)
  const lastRect = useRef<DOMRect | null>(null)
  const settle = useRef(0)
  useEmailCopyEvent(email)
  useEffect(() => () => window.clearTimeout(settle.current), [])

  useEffect(() => {
    const mq = window.matchMedia(PHONE_QUERY)
    const sync = () => setPhone(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const holdsFocus = () => Boolean(toolbar.current?.contains(document.activeElement))

  // From md up: whether the bar's place is free of content. The bar's last measured box is used while
  // it is hidden; before the first measure, its usual place in the corner.
  const isClear = useCallback((): boolean => {
    if (window.matchMedia(PHONE_QUERY).matches || holdsFocus()) return true
    const bar = toolbar.current
    if (bar) lastRect.current = bar.getBoundingClientRect()
    const { width, height, inset } = DESKTOP_ESTIMATE
    const right = window.innerWidth - inset
    const bottom = window.innerHeight - inset
    const rect = lastRect.current ?? { left: right - width, top: bottom - height, right, bottom }
    return !contentUnder(rect, bar)
  }, [])

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(DISMISS_KEY) === '1')
    } catch {
      setDismissed(false)
    }
  }, [])

  // While the island is enabled, <html data-island> gives the footer room under its last line (globals.css).
  useEffect(() => {
    const root = document.documentElement
    if (dismissed) root.removeAttribute('data-island')
    else root.setAttribute('data-island', '')
    return () => root.removeAttribute('data-island')
  }, [dismissed])

  // The home hero renders [data-hero-end]; elsewhere the island appears after 600 px.
  // The root is extended far below the viewport, so the zero-height sentinel counts as
  // intersecting until it passes the top edge; an instant jump past it still fires.
  useEffect(() => {
    const sentinel = document.querySelector('[data-hero-end]')
    hasSentinel.current = Boolean(sentinel)
    if (!sentinel) {
      setPast(window.scrollY > FALLBACK_OFFSET)
      return
    }
    const io = new IntersectionObserver(([e]) => setPast(!e.isIntersecting), { rootMargin: '0px 0px 100000px 0px' })
    io.observe(sentinel)
    return () => io.disconnect()
  }, [pathname])

  // Out of the way while the visitor reads. Phones: back only on a scroll up, gone on a scroll down.
  // From md: gone while the page moves, back once it settles if nothing lies under its place (both
  // states are set together, so it never flashes over content). It stays put while it holds keyboard
  // focus so focus is never dropped.
  useMotionValueEvent(scrollY, 'change', (y) => {
    if (!hasSentinel.current) setPast(y > FALLBACK_OFFSET)
    const delta = y - (scrollY.getPrevious() ?? y)
    const focused = holdsFocus()
    if (delta > 0 && !focused) setRevealed(false)
    else if (delta < 0) setRevealed(true)
    if (delta !== 0 && !focused) setMoving(true)
    window.clearTimeout(settle.current)
    settle.current = window.setTimeout(() => {
      setClear(isClear())
      setMoving(false)
    }, SETTLE_MS)
  })

  // The first read, once the visitor is past the hero (or opened the page part way down).
  useEffect(() => {
    if (past) setClear(isClear())
  }, [past, isClear])

  // A width change moves content under the bar's place: measure again once the resize settles.
  useEffect(() => {
    let t = 0
    const onResize = () => {
      lastRect.current = null
      window.clearTimeout(t)
      t = window.setTimeout(() => setClear(isClear()), SETTLE_MS)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('resize', onResize)
    }
  }, [isClear])

  // Hidden while the command palette or the pitch lightbox is open.
  useEffect(() => {
    const onState = (e: Event) => {
      const open = Boolean((e as CustomEvent<{ open?: boolean }>).detail?.open)
      setOverlays((s) => ({ ...s, [e.type]: open }))
    }
    window.addEventListener('palette:state', onState)
    window.addEventListener('reel:state', onState)
    return () => {
      window.removeEventListener('palette:state', onState)
      window.removeEventListener('reel:state', onState)
    }
  }, [])

  const dismiss = () => {
    track('cta_click', { id: 'dismiss', location: 'island' })
    // The button is about to unmount: hand focus to the main landmark rather than letting it fall to body.
    const main = document.getElementById('main')
    if (main && toolbar.current?.contains(document.activeElement)) {
      if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1')
      main.focus({ preventScroll: true })
    }
    setDismissed(true)
    try {
      sessionStorage.setItem(DISMISS_KEY, '1')
    } catch {
      // Storage blocked: hidden for this page view only.
    }
  }
  const openSearch = () => {
    track('cta_click', { id: 'search', location: 'island' })
    window.dispatchEvent(new CustomEvent('palette:open'))
  }
  // Arrow keys move focus along the toolbar.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('a, button'))
    const i = items.indexOf(document.activeElement as HTMLElement)
    if (i < 0) return
    e.preventDefault()
    items[(i + (e.key === 'ArrowRight' ? 1 : items.length - 1)) % items.length]?.focus()
  }

  const shown = phone ? revealed : !moving && clear
  const visible = past && !dismissed && shown && !Object.values(overlays).some(Boolean)

  // Stays in the DOM through the exit fade, then unmounts (what AnimatePresence did before).
  const [present, setPresent] = useState(visible)
  useEffect(() => {
    if (visible) {
      setPresent(true)
      return
    }
    if (reduce) {
      setPresent(false)
      return
    }
    const t = window.setTimeout(() => setPresent(false), EXIT_MS)
    return () => window.clearTimeout(t)
  }, [visible, reduce])

  // Progress ring: pathLength 1, so the dash offset is the share of the page still below.
  const paintRing = useCallback((v: number) => {
    ring.current?.style.setProperty('stroke-dashoffset', String(1 - Math.min(1, Math.max(0, v))))
  }, [])
  useMotionValueEvent(scrollYProgress, 'change', paintRing)
  useEffect(() => {
    if (present) paintRing(scrollYProgress.get())
  }, [present, scrollYProgress, paintRing])

  if (!present) return null
  return (
    <div
      data-open={visible}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-[opacity,translate] duration-[280ms] ease-[cubic-bezier(0.25,1,0.5,1)] data-[open=false]:translate-y-3 data-[open=false]:opacity-0 starting:translate-y-3 starting:opacity-0 motion-reduce:transition-none md:justify-end md:px-6 md:pb-6"
    >
      <div
        ref={toolbar}
        role="toolbar"
        aria-label="Quick actions"
        onKeyDown={onKeyDown}
        // An opaque square bar on the raised tone. It floats over the page, so it takes the float-lift
        // utility; no blur and no outline.
        className="panel float-lift pointer-events-auto relative flex items-center gap-1 bg-surface-raised p-1.5"
      >
        <span aria-hidden="true" className="mx-1 inline-flex h-7 w-7 shrink-0 items-center justify-center">
          <svg viewBox="0 0 28 28" className="h-7 w-7 -rotate-90">
            <circle cx="14" cy="14" r="12" className="fill-none stroke-rule" strokeWidth="2" />
            <circle
              ref={ring}
              cx="14"
              cy="14"
              r="12"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1}
              className="fill-none stroke-accent"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <a href={resumeHref} download={resumeIsFile || undefined} onClick={() => track('cta_click', { id: 'resume', location: 'island' })} className={item}>
          {resumeIsFile ? <DownloadSimple size={18} aria-hidden="true" /> : <ArrowRight size={18} aria-hidden="true" />}
          <span className="sr-only md:not-sr-only">Resume</span>
        </a>
        <CopyEmail parts={email} location="island" compact />
        {callHref ? (
          <a href={callHref} target="_blank" rel="noopener noreferrer" onClick={() => track('cta_click', { id: 'call', location: 'island' })} className={item}>
            <CalendarBlank size={18} aria-hidden="true" />
            <span className="sr-only md:not-sr-only">Call</span>
          </a>
        ) : null}
        <button type="button" onClick={openSearch} className={item}>
          <MagnifyingGlass size={18} aria-hidden="true" />
          <span className="sr-only md:not-sr-only">Search</span>
        </button>
        <button type="button" onClick={dismiss} aria-label="Hide quick actions" className={item}>
          <X size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
