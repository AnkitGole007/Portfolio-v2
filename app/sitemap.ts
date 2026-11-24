import type { MetadataRoute } from 'next'
import { hasResearch, profile, SITE_URL, type Project } from '@/lib/content'
import { PITCH_SECONDS, hasPitch, pitchPosterSrc, pitchVideoSrc } from '@/components/reel/pitch-slugs'

type Entry = MetadataRoute.Sitemap[number]
type Video = NonNullable<Entry['videos']>[number]

const abs = (path: string) => `${SITE_URL}${path}`
/** The owner's portrait from profile.json, listed as an image of the home and about pages when present. */
const portrait = profile.identity.portrait?.src
const portraitImages = portrait ? { images: [abs(portrait)] } : {}

// Every indexable route, generated from the content model so a new project is listed automatically.
// Project pages carry their pitch as a video sitemap entry and the WebP poster as an image.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(profile.meta.lastUpdated)
  const entry = (path: string, changeFrequency: Entry['changeFrequency'], priority: number, extra: Partial<Entry> = {}): Entry => ({
    url: abs(path),
    lastModified,
    changeFrequency,
    priority,
    ...extra,
  })

  const pitchVideo = (p: Project): Video => ({
    title: `${p.name}: ${PITCH_SECONDS}-second pitch`,
    description: `${p.pitch.problem} ${p.pitch.action} ${p.pitch.change}`,
    thumbnail_loc: abs(pitchPosterSrc(p.slug)),
    content_loc: abs(pitchVideoSrc(p.slug)),
    duration: PITCH_SECONDS,
    publication_date: lastModified,
    family_friendly: 'yes',
    uploader: { info: SITE_URL, content: profile.identity.name },
  })

  const projectEntry = (p: Project): Entry => {
    const pitch = hasPitch(p.slug)
    const images = [...(pitch ? [abs(pitchPosterSrc(p.slug))] : []), ...(p.visual ? [abs(p.visual.src)] : [])]
    return entry(`/projects/${p.slug}`, p.status === 'ongoing' ? 'monthly' : 'yearly', p.featured ? 0.8 : 0.6, {
      ...(images.length ? { images } : {}),
      ...(pitch ? { videos: [pitchVideo(p)] } : {}),
    })
  }

  const figures = profile.publications.flatMap((p) => p.figures.map((f) => abs(f.src)))

  return [
    entry('/', 'weekly', 1, portraitImages),
    entry('/projects', 'weekly', 0.9),
    // Listed only while the research page has a paper or a research role to show (it is a 404 otherwise).
    ...(hasResearch ? [entry('/research', 'monthly', 0.9, figures.length ? { images: figures } : {})] : []),
    entry('/resume', 'monthly', 0.8),
    entry('/about', 'monthly', 0.7, portraitImages),
    ...profile.projects.map(projectEntry),
    entry('/llms.txt', 'monthly', 0.3),
  ]
}
