import { DownloadSimple } from '@phosphor-icons/react/dist/ssr'
import { listJoin, profile } from '@/lib/content'
import { cn } from '@/lib/utils'
import { Prose } from '@/components/glossary/prose'
import { TrackLink } from '@/components/cta/actions'
import { CopyEmail } from '@/components/cta/copy-email'
import { splitEmail } from '@/components/cta/email'
import { ButtonLink } from '@/components/ui/button'
import { paragraphs } from './text'

const { identity, links } = profile
const { availability } = identity

/** The letter from profile.json `identity.story`; without one, the summary and tagline packed into short paragraphs. */
function letter(): string[] {
  if (identity.story?.length) return identity.story
  return paragraphs([identity.summary, identity.tagline].filter(Boolean).join(' '))
}

/**
 * The About letter: short first-person paragraphs in the full ink, the first one a step larger, then
 * the sign-off with the name and title. `seen` is shared with the facts so a glossary term is
 * explained once across the opening.
 */
export function Story({ seen }: { seen: Set<string> }) {
  return (
    <div>
      {/* One measure for the whole letter, so the larger first paragraph keeps the same right edge as the rest. */}
      <div className="max-w-[34rem] space-y-5">
        {letter().map((text, i) => (
          <Prose key={i} text={text} seen={seen} className={cn('text-ink', i === 0 && 'text-lead')} />
        ))}
      </div>
      <div className="mt-8">
        <p className="text-title">{identity.name}</p>
        <p className="text-status mt-1">{identity.title}</p>
      </div>
    </div>
  )
}

/**
 * Facts under the portrait, label over value with space between them and no rules: pronouns and work
 * authorization only when the profile carries and shows them (the authorization in its full stated
 * wording), then the actions. Copy email is the only way to the address, so no mailto: reaches the HTML.
 */
export function Facts({ seen }: { seen: Set<string> }) {
  const facts: [label: string, value: string][] = []
  if (identity.pronouns) facts.push(['Pronouns', identity.pronouns])
  facts.push(['Based in', identity.location.display])
  if (identity.languages.length > 0) facts.push(['Languages', listJoin(identity.languages)])
  if (identity.showWorkAuthorization && availability.workAuthorization) {
    facts.push(['Work authorization', availability.workAuthorization])
  }

  return (
    <div>
      <dl className="space-y-4">
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt className="text-label text-ink-2">{label}</dt>
            <Prose as="dd" text={value} seen={seen} className="mt-0.5 max-w-[44ch] text-ink" />
          </div>
        ))}
      </dl>
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
        <CopyEmail parts={splitEmail(links.email)} location="about" />
        {links.resumePdf ? (
          <TrackLink href={links.resumePdf} id="resume" location="about" variant="text" download>
            <DownloadSimple size={16} aria-hidden="true" />
            Download resume
          </TrackLink>
        ) : (
          <ButtonLink href="/resume" variant="ghost" className="-ml-2">
            Read the resume
          </ButtonLink>
        )}
      </div>
    </div>
  )
}
