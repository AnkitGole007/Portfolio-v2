import { renderMonogram } from '@/lib/monogram'

// Apple touch icon: the owner's initials from profile.json (lib/monogram), full bleed for the iOS mask.
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return renderMonogram(size.width)
}
