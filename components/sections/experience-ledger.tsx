import { organizationCount, profile, year, type Experience } from '@/lib/content'
import { Timeline, type TimelineItem, type TimelineMetric } from '@/components/timeline'
import { ButtonLink } from '@/components/ui/button'
import { Section } from '@/components/ui/section'

function isMetric(m: unknown): m is TimelineMetric {
  return (
    typeof m === 'object' &&
    m !== null &&
    typeof (m as { label?: unknown }).label === 'string' &&
    typeof (m as { value?: unknown }).value === 'string'
  )
}

/** Metrics from the entry when the content carries them, plus its award as a labelled value. */
function entryMetrics(e: Experience): TimelineMetric[] | undefined {
  const raw = (e as Experience & { metrics?: unknown }).metrics
  const metrics = Array.isArray(raw) ? raw.filter(isMetric) : []
  if (e.award) metrics.push({ label: 'Recognition', value: e.award })
  return metrics.length > 0 ? metrics : undefined
}

/**
 * "Graduate Assistant, FIN 530 Cryptocurrencies and Financial Markets" -> title "Graduate Assistant",
 * detail "FIN 530 Cryptocurrencies and Financial Markets", so the title holds two lines at 320 px.
 */
function splitRole(role: string): { title: string; detail?: string } {
  const at = role.indexOf(', ')
  return at > 0 ? { title: role.slice(0, at), detail: role.slice(at + 2) } : { title: role }
}

function toItem(e: Experience): TimelineItem {
  const { title, detail } = splitRole(e.role)
  return {
    id: e.id,
    start: e.start,
    end: e.end,
    title,
    detail,
    org: e.org,
    logoName: e.org,
    lines: e.highlights.length > 0 ? e.highlights : [e.summary],
    metrics: entryMetrics(e),
    href: e.orgUrl ?? undefined,
    tags: [e.type],
  }
}

export function ExperienceLedger() {
  const roles = profile.experience
  if (roles.length === 0) return null
  const items = roles.map(toItem)
  // Organizations by name before the first comma: the WPI lab and the WPI teaching roles are one.
  const orgs = organizationCount(roles)
  const first = roles.map((e) => e.start).sort()[0]
  const ongoing = roles.find((e) => e.end === null)
  const last = roles.map((e) => e.end ?? e.start).sort().at(-1)
  const intro = `${roles.length} ${roles.length === 1 ? 'role' : 'roles'} at ${orgs} ${orgs === 1 ? 'organization' : 'organizations'}, ${year(first)} to ${ongoing ? 'present' : year(last)}.`

  return (
    // A full-bleed field of the raised tone between the ledger above and the green numbers band below; the
    // timeline's channel takes the sunken tone on it.
    <div className="bg-surface-raised [--rail-track:var(--surface-sunken)]">
      <Section id="experience" title="Experience" intro={intro}>
        <Timeline items={items} initialOpen={ongoing?.id ?? 'first'} />
        <div className="mt-12">
          <ButtonLink href="/resume" variant="secondary">
            Full resume
          </ButtonLink>
        </div>
      </Section>
    </div>
  )
}
