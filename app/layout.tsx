import type { Metadata, Viewport } from 'next'
import { EB_Garamond, Libre_Franklin } from 'next/font/google'
import './globals.css'
import { githubLogin, hasResearch, INDEXABLE, nameParts, profile, SITE_URL } from '@/lib/content'
import { fitDescription } from '@/lib/seo'
import { Nav } from '@/components/site/nav'
import { Footer } from '@/components/site/footer'
import { SiteAnalytics } from '@/components/site/analytics'
import { DeferredAnalytics } from '@/components/site/deferred-analytics'
import { CommandPalette } from '@/components/cta/command-palette'
import { ScrollIsland } from '@/components/cta/scroll-island'
import { ReelProvider, pitchItems } from '@/components/reel'
import { JsonLd, personJsonLd, websiteJsonLd } from '@/lib/jsonld'

// Two families (spec section 5, art direction): EB Garamond for display and reading text, Libre Franklin
// for the small print. Both are variable fonts, so every weight the components ask for comes from one file.
const garamond = EB_Garamond({ subsets: ['latin'], variable: '--font-garamond', display: 'swap' })
const franklin = Libre_Franklin({ subsets: ['latin'], variable: '--font-franklin', display: 'swap' })

const { identity, links } = profile
const { given, family } = nameParts(identity.name)
const TITLE = `${identity.name} | ${identity.title}`
// Home description, 150 to 160 characters from profile.json: name and headline, then the city and the first degree as room allows.
const degree = profile.education[0]
const DESCRIPTION = fitDescription(
  [`${identity.name}: ${identity.headline}.`],
  [`Based in ${identity.location.city}, ${identity.location.region}.`, degree ? `${degree.degree} in ${degree.field}, ${degree.abbr}.` : null],
)

// --surface in globals.css; the browser chrome wants the plain colour.
const GROUND = '#e5e1d8'

// The nav joins the address on the client at click time, so no page carries a mailto: link in its markup.
const [emailUser, emailDomain] = links.email.replace(/^mailto:/, '').split('@')

// Vercel Analytics and Speed Insights scripts exist only on a Vercel deployment (/_vercel/*). Read at build
// time, so a local or other host ships neither and logs no 404 for them.
const ON_VERCEL = Boolean(process.env.VERCEL_ENV)

// openGraph and twitter carry no title or description on purpose: Next fills them from each page's own
// resolved title and description, so a route that sets neither still gets its own social card copy.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: `%s | ${identity.name}` },
  description: DESCRIPTION,
  applicationName: SITE_URL.replace(/^https?:\/\//, ''),
  authors: [{ name: identity.name, url: SITE_URL }],
  creator: identity.name,
  publisher: identity.name,
  // Name, role, the core skills, schools and city, all from profile.json.
  keywords: [
    identity.name,
    identity.title,
    ...Object.values(profile.coreSkills ?? {}).flat(),
    ...profile.education.map((e) => e.institution),
    identity.location.city,
    'portfolio',
  ],
  alternates: { canonical: '/', types: { 'text/markdown': '/md/index.md' } },
  openGraph: {
    type: 'profile',
    locale: 'en_US',
    url: SITE_URL,
    siteName: identity.name,
    firstName: given,
    lastName: family,
    ...(githubLogin ? { username: githubLogin } : {}),
  },
  twitter: { card: 'summary_large_image' },
  // A Vercel preview or development build without NEXT_PUBLIC_SITE_URL asks search engines to stay away (lib/content.ts INDEXABLE).
  robots: INDEXABLE
    ? {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
      }
    : { index: false, follow: false, googleBot: { index: false, follow: false } },
  category: 'technology',
  formatDetection: { telephone: false, email: false, address: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light',
  themeColor: GROUND,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${garamond.variable} ${franklin.variable}`}>
      <body className="bg-surface text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-ink"
        >
          Skip to content
        </a>
        <Nav name={identity.name} email={{ user: emailUser, domain: emailDomain }} research={hasResearch} />
        {/* The reel provider wraps the page content so any PlayPitch or filmstrip opens the one shared lightbox. */}
        <ReelProvider items={pitchItems()}>
          <main id="main">{children}</main>
        </ReelProvider>
        <Footer />
        <JsonLd data={personJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        {ON_VERCEL ? <DeferredAnalytics /> : null}
        <SiteAnalytics />
        <ScrollIsland />
        <CommandPalette />
      </body>
    </html>
  )
}
