'use client'

import { useState } from 'react'
import { Instrument, Segmented, useInstrument } from '@/components/instruments/instrument'
import type { Project } from '@/lib/content'
import { cn } from '@/lib/utils'

/*
 * Handshake AI, how one blinded session pair is evaluated, step by step: run both agents, verify
 * each build, compare effort, rank the pair, grade each run, flag failures, and the evaluation
 * snapshot (tooling, not a grading step).
 * It names no project, client or model, and it shows no sample rating or score as if it were real:
 * the scale, the rubric and the taxonomy are drawn as structure only (the 19 codes as a count).
 * The numbers are the verified ones: 477 checks with 0 failed on one task, 48 turns and 40 tool
 * calls against 167 and 158 on one task, traces up to 5.2 MB, snapshots from 658 MB to 7.7 MB.
 * Source: the portfolio context file, section 5.1.
 */

type Step = { id: string; label: string; title: string; text: string; status: string }

const STEPS: Step[] = [
  {
    id: 'run',
    label: 'Run',
    title: 'Same prompt, same container',
    text: 'Both coding agents get the same prompt in the same Docker container. Both sessions are run, and the pair stays blinded.',
    status: 'Step 1 of 7, run: both agents, same prompt, same Docker container.',
  },
  {
    id: 'verify',
    label: 'Verify',
    title: 'Every build re-run',
    text: 'A green test suite can hide a broken build, so each build is re-run to check what the agent claimed. One run passed every test while a required field was missing.',
    status: 'Step 2 of 7, verify: 477 checks, 0 failed, on one task.',
  },
  {
    id: 'compare',
    label: 'Compare',
    title: 'Effort from the session traces',
    text: 'Session traces, up to 5.2 MB, show how much work each agent spent to reach its result. These bars are from one task.',
    status: 'Step 3 of 7, compare: 48 turns and 40 tool calls against 167 and 158, on one task.',
  },
  {
    id: 'rank',
    label: 'Rank',
    title: 'A 7-point preference scale',
    text: 'The pair is ranked on a 7-point scale from -3 to +3.',
    status: 'Step 4 of 7, rank: a 7-point preference scale, -3 to +3.',
  },
  {
    id: 'grade',
    label: 'Grade',
    title: 'A 4-part rubric',
    text: 'Each run is graded on its own, on four dimensions.',
    status: 'Step 5 of 7, grade: 4 rubric dimensions.',
  },
  {
    id: 'flag',
    label: 'Flag',
    title: 'A 19-code failure taxonomy',
    text: 'Each failure is logged against a taxonomy of 19 codes.',
    status: 'Step 6 of 7, flag: a 19-code failure taxonomy.',
  },
  {
    id: 'snapshot',
    label: 'Snapshot',
    title: 'A smaller evaluation snapshot',
    text: 'The evaluation snapshot was cut 98.8%, from 658 MB to 7.7 MB.',
    status: 'Step 7 of 7, snapshot: from 658 MB to 7.7 MB.',
  },
]

const RUBRIC = ['Correctness', 'Agent behavior', 'Communication', 'Code style']

/** Horizontal bars on one linear scale, value beside the label. */
function Bars({ rows, max }: { rows: { label: string; value: string; n: number; tone: 'a' | 'b' }[]; max: number }) {
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-ink-2">{r.label}</span>
            <span className={cn('text-metric', r.tone === 'a' ? 'text-accent' : 'text-ink')}>{r.value}</span>
          </div>
          <span aria-hidden="true" className="mt-1.5 block h-2.5">
            <span
              className={cn('block h-full', r.tone === 'a' ? 'bg-accent' : 'bg-ink-2')}
              style={{ width: `${(r.n / max) * 100}%`, minWidth: 2 }}
            />
          </span>
        </li>
      ))}
    </ul>
  )
}

/** Squares in a grid, for counts drawn as structure: 477 passed checks, 19 codes. */
function Squares({ count, cols, cell, label }: { count: number; cols: number; cell: number; label: string }) {
  const gap = Math.max(1, Math.round(cell / 4))
  const step = cell + gap
  const rows = Math.ceil(count / cols)
  return (
    <figure>
      <svg viewBox={`0 0 ${cols * step - gap} ${rows * step - gap}`} className="h-auto w-full max-w-[24rem]" aria-hidden="true" focusable="false">
        {Array.from({ length: count }, (_, i) => (
          <rect key={i} x={(i % cols) * step} y={Math.floor(i / cols) * step} width={cell} height={cell} className="fill-accent" />
        ))}
      </svg>
      <figcaption className="text-status mt-2">{label}</figcaption>
    </figure>
  )
}

function Picture({ step }: { step: Step }) {
  switch (step.id) {
    case 'run':
      return (
        <div aria-hidden="true" className="grid max-w-[24rem] gap-2">
          <div className="bg-surface px-4 py-3 text-center text-ink">One prompt, one Docker container</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-surface-sunken px-4 py-3 text-center text-ink-2">Session A</div>
            <div className="bg-surface-sunken px-4 py-3 text-center text-ink-2">Session B</div>
          </div>
        </div>
      )
    case 'verify':
      return <Squares count={477} cols={53} cell={8} label="477 checks on one task, every one passed: 0 failed." />
    case 'compare':
      return (
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-label text-ink-2">Turns</p>
            <div className="mt-2">
              <Bars
                max={167}
                rows={[
                  { label: 'One agent', value: '48', n: 48, tone: 'a' },
                  { label: 'The other', value: '167', n: 167, tone: 'b' },
                ]}
              />
            </div>
          </div>
          <div>
            <p className="text-label text-ink-2">Tool calls</p>
            <div className="mt-2">
              <Bars
                max={167}
                rows={[
                  { label: 'One agent', value: '40', n: 40, tone: 'a' },
                  { label: 'The other', value: '158', n: 158, tone: 'b' },
                ]}
              />
            </div>
          </div>
        </div>
      )
    case 'rank':
      return (
        <figure>
          <ol aria-hidden="true" className="grid max-w-[28rem] grid-cols-7 gap-1.5">
            {[-3, -2, -1, 0, 1, 2, 3].map((n) => (
              <li key={n} className={cn('text-metric py-3 text-center', n === 0 ? 'bg-surface-sunken text-ink' : 'bg-surface text-ink')}>
                {n > 0 ? `+${n}` : String(n)}
              </li>
            ))}
          </ol>
          <figcaption className="text-status mt-2">The scale only: no rating is shown.</figcaption>
        </figure>
      )
    case 'grade':
      return (
        <ol className="grid max-w-[28rem] gap-1.5 sm:grid-cols-2">
          {RUBRIC.map((r, i) => (
            <li key={r} className="flex items-baseline gap-3 bg-surface px-4 py-3">
              <span className="text-label text-ink-2">{i + 1}</span>
              <span className="text-ink">{r}</span>
            </li>
          ))}
        </ol>
      )
    case 'flag':
      return <Squares count={19} cols={19} cell={14} label="19 codes. The codes are not listed here, only their count." />
    case 'snapshot':
      return (
        <Bars
          max={658}
          rows={[
            { label: 'Before', value: '658 MB', n: 658, tone: 'b' },
            { label: 'After', value: '7.7 MB', n: 7.7, tone: 'a' },
          ]}
        />
      )
    default:
      return null
  }
}

function Body({ step, onSelect }: { step: Step; onSelect: (id: string) => void }) {
  return (
    <div>
      <Segmented label="Step" options={STEPS.map((s) => ({ id: s.id, label: s.label }))} value={step.id} onChange={onSelect} />
      <div className="mt-5 grid gap-6 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <p className="text-title text-ink">{step.title}</p>
          <p className="mt-2 max-w-[40ch] text-ink-2">{step.text}</p>
        </div>
        <div className="md:col-span-7">
          <Picture step={step} />
        </div>
      </div>
    </div>
  )
}

function Interactive({ id, setId }: { id: string; setId: (id: string) => void }) {
  const { interact } = useInstrument()
  const step = STEPS.find((s) => s.id === id) ?? STEPS[0]
  return (
    <Body
      step={step}
      onSelect={(next) => {
        interact()
        setId(next)
      }}
    />
  )
}

export default function EvalWorkflow({ project }: { project: Project }) {
  const [id, setId] = useState(STEPS[0].id)
  const step = STEPS.find((s) => s.id === id) ?? STEPS[0]
  return (
    <Instrument title="How a session pair is evaluated" status={step.status} slug={project.slug}>
      <Interactive id={id} setId={setId} />
    </Instrument>
  )
}
