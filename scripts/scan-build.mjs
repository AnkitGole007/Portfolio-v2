#!/usr/bin/env node
// Built-output scan, run on postbuild: fails the build when a banned claim or a private detail reaches
// anything the site serves, even though content/profile.json passed scripts/check-profile.mjs. A derived
// surface (llms files, markdown mirrors, JSON-LD, OG image text, vCard, glossary tips) can still leak.
//
// What it reads:
//   .next/server/app   every prerendered page, flight payload and route body (llms files, vCard, sitemap)
//   .next/static       the client bundles
//   public             every text file, the markdown mirrors under public/md included
//   OG image text      the strings app/opengraph-image.tsx and app/projects/[slug]/opengraph-image.tsx draw,
//                      rebuilt from profile.json (the PNG bodies are binary)
//
// Rules (each one fails the build):
//   banned      a claim from scripts/banned.mjs, in the raw file and in the visible text of each page
//   phone       a phone shape from scripts/banned.mjs. In the raw text of every file (HTML attributes and
//               inline scripts, JSON bodies, flight payloads, bundles, text files) and in readable text:
//               any number in the owner's area code, any US number with separators, any tel: link or
//               vCard TEL line. In readable text only (page text, JSON-LD, text files, OG text): a 3 and
//               4 digit group after a phone word, the area code after a phone word, the area code as a
//               bare token. The guards never hold the owner's number, only its area code.
//   private     a term from the PRIVATE_TERMS environment variable (scripts/banned.mjs), as whole words
//               in any case; skipped with one printed line while the variable is unset
//   email       the full email address anywhere except the vCard route
//   cloud-run   a Cloud Run URL (the B2 deployment URL stays off the site)
//   multi-agent on a page, markdown file, JSON body or OG card that mentions B2, Research Agent or
//               researchagent, "multi-agent" anywhere outside the one project that is a multi-agent system
//               (MULTI_AGENT_PROJECT): outside its data-project element in HTML, its heading section or
//               list item in markdown, its JSON-LD block, its JSON rows and its OG card
//   account     a path on the previous owner's GitHub account other than the three shared repository URLs;
//               a sentence's period right after one of those URLs is allowed
// Warning (printed, never fails the build):
//   description an indexable page whose meta description is not 150 to 160 characters
//
//   node scripts/scan-build.mjs              scan the build; exit 1 with one line per hit
//   node scripts/scan-build.mjs --self-test  prove every rule on planted fixtures in a temporary folder
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BANNED, hasPrivateTerm, phoneMarkup, phoneNumber, privateTerms, readablePhone } from './banned.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')

// A term must not be part of a longer token. One that starts with a digit may not follow a letter, digit,
// "." or "," ("50x" does not match "150x", "1.50x" or a hashed chunk name); one that starts with a letter
// may not follow a letter or digit, so ",Kubernetes" in a comma-joined keywords list still counts. A term
// that ends with a letter or digit may not run on ("Platt" does not match "Platter").
const lookbehind = (term) => (/^\d/.test(term) ? '(?<![\\w.,])' : /^\w/.test(term) ? '(?<!\\w)' : '')
const TERMS = BANNED.map((term) => ({
  term,
  re: new RegExp(`${lookbehind(term)}${escape(term)}${/\w$/.test(term) ? '(?!\\w)' : ''}`, 'i'),
}))
const CLOUD_RUN = /\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.run\.app\b/i
const MULTI_AGENT = /multi[\s-]?agent/i
// B2 Research Agent under any of its names, the repository name included.
const B2 = /\bB2\b|research\s?agent/i

// RealmWeaver-AI (MADWE) is a multi-agent diffusion world engine; it is the one project the phrase may
// describe. Its HTML containers carry data-project="<slug>" (project page, /projects row, featured row,
// resume entry), its markdown sections start with a heading that opens with its name, and its JSON-LD
// blocks have an @id under /projects/<slug>.
const MULTI_AGENT_PROJECT = 'realmweaver-madwe'

// The previous owner's GitHub account, assembled from parts so this file does not trip
// scripts/check-identity.mjs. Three of the owner's team projects live there; those exact repository URLs
// are allowed, followed by nothing that extends the path: no letter, digit, "/" or "-", and a "." only
// as a sentence's period (not followed by a letter, digit, "/" or "-", as in ".github.io" or ".git").
const ACCOUNT = 'Son' + 'ica-B'
const SHARED_REPOS = ['TumorLytix', 'RealmWeaver-MADWE', 'TrendED']
const SHARED_URL = new RegExp(
  `(?:https?://)?(?:www\\.)?github\\.com/${escape(ACCOUNT)}/(?:${SHARED_REPOS.map(escape).join('|')})(?![\\w/-]|\\.[\\w/-])`,
  'gi',
)
const ACCOUNT_RE = new RegExp(escape(ACCOUNT), 'i')

const DESCRIPTION_MIN = 150
const DESCRIPTION_MAX = 160

/** Binary when the first 8 KB hold a NUL byte (images, fonts, video): only text files are scanned. */
const isBinary = (buf) => buf.subarray(0, 8192).includes(0)

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }
const decode = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : Number(e.slice(1)))
    return ENTITIES[e.toLowerCase()] ?? m
  })
const flatText = (html) => decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ')

/**
 * What a reader or an agent reads on a page: the body and title text without scripts, styles and
 * comments (so no flight payload, bundle code or SVG path data, which sits in attributes), plus each
 * JSON-LD block. The phone-word shapes and the bare area code token are checked on this text only.
 */
function readableText(html) {
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => decode(m[1]))
  const body = html.replace(/<(script|style)\b[^>]*>.*?<\/\1>/gs, ' ').replace(/<!--.*?-->/gs, '')
  return [flatText(body), ...jsonLd].join('\n')
}

/**
 * The visible text of an HTML page, two ways, so a claim split across elements is still found:
 * tags as spaces ("0.85 <button>F1</button>" reads "0.85 F1") and tags removed ("87.4<b>%</b>").
 * React's <!-- --> separators between adjacent text nodes are removed in both.
 */
function visibleTexts(html) {
  const body = html.replace(/<!--.*?-->/gs, '')
  return [flatText(body), decode(body.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ')]
}

const excerpt = (text, index, length) =>
  text
    .slice(Math.max(0, index - 50), index + length + 50)
    .replace(/\s+/g, ' ')
    .trim()

// ---- multi-agent: the text that does not belong to the multi-agent project -------------------------

/** Removes every element that carries data-project="<slug>", with its whole subtree, by matching its closing tag. */
function withoutOwnedElements(html, slug) {
  const open = new RegExp(`<([a-z][a-z0-9-]*)\\b[^>]*\\bdata-project="${escape(slug)}"[^>]*>`, 'i')
  let out = html
  for (let m = open.exec(out); m; m = open.exec(out)) {
    const tags = new RegExp(`<(/?)${m[1]}\\b[^>]*>`, 'gi')
    tags.lastIndex = m.index + m[0].length
    let depth = 1
    let end = out.length
    for (let t = tags.exec(out); t; t = tags.exec(out)) {
      depth += t[1] ? -1 : 1
      if (depth === 0) {
        end = t.index + t[0].length
        break
      }
    }
    out = `${out.slice(0, m.index)} ${out.slice(end)}`
  }
  return out
}

/**
 * An HTML page as the pieces of text that are not the project's own: each JSON-LD block whose @id is not
 * under /projects/<slug>; the title and description tags unless the page is that project's own page; and
 * the body text without scripts (the flight payload repeats the page) and without the project's elements.
 */
function htmlOutside(html, project) {
  const pieces = []
  const own = new RegExp(`/projects/${escape(project.slug)}(?:#|$)`)
  for (const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    let id = ''
    try {
      id = JSON.parse(decode(m[1]))['@id'] ?? ''
    } catch {
      // An unparsable block is checked as text.
    }
    if (!own.test(id)) pieces.push(decode(m[1]))
  }
  const canonical = /<link rel="canonical" href="([^"]*)"/.exec(html)?.[1] ?? ''
  const ownPage = own.test(canonical)
  let body = html.replace(/<script\b[^>]*>.*?<\/script>/gs, ' ').replace(/<!--.*?-->/gs, '')
  if (ownPage) {
    body = body.replace(/<title>.*?<\/title>/s, ' ')
  } else {
    const metas = /<meta (?:name|property)="(?:description|og:description|twitter:description|og:title|twitter:title)" content="([^"]*)"/g
    for (const m of html.matchAll(metas)) pieces.push(decode(m[1]))
  }
  pieces.push(flatText(withoutOwnedElements(body, project.slug)))
  return pieces
}

/**
 * Markdown or plain text as the lines that are not the project's own: its section (from a heading that
 * opens with its name to the next heading of the same or a higher level) and its llms.txt list item
 * ("- [Name](...)") are left out.
 */
function proseOutside(text, project) {
  const out = []
  let ownLevel = 0
  for (const line of text.split(/\r?\n/)) {
    const heading = /^(#{1,6})\s+(.*)$/.exec(line)
    if (heading) {
      const level = heading[1].length
      if (ownLevel && level <= ownLevel) ownLevel = 0
      if (!ownLevel && heading[2].trim().startsWith(project.name)) ownLevel = level
    }
    if (ownLevel || line.trimStart().startsWith(`- [${project.name}](`)) continue
    out.push(line)
  }
  return out
}

/**
 * A JSON body (the palette index) as its strings outside the project's own rows: an object that holds the
 * project's slug, its page path or a URL to it as a direct value is the project's own, with all it holds.
 */
function jsonOutside(text, project) {
  let data
  try {
    data = JSON.parse(text)
  } catch {
    return null
  }
  const own = new RegExp(`^(?:${escape(project.slug)}|(?:https?://[^/]+)?/projects/${escape(project.slug)}(?:#.*)?|project-${escape(project.slug)})$`)
  const out = []
  const visit = (v) => {
    if (typeof v === 'string') out.push(v)
    else if (Array.isArray(v)) v.forEach(visit)
    else if (v && typeof v === 'object') {
      if (Object.values(v).some((x) => typeof x === 'string' && own.test(x))) return
      Object.values(v).forEach(visit)
    }
  }
  visit(data)
  return out
}

/**
 * Checks one text. `kind` picks the extra rules: "html" adds the visible-text pass and reads the page
 * through htmlOutside for the multi-agent rule; "prose" (markdown, llms files, OG text) reads it through
 * proseOutside; "json" through jsonOutside; "data" (flight payloads, bundles) gets the plain rules only.
 * `owned` marks a text that is the multi-agent project's own (its OG card).
 */
function checkText(file, text, { kind, email, emailAllowed, project, terms, owned = false, describe = false }) {
  const hits = []
  const warnings = []
  const add = (rule, detail) => hits.push({ file, rule, detail })
  const texts = kind === 'html' ? [text, ...visibleTexts(text)] : [text]

  const seen = new Set()
  for (const t of texts) {
    for (const { term, re } of TERMS) {
      const m = re.exec(t)
      if (m && !seen.has(term)) {
        seen.add(term)
        add('banned', `"${term}" in ...${excerpt(t, m.index, m[0].length)}...`)
      }
    }
  }
  // Phone. On the raw text of every kind (HTML attributes and inline scripts, JSON bodies, flight payloads,
  // bundles, text files): a tel: link, a vCard TEL line and the two whole-number shapes. On readable text
  // only (page text and JSON-LD, text files, OG text; never flight payloads, bundles, JSON rows or SVG
  // path data, where digit runs are not copy): the phone-word shapes and the bare area code token.
  const readable = kind === 'html' ? readableText(text) : kind === 'prose' ? text : null
  const phone = phoneMarkup(text) ?? phoneNumber(text) ?? (readable !== null ? readablePhone(readable) : null)
  if (phone) add('phone', phone)
  if (texts.some((t) => hasPrivateTerm(t, terms))) add('private', 'a term from PRIVATE_TERMS')
  if (email && !emailAllowed && text.toLowerCase().includes(email)) add('email', 'the full email address')
  const run = CLOUD_RUN.exec(text)
  if (run) add('cloud-run', `"${run[0]}"`)

  const account = ACCOUNT_RE.exec(text.replace(/\\\//g, '/').replace(SHARED_URL, ''))
  if (account) {
    const flat = text.replace(/\\\//g, '/')
    const at = flat.search(ACCOUNT_RE)
    add('account', `${ACCOUNT} path outside the shared repository URLs: ...${excerpt(flat, at, ACCOUNT.length)}...`)
  }

  if (!owned && MULTI_AGENT.test(text) && B2.test(text)) {
    const outside =
      kind === 'html' ? htmlOutside(text, project) : kind === 'prose' ? proseOutside(text, project) : kind === 'json' ? jsonOutside(text, project) : null
    const piece = outside?.find((p) => MULTI_AGENT.test(p))
    if (piece) {
      const at = piece.search(MULTI_AGENT)
      add('multi-agent', `"multi-agent" outside ${project.slug} on a page that names B2 or Research Agent: ...${excerpt(piece, at, 11)}...`)
    }
  }

  if (describe) {
    const robots = /<meta name="robots" content="([^"]*)"/.exec(text)?.[1] ?? ''
    if (!/noindex/i.test(robots)) {
      const raw = /<meta name="description" content="([^"]*)"/.exec(text)?.[1]
      const length = raw === undefined ? 0 : decode(raw).length
      if (length < DESCRIPTION_MIN || length > DESCRIPTION_MAX) {
        warnings.push({ file, rule: 'description', detail: `meta description is ${length} characters (${DESCRIPTION_MIN} to ${DESCRIPTION_MAX})` })
      }
    }
  }
  return { hits, warnings }
}

function kindOf(rel) {
  if (rel.endsWith('.html')) return 'html'
  if (/\.json(\.body)?$/.test(rel)) return 'json'
  if (/\.(md|txt|vcf|xml|vtt|srt)$|\.(txt|vcf|xml)\.body$/.test(rel)) return 'prose'
  return 'data'
}

function walk(dir, visit) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name)
    if (entry.isDirectory()) walk(abs, visit)
    else if (entry.isFile()) visit(abs)
  }
}

/**
 * Scans the build. `app` is .next/server/app (its pages get the description warning, and its vCard
 * route may carry the email), `others` are folders served as they are, `og` the OG image texts,
 * `project` the multi-agent project ({ slug, name }), `terms` the private terms (privateTerms).
 */
function scan({ app, others = [], og = [], email, project, terms, base = ROOT }) {
  const hits = []
  const warnings = []
  const collect = (r) => {
    hits.push(...r.hits)
    warnings.push(...r.warnings)
  }
  const rel = (abs) => relative(base, abs).split(sep).join('/')
  const visitFile = (abs, { inApp }) => {
    const buf = readFileSync(abs)
    if (isBinary(buf)) return
    const r = rel(abs)
    const inner = inApp ? relative(app, abs).split(sep).join('/') : r
    const kind = kindOf(r)
    // A served page: in the app folder, not a Next internal (_not-found, _global-error) and not a segment.
    const describe = kind === 'html' && inApp && !/^_/.test(inner) && !inner.includes('.segments/')
    const emailAllowed = inApp && /^vcard\.vcf(\.[a-z]+|\/|$)/.test(inner)
    collect(checkText(r, buf.toString('utf8'), { kind, email, emailAllowed, project, terms, describe }))
  }
  if (app) walk(app, (abs) => visitFile(abs, { inApp: true }))
  for (const dir of others) if (existsSync(dir)) walk(dir, (abs) => visitFile(abs, { inApp: false }))
  for (const { name, text } of og) {
    const owned = name === `og-image:/projects/${project.slug}/opengraph-image`
    collect(checkText(name, text, { kind: 'prose', email, emailAllowed: false, project, terms, owned }))
  }
  return { hits, warnings }
}

/** The email address from links.email, the one field allowed to carry it, so this file never spells it out. */
function ownerEmail(profile) {
  return (profile.links?.email ?? '').replace(/^mailto:/i, '').toLowerCase()
}

/**
 * The text the OG images draw, from the same fields their modules read: the site card (title, name,
 * headline, first paper, first award, first degree) and one card per project (kind, name, outcome line
 * and the first three metrics). A superset is fine: every string here reaches a served image.
 */
function ogTexts(profile) {
  const { identity, publications, recognition, education, projects } = profile
  const site = [
    identity.title,
    identity.name,
    identity.headline,
    ...publications.slice(0, 1).flatMap((p) => [p.venue, p.status]),
    ...recognition.filter((r) => r.kind !== 'certification').slice(0, 1).flatMap((r) => [r.org, r.title]),
    ...education.slice(0, 1).flatMap((e) => [e.gpa ? `GPA ${e.gpa}` : e.abbr, `${e.degree}, ${e.field}, ${e.abbr}`]),
  ]
  return [
    { name: 'og-image:/opengraph-image', text: site.join('\n') },
    ...projects.map((p) => ({
      name: `og-image:/projects/${p.slug}/opengraph-image`,
      text: [p.kind, p.name, p.pitch.change, ...p.metrics.slice(0, 3).flatMap((m) => [m.value, m.label])].join('\n'),
    })),
  ]
}

function report({ hits, warnings }, scope) {
  for (const w of warnings) console.warn(`scan-build warning: ${w.file}: ${w.rule}: ${w.detail}`)
  if (hits.length === 0) {
    console.log(`scan-build ok: no banned claim or private detail in ${scope}${warnings.length ? ` (${warnings.length} warning(s) above)` : ''}`)
    return 0
  }
  console.error(`scan-build: ${hits.length} hit(s) in ${scope}:`)
  for (const h of hits.slice(0, 60)) console.error(` - ${h.file}: ${h.rule}: ${h.detail}`)
  if (hits.length > 60) console.error(` ... and ${hits.length - 60} more`)
  return 1
}

// ---- Self-test ----------------------------------------------------------------------------------
// Plants one fault per rule (and the clean controls each rule must let through) in a temporary build,
// then checks that exactly the planted faults are reported, and exactly the planted warning is printed.
function selfTest() {
  const dir = mkdtempSync(join(tmpdir(), 'scan-build-'))
  const app = join(dir, 'app')
  const pub = join(dir, 'public')
  const email = ['someone', 'example.org'].join('@')
  const project = { slug: 'world-engine', name: 'World Engine' }
  // The owner's area code (allowed: alone it does not reconstruct the number) and fictional 555-01xx numbers.
  const area = '77' + '4'
  // A fictional private name and its distinctive word, in place of the real terms, set in the variable
  // the real run reads, so the self-test goes through the same loader.
  process.env.PRIVATE_TERMS = 'Project Willow, willow'
  const terms = privateTerms('scan-build self-test')
  const page = (description, body, robots = 'index, follow', head = '') =>
    `<!DOCTYPE html><html><head><meta name="description" content="${description}"/><meta name="robots" content="${robots}"/>${head}</head><body>${body}</body></html>`
  const good = 'A'.repeat(155)
  const shared = `https://github.com/${ACCOUNT}/${SHARED_REPOS[2]}`
  const files = {
    // ---- Clean controls: none of these may be reported.
    'app/index.html': page(
      good,
      `<p>Code: ${shared}. Next sentence.</p><li data-project="${project.slug}"><div><h3>${project.name}</h3><div><p>A multi-agent world engine.</p></div></div></li><p>Research Agent ranks papers.</p><p>Rendered at 150x150, a value of 0.774, 1,774 rows, 17745 points, build a${area}5550142b, ISBN 9780131103627, 385,000+ papers, 2026-11-23, port 3130, version 1.2.3, a willowy hedge.</p><svg viewBox="0 0 800 800"><path d="M${area} 10L20 ${area}"/></svg><script>self.__next_f.push([1,"${area}"])</script>`,
    ),
    'app/research.html': page('Short.', '<p>Not found.</p>', 'noindex'),
    'app/vcard.vcf.body': `BEGIN:VCARD\nEMAIL:${email}\nEND:VCARD\n`,
    // The flight payload holds the whole page in one script; only the rendered body counts.
    'app/projects/flight.html': page(
      good,
      '<p>Four agents.</p><script>self.__next_f.push([1,"A multi-agent engine. Research Agent ranks papers at the B2 Foundation."])</script>',
    ),
    // The project's own page: its JSON-LD, title and description may call it multi-agent.
    'app/projects/own-page.html': page(
      'A multi-agent world engine.',
      `<script type="application/ld+json">{"@id":"https://x.dev/projects/${project.slug}#project","description":"A multi-agent world engine."}</script><p>Next: Research Agent.</p>`,
      'noindex',
      `<title>A multi-agent world engine</title><link rel="canonical" href="https://x.dev/projects/${project.slug}"/>`,
    ),
    'app/palette-ok.json.body': JSON.stringify([
      { id: 'project-b2', title: 'Research Agent', href: '/projects/b2' },
      { id: `project-${project.slug}`, title: project.name, hint: 'A multi-agent world engine', href: `/projects/${project.slug}` },
    ]),
    'app/projects/x.rsc': `["$","a",null,{"href":"${shared}"}],"${shared.replace(/\//g, '\\/')}\\"`,
    'public/md/clean.md': `Code: ${shared}.\n`,
    'public/md/own-section.md': `## Research Agent\n\nRanks papers.\n\n## ${project.name}\n\n### Approach\n\nA multi-agent world engine.\n\n## Other\n\nPlain.\n`,
    'public/md/llms-lines.md': `- [Research Agent](/projects/b2): ranks papers.\n- [${project.name}](/projects/${project.slug}): a multi-agent world engine.\n`,
    'public/md/no-b2.md': 'A multi-agent world engine, on a page about nothing else.\n',
    // The bare area code token is read from readable text only, never from JSON rows or flight payloads.
    'app/area-ok.json.body': JSON.stringify([{ id: 'stats', hint: `${area} projects`, value: area }]),
    'app/projects/area-ok.rsc': `1:["$","p",null,{"children":"${area} projects"}]\n`,
    // ---- Planted faults: one line per expected report below.
    'app/tip.html': page(good, '<p>F1 reached 0.85 <button>F1</button><span popover="manual">A score from 0 to 1.</span></p>'),
    'app/projects/b2.html': page(good, '<p>Research Agent is a multi-agent system.</p>'),
    'app/projects/b2-head.html': page(good, '<h3>Research Agent</h3><ul><li>Search rebuild.</li><li>A multi-agent pipeline.</li></ul>'),
    'app/projects/b2-ld.html': page(
      good,
      '<p>Search.</p><script type="application/ld+json">{"name":"Research Agent","description":"A multi-agent search tool."}</script>',
    ),
    'app/projects/b2-meta.html': page('A multi-agent search tool, the B2 Research Agent.' + 'A'.repeat(110), '<p>Search.</p>'),
    'app/palette-index.json.body': JSON.stringify([{ id: 'project-b2', title: 'Research Agent', hint: 'A multi-agent search', href: '/projects/b2' }]),
    'app/keywords.html': page(good, '<meta name="keywords" content="Python,Kubernetes,Docker"/><p>Stack.</p>'),
    'app/about.html': page('Too short a description.', `<p>Write to ${email}.</p>`),
    'app/tel.html': page(good, '<p><a href="tel:+15555550100">Call</a></p>'),
    'app/phone-a.txt.body': 'Call 555-0142.',
    'app/phone-b.txt.body': 'Office: 555 555 0142',
    'app/phone-c.txt.body': 'Number: (555) 555-0142',
    'app/phone-d.txt.body': `Call (${area}) now.`,
    'app/phone-e.txt.body': `Number: ${area}5550142`,
    'app/phone-f.txt.body': `Number: +1${area}5550142`,
    'app/phone-g.txt.body': `Number: +1 (${area}) 555-0142`,
    'app/phone-h.txt.body': 'Link: tel:+15555550142',
    'app/phone-i.txt.body': `Reach me at +1 ${area}.`,
    'app/phone-j.txt.body': `Cell: ${area}, evenings.`,
    'app/phone-k.txt.body': `Office ${area} 555 0142.`,
    'app/phone-l.txt.body': `Area code ${area}.`,
    'app/phone-m.txt.body': 'Number: +1 555.555.0142',
    // A number shape outside the readable text: in an attribute, a JSON route body or a flight payload.
    'app/phone-meta.html': page(`Reach Ankit at (${area}) 555-0142 for work.`.padEnd(155, 'A'), '<p>About.</p>'),
    'app/phone-og.html': page(good, '<p>About.</p>', 'index, follow', `<meta property="og:description" content="Reach me at +1 ${area} 555 0142."/>`),
    'app/phone-alt.html': page(good, `<p><img alt="Card for ${area}.555.0142" src="/card.png"/></p>`),
    'app/phone-aria.html': page(good, '<p><a aria-label="Office line (555) 555-0142" href="/contact">Office</a></p>'),
    'app/phone-route.json.body': JSON.stringify([{ id: 'contact', hint: `${area}5550142` }]),
    'app/projects/phone-flight.rsc': `1:["$","p",null,{"children":"Reach me at ${area}-555-0142"}]\n`,
    'app/phone-inline.html': page(good, `<p>About.</p><script>self.__next_f.push([1,"Reach me at (${area}) 555-0142"])</script>`),
    'app/private.html': page(good, '<p>Worked on Project <b>Willow</b> in 2026.</p>'),
    'public/md/private.md': 'Internal name: project-willow\n',
    'app/area.html': page(good, `<p>Reach me on ${area}.</p>`),
    'app/area-ld.html': page(good, `<p>Contact.</p><script type="application/ld+json">{"@type":"Person","telephone":"${area}"}</script>`),
    'public/md/area.md': `${area} projects\n`,
    'public/card.vcf': 'BEGIN:VCARD\nFN:Someone\nTEL;TYPE=CELL:+15555550100\nEND:VCARD\n',
    'app/llms.txt.body': `Deployed at https://agent-abc123.us-central1.run.app/search\n`,
    'public/md/pages.md': `Site: https://${ACCOUNT.toLowerCase()}.github.io/${SHARED_REPOS[2]}\n`,
    'public/md/tree.md': `Tree: ${shared}/tree/main\n`,
    'public/md/other.md': `Other: https://github.com/${ACCOUNT}/another-repo.\n`,
    'public/md/git.md': `Clone: ${shared}.git\n`,
    'public/md/claim.md': 'It scored 50x faster.\n',
    'public/md/b2-head.md': '## Research Agent\n\nSearch rebuild.\n\n- A multi-agent pipeline.\n',
    'public/md/glossary.md': '# Glossary\n\n- Research Agent: a paper search tool.\n- Orchestration: a multi-agent pattern.\n',
  }
  const expected = [
    'app/tip.html|banned',
    'app/projects/b2.html|multi-agent',
    'app/projects/b2-head.html|multi-agent',
    'app/projects/b2-ld.html|multi-agent',
    'app/projects/b2-meta.html|multi-agent',
    'app/palette-index.json.body|multi-agent',
    'app/keywords.html|banned',
    'app/about.html|email',
    'app/tel.html|phone',
    ...'abcdefghijklm'.split('').map((c) => `app/phone-${c}.txt.body|phone`),
    'app/phone-meta.html|phone',
    'app/phone-og.html|phone',
    'app/phone-alt.html|phone',
    'app/phone-aria.html|phone',
    'app/phone-route.json.body|phone',
    'app/projects/phone-flight.rsc|phone',
    'app/phone-inline.html|phone',
    'app/area.html|phone',
    'app/area-ld.html|phone',
    'public/md/area.md|phone',
    'public/card.vcf|phone',
    'app/private.html|private',
    'public/md/private.md|private',
    'og-image:/projects/w/opengraph-image|private',
    'app/llms.txt.body|cloud-run',
    'public/md/pages.md|account',
    'public/md/tree.md|account',
    'public/md/other.md|account',
    'public/md/git.md|account',
    'public/md/claim.md|banned',
    'public/md/b2-head.md|multi-agent',
    'public/md/glossary.md|multi-agent',
    'og-image:/projects/x/opengraph-image|banned',
    'og-image:/projects/b2/opengraph-image|multi-agent',
  ]
  const expectedWarnings = ['app/about.html|description']
  try {
    for (const [name, content] of Object.entries(files)) {
      const abs = join(dir, name)
      mkdirSync(dirname(abs), { recursive: true })
      writeFileSync(abs, content)
    }
    const og = [
      { name: 'og-image:/opengraph-image', text: 'Clean title\nClean subtitle' },
      { name: 'og-image:/projects/x/opengraph-image', text: 'Project\nIt edged past the baseline.' },
      { name: 'og-image:/projects/b2/opengraph-image', text: 'Research Agent\nA multi-agent search.' },
      { name: 'og-image:/projects/w/opengraph-image', text: 'Evaluation\nBuilt for WILLOW.' },
      { name: `og-image:/projects/${project.slug}/opengraph-image`, text: `${project.name}\nA multi-agent engine, unlike Research Agent.` },
    ]
    const { hits, warnings } = scan({ app, others: [pub], og, email, project, terms, base: dir })
    const key = (h) => `${h.file}|${h.rule}`
    const missing = [
      ...expected.filter((e) => !hits.some((h) => key(h) === e)),
      ...expectedWarnings.filter((e) => !warnings.some((w) => key(w) === e)).map((e) => `${e} (warning)`),
    ]
    const extra = [...hits.filter((h) => !expected.includes(key(h))), ...warnings.filter((w) => !expectedWarnings.includes(key(w)))]
    if (missing.length || extra.length) {
      console.error('scan-build self-test FAILED')
      for (const m of missing) console.error(` - not reported: ${m}`)
      for (const h of extra) console.error(` - false alarm: ${h.file}: ${h.rule}: ${h.detail}`)
      return 1
    }
    console.log(
      `scan-build self-test ok: ${expected.length} planted faults reported, ${expectedWarnings.length} planted warning printed, no false alarms`,
    )
    return 0
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

// ---- Entry point --------------------------------------------------------------------------------
if (process.argv.includes('--self-test')) process.exit(selfTest())
const app = join(ROOT, '.next', 'server', 'app')
if (!existsSync(app)) {
  console.error('scan-build: .next/server/app is missing; run `npm run build` first')
  process.exit(2)
}
const profile = JSON.parse(readFileSync(join(ROOT, 'content', 'profile.json'), 'utf8'))
const multiAgent = profile.projects.find((p) => p.slug === MULTI_AGENT_PROJECT)
const result = scan({
  app,
  others: [join(ROOT, '.next', 'static'), join(ROOT, 'public')],
  og: ogTexts(profile),
  email: ownerEmail(profile),
  // Without that project in profile.json, no text may call anything multi-agent next to B2.
  project: { slug: MULTI_AGENT_PROJECT, name: multiAgent?.name ?? MULTI_AGENT_PROJECT },
  terms: privateTerms('scan-build'),
})
process.exit(report(result, '.next/server/app, .next/static, public and the OG image text'))
