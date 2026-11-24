'use client'

import { useId, useState } from 'react'
import { Instrument, Segmented, useInstrument } from '@/components/instruments/instrument'
import type { PipelineStage, Project } from '@/lib/content'
import { cn } from '@/lib/utils'

/*
 * B2 Research Agent, the retrieval stages. Step through one search: the corpus, the Reciprocal
 * Rank Fusion candidates, the SPECTER2 rerank and the cross-encoder reading list. The counts come
 * from `project.pipeline` (the same record the home hero draws); the field is drawn at one dot per
 * 100 papers. The reading list has no count on record, so none is printed or drawn. The reranker
 * swap sits on the cross-encoder stage, where it happened.
 *
 * Every number here is from the portfolio context file, section 5.2 (verified metrics table).
 * Nothing animates between stages: the marks switch at once, so no count other than the measured
 * ones is ever on screen.
 */

const PAPERS_PER_DOT = 100
const COLS = 125
const PITCH = 8
const PAD = 8

const fmt = (n: number) => n.toLocaleString('en-US')
const dotsFor = (count: number) => Math.ceil(count / PAPERS_PER_DOT)
/** "Candidates after ..." reads as "1,200 candidates after ..." once the count leads. */
const afterCount = (label: string) => label.charAt(0).toLowerCase() + label.slice(1)

/** Short control names and what each stage does, in pipeline order (context file 5.2, deployed main). */
const STAGES = [
  {
    short: 'Corpus',
    how: 'The stored library of computer science papers from arXiv and Semantic Scholar, in one LanceDB index on Cloudflare R2.',
  },
  {
    short: 'Fusion',
    how: 'LanceDB runs full-text and vector search together and fuses the two rankings with Reciprocal Rank Fusion.',
  },
  {
    short: 'SPECTER2',
    how: 'SPECTER2 reranks the fused candidates and keeps the top 200.',
  },
  {
    short: 'Cross-encoder',
    how: 'A gte-reranker-modernbert-base cross-encoder orders the reading list, and MiniLM picks an evidence sentence for each paper.',
  },
]

/** The reranker swap on the cross-encoder stage (context file 5.2: "about 3x faster on CPU, MTEB 0.584 vs 0.553, 568M to 150M parameters"). */
const RERANKER = [
  { label: 'Parameters', before: '568M', after: '150M' },
  { label: 'MTEB score', before: '0.553', after: '0.584' },
]

/** Seeded picks in the field, so the marks sit in the same places on every visit. The 200 are a subset of the 1,200. */
function picks(n: number, total: number): number[] {
  const out: number[] = []
  let s = 20260722
  while (out.length < n && out.length < total) {
    s = (s * 1103515245 + 12345) % 2147483648
    const k = s % total
    if (!out.includes(k)) out.push(k)
  }
  return out
}

function Field({ total, marks, shown, ringed, dim, id }: { total: number; marks: number[]; shown: number; ringed: number; dim: boolean; id: string }) {
  const { reduced } = useInstrument()
  const full = Math.floor(total / COLS)
  const rest = total % COLS
  const rows = full + (rest ? 1 : 0)
  const width = COLS * PITCH
  const at = (k: number) => ({ cx: (k % COLS) * PITCH + PITCH / 2, cy: Math.floor(k / COLS) * PITCH + PITCH / 2 })
  const fade = reduced ? '' : 'transition-opacity duration-300'
  return (
    // The view box keeps a margin of PAD so the marks on the edge rows and columns are not clipped.
    <svg
      viewBox={`${-PAD} ${-PAD} ${width + PAD * 2} ${rows * PITCH + PAD * 2}`}
      className="h-auto w-full"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={id} width={PITCH} height={PITCH} patternUnits="userSpaceOnUse">
          <circle cx={PITCH / 2} cy={PITCH / 2} r={1.7} fill="currentColor" />
        </pattern>
      </defs>
      <g className={cn('text-ink-3', fade)} style={{ opacity: dim ? 0.35 : 1 }}>
        {full > 0 && <rect width={width} height={full * PITCH} fill={`url(#${id})`} />}
        {rest > 0 && <rect y={full * PITCH} width={rest * PITCH} height={PITCH} fill={`url(#${id})`} />}
      </g>
      <g className="text-accent">
        {marks.map((k, i) => (
          <circle key={k} {...at(k)} r={5} fill="currentColor" className={fade} style={{ opacity: i < shown ? 1 : 0 }} />
        ))}
        {marks.slice(0, ringed).map((k) => (
          <circle key={`ring-${k}`} {...at(k)} r={9} fill="none" stroke="currentColor" strokeWidth={2.5} />
        ))}
      </g>
    </svg>
  )
}

function Reranker() {
  return (
    <div className="mt-5 w-fit max-w-full bg-surface p-4">
      <table className="text-left">
        <caption className="text-label text-left text-ink-2">The reranker swap on this stage</caption>
        <thead>
          <tr className="text-label text-ink-2">
            <th scope="col" className="pt-2 font-normal">
              <span className="sr-only">Measure</span>
            </th>
            <th scope="col" className="pt-2 pl-5 font-normal">
              Before
            </th>
            <th scope="col" className="pt-2 pl-5 font-normal">
              After
            </th>
          </tr>
        </thead>
        <tbody>
          {RERANKER.map((row) => (
            <tr key={row.label}>
              <th scope="row" className="pt-1 font-normal text-ink-2">
                {row.label}
              </th>
              <td className="text-metric pt-1 pl-5 text-ink-2">{row.before}</td>
              <td className="text-metric pt-1 pl-5 text-ink">{row.after}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-ink">About 3x faster on CPU.</p>
    </div>
  )
}

function Body({ stages, index, onSelect }: { stages: PipelineStage[]; index: number; onSelect: (i: number) => void }) {
  const fieldId = `${useId().replace(/[^a-zA-Z0-9_-]/g, '')}-dot`
  const corpus = stages[0]?.count ?? 0
  const total = dotsFor(corpus)
  const counted = stages.map((s) => (s.count === null ? 0 : dotsFor(s.count)))
  const marks = picks(Math.max(0, ...counted.slice(1)), total)
  const stage = stages[index]
  const info = STAGES[index]
  // The reading list has no count: its stage rings the 200 it is drawn from and prints no number.
  const listStage = stage.count === null
  const lastCounted = counted.slice(0, index + 1).filter((d, i) => i > 0 && d > 0).at(-1) ?? 0
  const shown = index === 0 || listStage ? 0 : counted[index]
  const ringed = listStage ? lastCounted : 0
  const drawnFrom = stages.slice(0, index).findLast((s) => s.count !== null)?.count ?? null

  return (
    <div>
      <Segmented
        label="Retrieval stage"
        options={stages.map((s, i) => ({ id: String(i), label: STAGES[i]?.short ?? s.label }))}
        value={String(index)}
        onChange={(id) => onSelect(Number(id))}
      />
      <div className="mt-5 grid gap-6 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          {/* The control above and the status line below name the stage, so no label sits over the count. */}
          {listStage ? (
            <>
              <p className="text-metric text-4xl leading-none text-ink md:text-5xl">Reading list</p>
              <p className="mt-2 text-ink-2">Its length is not on record, so no count is printed.</p>
            </>
          ) : (
            <>
              <p className="text-metric text-4xl leading-none text-ink md:text-5xl">{fmt(stage.count ?? 0)}</p>
              <p className="mt-2 text-ink-2">{afterCount(stage.label)}</p>
            </>
          )}
          {info ? <p className="mt-3 max-w-[40ch] text-ink-2">{info.how}</p> : null}
          {listStage ? <Reranker /> : null}
        </div>
        <figure className="md:col-span-7">
          <Field total={total} marks={marks} shown={shown} ringed={ringed} dim={index > 0} id={fieldId} />
          <figcaption className="text-status mt-2">
            One dot is {PAPERS_PER_DOT} papers.
            {listStage
              ? drawnFrom !== null
                ? ` The ringed dots are the ${fmt(drawnFrom)} papers the list is drawn from.`
                : ''
              : index > 0
                ? ' Which dots survive is drawn at random; the counts are real.'
                : ''}
          </figcaption>
        </figure>
      </div>
    </div>
  )
}

export default function B2Pipeline({ project }: { project: Project }) {
  const [index, setIndex] = useState(0)
  const stages = project.pipeline ?? []
  if (stages.length === 0 || stages[0].count === null) return null
  const stage = stages[index]
  const status =
    stage.count === null
      ? `Stage ${index + 1} of ${stages.length}: ${afterCount(stage.label)}, no count on record.`
      : `Stage ${index + 1} of ${stages.length}: ${fmt(stage.count)} ${afterCount(stage.label)}.`
  return (
    <Instrument title="Retrieval stages, one search" status={status} slug={project.slug}>
      <Interactive stages={stages} index={index} setIndex={setIndex} />
    </Instrument>
  )
}

/** The body inside the instrument context, so the first stage change fires the analytics event once. */
function Interactive({ stages, index, setIndex }: { stages: PipelineStage[]; index: number; setIndex: (i: number) => void }) {
  const { interact } = useInstrument()
  return (
    <Body
      stages={stages}
      index={index}
      onSelect={(i) => {
        interact()
        setIndex(i)
      }}
    />
  )
}
