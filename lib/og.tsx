import { ImageResponse } from 'next/og'
import { profile, SITE_URL } from '@/lib/content'

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

export type OgMetric = { value: string; label: string }
export type OgProps = {
  title: string
  subtitle?: string
  metrics?: OgMetric[]
  kicker?: string
}

// The tokens of globals.css: next/og renders outside the CSS cascade.
const SURFACE = '#e5e1d8'
const PANEL = '#dad5ca'
const INK = '#2a1d17'
const INK_2 = '#54463d'
const INK_3 = '#5c4d43'
const ACCENT = '#355b2c'

const HOST = SITE_URL.replace(/^https?:\/\//, '')

function titleSize(title: string) {
  if (title.length > 56) return 54
  if (title.length > 36) return 64
  if (title.length > 20) return 80
  return 96
}

/** Shared 1200x630 Open Graph card: bone ground, a green bar, title, subtitle, up to three metrics, and a footer band one tone down. */
export function renderOg({ title, subtitle, metrics = [], kicker }: OgProps) {
  const shown = metrics.slice(0, 3)
  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: SURFACE,
          color: INK,
          padding: '56px 64px',
          fontFamily: 'serif',
        }}
      >

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 72, height: 6, background: ACCENT }} />
          {kicker ? (
            <div style={{ fontSize: 24, color: ACCENT }}>{kicker}</div>
          ) : null}
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 36,
            fontSize: titleSize(title),
            lineHeight: 1.04,
            letterSpacing: -1,
            color: INK,
          }}
        >
          {title}
        </div>

        {subtitle ? (
          <div style={{ display: 'flex', marginTop: 20, maxWidth: 1000, fontSize: 28, lineHeight: 1.35, color: INK_2 }}>
            {subtitle}
          </div>
        ) : null}

        <div style={{ display: 'flex', flexGrow: 1 }} />

        {shown.length > 0 ? (
          <div style={{ display: 'flex', gap: 56, alignItems: 'flex-end' }}>
            {shown.map((m) => (
              <div key={m.label} style={{ display: 'flex', flexDirection: 'column', maxWidth: 320 }}>
                <div style={{ fontSize: 40, lineHeight: 1.1, letterSpacing: -1, color: ACCENT }}>{m.value}</div>
                <div style={{ marginTop: 8, fontSize: 20, lineHeight: 1.3, color: INK_2 }}>{m.label}</div>
              </div>
            ))}
          </div>
        ) : null}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 36,
            marginLeft: -64,
            marginRight: -64,
            marginBottom: -56,
            padding: '24px 64px 32px',
            background: PANEL,
            fontSize: 22,
            color: INK_3,
          }}
        >
          <div>{HOST}</div>
          <div>{profile.identity.name}</div>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  )
}
