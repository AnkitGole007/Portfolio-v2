import { profile } from '@/lib/content'
import { cx } from '@/lib/cx'

/**
 * In the hero, under the copy: the proof chips, each naming the owner's relation to it ("AI Trainer,
 * Handshake AI"), then one status line with the availability and the work authorization in its full
 * stated wording when the profile shows it. On phones it sits above the funnel, so a recruiter's first
 * screen says who he is, what level and whether he is looking. Plain text set on one baseline, separated
 * by space rather than rules; every string comes from profile.json.
 */
export function ProofStrip({ className }: { className?: string }) {
  const { proof = [], showWorkAuthorization, availability } = profile.identity
  const status = [
    availability.status === 'open' ? availability.display : '',
    showWorkAuthorization ? availability.workAuthorization : '',
  ]
    .filter(Boolean)
    .map((s) => (/[.!?]$/.test(s) ? s : `${s}.`))
    .join(' ')
  if (proof.length === 0 && !status) return null
  return (
    <section aria-label="Credentials and availability" className={cx('pb-8 md:pt-2 md:pb-10', className)}>
      {proof.length > 0 && (
        <ul className="flex flex-wrap gap-x-8 gap-y-2 text-ink">
          {proof.map((chip) => (
            <li key={chip}>{chip}</li>
          ))}
        </ul>
      )}
      {status && <p className="text-status mt-3 max-w-[56ch]">{status}</p>}
    </section>
  )
}
