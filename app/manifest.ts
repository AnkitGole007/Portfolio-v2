import type { MetadataRoute } from 'next'
import { nameParts, profile } from '@/lib/content'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: profile.identity.name,
    short_name: nameParts(profile.identity.name).given || profile.identity.name,
    description: profile.identity.headline,
    start_url: '/',
    display: 'standalone',
    // --surface in globals.css.
    background_color: '#e5e1d8',
    theme_color: '#e5e1d8',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
