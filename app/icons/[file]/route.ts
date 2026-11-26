import { renderMonogram } from '@/lib/monogram'

// The web app manifest icons (app/manifest.ts), rendered from the owner's initials at build time and
// served at the same /icons/<file> paths the manifest lists.
const ICONS: Record<string, { size: number; maskable?: boolean }> = {
  'icon-192.png': { size: 192 },
  'icon-512.png': { size: 512 },
  'maskable-512.png': { size: 512, maskable: true },
}

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return Object.keys(ICONS).map((file) => ({ file }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params
  const icon = ICONS[file]
  if (!icon) return new Response('Not found', { status: 404 })
  return renderMonogram(icon.size, { maskable: icon.maskable })
}
