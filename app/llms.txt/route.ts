import { formatMonth, hasDistinctPitch, hasResearch, isEarlierWork, listJoin, profile, profileLinks, SITE_URL, VCARD_PATH, type Project } from '@/lib/content'
import { PITCH_SECONDS, hasPitch, pitchVideoSrc } from '@/components/reel/pitch-slugs'

export const dynamic = 'force-static'

// /llms.txt following https://llmstxt.org: H1, a blockquote summary, free text (the dated facts),
// then H2 sections whose list items are links with notes. Everything comes from the content model,
// and a link the profile does not carry is left out. No email address: the contact paths are the
// profile links and the vCard.
export function GET() {
  const { identity, links, publications, projects, now, meta } = profile
  const a = identity.availability
  const abs = (path: string) => `${SITE_URL}${path}`
  // Without an outcome on record the three pitch cells restate the name, so the note is the summary, as on /projects.
  const pitch = (p: Project) => (hasDistinctPitch(p) ? `${p.pitch.problem} ${p.pitch.action} ${p.pitch.change}` : p.summary)
  const video = (p: Project) => (hasPitch(p.slug) ? ` Pitch video (${PITCH_SECONDS} s): ${abs(pitchVideoSrc(p.slug))}.` : '')
  const pitched = projects.filter((p) => hasPitch(p.slug)).length
  // The same grouping as /projects: earlier work is listed apart, after the main projects.
  const main = projects.filter((p) => !isEarlierWork(p))
  const earlier = projects.filter((p) => isEarlierWork(p))
  const projectLine = (p: Project) => `- [${p.name}](${abs(`/projects/${p.slug}`)}): ${pitch(p)}${video(p)} Markdown: ${abs(`/md/projects/${p.slug}.md`)}`
  const pronouns = identity.pronouns ? ` (${identity.pronouns})` : ''
  const authorization = a.workAuthorization ? ` ${a.workAuthorization}` : ''
  // The /about blocks in page order, each only when the profile has something for it.
  const aboutParts = listJoin(
    [
      'story',
      profile.education.length ? 'education' : null,
      profile.recognition.length ? 'recognition' : null,
      profile.certifications.length ? 'certifications' : null,
      profile.leadership.length || profile.education.some((e) => e.activities?.length) ? 'leadership' : null,
      profile.writing.length ? 'writing' : null,
      'availability',
    ].filter((x): x is string => Boolean(x)),
  )

  const lines: string[] = [
    `# ${identity.name}`,
    '',
    `> ${identity.summary}`,
    '',
    `${identity.name}${pronouns} is ${/^[aeiou]/i.test(identity.title) ? 'an' : 'a'} ${identity.title} based in ${identity.location.display}. ${a.display}${a.startDate ? `, starting ${a.startDate.toLowerCase()}` : ''}.${authorization}`,
    '',
    `Author: ${identity.name}. Content last updated ${meta.lastUpdated} (profile version ${meta.version}). Every page is also served as markdown: send \`Accept: text/markdown\` or fetch the \`/md/\` path listed next to each link.`,
    '',
    `Now, as of ${now.date}:`,
    '',
    ...now.lines.map((line) => `- ${line}`),
    '',
    '## Pages',
    '',
    `- [Home](${abs('/')}): headline, proof points, featured work${pitched ? ', the pitch reel' : ''}, experience, outcome numbers, skills, recognition and education${profile.writing.length ? ', writing' : ''} and contact. Markdown: ${abs('/md/index.md')}`,
    `- [Projects](${abs('/projects')}): all ${projects.length} projects with the three-second strip, metrics, stack and repositories. Markdown: ${abs('/md/projects.md')}`,
    ...(hasResearch
      ? [`- [Research](${abs('/research')}): ${publications.length ? `${publications.length} publications with abstracts, findings, figures and the research positions behind them` : 'research roles'}. Markdown: ${abs('/md/research.md')}`]
      : []),
    `- [About](${abs('/about')}): ${aboutParts}. Markdown: ${abs('/md/about.md')}`,
    `- [Resume](${abs('/resume')}): the resume as HTML, with the roles and projects ${identity.name} selected for it. Markdown: ${abs('/md/resume.md')}.${links.resumePdf ? ` PDF: ${abs(links.resumePdf)}` : ''}`,
    ...(pitched
      ? [`- [Pitch reel](${abs('/#reel')}): ${pitched} project pitches of ${PITCH_SECONDS} seconds each, listed per project below`]
      : []),
    '',
    `## Projects (${main.length}, featured first; each note is the problem, what ${identity.name} did and what changed, or a summary where no outcome is on record)`,
    '',
    ...main.map(projectLine),
    ...(earlier.length ? ['', `## Earlier work (${earlier.length} older and minor projects)`, '', ...earlier.map(projectLine)] : []),
    '',
    // Listed only while a paper is on record, so an empty heading never reaches the file.
    ...(publications.length
      ? [
          '## Publications',
          '',
          ...publications.map(
            (p) =>
              `- [${p.title}](${p.links.paper ?? p.venueUrl}): ${p.displayString} (${p.status}), ${formatMonth(p.date)}. Authors: ${p.authors.join(', ')}. ${p.tldr}`,
          ),
          '',
        ]
      : []),
    '## Contact',
    '',
    ...(links.linkedin ? [`- [LinkedIn](${links.linkedin}): messages and connection requests`] : []),
    ...(links.scheduling ? [`- [Book a call](${links.scheduling}): scheduling link`] : []),
    `- [Contact card](${abs(VCARD_PATH)}): vCard download with the email address`,
    ...(links.resumePdf ? [`- [Resume PDF](${abs(links.resumePdf)})`] : []),
    '',
    '## Full content',
    '',
    `- [llms-full.txt](${abs('/llms-full.txt')}): every page of this site as one markdown document, plus the glossary of terms used on it`,
    `- [Resume in markdown](${abs('/md/resume.md')}): summary, education, experience, selected projects and technical skills, in the order and selection of the resume page`,
    '',
    '## Profiles',
    '',
    ...profileLinks().map((l) => `- [${l.label}](${l.url})`),
    '',
    '## Optional',
    '',
    `- [Sitemap](${abs('/sitemap.xml')}): every indexable URL, with image and video entries`,
    `- [humans.txt](${abs('/humans.txt')}): who built the site and with what`,
  ]

  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
