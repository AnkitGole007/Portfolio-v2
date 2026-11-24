import { profile, VCARD_PATH } from '@/lib/content'
import { PortraitCard } from '@/components/about/portrait-card'
import { TrackLink } from '@/components/cta/actions'
import { CopyEmail } from '@/components/cta/copy-email'
import { splitEmail } from '@/components/cta/email'
import { Reveal } from '@/components/ui/reveal'

/**
 * Closing band on the raised tone: one row of three parts hanging from the same top line. The
 * availability sentence with the roles, the location and the work authorization in its full stated
 * wording; the portrait when profile.json has one; the actions. The email is copied, never linked, so
 * no mailto: and no address reach the HTML. Optional links (a scheduling page, a resume PDF) show only
 * when profile.json carries them. Full-bleed, so it does not use the Section wrapper.
 */
export function ContactSection() {
  const { identity, links } = profile
  const { availability, location } = identity
  // The stated wording in full (both sentences), only when the profile shows it, as in the proof strip.
  const authorization = identity.showWorkAuthorization ? availability.workAuthorization : ''
  const portrait = Boolean(identity.portrait)

  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-surface-raised">
      <h2 id="contact-title" className="sr-only">
        Contact
      </h2>
      <Reveal className="container-site grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-8 py-20 md:grid-cols-12 md:gap-x-6 md:py-28">
        <div className="col-span-2 md:col-span-6">
          <p className="text-lead max-w-[32ch] text-ink">{availability.display}.</p>
          {availability.roles.length > 0 && (
            <p className="mt-5 max-w-[60ch] text-ink-2">
              <span className="text-ink">Roles: </span>
              {availability.roles.join(', ')}.
            </p>
          )}
          <p className="text-status mt-5 max-w-[60ch]">
            {location.display}.{authorization ? ` ${authorization}` : ''}
          </p>
        </div>

        {portrait && <PortraitCard className="w-24 self-start md:col-span-2 md:col-start-8 md:w-full" sizes="(min-width: 768px) 200px, 96px" />}

        <div className={portrait ? 'flex flex-col items-start gap-1 md:col-span-3 md:col-start-10' : 'col-span-2 flex flex-col items-start gap-1 md:col-span-4 md:col-start-9'}>
          <CopyEmail parts={splitEmail(links.email)} location="contact" variant="primary" />
          {links.linkedin && (
            <TrackLink href={links.linkedin} id="linkedin" location="contact" variant="text" className="mt-2">
              LinkedIn
            </TrackLink>
          )}
          {links.scheduling && (
            <TrackLink href={links.scheduling} id="call" location="contact" variant="text">
              Book a call
            </TrackLink>
          )}
          {links.resumePdf && (
            <TrackLink href={links.resumePdf} id="resume" location="contact" variant="text" download>
              Download resume
            </TrackLink>
          )}
          <TrackLink href={VCARD_PATH} id="vcard" location="contact" variant="text" download>
            Download vCard
          </TrackLink>
        </div>
      </Reveal>
    </section>
  )
}
