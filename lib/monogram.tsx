import { ImageResponse } from 'next/og'
import { nameParts, profile } from '@/lib/content'

// The monogram tile behind the tab icon, the Apple touch icon and the manifest icons. The initials
// come from profile.json, so the icons follow the owner's name.
// The accent and the ground of globals.css: bone letters on the moss-green tile.
const GROUND = '#355b2c'
const INK = '#e5e1d8'

/** "Ankit Gole" -> "AG": the first letter of the given and the family name. */
export function initials(name: string): string {
  const { given, family } = nameParts(name)
  return `${given.charAt(0)}${family.charAt(0)}`.toUpperCase()
}

/**
 * Square PNG of the owner's initials. `rounded` gives the tab icon its corners; the Apple touch icon
 * and the maskable icon stay full bleed because the platform applies its own mask. `maskable` shrinks
 * the letters into the central safe zone the platform mask never crops.
 */
export function renderMonogram(size: number, { rounded = false, maskable = false }: { rounded?: boolean; maskable?: boolean } = {}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: GROUND,
          color: INK,
          borderRadius: rounded ? Math.round(size * 0.22) : 0,
          fontSize: Math.round(size * (maskable ? 0.3 : 0.42)),
          fontWeight: 600,
          letterSpacing: -Math.round(size * 0.01),
        }}
      >
        {initials(profile.identity.name)}
      </div>
    ),
    { width: size, height: size },
  )
}
