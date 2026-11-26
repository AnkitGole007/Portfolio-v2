import { profile, type Writing } from '@/lib/content'

export type Row = { key: string; title: string; value?: string; note?: string }

/**
 * Two-ended rows in one column: the title at the left in the full ink, a short value at the right in
 * the small print, an optional note under the title. No box and nothing drawn between rows; on phones
 * the value wraps under the title.
 */
export function Rows({ rows }: { rows: Row[] }) {
  return (
    <ul className="space-y-1">
      {rows.map((r) => (
        <li key={r.key} className="flex flex-wrap items-baseline justify-between gap-x-6 py-2">
          <span className="min-w-0 text-ink">{r.title}</span>
          {r.value ? <span className="text-status">{r.value}</span> : null}
          {r.note ? <span className="basis-full text-sm text-ink-2">{r.note}</span> : null}
        </li>
      ))}
    </ul>
  )
}

/**
 * Leadership from profile.json: dated entries in `leadership`, then the roles a degree lists under
 * `activities` with that school's name. No dates are on record for the activities, so none are printed.
 */
export function leadershipRows(): Row[] {
  const dated: Row[] = profile.leadership.map((l, i) => ({
    key: `leadership-${i}`,
    title: l.title,
    value: [l.org, l.date].filter(Boolean).join(', '),
    note: l.note || undefined,
  }))
  const fromEducation: Row[] = profile.education.flatMap((e) =>
    (e.activities ?? []).map((a) => ({ key: `${e.id}-${a}`, title: a, value: e.institution })),
  )
  return [...dated, ...fromEducation]
}

/** "blog post" -> "Blog post"; the kind words in profile.json are lowercase. */
const sentenceCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** "Blog post, Medium, 2025": only the parts on record. */
const writingMeta = (w: Writing) => [sentenceCase(w.kind), w.platform, w.date?.slice(0, 4)].filter(Boolean).join(', ')

/** Posts and articles; a title links out only when its URL is confirmed in profile.json. */
export function WritingList() {
  return (
    <ul className="space-y-1">
      {profile.writing.map((w) => (
        <li key={w.title} className="flex flex-wrap items-baseline justify-between gap-x-6 py-2">
          <span className="min-w-0 text-ink">
            {w.url ? (
              <a
                href={w.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-rule-strong decoration-1 underline-offset-[5px] transition-colors hover:text-accent hover:decoration-accent"
              >
                {w.title}
              </a>
            ) : (
              w.title
            )}
          </span>
          <span className="text-status">{writingMeta(w)}</span>
        </li>
      ))}
    </ul>
  )
}
