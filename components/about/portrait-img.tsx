'use client'

import type { ImgHTMLAttributes } from 'react'

/**
 * The portrait <img>, rendered from a client module on purpose. React turns an eager <img> in a server
 * component into an image preload hint inside the route's RSC payload, so every page that prefetched
 * /about preloaded the portrait and never used it. From here the image is not in that payload; the
 * server render of the page that shows it still puts the preload in that page's own head.
 */
export function PortraitImg(props: ImgHTMLAttributes<HTMLImageElement>) {
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img {...props} />
}
