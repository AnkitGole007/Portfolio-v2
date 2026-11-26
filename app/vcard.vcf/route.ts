import { nameParts, profile, PROFILE_LINKS, SITE_URL } from '@/lib/content'

export const dynamic = 'force-static'

const encoder = new TextEncoder()

/** Escapes a vCard 3.0 text value (RFC 2426, section 2.4.2). */
function esc(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')
}

/** Folds a content line at 75 octets with CRLF plus one space (RFC 2426, section 2.6). */
function fold(line: string): string {
  const out: string[] = []
  let current = ''
  let bytes = 0
  for (const ch of line) {
    const size = encoder.encode(ch).length
    // Continuation lines start with a space, which counts toward the 75 octets.
    const limit = out.length === 0 ? 75 : 74
    if (bytes + size > limit) {
      out.push(current)
      current = ''
      bytes = 0
    }
    current += ch
    bytes += size
  }
  out.push(current)
  return out.join('\r\n ')
}

/** "Ankit Gole" -> "ankit-gole", the download's file name. */
const fileSlug = (name: string) =>
  name
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-') || 'contact'

/** vCard social profile types for the keys in PROFILE_LINKS. */
const SOCIAL_TYPE: Record<string, string> = { linkedin: 'linkedin', github: 'github', medium: 'medium' }

// vCard 3.0 contact card built from profile.json: name, title, links and location. No phone number by
// design. This route is the only surface that carries the email address.
export function GET() {
  const { identity, links, meta } = profile
  const { given, family, additional } = nameParts(identity.fullName || identity.name)
  const { city, region, country } = identity.location
  const email = (identity.email || links.email || '').replace(/^mailto:/i, '')
  const socials = PROFILE_LINKS.flatMap(({ key }) =>
    links[key] ? [`X-SOCIALPROFILE;TYPE=${SOCIAL_TYPE[key] ?? key.toLowerCase()}:${links[key]}`] : [],
  )

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${esc(identity.name)}`,
    `N:${esc(family)};${esc(given)};${esc(additional)};;`,
    `TITLE:${esc(identity.title)}`,
    ...(email ? [`EMAIL;TYPE=INTERNET,PREF:${email}`] : []),
    `URL:${SITE_URL}`,
    ...socials,
    `ADR;TYPE=WORK:;;;${esc(city)};${esc(region)};;${esc(country)}`,
    `NOTE:${esc(identity.headline)}`,
    `REV:${meta.lastUpdated}T00:00:00Z`,
    'END:VCARD',
  ]

  return new Response(lines.map(fold).join('\r\n') + '\r\n', {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${fileSlug(identity.name)}.vcf"`,
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
