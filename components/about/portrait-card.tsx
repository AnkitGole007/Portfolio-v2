import fs from 'node:fs'
import path from 'node:path'
import { profile } from '@/lib/content'
import { publicImageSize } from '@/components/projects/figure'
import { cx } from '@/lib/cx'
import { PortraitImg } from './portrait-img'

/** Other widths of the same crop beside the profile's file: "/portrait/ankit-gole-960.webp" -> "-480" and "-1440", when present under public/. */
const SIBLING_WIDTHS = [480, 1440]

function siblingSources(src: string, width: number): { src: string; w: number }[] {
  if (!/-\d+(\.\w+)$/.test(src)) return []
  return SIBLING_WIDTHS.filter((w) => w !== width)
    .map((w) => ({ src: src.replace(/-\d+(\.\w+)$/, `-${w}$1`), w }))
    .filter((s) => fs.existsSync(path.join(process.cwd(), 'public', s.src)))
}

/**
 * The owner's portrait from profile.json as a plain photograph: square corners, its own 4:5 crop, a
 * 480, the profile's 960 and a 1440 WebP source (sharp on 2x screens where it is 660 px wide). Lazy by
 * default; a page that shows it in the first screen passes loading="eager" so the browser does not hold
 * it back. Width comes from the caller. Renders nothing when the profile has no portrait.
 */
export function PortraitCard({
  className,
  sizes = '(min-width: 768px) 360px, 60vw',
  loading = 'lazy',
}: {
  className?: string
  sizes?: string
  loading?: 'lazy' | 'eager'
}) {
  const portrait = profile.identity.portrait
  if (!portrait) return null
  const { width, height } = publicImageSize(portrait.src)
  const sources = [...siblingSources(portrait.src, width), { src: portrait.src, w: width }].sort((a, b) => a.w - b.w)
  const srcSet = sources.length > 1 ? sources.map((s) => `${s.src} ${s.w}w`).join(', ') : undefined
  return (
    <PortraitImg
      src={portrait.src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={portrait.alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      className={cx('frame-media h-auto', className)}
      style={{ aspectRatio: `${width} / ${height}` }}
    />
  )
}
