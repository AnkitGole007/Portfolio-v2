import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import { getLogo } from '@/lib/logos'
import { Logo } from '@/components/ui/logo'
import type { WalletCredential } from './credential-card'

/**
 * The issuer's mark: its logo when one is sourced in content/logos.json, else its initial on a square
 * of the sunken tone. Decorative, since the issuer's name follows in text.
 */
function IssuerMark({ issuer }: { issuer: string }) {
  if (getLogo(issuer)) {
    return (
      <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center overflow-hidden">
        <Logo name={issuer} height={18} fullWidth />
      </span>
    )
  }
  return (
    <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center bg-surface-sunken font-display text-sm font-medium text-ink-2">
      {issuer.trim().charAt(0).toUpperCase()}
    </span>
  )
}

/**
 * Certifications as two-ended rows when no scan or badge is on record: the issuer's mark and the title
 * at the left, the issuer and month at the right, the credential id or a verify link under the title.
 * Every part except the title shows only when profile.json carries it, so a title-only record reads
 * as a plain list with no empty marks.
 */
export function CredentialList({ credentials }: { credentials: WalletCredential[] }) {
  return (
    <ul className="space-y-1">
      {credentials.map((c) => {
        const value = [c.issuer, c.month].filter(Boolean).join(', ')
        return (
          <li key={c.id} className="flex items-start gap-3 py-2">
            {c.issuer ? <IssuerMark issuer={c.issuer} /> : null}
            <div className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-6">
              <span className="min-w-0 text-ink">{c.title}</span>
              {value ? <span className="text-status">{value}</span> : null}
              {c.url ? (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 basis-full items-center gap-1 text-sm text-accent underline-offset-4 hover:underline"
                >
                  Verify<span className="sr-only"> {c.title}</span>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              ) : c.credentialId ? (
                <span className="text-status basis-full">Credential {c.credentialId}</span>
              ) : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
