'use client'

import { useState } from 'react'
import { Instrument, Segmented, useInstrument } from '@/components/instruments/instrument'
import type { Project } from '@/lib/content'
import { cn } from '@/lib/utils'

/*
 * PayPal-sponsored GQP, the matched baselines and the checks behind them. Three views:
 * - Matched: Phi-4-mini (LoRA) beside XGBoost. The two accuracy figures come from different test
 *   sets, so the table says "matched" and nothing stronger. XGBoost's KS is not on record.
 * - Stability checks: the feature-order shuffle (Phi-4-mini, KS 0.743 to 0.733) and the threshold
 *   sweep (Phi-3.5-mini, cutoffs 0.2 to 0.8, F1, MCC and KS held steady; no per-cutoff values, so
 *   only the range is drawn).
 * - Re-check: one binary feature on its own reproduces XGBoost's score, a likely leak, and it
 *   pointed at the 27% of good cases no model separates (approved for public use).
 * Source: the portfolio context file, section 6.1, with the 2026-11-12 correction.
 */

type Row = { model: string; accuracy: string; mcc: string; ks?: string; lead?: boolean }

const MATCHED: Row[] = [
  { model: 'Phi-4-mini, LoRA', accuracy: '0.947', mcc: '0.835', ks: '0.743' },
  { model: 'XGBoost', accuracy: '0.944', mcc: '0.826' },
]

const RECHECK: Row[] = [
  ...MATCHED,
  { model: 'attribute213 alone', accuracy: '0.9441', mcc: '0.8261', lead: true },
]

const VIEWS = [
  {
    id: 'matched',
    label: 'Matched',
    status: 'Matched: Phi-4-mini accuracy 0.947 and MCC 0.835, XGBoost 0.944 and 0.826, on different test sets.',
  },
  {
    id: 'checks',
    label: 'Stability checks',
    status: 'Stability checks: shuffling the input fields moved KS from 0.743 to 0.733; cutoffs from 0.2 to 0.8 held steady.',
  },
  {
    id: 'recheck',
    label: 'Re-check',
    status: 'Re-check: one binary feature alone scores accuracy 0.9441 and MCC 0.8261, a likely leak.',
  },
] as const

function ScoreTable({ rows, ks, caption }: { rows: Row[]; ks: boolean; caption: string }) {
  return (
    <div className="max-w-[44rem] overflow-x-auto">
      <table className="w-full min-w-[17rem] text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="text-label text-ink-2">
            <th scope="col" className="pr-2 sm:pr-4 pb-2 pl-3 font-normal">
              Model
            </th>
            <th scope="col" className="px-2 pb-2 text-right font-normal sm:px-4">
              Accuracy
            </th>
            <th scope="col" className="px-2 pb-2 text-right font-normal sm:px-4">
              MCC
            </th>
            {ks ? (
              <th scope="col" className="pr-3 pb-2 pl-2 sm:pl-4 text-right font-normal">
                KS
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.model} className={cn(r.lead ? 'bg-accent-soft' : 'odd:bg-surface')}>
              <th scope="row" className={cn('py-2.5 pr-2 sm:pr-4 pl-3 font-normal', r.lead ? 'text-ink' : 'text-ink-2')}>
                {r.model}
              </th>
              <td className="text-metric px-2 sm:px-4 py-2.5 text-right text-ink">{r.accuracy}</td>
              <td className="text-metric px-2 sm:px-4 py-2.5 text-right text-ink">{r.mcc}</td>
              {ks ? (
                <td className={cn('py-2.5 pr-3 pl-2 sm:pl-4 text-right', r.ks ? 'text-metric text-ink' : 'text-label text-ink-2')}>
                  {r.ks ?? 'not on record'}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** A 0 to 1 track with marks or a band, for the two stability checks. */
function Track({ children, ticks }: { children: React.ReactNode; ticks: number[] }) {
  return (
    <div aria-hidden="true">
      <div className="relative h-3 bg-surface">{children}</div>
      <div className="relative mt-1 h-5">
        {ticks.map((t) => (
          <span
            key={t}
            className="text-label absolute top-0 text-ink-2"
            style={{ left: `${t * 100}%`, transform: t === 0 ? 'none' : t === 1 ? 'translateX(-100%)' : 'translateX(-50%)' }}
          >
            {t === 0 ? '0' : t === 1 ? '1' : String(t)}
          </span>
        ))}
      </div>
    </div>
  )
}

function Checks() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <p className="text-ink">Input fields shuffled</p>
        <p className="text-label text-ink-2">Phi-4-mini, KS on a 0 to 1 scale</p>
        <ul className="mt-3 space-y-3">
          {[
            { label: 'Fields in order', value: '0.743', n: 0.743 },
            { label: 'Fields shuffled', value: '0.733', n: 0.733 },
          ].map((m) => (
            <li key={m.label}>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-ink-2">{m.label}</span>
                <span className="text-metric text-ink">{m.value}</span>
              </div>
              <span aria-hidden="true" className="mt-1.5 block h-2.5 bg-surface">
                <span className="block h-full bg-accent" style={{ width: `${m.n * 100}%` }} />
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-ink">Decision cutoff swept from 0.2 to 0.8</p>
        <p className="text-label text-ink-2">Phi-3.5-mini, cutoff on a 0 to 1 scale</p>
        <div className="mt-3">
          <Track ticks={[0, 0.2, 0.8, 1]}>
            <span className="absolute inset-y-0 bg-accent" style={{ left: '20%', width: '60%' }} />
          </Track>
        </div>
        <p className="mt-2 text-ink-2">F1, MCC and KS held steady across the range. Only the range is on record, so no curve is drawn.</p>
      </div>
    </div>
  )
}

function Body({ view, onSelect }: { view: (typeof VIEWS)[number]; onSelect: (id: string) => void }) {
  return (
    <div>
      <Segmented label="View" options={VIEWS.map((v) => ({ id: v.id, label: v.label }))} value={view.id} onChange={onSelect} />
      <div className="mt-5">
        {view.id === 'matched' ? (
          <>
            <ScoreTable rows={MATCHED} ks caption="Phi-4-mini and XGBoost scores" />
            <p className="mt-4 max-w-[60ch] text-ink-2">
              Matched, and no more: the two scores come from different test sets, an Azure 5% sample split for Phi-4-mini and
              seeded 80/20 splits of the full data for XGBoost. Phi-4-mini trained on about 5% of the 692,922 records.
            </p>
          </>
        ) : null}
        {view.id === 'checks' ? <Checks /> : null}
        {view.id === 'recheck' ? (
          <>
            <ScoreTable rows={RECHECK} ks={false} caption="Phi-4-mini, XGBoost and one feature on its own" />
            <p className="mt-4 max-w-[60ch] text-ink">
              Re-checking the results: one binary feature, attribute213, scores accuracy 0.9441 and MCC 0.8261 on its own,
              XGBoost&apos;s score. Most of every model&apos;s score comes from that feature, a likely leak.
            </p>
            <p className="mt-2 max-w-[60ch] text-ink-2">It also pointed at the 27% of good cases no model separates.</p>
          </>
        ) : null}
      </div>
    </div>
  )
}

function Interactive({ id, setId }: { id: string; setId: (id: string) => void }) {
  const { interact } = useInstrument()
  const view = VIEWS.find((v) => v.id === id) ?? VIEWS[0]
  return (
    <Body
      view={view}
      onSelect={(next) => {
        interact()
        setId(next)
      }}
    />
  )
}

export default function PaypalMatched({ project }: { project: Project }) {
  const [id, setId] = useState<string>(VIEWS[0].id)
  const view = VIEWS.find((v) => v.id === id) ?? VIEWS[0]
  return (
    <Instrument title="Matched baselines and the checks behind them" status={view.status} slug={project.slug}>
      <Interactive id={id} setId={setId} />
    </Instrument>
  )
}
