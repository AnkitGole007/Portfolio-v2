import { profile } from '@/lib/content'
import { splitEmail } from './email'
import { IslandLoader } from './island-loader'

/**
 * Mount once in the layout (a server component): <ScrollIsland />.
 * Appears after the visitor scrolls past the hero (or 600 px on pages without one),
 * bottom centre on phones inside the safe area, bottom right on desktop. Dismissal is
 * remembered for the session. Hidden while the palette or the pitch lightbox is open.
 * The bar's code loads after the first paint (island-loader.tsx).
 */
export function ScrollIsland() {
  const { links } = profile
  // Resume opens the PDF when one is linked, else the /resume page. Call renders only with a scheduling link.
  return (
    <IslandLoader
      resumeHref={links.resumePdf || '/resume'}
      resumeIsFile={Boolean(links.resumePdf)}
      callHref={links.scheduling || undefined}
      email={splitEmail(links.email)}
    />
  )
}
