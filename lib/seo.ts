import { formatRange, informativeKind, listJoin, profile, type Project } from '@/lib/content'

/** The meta description window: long enough to say something, short enough that results pages do not cut it. */
export const DESCRIPTION_MIN = 150
export const DESCRIPTION_MAX = 160

/**
 * One optional part of a description after its lead:
 * - a sentence, used whole or not at all;
 * - `options`: alternatives, longest first, of which at most one is used;
 * - a list: `lead` plus as many `items` as fit, worded with `partial` ("Stack includes") when some are left out.
 */
export type Clause =
  | string
  | null
  | undefined
  | false
  | { options: string[] }
  | { lead: string; partial?: string; items: string[] }

type FitOptions = {
  /** Tried before the lead when the lead alone cannot reach the window ("Research: "). */
  prefix?: string | null
}

function variants(clause: Exclude<Clause, null | undefined | false>): string[] {
  if (typeof clause === 'string') return [clause]
  if ('options' in clause) return clause.options
  const { items } = clause
  return items.map((_, k) => {
    const n = items.length - k
    return `${n < items.length && clause.partial ? clause.partial : clause.lead}${listJoin(items.slice(0, n))}.`
  })
}

/** "A. B. C." -> ["A.", "B.", "C."]; a period inside a number or a name ("0.82", "Map.AR") does not split. */
export function sentences(text: string): string[] {
  return text.trim().split(/(?<=[.!?])\s+/)
}

/**
 * A meta description of 150 to 160 characters built only from content-model text. The lead (its
 * sentences in order, as many as fit) always comes first; then the clauses, in order of preference,
 * each used whole or skipped. The first combination that lands in the window wins, so earlier
 * sentences and clauses are kept over later ones. When none lands, the longest one under the cap
 * is returned, and scripts/scan-build.mjs prints a warning naming the page that carries it.
 */
export function fitDescription(lead: string[], clauses: Clause[], options: FitOptions = {}): string {
  const parts = clauses.filter((c): c is Exclude<Clause, null | undefined | false> => Boolean(c))
  let longest = ''
  const search = (i: number, text: string): string | null => {
    if (text.length > DESCRIPTION_MAX) return null
    if (text.length > longest.length) longest = text
    if (text.length >= DESCRIPTION_MIN) return text
    if (i === parts.length) return null
    for (const v of variants(parts[i])) {
      const found = search(i + 1, `${text} ${v}`)
      if (found) return found
    }
    return search(i + 1, text)
  }
  for (const prefix of ['', ...(options.prefix ? [options.prefix] : [])]) {
    for (let k = lead.length; k >= 1; k -= 1) {
      const found = search(0, prefix + lead.slice(0, k).join(' '))
      if (found) return found
    }
  }
  if (longest) return longest
  // A first sentence over the cap: cut at a word and mark the cut.
  return `${lead[0].slice(0, DESCRIPTION_MAX - 1).replace(/\s+\S*$/, '')}…`
}

const { identity } = profile
/** "Ankit Gole, AI/ML Engineer in San Jose, CA" */
export const ownerLine = `${identity.name}, ${identity.title} in ${identity.location.city}, ${identity.location.region}`

/**
 * A project page's description: its summary first, then its kind and dates, stack, outcome and
 * subtitle, then who made it. An earlier build (one-line summary) is filled with what the record
 * says about it: earlier work, its stack, and its place among the projects.
 */
export function projectDescription(p: Project): string {
  const kind = informativeKind(p.kind)
  const period = p.start ? formatRange(p.start, p.end) : ''
  // A summary whose first sentence alone passes the cap gives way to the subtitle.
  const summary = sentences(p.summary)
  const lead = summary[0].length <= DESCRIPTION_MAX ? summary : [`${p.subtitle}.`]
  const stack: Clause = p.tags.length ? { lead: 'Stack: ', partial: 'Stack includes ', items: p.tags } : null
  const by = (words: string): Clause => ({ options: [`${words} ${ownerLine}.`, `${words} ${identity.name}, ${identity.title}.`] })
  const subtitle = lead.join(' ').toLowerCase().includes(p.subtitle.toLowerCase()) ? null : `${p.subtitle}.`
  const clauses: Clause[] = p.earlier
    ? [by('Earlier work by'), stack, `One of ${profile.projects.length} projects by ${identity.name}.`, 'Listed for completeness.']
    : [kind && period ? `${kind}, ${period}.` : null, stack, p.metrics.length ? p.pitch.change : null, subtitle, by('By')]
  return fitDescription(lead, clauses, { prefix: kind ? `${kind}: ` : null })
}
