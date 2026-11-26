'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { afterPaintIdle } from '@/lib/idle'
import type { fitCanvas as FitCanvas, RunFunnel } from './funnel-run'

/**
 * The animated layer of the retrieval funnel. It decides nothing about content: it waits for the
 * first paint and an idle period, then mounts a 2D canvas over the static figure and runs the search
 * once when the figure is on screen (about 3.5 s, under the 5 s that would need a pause control).
 * A replay button lands in the caption slot afterwards.
 *
 * It never mounts under prefers-reduced-motion, with Save-Data on, in a browser without WebGL (taken
 * as the sign of a device that should not spend frames on decoration) or without a 2D context. In each
 * of those cases the server-rendered figure is the whole picture.
 */
export function FunnelMotion() {
  const marker = useRef<HTMLSpanElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const runRef = useRef<RunFunnel | null>(null)
  const cancelRef = useRef<(() => void) | null>(null)
  const [live, setLive] = useState(false)
  const [running, setRunning] = useState(false)
  const [slot, setSlot] = useState<Element | null>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } }
    const noWebGL = typeof window.WebGLRenderingContext === 'undefined'
    if (reduce || nav.connection?.saveData || noWebGL) return
    return afterPaintIdle(() => setLive(true), 2500)
  }, [])

  const figure = () => marker.current?.closest<HTMLElement>('[data-funnel]') ?? null

  const start = useCallback(() => {
    const fig = figure()
    const canvas = canvasRef.current
    const run = runRef.current
    if (!fig || !canvas || !run) return
    cancelRef.current?.()
    setRunning(true)
    cancelRef.current = run(fig, canvas, () => {
      cancelRef.current = null
      setRunning(false)
    })
  }, [])

  useEffect(() => {
    if (!live) return
    const fig = figure()
    const canvas = canvasRef.current
    if (!fig || !canvas || !canvas.getContext('2d')) {
      setLive(false)
      return
    }
    setSlot(fig.querySelector('[data-funnel-replay]'))
    let io: IntersectionObserver | null = null
    let ro: ResizeObserver | null = null
    let disposed = false
    import('./funnel-run').then(
      ({ runFunnel, fitCanvas }: { runFunnel: RunFunnel; fitCanvas: typeof FitCanvas }) => {
        if (disposed) return
        runRef.current = runFunnel
        // The canvas stays invisible until it is clipped to the field and the channel, off the text.
        fitCanvas(fig, canvas)
        ro = new ResizeObserver(() => fitCanvas(fig, canvas))
        ro.observe(fig)
        io = new IntersectionObserver(
          (entries) => {
            if (!entries.some((e) => e.isIntersecting)) return
            io?.disconnect()
            start()
          },
          { threshold: 0.35 },
        )
        io.observe(fig)
      },
      () => setLive(false),
    )
    return () => {
      disposed = true
      io?.disconnect()
      ro?.disconnect()
      cancelRef.current?.()
    }
  }, [live, start])

  return (
    <>
      <span ref={marker} hidden />
      {live && (
        <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none invisible absolute inset-0 h-full w-full" />
      )}
      {live &&
        slot &&
        createPortal(
          <button
            type="button"
            // aria-disabled, not disabled: a disabled button drops keyboard focus to the page body.
            onClick={running ? undefined : start}
            aria-disabled={running}
            className="press inline-flex min-h-11 items-center px-0.5 text-ink underline decoration-rule-strong underline-offset-[5px] transition-colors hover:text-accent hover:decoration-accent aria-disabled:text-ink-2 aria-disabled:no-underline"
          >
            {running ? 'Searching' : 'Run the search again'}
          </button>,
          slot,
        )}
    </>
  )
}
