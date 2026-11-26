'use client'

import { useState } from 'react'
import { Instrument, Segmented, useInstrument } from '@/components/instruments/instrument'
import type { Project } from '@/lib/content'
import { cn } from '@/lib/utils'

/*
 * FairnessEM, the verified points of the alpha sweep. The per-alpha results are not in the public
 * repository (AnkitGole007/Fairness-In-Entity-Matching, branch ag/phase3, holds the code only), so
 * this draws the three points on record and nothing between them: the starting averages, the best
 * alpha per configuration, and alpha 1.0, where F1 collapsed and the near-zero disparity was false
 * fairness. There is no alpha axis and no line: "best alpha" is a different alpha per configuration.
 * At alpha 1.0 only F1 has a figure; disparity there is "near zero" in words and gets no bar.
 * Source: the portfolio context file, section 6.2 (RESULTS_ANALYSIS_v1).
 */

type Point = {
  id: string
  label: string
  /** Average group disparity, or null where only words are on record. */
  disparity: { value: string; n: number } | null
  f1: { value: string; n: number }
  text: string
}

const POINTS: Point[] = [
  {
    id: 'before',
    label: 'Before',
    disparity: { value: '0.0355', n: 0.0355 },
    f1: { value: '0.816', n: 0.816 },
    text: 'The starting averages: group disparity 0.0355 and F1 0.816.',
  },
  {
    id: 'best',
    label: 'Best alpha',
    disparity: { value: '0.0094', n: 0.0094 },
    f1: { value: '0.820', n: 0.82 },
    text: 'At each configuration’s best alpha, average disparity fell 74%, to 0.0094, while average F1 moved to 0.820. The best alpha is picked per configuration, so this is the best case.',
  },
  {
    id: 'one',
    label: 'Alpha 1.0',
    disparity: null,
    f1: { value: '0.0113', n: 0.0113 },
    text: 'False fairness. Disparity neared zero only because F1 collapsed to 0.0113: the model made almost no positive predictions.',
  },
]

/** The disparity bars run to the largest verified point (0.0355), so no unmeasured bound is printed; F1 runs 0 to 1. */
const DISPARITY_SCALE = Math.max(...POINTS.map((p) => p.disparity?.n ?? 0))

const statusFor = (p: Point) =>
  p.id === 'one'
    ? 'Alpha 1.0: F1 0.0113, disparity near zero. False fairness.'
    : `${p.id === 'best' ? 'Best alpha per configuration' : 'Before'}: average disparity ${p.disparity?.value}, average F1 ${p.f1.value}.`

function Cell({ value, share, on }: { value: string; share: number | null; on: boolean }) {
  return (
    <td className="px-2 py-2 align-top first:pl-0">
      <span className={cn('text-metric block', on ? 'text-ink' : 'text-ink-2')}>{value}</span>
      <span aria-hidden="true" className="mt-1.5 block h-2.5 w-full">
        {share !== null ? (
          <span className={cn('block h-full', on ? 'bg-accent' : 'bg-ink-3 opacity-40')} style={{ width: `${share * 100}%`, minWidth: 2 }} />
        ) : null}
      </span>
    </td>
  )
}

function Body({ point, onSelect }: { point: Point; onSelect: (id: string) => void }) {
  return (
    <div>
      <Segmented label="Point" options={POINTS.map((p) => ({ id: p.id, label: p.label }))} value={point.id} onChange={onSelect} />
      <div className="mt-5 max-w-[48rem] overflow-x-auto">
        <table className="w-full min-w-[17rem] table-fixed text-left">
          <caption className="sr-only">Average group disparity and F1 at the three points on record</caption>
          <colgroup>
            <col className="w-[28%]" />
            <col />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr className="text-label text-ink-2">
              <th scope="col" className="pb-1 font-normal">
                <span className="sr-only">Measure</span>
              </th>
              {POINTS.map((p) => (
                <th key={p.id} scope="col" className={cn('px-2 pb-1 font-normal', p.id === point.id && 'text-ink')}>
                  {p.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className="py-2 pr-2 align-top font-normal text-ink-2">
                Disparity
                <span className="text-label block text-ink-2">lower is fairer</span>
              </th>
              {POINTS.map((p) => (
                <Cell
                  key={p.id}
                  value={p.disparity?.value ?? 'near zero'}
                  share={p.disparity ? p.disparity.n / DISPARITY_SCALE : null}
                  on={p.id === point.id}
                />
              ))}
            </tr>
            <tr>
              <th scope="row" className="py-2 pr-2 align-top font-normal text-ink-2">
                F1
                <span className="text-label block text-ink-2">scale 0 to 1</span>
              </th>
              {POINTS.map((p) => (
                <Cell key={p.id} value={p.f1.value} share={p.f1.n} on={p.id === point.id} />
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className={cn('mt-4 max-w-[56ch]', point.id === 'one' ? 'text-ink' : 'text-ink-2')}>{point.text}</p>
      <p className="text-status mt-4 max-w-[64ch]">
        110 runs: 10 configurations x 11 alpha values. The per-alpha results are not in the public repository, so only these
        three points are drawn, with nothing between them.
      </p>
    </div>
  )
}

function Interactive({ id, setId }: { id: string; setId: (id: string) => void }) {
  const { interact } = useInstrument()
  const point = POINTS.find((p) => p.id === id) ?? POINTS[0]
  return (
    <Body
      point={point}
      onSelect={(next) => {
        interact()
        setId(next)
      }}
    />
  )
}

export default function FairnessSweep({ project }: { project: Project }) {
  const [id, setId] = useState(POINTS[0].id)
  const point = POINTS.find((p) => p.id === id) ?? POINTS[0]
  return (
    <Instrument title="Disparity and F1, the points on record" status={statusFor(point)} slug={project.slug}>
      <Interactive id={id} setId={setId} />
    </Instrument>
  )
}
