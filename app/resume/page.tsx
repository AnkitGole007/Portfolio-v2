import type { Metadata } from 'next'
import Link from 'next/link'
import { formatRange, isEarlierWork, profile, SITE_URL, type Education, type Experience, type Project } from '@/lib/content'
import { JsonLd, breadcrumbJsonLd } from '@/lib/jsonld'
import { ButtonLink } from '@/components/ui/button'
import { Prose, ProseList } from '@/components/glossary/prose'
import { CopyEmail } from '@/components/cta/copy-email'
import { splitEmail } from '@/components/cta/email'
import { PrintButton } from './print-button'

const { identity, links, experience, education, projects, skills, resumeMaster } = profile

type Item<T> = { entry: T; bullets: string[] }

/**
 * What /resume prints, in order. With `resumeMaster` in profile.json (the resume v3 master of context
 * section 10): only the roles and projects it lists, each with its own capped bullets, all checked
 * against the content model by scripts/check-profile.mjs. Without it: every role with all its
 * highlights, and every project that has no role of its own and is not earlier work, with its pitch.
 * About, /projects and the home page always show everything.
 */
const roles: Item<Experience>[] = resumeMaster
  ? resumeMaster.experience.flatMap((r) => {
      const entry = experience.find((e) => e.id === r.id)
      return entry ? [{ entry, bullets: r.bullets }] : []
    })
  : experience.map((entry) => ({ entry, bullets: entry.highlights }))

const resumeProjects: Item<Project>[] = resumeMaster
  ? resumeMaster.projects.flatMap((r) => {
      const entry = projects.find((x) => x.slug === r.slug)
      return entry ? [{ entry, bullets: r.bullets }] : []
    })
  : projects
      .filter((x) => !x.experienceId && !isEarlierWork(x))
      .map((entry) => ({ entry, bullets: entry.featured ? [entry.pitch.action, entry.pitch.change] : [entry.pitch.change] }))

// 150 to 160 characters, counts from the content model. Title and description reach the social card through Next's fallback.
const degree = education[0]
const DESCRIPTION = `Resume of ${identity.name}, ${identity.title} in ${identity.location.city}, ${identity.location.region}: ${[
  degree ? `${degree.degree} in ${degree.field} from ${degree.abbr}` : null,
  `${roles.length} ${roles.length === 1 ? 'role' : 'roles'}`,
  resumeProjects.length ? `${resumeProjects.length} projects` : null,
]
  .filter(Boolean)
  .join(', ')}. ${links.resumePdf ? 'Download the PDF or print.' : 'Print it from the page.'}`

export const metadata: Metadata = {
  title: `Resume, ${identity.title}`,
  description: DESCRIPTION,
  keywords: [identity.name, 'resume', 'CV', identity.title, ...identity.availability.roles, ...Object.keys(skills)],
  alternates: { canonical: '/resume', types: { 'text/markdown': '/md/resume.md' } },
  openGraph: {
    type: 'website',
    url: '/resume',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: `${identity.name}, ${identity.title}` }],
  },
}

/*
 * Hoisted into <head> by React. In print: black on white, only <main> (the nav, footer, scroll island
 * and dialogs are body siblings of it), and a type scale set in points (10 pt text, 9.5 pt small lines) so the resume master
 * stays well under two Letter or A4 pages. The root size scales every rem-based space with it.
 */
const PRINT_CSS = `
@page { margin: 12mm 14mm; }
@media print {
  :root, [data-theme="light"], [data-theme="dark"] {
    --surface: #fff; --surface-raised: #fff; --surface-sunken: #fff;
    --rule: #c9c9c9; --rule-strong: #9a9a9a;
    --ink: #000; --ink-2: #2b2b2b; --ink-3: #444;
    --accent: #000; --accent-ink: #fff; --accent-soft: transparent;
    --grain-opacity: 0; color-scheme: light;
  }
  html { font-size: 10pt; }
  body { background: #fff !important; color: #000 !important; }
  body > :not(main) { display: none !important; }
  a { color: inherit; text-decoration: none; }
  [data-resume] { font-size: 10pt; line-height: 1.3; }
  [data-resume] p, [data-resume] li, [data-resume] dd, [data-resume] dt { line-height: 1.3; }
  [data-resume] h1 { font-size: 21pt; line-height: 1.1; }
  [data-resume] h2 { font-size: 12.5pt; line-height: 1.2; }
  [data-resume] h3, [data-resume] .resume-lead { font-size: 10.5pt; }
  [data-resume] .resume-small { font-size: 9.5pt; }
}
`

const host = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
const BULLETS = 'resume-small mt-1.5 list-disc space-y-0.5 pl-5 text-sm text-ink marker:text-ink-3 print:mt-1 print:space-y-0'
const META = 'resume-small mt-0.5 text-sm text-ink-2'
/** A plain link with a 44 px target below md; the row and the entry heads stay text-sized from md and in print. */
const LINK = 'inline-flex min-h-11 items-center transition-colors hover:text-ink md:min-h-0 print:min-h-0'

/** A project's period, or nothing for an undated one (never "present to present"). */
const period = (p: Pick<Project, 'start' | 'end'>) => (p.start ? formatRange(p.start, p.end) : '')

/** "AI Trainer" at the left, "Aug 2026 to present" at the right, wrapping under the title on a phone. */
function EntryHead({ title, when }: { title: React.ReactNode; when?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6">
      <h3 className="resume-lead font-medium text-ink">{title}</h3>
      {when ? <p className="resume-small text-metric text-sm text-ink-2">{when}</p> : null}
    </div>
  )
}

/** Section title at the left from lg, content in the nine columns to its right; one column in print. */
function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="py-8 md:py-10 lg:grid lg:grid-cols-12 lg:gap-x-6 print:block print:py-0 print:pt-3"
    >
      <h2 id={`${id}-title`} className="text-title lg:col-span-3">
        {title}
      </h2>
      <div className="mt-4 lg:col-span-9 lg:mt-1 xl:col-span-8 print:mt-1.5">{children}</div>
    </section>
  )
}

function EducationEntry({ e }: { e: Education }) {
  const lines = [
    `${e.degree} in ${e.field}. ${e.location}.${e.gpa ? ` GPA ${e.gpa}${e.gpaScale ? `/${e.gpaScale}` : ''}.` : ''}`,
    e.coursework.length > 0 ? `Coursework: ${e.coursework.join(', ')}.` : null,
    e.activities?.length ? `Leadership: ${e.activities.join(', ')}.` : null,
  ].filter((l): l is string => Boolean(l))
  return (
    <li className="break-inside-avoid">
      <EntryHead title={e.institution} when={formatRange(e.start, e.end)} />
      {lines.map((l) => (
        <p key={l} className={META}>
          {l}
        </p>
      ))}
      {e.honors.length > 0 ? (
        <ul className={BULLETS}>
          {e.honors.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      ) : null}
    </li>
  )
}

function ExperienceEntry({ e, bullets, seen }: { e: Experience; bullets: string[]; seen: Set<string> }) {
  const where = [e.org, e.location].filter(Boolean).join(', ')
  return (
    <li className="break-inside-avoid">
      <EntryHead title={e.role} when={formatRange(e.start, e.end)} />
      <p className={META}>
        {e.orgUrl ? (
          <a href={e.orgUrl} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
            {where}
          </a>
        ) : (
          where
        )}
        . {e.type}.{e.award ? ` ${e.award}.` : ''}
        {/* A role without bullets carries its one-line summary on the same line, in the full ink. */}
        {bullets.length === 0 ? (
          <>
            {' '}
            <Prose as="span" text={e.summary} className="text-ink" seen={seen} />
          </>
        ) : null}
      </p>
      {bullets.length > 0 ? <ProseList items={bullets} className={BULLETS} seen={seen} /> : null}
      {e.advisors?.length ? <p className={META}>Advisor: {e.advisors.join(', ')}.</p> : null}
    </li>
  )
}

/** A project with its subtitle and role saying what it is, its recognition, and the bullets the resume picked. */
function ProjectEntry({ p, bullets, seen }: { p: Project; bullets: string[]; seen: Set<string> }) {
  const meta = [p.subtitle, p.role].filter(Boolean).join('. ')
  return (
    <li data-project={p.slug} className="break-inside-avoid">
      <EntryHead
        title={
          <Link
            href={`/projects/${p.slug}`}
            className="inline-flex min-h-11 items-center underline decoration-rule-strong decoration-1 underline-offset-[5px] hover:text-accent hover:decoration-accent md:min-h-0 print:min-h-0 print:no-underline"
          >
            {p.name}
          </Link>
        }
        when={period(p)}
      />
      {meta ? <p className={META}>{meta}.</p> : null}
      {p.recognition ? <p className={META}>{p.recognition}.</p> : null}
      {bullets.length > 0 ? <ProseList items={bullets} className={BULLETS} seen={seen} /> : null}
    </li>
  )
}

export default function ResumePage() {
  // The resume reads top to bottom, so each glossary term gets one popover per page.
  const seen = new Set<string>()
  return (
    <div className="container-site py-12 md:py-16 print:p-0">
      <style href="resume-print" precedence="default">
        {PRINT_CSS}
      </style>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Resume', path: '/resume' }])} />

      <article data-resume className="max-w-[72rem]">
        <header className="pb-4 md:pb-6 lg:grid lg:grid-cols-12 lg:gap-x-6 print:block print:pb-1">
          <div className="lg:col-span-9 lg:col-start-4 xl:col-span-8 xl:col-start-4">
            <h1 className="text-display">{identity.name}</h1>
            <p className="resume-lead text-lead mt-2 text-ink-2 print:mt-0.5">{identity.title}</p>
            {/* Links keep a 44 px target on phones (the row loses its gap to make room), plain text from md and in print. */}
            <ul className="resume-small mt-4 flex flex-wrap items-center gap-x-5 text-sm text-ink-2 md:gap-y-1 print:mt-1.5">
              <li>{identity.location.display}</li>
              <li>
                <a href={SITE_URL} className={LINK}>
                  {host(SITE_URL)}
                </a>
              </li>
              {links.linkedin ? (
                <li>
                  <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className={LINK}>
                    {host(links.linkedin)}
                  </a>
                </li>
              ) : null}
              {links.github ? (
                <li>
                  <a href={links.github} target="_blank" rel="noopener noreferrer" className={LINK}>
                    {host(links.github)}
                  </a>
                </li>
              ) : null}
            </ul>
            {/* Screen only. The address is copied on the client from two halves, so it never appears in this page's HTML or print. */}
            <div className="mt-6 flex flex-wrap gap-3 print:hidden">
              {links.resumePdf && (
                <ButtonLink href={links.resumePdf} download>
                  Download PDF
                </ButtonLink>
              )}
              <CopyEmail parts={splitEmail(links.email)} location="resume" />
              <PrintButton />
            </div>
          </div>
        </header>

        <Section id="summary" title="Summary">
          <Prose text={identity.summary} className="max-w-[68ch] text-ink print:max-w-none" seen={seen} />
        </Section>

        <Section id="education" title="Education">
          <ol className="space-y-5 print:space-y-2">
            {education.map((e) => (
              <EducationEntry key={e.id} e={e} />
            ))}
          </ol>
        </Section>

        <Section id="experience" title="Experience">
          <ol className="space-y-6 print:space-y-2">
            {roles.map(({ entry, bullets }) => (
              <ExperienceEntry key={entry.id} e={entry} bullets={bullets} seen={seen} />
            ))}
          </ol>
        </Section>

        {resumeProjects.length > 0 ? (
          <Section id="projects" title="Projects">
            <ol className="space-y-6 print:space-y-2">
              {resumeProjects.map(({ entry, bullets }) => (
                <ProjectEntry key={entry.slug} p={entry} bullets={bullets} seen={seen} />
              ))}
            </ol>
          </Section>
        ) : null}

        <Section id="skills" title="Technical skills">
          <dl className="space-y-3 print:space-y-1">
            {Object.entries(skills).map(([group, list]) => (
              <div key={group} className="break-inside-avoid sm:grid sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-x-6 print:grid print:grid-cols-[10rem_minmax(0,1fr)]">
                <dt className="resume-small text-sm font-medium text-ink">{group}</dt>
                <dd className="resume-small text-sm text-ink-2">{list.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </Section>
      </article>
    </div>
  )
}
