'use client'

import { useState } from 'react'
import { Instrument, Segmented, useInstrument } from '@/components/instruments/instrument'
import type { Project } from '@/lib/content'

/*
 * PRISEM, the budget toggle. The 91-pair demo was measured at two budgets: 150 units, with 80 pairs
 * flagged for human review, and 250 units, with 2. Those are the only two states. The toggle swaps
 * between them at once, with no slider and no animation, so no count between 80 and 2 is ever
 * drawn. How the unflagged pairs split across the automated tiers is not on record, so the grid
 * marks only flagged and not flagged. Source: the portfolio context file, section 5.3.
 */

const PAIRS = 91
const COLS = 13
const CELL = 12
const GAP = 3

const STATES = [
  { id: '150', label: '150 units', budget: 150, review: 80 },
  { id: '250', label: '250 units', budget: 250, review: 2 },
] as const

type State = (typeof STATES)[number]

const statusFor = (s: State) => `Budget ${s.budget} units: ${s.review} of ${PAIRS} pairs flagged for human review.`

/** One square per pair, flagged ones first in reading order: a count, not a map of which pairs. */
function Pairs({ flagged }: { flagged: number }) {
  const rows = Math.ceil(PAIRS / COLS)
  const step = CELL + GAP
  return (
    <svg
      viewBox={`0 0 ${COLS * step - GAP} ${rows * step - GAP}`}
      className="h-auto w-full max-w-[26rem]"
      aria-hidden="true"
      focusable="false"
    >
      {Array.from({ length: PAIRS }, (_, i) => (
        <rect
          key={i}
          x={(i % COLS) * step}
          y={Math.floor(i / COLS) * step}
          width={CELL}
          height={CELL}
          className={i < flagged ? 'fill-accent' : 'fill-ink-3 opacity-25'}
        />
      ))}
    </svg>
  )
}

function Body({ state, onSelect }: { state: State; onSelect: (id: string) => void }) {
  return (
    <div>
      <Segmented
        label="Budget"
        options={STATES.map((s) => ({ id: s.id, label: s.label }))}
        value={state.id}
        onChange={onSelect}
      />
      <div className="mt-5 grid gap-6 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <p className="text-metric text-4xl leading-none text-ink md:text-5xl">
            {state.review} of {PAIRS}
          </p>
          <p className="mt-2 text-ink-2">pairs flagged for human review at a budget of {state.budget} units</p>
          <p className="mt-4 max-w-[40ch] text-ink-2">
            Tiers, cheapest first: rules over 8 lexical features, a BGE sentence-embedding model, 4-bit LLMs on CPU, then
            human review.
          </p>
        </div>
        <figure className="md:col-span-7">
          <Pairs flagged={state.review} />
          <figcaption className="text-status mt-3">
            <span className="mr-4 inline-flex items-center gap-2">
              <span aria-hidden="true" className="inline-block size-3 bg-accent" />
              Flagged for human review
            </span>
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="inline-block size-3 bg-ink-3 opacity-25" />
              Not flagged
            </span>
          </figcaption>
        </figure>
      </div>
      <p className="text-status mt-5 max-w-[60ch]">
        The demo was measured at these two budgets only. Nothing between them was measured, so nothing between them is
        drawn.
      </p>
    </div>
  )
}

function Interactive({ id, setId }: { id: string; setId: (id: string) => void }) {
  const { interact } = useInstrument()
  const state = STATES.find((s) => s.id === id) ?? STATES[0]
  return (
    <Body
      state={state}
      onSelect={(next) => {
        interact()
        setId(next)
      }}
    />
  )
}

export default function PrisemBudget({ project }: { project: Project }) {
  const [id, setId] = useState<string>(STATES[0].id)
  const state = STATES.find((s) => s.id === id) ?? STATES[0]
  return (
    <Instrument title="Review budget, two measured states" status={statusFor(state)} slug={project.slug}>
      <Interactive id={id} setId={setId} />
    </Instrument>
  )
}
