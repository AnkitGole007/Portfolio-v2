import { getProject, informativeKind, profile, projectSlugs, projectYear } from '@/lib/content'
import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from '@/lib/og'

export const alt = `Project by ${profile.identity.name}`
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const dynamicParams = false

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }))
}

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = getProject(slug)
  if (!p) {
    return renderOg({ title: profile.identity.name, subtitle: profile.identity.headline })
  }
  // The kicker names the kind where it says something; "Other" gives way to the year, and an undated
  // project of that kind has no kicker. The outcome line sits under the title.
  return renderOg({
    kicker: informativeKind(p.kind) ?? (projectYear(p) || undefined),
    title: p.name,
    subtitle: p.pitch.change,
    metrics: p.metrics.slice(0, 3),
  })
}
