/**
 * One animated run of the retrieval funnel, drawn on a 2D canvas laid over the static figure
 * (components/hero/retrieval-funnel.tsx). Loaded on demand by FunnelMotion once the page is idle.
 *
 * Every position comes from the static markup, so the run ends exactly on the picture the server
 * rendered: the field geometry from the field SVG's data attributes, the landing spots from the
 * stage dots. Timeline, about 3.5 s in all:
 *   0 to 0.35 s     as many field dots as stage one holds light up in the accent, spread over the corpus
 *   0.35 to 1.45 s  each slides along its row to the channel, then drops into the stage-one slot
 *   1.75 to 2.65 s  as many as stage two holds move on into its channel the same way
 *   2.65 s          the reading list draws in (CSS, on the figure's data-phase)
 *   3.3 s           the static marks return and the canvas clears
 * A change in the figure's width during a run ends it at once on the static picture (a phone's URL bar
 * changing the viewport height does not).
 *
 * The canvas is clipped to the field and the channel column (fitCanvas), so it never lies over the
 * counts and labels: a dot's path is a slide inside the field, then a fall inside the channel.
 */

export type RunFunnel = (figure: HTMLElement, canvas: HTMLCanvasElement, onEnd: () => void) => () => void

type Point = { x: number; y: number; r: number }

const T_LIGHT = 350
const T_DROP = 1450
const T_HOLD = 1750
const T_MOVE = 2650
const T_SETTLE = 3300
const T_END = 3480
const STAGGER = 28
/** Share of a move spent sliding sideways; the rest is the fall. */
const SLIDE = 0.5

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const easeIn = (t: number) => t * t
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))

/** Centres and radii of a stage's dots, relative to the figure. */
function stageDots(figure: HTMLElement, origin: DOMRect, stage: number): Point[] {
  return Array.from(figure.querySelectorAll<SVGCircleElement>(`[data-stage="${stage}"] circle`), (c) => {
    const b = c.getBoundingClientRect()
    return { x: b.left - origin.left + b.width / 2, y: b.top - origin.top + b.height / 2, r: b.width / 2 }
  })
}

/** An L-shaped move: slide along the row to the target's column, then drop into place. */
function along(a: Point, b: Point, t: number): Point {
  if (t <= SLIDE) {
    const k = easeInOut(t / SLIDE)
    return { x: a.x + (b.x - a.x) * k, y: a.y, r: a.r }
  }
  const k = easeIn((t - SLIDE) / (1 - SLIDE))
  return { x: b.x, y: a.y + (b.y - a.y) * k, r: b.r }
}

/**
 * Sizes the canvas to the figure and clips it to where dots travel: the field, from its top edge
 * down to the panel edge across the full width, then the channel column below. Returns the figure box.
 */
export function fitCanvas(figure: HTMLElement, canvas: HTMLCanvasElement): DOMRect {
  const origin = figure.getBoundingClientRect()
  const field = figure.querySelector('[data-funnel-field]')?.getBoundingClientRect()
  const below = figure.querySelector<HTMLElement>('[data-funnel-below]')
  const column = below ? parseFloat(getComputedStyle(below).getPropertyValue('--col')) : NaN
  if (field && below && Number.isFinite(column)) {
    const top = Math.max(0, Math.floor(field.top - origin.top) - 4)
    const seam = Math.round(below.getBoundingClientRect().top - origin.top)
    const col = Math.ceil(column)
    canvas.style.clipPath = `polygon(0 ${top}px, 100% ${top}px, 100% ${seam}px, ${col}px ${seam}px, ${col}px 100%, 0 100%)`
  }
  canvas.style.visibility = 'visible'
  return origin
}

export const runFunnel: RunFunnel = (figure, canvas, onEnd) => {
  const ctx = canvas.getContext('2d')
  const field = figure.querySelector<SVGSVGElement>('[data-funnel-field]')
  const origin = fitCanvas(figure, canvas)
  const first = stageDots(figure, origin, 1)
  const second = stageDots(figure, origin, 2)
  if (!ctx || !field || first.length === 0) {
    onEnd()
    return () => {}
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.round(origin.width * dpr)
  canvas.height = Math.round(origin.height * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const accent = getComputedStyle(figure).getPropertyValue('--accent').trim() || '#355b2c'
  const cols = Number(field.dataset.cols) || 125
  const dots = Number(field.dataset.dots) || cols
  const box = field.getBoundingClientRect()
  const pitch = box.width / cols
  const fieldR = pitch * (1.7 / 8)

  // Stratified picks: one dot from each equal slice of the corpus, so the candidates come from all over it.
  const picks: Point[] = first.map((_, k) => {
    const i = Math.min(dots - 1, Math.floor((k + Math.random()) * (dots / first.length)))
    return {
      x: box.left - origin.left + ((i % cols) + 0.5) * pitch,
      y: box.top - origin.top + (Math.floor(i / cols) + 0.5) * pitch,
      r: fieldR,
    }
  })
  // The stage-one dots that go on to stage two.
  const onward = first
    .map((p) => ({ p, key: Math.random() }))
    .sort((a, b) => a.key - b.key)
    .slice(0, second.length)
    .map(({ p }) => p)

  let raf = 0
  let ended = false
  let listShown = false
  const t0 = performance.now()
  figure.dataset.phase = 'run'

  const dot = (p: Point, alpha = 1) => {
    ctx.globalAlpha = alpha
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fill()
  }

  const ro = new ResizeObserver(([entry]) => {
    if (entry && Math.abs(entry.contentRect.width - origin.width) > 1) finish()
  })

  function finish() {
    if (ended) return
    ended = true
    cancelAnimationFrame(raf)
    ro.disconnect()
    delete figure.dataset.phase
    ctx?.clearRect(0, 0, origin.width, origin.height)
    onEnd()
  }

  const frame = (now: number) => {
    const t = now - t0
    ctx.clearRect(0, 0, origin.width, origin.height)
    ctx.fillStyle = accent

    if (t < T_LIGHT) {
      const k = easeOut(t / T_LIGHT)
      picks.forEach((p) => dot({ ...p, r: p.r + (first[0].r - p.r) * k }, k))
    } else {
      // Stage one: each pick travels to its slot, a few milliseconds behind the one before.
      first.forEach((target, i) => {
        const local = clamp01((t - T_LIGHT - i * STAGGER) / (T_DROP - T_LIGHT))
        dot(along({ ...picks[i], r: target.r }, target, local))
      })
      // Stage two: copies of the onward dots move down the channel.
      if (t >= T_HOLD) {
        const local = clamp01((t - T_HOLD) / (T_MOVE - T_HOLD))
        second.forEach((target, i) => dot(along(onward[i] ?? first[0], target, local)))
      }
    }

    if (t >= T_MOVE && !listShown) {
      listShown = true
      figure.dataset.phase = 'list'
    }
    if (t >= T_SETTLE && figure.dataset.phase) delete figure.dataset.phase
    if (t >= T_END) {
      finish()
      return
    }
    raf = requestAnimationFrame(frame)
  }

  ro.observe(figure)
  raf = requestAnimationFrame(frame)
  return finish
}
