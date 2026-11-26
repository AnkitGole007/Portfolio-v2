import { Fragment, type ReactNode } from 'react'

// A number and its unit ("14.3 s", "8 GiB", "24+ min") and an ISO date ("2026-07-22"). The text itself is
// unchanged (no non-breaking characters), so the build scans and the markdown mirrors read the same words.
const TOGETHER = /(\d[\d,.]*\+?\s(?:ms|s|min|h|KB|MB|GB|MiB|GiB)(?!\w)|\d{4}-\d{2}-\d{2})/

/** A heading never breaks inside a hyphenated word ("open-source", "four-agent"): each sits in a nowrap span. */
export function keepCompounds(text: string): ReactNode {
  const parts = text.split(/(\S+-\S+)/)
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

/** Wraps each number with its unit, and each date, in a nowrap span so a line never breaks inside one. */
export function keepTogether(text: string): ReactNode {
  const parts = text.split(TOGETHER)
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}
