import Link from 'next/link'
import type { PipelineStage } from '@/lib/content'
import { cx } from '@/lib/cx'
import { FunnelMotion } from './funnel-motion'

/** The scale of every mark in the figure: one dot stands for this many papers. */
export const PAPERS_PER_DOT = 100
/** Dots per row in the corpus field, and the field's grid pitch in viewBox units. */
const FIELD_COLS = 125
const PITCH = 8
/** Stage marks: up to 12 dots a row, 8 px apart, 8 px of channel on each side. */
const STAGE_COLS = 12
const STAGE_PITCH = 8
const CHANNEL_PAD = 8
/** Height of the slope where the channel narrows from one stage to the next. */
const SLOPE = 20

const fmt = (n: number) => n.toLocaleString('en-US')
const dotsFor = (count: number) => Math.ceil(count / PAPERS_PER_DOT)
/** "Candidates after ..." reads as "1,200 candidates after ..." once the count leads. */
const afterCount = (label: string) => label.charAt(0).toLowerCase() + label.slice(1)
/** Channel width in px for a stage of `dots` marks. */
const channelWidth = (dots: number) => Math.min(dots, STAGE_COLS) * STAGE_PITCH + CHANNEL_PAD * 2

/**
 * The corpus as one field of dots, 100 papers each, drawn by a pattern fill: full rows, then the
 * partial last row, so the field holds exactly the rounded-up dot count and the DOM holds two rects.
 */
function Field({ dots, id }: { dots: number; id: string }) {
  const full = Math.floor(dots / FIELD_COLS)
  const rest = dots % FIELD_COLS
  const rows = full + (rest ? 1 : 0)
  const width = FIELD_COLS * PITCH
  return (
    <svg
      data-funnel-field=""
      data-cols={FIELD_COLS}
      data-dots={dots}
      viewBox={`0 0 ${width} ${rows * PITCH}`}
      className="h-auto w-full text-ink-3"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={id} width={PITCH} height={PITCH} patternUnits="userSpaceOnUse">
          <circle cx={PITCH / 2} cy={PITCH / 2} r={1.7} fill="currentColor" />
        </pattern>
      </defs>
      {full > 0 && <rect width={width} height={full * PITCH} fill={`url(#${id})`} />}
      {rest > 0 && <rect y={full * PITCH} width={rest * PITCH} height={PITCH} fill={`url(#${id})`} />}
    </svg>
  )
}

/** One stage's dots in the accent, the marks the animated run lands on. */
function StageDots({ dots, stage }: { dots: number; stage: number }) {
  const cols = Math.min(dots, STAGE_COLS)
  const rows = Math.ceil(dots / STAGE_COLS)
  return (
    <svg
      data-stage={stage}
      width={cols * STAGE_PITCH}
      height={rows * STAGE_PITCH}
      viewBox={`0 0 ${cols * STAGE_PITCH} ${rows * STAGE_PITCH}`}
      className="funnel-mark text-accent"
      aria-hidden="true"
      focusable="false"
    >
      {Array.from({ length: dots }, (_, i) => (
        <circle
          key={i}
          cx={(i % STAGE_COLS) * STAGE_PITCH + STAGE_PITCH / 2}
          cy={Math.floor(i / STAGE_COLS) * STAGE_PITCH + STAGE_PITCH / 2}
          r={2.6}
          fill="currentColor"
        />
      ))}
    </svg>
  )
}

/** The settled reading list, drawn as a short ragged paragraph: lines of text, not a count of papers. */
function ListMarks() {
  return (
    <span aria-hidden="true" className="flex flex-col gap-[5px] pt-0.5">
      {[88, 88, 54].map((w, i) => (
        <span key={i} className="funnel-row block h-[3px] bg-ink-2" style={{ width: w, transitionDelay: `${i * 90}ms` }} />
      ))}
    </span>
  )
}

type Props = {
  stages: PipelineStage[]
  /** The project the stages come from: its name heads the figure and links to its page. */
  source?: { name: string; href: string }
  /** Unique per page; names the dot pattern. */
  id?: string
  className?: string
}

/**
 * The hero signature: one search of the Research Agent corpus, drawn to scale. The first stage is a
 * field of dots (one per 100 papers) that sits in the hero's tone panel; under the panel's edge a
 * channel narrows through the later stages, each printed with its real count, to the reading list,
 * which carries no count because none is verified. Everything here is static, server-rendered markup
 * (the LCP-safe version); FunnelMotion adds a canvas that runs the search once the page is idle, and
 * leaves this markup as the whole picture under reduced motion, Save-Data or no canvas support.
 *
 * Expects to sit in a two-row grid (it is a row subgrid): the field fills row one, the stages row two.
 */
export function RetrievalFunnel({ stages, source, id = 'funnel', className }: Props) {
  const [corpus, ...rest] = stages
  if (!corpus || corpus.count === null) return null
  const fieldDots = dotsFor(corpus.count)
  const captionId = `${id}-caption`
  let previous = 0
  const later = rest.map((stage) => {
    const dots = stage.count === null ? 0 : dotsFor(stage.count)
    const width = dots ? channelWidth(dots) : 0
    const from = previous
    previous = width || previous
    return { ...stage, dots, width, from }
  })
  const first = later.find((s) => s.width)
  // The column for the stage marks is as wide as the widest channel below the field.
  const column = Math.max(...later.map((s) => s.width), 96)

  return (
    <figure data-funnel="" aria-labelledby={captionId} className={cx('relative', className)}>
      {/* Row one, inside the tone panel: the whole corpus. */}
      <div className="self-end pt-4 pb-5 md:pt-10 md:pb-8">
        {source && (
          <p className="text-status">
            {/* 12 px of padding above and below, offset by negative margins: a 44 px target with the line where it was. */}
            <Link
              href={source.href}
              className="-my-3 inline-block py-3 underline decoration-rule-strong underline-offset-4 hover:text-accent hover:decoration-accent"
            >
              {source.name}
            </Link>
          </p>
        )}
        <p className="mt-1 text-ink-2">
          <span className="text-metric text-title text-ink">{fmt(corpus.count)}</span> {afterCount(corpus.label)}
        </p>
        <div className="mt-3">
          <Field dots={fieldDots} id={`${id}-dot`} />
        </div>
      </div>

      {/* Row two, under the panel edge: the channel narrows stage by stage. */}
      <div data-funnel-below="" style={{ '--col': `${column}px` } as React.CSSProperties}>
        {first && (
          <div
            aria-hidden="true"
            className="h-8 bg-surface-raised md:h-20"
            style={{ clipPath: `polygon(0 0, 100% 0, ${first.width}px 100%, 0 100%)` }}
          />
        )}
        <ol className="grid grid-cols-[var(--col)_minmax(0,1fr)] gap-x-4">
          {later.map((stage, i) => (
            <li key={stage.label} className="col-span-2 grid grid-cols-subgrid">
              <div
                className={cx('relative flex items-start', stage.width ? 'bg-surface-raised' : '')}
                style={
                  stage.width
                    ? {
                        clipPath:
                          stage.from && stage.from !== stage.width
                            ? `polygon(0 0, ${stage.from}px 0, ${stage.width}px ${SLOPE}px, ${stage.width}px 100%, 0 100%)`
                            : `polygon(0 0, ${stage.width}px 0, ${stage.width}px 100%, 0 100%)`,
                      }
                    : undefined
                }
              >
                {/* 20 px down: below the slope, and level with the middle of the count line beside it. */}
                <span className="block pt-5" style={{ paddingLeft: CHANNEL_PAD }}>
                  {stage.dots ? <StageDots dots={stage.dots} stage={i + 1} /> : <ListMarks />}
                </span>
              </div>
              <p className={cx('py-2', i > 0 && 'md:py-2.5')}>
                {stage.count === null ? (
                  <span className="text-sm text-ink md:text-base">{stage.label}</span>
                ) : (
                  <>
                    <span className="text-metric text-title text-ink">{fmt(stage.count)}</span>{' '}
                    <span className="text-sm text-ink-2 md:text-base">{afterCount(stage.label)}</span>
                  </>
                )}
              </p>
            </li>
          ))}
        </ol>
        {/* min-h-11 keeps room for the replay button FunnelMotion puts in the slot, so its arrival shifts nothing. */}
        <p className="text-status mt-1 flex min-h-11 flex-wrap items-center gap-x-4 md:mt-3">
          {/* The figure's name is this sentence only, never the replay button beside it. */}
          <span id={captionId}>One dot is {PAPERS_PER_DOT} papers.</span>
          <span data-funnel-replay="" className="contents" />
        </p>
      </div>
      <FunnelMotion />
    </figure>
  )
}
