'use client'

import { useEffect, useRef, useState } from 'react'
import { InstrumentFor } from '@/components/instruments/registry'
import type { Project } from '@/lib/content'
import { cn } from '@/lib/utils'

/**
 * Home-page slot for a project's lead instrument. `InstrumentFor` (next/dynamic, ssr: false) is rendered
 * only once the slot comes within 200 px of the viewport, so the instrument chunk and its data are
 * not fetched for a visitor who never scrolls to it. The slot keeps `minHeight` (380 px) before and while
 * the chunk loads. From 768 px the mounted instrument is that tall (378 px), and on a scroll it mounts
 * off screen, so nothing visible moves; on a phone it is taller (439 px at 390, 515 at 320), so a jump
 * or Tab straight past the slot can still move the text below it by the difference when it mounts.
 * Project pages render their instruments on the server instead (components/projects/instrument-section).
 */
export function InstrumentSlot({
  project,
  minHeight = 380,
  className,
}: {
  project: Project
  /** Pixels reserved before the instrument mounts. */
  minHeight?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || near) return
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: '200px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [near])

  return (
    // The reserve holds until an instrument shell is in; the shell then keeps its own height.
    <div
      ref={ref}
      className={cn('min-h-(--reserve) has-[[data-instrument]]:min-h-0', className)}
      style={{ '--reserve': `${minHeight}px` } as React.CSSProperties}
    >
      {near ? <InstrumentFor project={project} lead /> : null}
    </div>
  )
}
