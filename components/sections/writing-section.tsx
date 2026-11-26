import { profile, type Writing } from '@/lib/content'
import { Reveal } from '@/components/ui/reveal'
import { Section } from '@/components/ui/section'

/** "blog post" -> "Blog post"; the kind words in profile.json are lowercase. */
const sentenceCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** "Blog post, Medium, 2025": only the parts on record. */
const meta = (w: Writing) => [sentenceCase(w.kind), w.platform, w.date?.slice(0, 4)].filter(Boolean).join(', ')

/**
 * Posts and articles as two-ended rows: the title at the left, the kind and platform at the right.
 * A title links out only when its URL is confirmed in profile.json; until then it is plain text, so
 * no row offers a link that goes nowhere. Left out when nothing is on record.
 */
export function WritingSection() {
  const items = profile.writing
  if (items.length === 0) return null
  return (
    <Section id="writing" title="Writing" className="md:py-16">
      <ul className="max-w-[44rem] space-y-4">
        {items.map((w) => (
          <Reveal as="li" key={w.title} className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1">
            <p className="text-title max-w-[40ch]">
              {w.url ? (
                <a
                  href={w.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink underline decoration-rule-strong decoration-1 underline-offset-[5px] transition-colors hover:text-accent hover:decoration-accent"
                >
                  {w.title}
                </a>
              ) : (
                w.title
              )}
            </p>
            <p className="text-status">{meta(w)}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
