/**
 * Which projects have bespoke instruments (components/instruments/*.tsx, mapped by slug in
 * ./project-instruments for project pages and in ./registry for the home page's lead slot). Server-safe
 * on purpose: both maps are keyed by this list, and the project page reads it on the server to decide
 * where the project's visual goes.
 * Every other project falls back to the figure switcher or the metric explorer.
 */
export const BESPOKE_SLUGS = [
  'b2-research-agent',
  'prisem',
  'fairness-em',
  'paypal-gqp-credit-risk',
  'handshake-eval',
] as const

export type BespokeSlug = (typeof BESPOKE_SLUGS)[number]

/**
 * Bespoke instruments that already show the project's visual, so the page does not repeat it as a
 * figure. Add a slug here when its instrument draws the same picture the visual is cut from.
 */
const SHOWS_VISUAL: ReadonlySet<string> = new Set<BespokeSlug>([])

export function hasBespokeInstrument(slug: string): slug is BespokeSlug {
  return (BESPOKE_SLUGS as readonly string[]).includes(slug)
}

/** True when the page should show the visual as its own figure: a bespoke instrument that does not already draw it. */
export function visualNeedsFigure(slug: string): boolean {
  return hasBespokeInstrument(slug) && !SHOWS_VISUAL.has(slug)
}
