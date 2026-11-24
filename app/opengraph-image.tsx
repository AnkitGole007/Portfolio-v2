import { profile } from '@/lib/content'
import { OG_CONTENT_TYPE, OG_SIZE, renderOg, type OgMetric } from '@/lib/og'

const { identity, education, publications, recognition } = profile

// Up to three proof points, each the first entry of its list in profile.json: a paper, a recognition
// and the first degree. Lists that are empty add nothing.
const metrics: OgMetric[] = []
const paper = publications[0]
const award = recognition.find((r) => r.kind !== 'certification')
const degree = education[0]
if (paper) metrics.push({ value: paper.venue, label: paper.status })
if (award) metrics.push({ value: award.org, label: award.title })
if (degree) {
  metrics.push({
    value: degree.gpa ? `GPA ${degree.gpa}` : degree.abbr,
    label: `${degree.degree}, ${degree.field}, ${degree.abbr}`,
  })
}

export const alt = `${identity.name}, ${identity.title}`
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function OpenGraphImage() {
  return renderOg({
    kicker: identity.title,
    title: identity.name,
    subtitle: identity.headline,
    metrics,
  })
}
