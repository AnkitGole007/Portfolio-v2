import { CalendarBlank, IdentificationCard } from '@phosphor-icons/react/dist/ssr'
import { profile, VCARD_PATH } from '@/lib/content'
import { TrackLink } from '@/components/cta/actions'
import { CopyEmail } from '@/components/cta/copy-email'
import { splitEmail } from '@/components/cta/email'
import { PlayPitch } from '@/components/reel/play-pitch'
import { PITCH_SECONDS, hasPitch } from '@/components/reel/pitch-slugs'

const { identity, links } = profile
const { availability } = identity

const LOCATION = 'about-availability'
/** The first project in profile.json order that has a pitch video, if any. */
const PITCH_SLUG = profile.projects.find((p) => hasPitch(p.slug))?.slug

/**
 * The closing panel on the raised tone: the open-to sentence, then the start date (only when one is
 * confirmed), roles and locations as plain lists in the full ink, label at the left from md, and the
 * closing actions. The email is copied, never linked.
 */
export function Availability() {
  const rows: [label: string, value: string][] = []
  if (availability.startDate) rows.push(['Start', availability.startDate])
  if (availability.roles.length > 0) rows.push(['Roles', `${availability.roles.join(', ')}.`])
  if (availability.locations.length > 0) rows.push(['Locations', `${availability.locations.join(', ')}.`])

  return (
    <div className="panel p-5 md:p-8">
      <p className="text-lead max-w-[44ch] text-ink">{availability.display}.</p>
      {rows.length > 0 ? (
        <dl className="mt-6 space-y-4">
          {rows.map(([label, value]) => (
            <div key={label} className="grid gap-x-6 gap-y-0.5 md:grid-cols-[9rem_minmax(0,1fr)] md:items-baseline">
              <dt className="text-label text-ink-2">{label}</dt>
              <dd className="max-w-[64ch] text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
        {links.scheduling && (
          <TrackLink href={links.scheduling} id="call" location={LOCATION}>
            <CalendarBlank size={16} aria-hidden="true" />
            Book a call
          </TrackLink>
        )}
        <CopyEmail parts={splitEmail(links.email)} location={LOCATION} variant="primary" />
        <TrackLink href={VCARD_PATH} id="vcard" location={LOCATION} variant="text" download>
          <IdentificationCard size={16} aria-hidden="true" />
          Download vCard
        </TrackLink>
        {PITCH_SLUG && <PlayPitch slug={PITCH_SLUG} label={`Watch a ${PITCH_SECONDS} s pitch`} location={LOCATION} />}
      </div>
    </div>
  )
}
