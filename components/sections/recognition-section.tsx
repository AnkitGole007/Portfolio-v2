import { formatRange, profile } from '@/lib/content'
import { cn } from '@/lib/utils'
import { ButtonLink } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { Section } from '@/components/ui/section'

type Row = { id: string; year: string; title: string; org: string; detail: string }
type Group = { name: string; rows: Row[] }

/** The awards and the degrees as table groups, newest first, every cell from profile.json; empty groups are left out. */
function groups(): Group[] {
  const { recognition, education } = profile
  const awards: Row[] = recognition
    .filter((r) => r.kind !== 'certification')
    .map((r) => ({ id: r.id, year: r.date.slice(0, 4), title: r.title, org: r.org, detail: r.note ?? '' }))
  const degrees: Row[] = education.map((e) => ({
    id: e.id,
    year: e.end.slice(0, 4),
    title: `${e.degree}, ${e.field}`,
    org: e.institution,
    // A GPA only where one is on record.
    detail: [e.gpa ? `GPA ${e.gpa}` : null, formatRange(e.start, e.end)].filter(Boolean).join(', '),
  }))
  return [
    { name: 'Awards', rows: awards },
    { name: 'Education', rows: degrees },
  ].filter((g) => g.rows.length > 0)
}

const CELL = 'px-0 align-baseline md:px-4 md:py-3.5'

/**
 * Recognition and education as one table with no lines: year, title, organization, detail. Every
 * second row carries the raised tone instead of a rule, a group starts with its name, and a year is
 * printed once per run. On phones each row becomes a block. The certifications follow as a list,
 * titles only, because no issuer or date is on record for them.
 */
export function RecognitionSection() {
  const list = groups()
  const { certifications } = profile
  if (list.length === 0 && certifications.length === 0) return null
  let stripe = 0

  return (
    <Section id="recognition" title="Recognition and education">
      {list.length > 0 && (
        <Reveal>
          {/* The table reaches 16 px into the gutter on both sides (the gutter is 16 px or more at every
              width), so the text in its cells keeps the section's left edge while the striped rows have room. */}
          <table className="-mx-4 w-[calc(100%+2rem)] border-collapse text-left max-md:block">
            <caption className="sr-only">Awards and degrees, newest first</caption>
            <thead className="max-md:sr-only">
              <tr className="text-label text-ink-2">
                <th scope="col" className="w-[10%] px-4 pb-2 font-normal">
                  Year
                </th>
                <th scope="col" className="w-[32%] px-4 pb-2 font-normal">
                  Title
                </th>
                <th scope="col" className="w-[26%] px-4 pb-2 font-normal">
                  Organization
                </th>
                <th scope="col" className="px-4 pb-2 font-normal">
                  Detail
                </th>
              </tr>
            </thead>
            {list.map((group) => (
              <tbody key={group.name} className="max-md:block">
                <tr className="max-md:block">
                  <th scope="rowgroup" colSpan={4} className="text-title px-4 pt-8 pb-3 font-medium">
                    {group.name}
                  </th>
                </tr>
                {group.rows.map((row, i) => {
                  const shaded = stripe++ % 2 === 1
                  const firstOfYear = i === 0 || group.rows[i - 1].year !== row.year
                  return (
                    <tr key={row.id} className={cn('max-md:block max-md:px-4 max-md:py-3', shaded && 'bg-surface-raised')}>
                      <td className={cn(CELL, 'text-metric text-ink-2 max-md:block max-md:text-sm')}>
                        {/* The year stands once per run; repeated years stay for screen readers. */}
                        {firstOfYear ? row.year : <span className="sr-only">{row.year}</span>}
                      </td>
                      <td className={cn(CELL, 'text-ink max-md:block')}>{row.title}</td>
                      <td className={cn(CELL, 'text-ink-2 max-md:block')}>{row.org}</td>
                      <td className={cn(CELL, 'text-ink max-md:mt-1 max-md:block')}>{row.detail}</td>
                    </tr>
                  )
                })}
              </tbody>
            ))}
          </table>
        </Reveal>
      )}

      {certifications.length > 0 && (
        <Reveal className="mt-12">
          <h3 className="text-title">Certifications</h3>
          <ul className="mt-4 grid gap-x-6 gap-y-2 text-ink md:grid-cols-2">
            {certifications.map((c) => (
              <li key={c.title}>
                {c.title}
                {c.issuer || c.date ? <span className="text-ink-2">{`, ${[c.issuer, c.date?.slice(0, 4)].filter(Boolean).join(', ')}`}</span> : null}
              </li>
            ))}
          </ul>
        </Reveal>
      )}

      <div className="mt-10 -ml-2">
        <ButtonLink href="/about#recognition" variant="ghost">
          All recognition and certifications
        </ButtonLink>
      </div>
    </Section>
  )
}
