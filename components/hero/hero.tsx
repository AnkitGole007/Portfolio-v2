import { profile } from '@/lib/content'
import { Prose } from '@/components/glossary/prose'
import { ProofStrip } from '@/components/hero/proof-strip'
import { RetrievalFunnel } from '@/components/hero/retrieval-funnel'
import { TrackLink } from '@/components/cta/actions'
import { CopyEmail } from '@/components/cta/copy-email'
import { splitEmail } from '@/components/cta/email'

/** The project whose retrieval stages the hero draws: the first one in profile.json that carries a pipeline. */
const SIGNATURE = profile.projects.find((p) => p.pipeline && p.pipeline.length > 1)

/**
 * The first screen, composed as "object on the seam" (spec section 5, art direction). From md a tone
 * panel holds the name and the corpus; the funnel figure straddles the panel's lower edge, so the stages
 * of one real search narrow below it; the copy sits under the seam beside them, and the credentials and
 * availability run under both. On phones the copy comes first, then the credentials, then the funnel.
 * Every string comes from profile.json: name, headline, the tools line, one measured result, the
 * actions, the credentials and the availability.
 */
export function Hero() {
  const { identity, links } = profile
  const tools = identity.tools ?? []
  return (
    <>
      <section aria-labelledby="hero-title" className="hero-grid container-site pt-3">
        <div aria-hidden="true" className="hero-panel" />

        {/* On phones the name opens the page above the copy; from md its baseline rests on the panel edge. */}
        <h1 id="hero-title" className="hero-name text-display pt-6 md:-mb-[0.14em] md:pt-0">
          {identity.name}
        </h1>

        {/* Phones move the actions up under the headline so the button is on the first screen; from md the order is the source order. */}
        <div className="hero-copy flex flex-col pt-4 pb-6 md:pt-10 md:pb-12">
          <Prose as="p" text={identity.headline} className="text-lead max-w-[34ch] text-ink" />
          {tools.length > 0 && <p className="order-3 mt-6 max-w-[48ch] font-small text-sm text-ink-2 md:order-none md:mt-5">{tools.join(', ')}</p>}
          {identity.result && <p className="order-4 mt-3 max-w-[42ch] text-ink md:order-none">{identity.result}</p>}

          <div className="order-2 mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 md:order-none md:mt-7">
            <CopyEmail parts={splitEmail(links.email)} location="hero" variant="primary" />
            {links.linkedin && (
              <TrackLink href={links.linkedin} id="linkedin" location="hero" variant="text">
                LinkedIn
              </TrackLink>
            )}
            {links.github && (
              <TrackLink href={links.github} id="github" location="hero" variant="text">
                GitHub
              </TrackLink>
            )}
            <TrackLink href="/projects" id="work" location="hero" variant="text">
              View work
            </TrackLink>
          </div>
        </div>

        <ProofStrip className="hero-proof" />

        {/* The figure comes after the copy and the credentials in the source, so reading and focus order are
            name, copy, credentials, funnel at every width; the hero-* utilities place each part on the grid. */}
        {SIGNATURE?.pipeline && (
          <RetrievalFunnel
            stages={SIGNATURE.pipeline}
            source={{ name: SIGNATURE.name, href: `/projects/${SIGNATURE.slug}` }}
            className="hero-figure"
          />
        )}
      </section>
      {/* Sentinel for the scroll island: it appears once this line leaves the top of the viewport. */}
      <div data-hero-end="" aria-hidden="true" />
    </>
  )
}
