import { renderMonogram } from '@/lib/monogram'

// Browser tab icon: the owner's initials from profile.json (lib/monogram).
export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

export default function Icon() {
  return renderMonogram(size.width, { rounded: true })
}
