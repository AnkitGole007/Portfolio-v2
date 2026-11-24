import { profile, profileLinks, SITE_URL, VCARD_PATH } from '@/lib/content'

export const dynamic = 'force-static'

// humans.txt (humanstxt.org): who built the site and with what. No email address here: the
// contact paths are the profile links and the vCard, which is the one attachment that carries
// the address. Every owner detail comes from profile.json.
export function GET() {
  const { identity, links, meta } = profile
  const contact = [
    links.linkedin ? `LinkedIn ${links.linkedin}` : null,
    links.scheduling ? `scheduling ${links.scheduling}` : null,
    `vCard ${SITE_URL}${VCARD_PATH}`,
  ].filter(Boolean)
  const profiles = profileLinks()
    .filter((l) => l.key !== 'linkedin')
    .map((l) => `${l.label}: ${l.url}`)
  const text = `/* TEAM */
Owner: ${identity.name}
Role: ${identity.title}
Location: ${identity.location.display}
Site: ${SITE_URL}
Contact: ${contact.join(', ')}
${profiles.join('\n')}

/* THANKS */
Motion-Primitives for the interaction mechanics behind several components.
Phosphor for the icons.
Vercel for hosting, analytics and speed insights.

/* SITE */
Last update: ${meta.lastUpdated}
Language: English
Doctype: HTML5
Standards: HTML5, CSS, JSON-LD (schema.org), Web App Manifest, llms.txt, text/markdown content negotiation, vCard 3.0, XML sitemap with image and video entries
Components: Next.js 16 (App Router, Turbopack, every route static), React 19, TypeScript 5, Tailwind CSS 4, Motion 12, Phosphor icons
Fonts: self-hosted through next/font
Analytics: Vercel Analytics and Speed Insights; Plausible or Umami only when configured at build time
Source of truth: content/profile.json (version ${meta.version}), plus content/glossary.json, content/logos.json, content/people.json and the content/github.json snapshot
`
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
