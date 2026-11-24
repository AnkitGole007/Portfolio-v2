// Drift guard: fails the build when profile.json contradicts the verified record or breaks the copy rules.
//
//   node scripts/check-profile.mjs                                  checks content/profile.json
//   node scripts/check-profile.mjs <file>                           checks another copy of the model
//   node scripts/check-profile.mjs <file> --expect-fail "<text>"    passes only when the check fails
//                                                                   and an error names <text>
//
// Exit 0 when the file passes (or, with --expect-fail, when it fails as expected), 1 otherwise.
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BANNED, hasPrivateTerm, phoneMarkup, privateTerms, readablePhone } from './banned.mjs'

const args = process.argv.slice(2)
const expectAt = args.indexOf('--expect-fail')
const expected = expectAt >= 0 ? args[expectAt + 1] : null
if (expectAt >= 0 && !expected) {
  console.error('check-profile: --expect-fail needs the text an error must name')
  process.exit(2)
}
const fileArg = args.find((a, i) => !a.startsWith('--') && !(expectAt >= 0 && i === expectAt + 1))
const profilePath = fileArg ? resolve(fileArg) : fileURLToPath(new URL('../content/profile.json', import.meta.url))
const label = fileArg ?? 'profile.json'
const peopleUrl = new URL('../content/people.json', import.meta.url)
const raw = readFileSync(profilePath, 'utf8')
const p = JSON.parse(raw)
const errors = []
const warnings = []
const today = new Date().toISOString().slice(0, 7)
const words = (s) => (typeof s === 'string' ? s.trim().split(/\s+/).filter(Boolean).length : 0)

/** Every string value in the model with its JSON path ("projects[2].pitch.change"). */
function strings(value, path = '', out = []) {
  if (typeof value === 'string') out.push({ path, text: value })
  else if (Array.isArray(value)) value.forEach((v, i) => strings(v, `${path}[${i}]`, out))
  else if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) strings(v, path ? `${path}.${k}` : k, out)
  return out
}
const all = strings(p)
// Copy is every string except links, ids, dates and file paths: the values a reader sees as prose.
const isUrl = (s) => /^(https?:|mailto:|\/)/.test(s)
const copy = all.filter(({ path, text }) => !isUrl(text) && !/(^links\.|\.links\.|\.(slug|id|start|end|date|src)$|\.repo$)/.test(path))

// ---- Dashes and punctuation (writing rules, context section 14) ----------------------------------
// Em, en, figure and horizontal-bar dashes, built from code points so this source stays free of them.
const DASH = new RegExp('[' + [0x2012, 0x2013, 0x2014, 0x2015].map((c) => String.fromCharCode(c)).join('') + ']')
for (const { path, text } of all) if (DASH.test(text)) errors.push(`dash character in ${path}: "${text.slice(0, 80)}"`)
for (const { path, text } of copy) {
  if (text.includes(';')) errors.push(`semicolon in copy at ${path}: "${text.slice(0, 80)}"`)
  if (/\s-\s|--/.test(text)) errors.push(`hyphen used as a dash at ${path}: "${text.slice(0, 80)}"`)
}

// ---- Banned claims and private data (plan Global Constraints) -------------------------------------
// BANNED, the private terms (read from the PRIVATE_TERMS environment variable) and the phone shapes live
// in scripts/banned.mjs, shared with the built-output scan (scripts/scan-build.mjs). Here, stricter for the
// content model: also any US phone shape without separators, "+1 xxx xxx xxxx" or ten digits in a row.
const PHONE = /(\+?1[\s.-]?)?\(?\b\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/
const PRIVATE = privateTerms('check-profile')
for (const { path, text } of all) {
  for (const term of BANNED) {
    if (text.toLowerCase().includes(term.toLowerCase())) errors.push(`banned string "${term}" in ${path}`)
  }
  // The site carries no phone number at all, so any phone shape fails; the guard never holds the real one.
  if (PHONE.test(text) || readablePhone(text) || phoneMarkup(text)) errors.push(`phone number in ${path}`)
  if (hasPrivateTerm(text, PRIVATE)) errors.push(`a term from PRIVATE_TERMS in ${path}`)
}
// The address lives only in links.email (copied in parts by CopyEmail, attached only to the vCard).
// Read from links.email, the one field allowed to carry it, so the guard never spells out the address.
const EMAIL = (p.links?.email ?? '').replace(/^mailto:/i, '').toLowerCase()
for (const { path, text } of all) {
  if (EMAIL && path !== 'links.email' && text.toLowerCase().includes(EMAIL)) errors.push(`email address in ${path}; only links.email may carry it`)
}
if (p.identity?.phone !== undefined) errors.push('identity.phone must not exist; the site carries no phone number')
if (p.identity?.email !== undefined) errors.push('identity.email must not exist; the address lives only in links.email')

// Ankit's banned words (context section 14); RealmWeaver is a name, so whole words only. "navigate" is
// banned in its figurative use, so the verb forms fail and the literal noun ("AR navigation") passes.
const BANNED_WORDS = /\b(delve\w*|navigat(?:e|es|ed|ing)|underscor\w*|leverag\w*|showcas\w*|foster\w*|harness\w*|robust\w*|comprehensive|seamless\w*|meticulous\w*|crucial\w*|vital\w*|landscape\w*|realm|realms|tapestry|testament|journey\w*)\b/i
for (const { path, text } of copy) {
  const m = BANNED_WORDS.exec(text)
  if (m) errors.push(`banned word "${m[0]}" at ${path}`)
}

// ---- Entry-specific facts ------------------------------------------------------------------------
const entryText = (entry) => strings(entry).map((s) => s.text).join(' \n ')

// B2 Research Agent: a staged retrieval pipeline, never multi-agent, never an agent framework.
const b2Entries = [
  ...(p.projects ?? []).filter((x) => /research agent|b2/i.test(`${x.slug} ${x.name} ${x.affiliation}`)),
  ...(p.experience ?? []).filter((x) => /b2 foundation|benevolent bandwidth/i.test(x.org)),
]
for (const { text, path } of all) if (/research agent|\bB2\b/i.test(text)) b2Entries.push({ text, path })
for (const e of b2Entries) {
  const t = typeof e.text === 'string' ? e.text : entryText(e)
  const where = e.slug ?? e.id ?? e.path
  if (/multi[\s-]?agent/i.test(t)) errors.push(`${where}: B2 Research Agent described as multi-agent`)
  if (/langchain|langgraph|crewai/i.test(t)) errors.push(`${where}: B2 Research Agent credited to an agent framework`)
}

// PayPal sponsors a WPI Graduate Qualifying Project. It is never an employer, and the result "matched" XGBoost.
for (const e of p.experience ?? []) {
  if (/paypal/i.test(e.org)) errors.push(`${e.id}: PayPal in experience[].org; PayPal is a project sponsor, never an employer`)
}
for (const key of ['title', 'headline', 'tagline', 'summary']) {
  if (/paypal/i.test(p.identity?.[key] ?? '')) errors.push(`identity.${key} names PayPal; the summary must not imply employment there`)
}
// The About letter: optional, one non-empty paragraph per string, at most 60 words each, and no PayPal (same reason as the summary).
const story = p.identity?.story
if (story !== undefined) {
  if (!Array.isArray(story) || story.length === 0) errors.push('identity.story must be a non-empty list of paragraphs')
  else
    story.forEach((s, i) => {
      if (typeof s !== 'string' || !words(s)) errors.push(`identity.story[${i}] must be a non-empty string`)
      else if (words(s) > 60) errors.push(`identity.story[${i}] is ${words(s)} words (max 60)`)
      if (/paypal/i.test(s ?? '')) errors.push(`identity.story[${i}] names PayPal; the story must not imply employment there`)
    })
}
for (const { path, text } of all) {
  if (/paypal|xgboost/i.test(text) && /\b(beat|beats|beating|outperform\w*|surpass\w*)\b|edged past/i.test(text)) {
    errors.push(`${path}: the PayPal result matched the baselines; do not say beat, outperformed or edged past`)
  }
}
const paypal = (p.projects ?? []).find((x) => /paypal/i.test(x.slug))
if (paypal && paypal.experienceId) errors.push(`${paypal.slug}: experienceId must be null; PayPal is not an employer`)

// PRISEM is research: never published, accepted or peer reviewed.
for (const e of [...(p.projects ?? []), ...(p.experience ?? [])].filter((x) => /prisem/i.test(entryText(x)))) {
  if (/\b(published|accepted|peer[\s-]?reviewed|vldb)\b/i.test(entryText(e))) {
    errors.push(`${e.slug ?? e.id}: PRISEM is research; never published, accepted or peer reviewed`)
  }
}

// Atos was an IT operations role.
for (const e of (p.experience ?? []).filter((x) => /atos/i.test(x.org))) {
  if (/software engineer/i.test(entryText(e))) errors.push(`${e.id}: Atos was an IT operations role, not software engineering`)
}

// Fixed dates and titles (plan Global Constraints, context sections 4 and 5).
const wpi = (p.education ?? []).find((e) => e.abbr === 'WPI')
if (!wpi || wpi.gpa !== '3.88') errors.push('WPI GPA must be 3.88')
if (wpi && (wpi.start !== '2024-08' || wpi.end !== '2026-05')) errors.push('WPI MS dates must be 2024-08 to 2026-05')
if (/\b3\.83\b/.test(raw)) errors.push('3.83 found; the GPA is 3.88')
const handshake = (p.experience ?? []).find((e) => /handshake/i.test(e.org))
if (!handshake) errors.push('Handshake AI experience entry missing')
else {
  if (handshake.org !== 'Handshake AI' || handshake.role !== 'AI Trainer') errors.push(`${handshake.id}: must read "AI Trainer, Handshake AI"`)
  if (handshake.start !== '2026-08' || handshake.end !== null) errors.push(`${handshake.id}: dates must be 2026-08 to present`)
}
// Found by id first, so renaming the org string cannot silently switch this check off.
const yossi = (p.experience ?? []).find((e) => e.id === 'wpi-yossi') ?? (p.experience ?? []).find((e) => /yossi/i.test(e.org))
if (!yossi) errors.push('WPI YOSSI Lab AI Researcher entry missing (id wpi-yossi)')
else if (yossi.end !== '2026-03' || yossi.status === 'ongoing') errors.push(`${yossi.id}: the AI Researcher role ended 2026-03`)

// Work authorization: shown only with the stated wording.
const AUTHORIZATION = 'OPT starting June 2026, with the 24-month STEM OPT extension available, about 3 years total. Will need H-1B sponsorship later.'
const a = p.identity?.availability
if (p.identity?.showWorkAuthorization === true && a?.workAuthorization !== AUTHORIZATION) {
  errors.push('identity.availability.workAuthorization must use the stated wording exactly')
}
if (p.identity?.showWorkAuthorization !== true && a?.workAuthorization) {
  errors.push('workAuthorization is set but identity.showWorkAuthorization is not true')
}

// Portrait: null, or a file under public/.
const portrait = p.identity?.portrait
if (portrait) {
  const file = new URL(`../public${portrait.src}`, import.meta.url)
  if (!portrait.alt) errors.push('identity.portrait needs alt text')
  if (!existsSync(file)) errors.push(`identity.portrait.src ${portrait.src} does not exist under public/`)
}

// Hero lines: the tools are skills the profile lists, the result is one sentence, and the proof strip holds at most four chips.
const allSkills = new Set(Object.values(p.skills ?? {}).flat())
for (const tool of p.identity?.tools ?? []) {
  if (!allSkills.has(tool)) errors.push(`identity.tools: "${tool}" is not in skills`)
}
if (p.identity?.result !== undefined && (typeof p.identity.result !== 'string' || !/\.$/.test(p.identity.result))) {
  errors.push('identity.result must be one sentence ending with a period')
}
if (p.identity?.proof !== undefined && (!Array.isArray(p.identity.proof) || p.identity.proof.length > 4 || p.identity.proof.some((c) => typeof c !== 'string' || !c.trim()))) {
  errors.push('identity.proof must be a list of at most four chips')
}

// hiddenRepos: bare repository names (no owner, no URL), read by the GitHub sync, panel and feed.
if (p.hiddenRepos !== undefined && (!Array.isArray(p.hiddenRepos) || p.hiddenRepos.some((n) => typeof n !== 'string' || !n || /[/\s]/.test(n)))) {
  errors.push('hiddenRepos must be a list of bare repository names')
}

// Writing: titled, labelled by kind, and linked only with a confirmed URL.
for (const w of p.writing ?? []) {
  if (!w.title || !w.kind) errors.push('writing entries need a title and a kind')
  if (w.url !== null && !/^https:\/\//.test(w.url ?? '')) errors.push(`writing "${w.title}": url must be null or https`)
}

// ---- Dates and status ----------------------------------------------------------------------------
if (/pursuing/i.test(raw)) errors.push('"pursuing" found; the degree is complete')
for (const list of [p.education, p.experience, p.research, p.projects]) {
  for (const e of list ?? []) {
    const id = e.id ?? e.slug
    if (e.end && e.end < today && e.status === 'ongoing') errors.push(`${id}: ended ${e.end} but marked ongoing`)
    if (e.end && e.status === 'ongoing') errors.push(`${id}: has an end date but is marked ongoing`)
    // An undated entry (start null) carries no end either; only a dated one is ongoing by having no end.
    if (e.start && e.end === null && e.status !== 'ongoing') errors.push(`${id}: no end date but status ${e.status}`)
    if (e.end && e.start && e.end < e.start) errors.push(`${id}: ends before it starts`)
  }
}
for (const pub of p.publications ?? []) {
  if (!pub.venueUrl) errors.push(`publication ${pub.id} lacks venueUrl`)
}

// ---- Projects ------------------------------------------------------------------------------------
// Unique slugs, summaries at most 40 words, a three-key pitch at 24 words or fewer each,
// problem and approach at most 70 words, highlights at most 14 words.
const slugs = new Set()
for (const pr of p.projects) {
  if (slugs.has(pr.slug)) errors.push(`duplicate slug ${pr.slug}`)
  slugs.add(pr.slug)
  if (!pr.summary || words(pr.summary) > 40) errors.push(`${pr.slug}: summary missing or over 40 words`)
  if (words(pr.problem) > 70) errors.push(`${pr.slug}: problem over 70 words`)
  if (words(pr.approach) > 70) errors.push(`${pr.slug}: approach over 70 words`)
  if (!pr.pitch || typeof pr.pitch !== 'object') {
    errors.push(`${pr.slug}: missing pitch`)
  } else {
    for (const key of ['problem', 'action', 'change']) {
      const n = words(pr.pitch[key])
      if (!n) errors.push(`${pr.slug}: pitch.${key} missing`)
      else if (n > 24) errors.push(`${pr.slug}: pitch.${key} is ${n} words (max 24)`)
    }
  }
  for (const [i, h] of (pr.highlights ?? []).entries()) {
    if (words(h) > 14) errors.push(`${pr.slug}: highlight ${i + 1} is ${words(h)} words (max 14)`)
  }
  // Metrics are outcomes or measured quantities: every value carries a number, and team size is not one.
  for (const m of pr.metrics ?? []) {
    if (!/\d/.test(m.value)) errors.push(`${pr.slug}: metric "${m.label}" has no number ("${m.value}"); move it to a descriptive field`)
    if (/team size/i.test(m.label)) errors.push(`${pr.slug}: team size is not a metric; say it in the approach or the pitch`)
  }
  // role: the owner's role as the data states it, short. shipped: { label } for an outside user or a public release.
  if (pr.role !== undefined && (typeof pr.role !== 'string' || !words(pr.role) || words(pr.role) > 10)) {
    errors.push(`${pr.slug}: role must be a string of 1 to 10 words`)
  }
  if (pr.shipped !== undefined) {
    if (!pr.shipped || typeof pr.shipped.label !== 'string' || !words(pr.shipped.label) || words(pr.shipped.label) > 6) {
      errors.push(`${pr.slug}: shipped must be { label } with 1 to 6 words`)
    }
  }
  // earlier: an older build kept for the record, never featured.
  if (pr.earlier && pr.featured) errors.push(`${pr.slug}: earlier work cannot be featured`)
  // pipeline: ordered stages, each a label and a count (null when no verified number exists).
  for (const stage of pr.pipeline ?? []) {
    if (!stage.label || !(stage.count === null || Number.isFinite(stage.count))) errors.push(`${pr.slug}: pipeline stages need a label and a number or null`)
  }
}

// coreSkills: for every skills group, exactly five names taken from that group.
if (!p.coreSkills || typeof p.coreSkills !== 'object') {
  errors.push('coreSkills missing')
} else {
  for (const [group, list] of Object.entries(p.skills)) {
    const core = p.coreSkills[group]
    if (!Array.isArray(core) || core.length !== 5) errors.push(`coreSkills["${group}"] must list exactly 5 skills`)
    else for (const name of core) if (!list.includes(name)) errors.push(`coreSkills["${group}"]: "${name}" is not in skills`)
  }
  for (const group of Object.keys(p.coreSkills)) if (!p.skills[group]) errors.push(`coreSkills["${group}"] has no skills group`)
}

// Glossary tips: one sentence of 12 to 25 words, no em or en dash, unique terms.
const glossaryUrl = new URL('../content/glossary.json', import.meta.url)
if (existsSync(glossaryUrl)) {
  const glossaryRaw = readFileSync(glossaryUrl, 'utf8')
  if (DASH.test(glossaryRaw)) errors.push('em dash or en dash found in glossary.json')
  const terms = new Set()
  for (const g of JSON.parse(glossaryRaw)) {
    if (terms.has(g.term)) errors.push(`glossary: duplicate term ${g.term}`)
    terms.add(g.term)
    const n = words(g.tip)
    if (n < 12 || n > 25) errors.push(`glossary ${g.term}: tip is ${n} words (12 to 25)`)
    if (/[.!?]\s+\S/.test(g.tip.trim())) errors.push(`glossary ${g.term}: tip must be one sentence`)
  }
}
for (const e of p.experience) {
  for (const [i, h] of (e.highlights ?? []).entries()) {
    if (words(h) > 16) errors.push(`${e.id}: highlight ${i + 1} is ${words(h)} words (max 16)`)
  }
}

// resumeMaster (context section 10): the roles and projects /resume prints. Each item names a real entry
// once, carries a whole-number cap of 1 to 10, holds 1 to `max` bullets, and every bullet is copied
// verbatim from that entry (an experience highlight; a project highlight, pitch action or pitch change),
// so the resume can never say more than the verified content model.
if (p.resumeMaster !== undefined) {
  const rm = p.resumeMaster
  const lists = [
    { name: 'experience', key: 'id', entries: new Map((p.experience ?? []).map((e) => [e.id, e])), allowed: (e) => e.highlights ?? [] },
    {
      name: 'projects',
      key: 'slug',
      entries: new Map((p.projects ?? []).map((x) => [x.slug, x])),
      allowed: (x) => [...(x.highlights ?? []), x.pitch?.action, x.pitch?.change].filter(Boolean),
    },
  ]
  if (!rm || typeof rm !== 'object') errors.push('resumeMaster must be an object with experience and projects lists')
  else
    for (const { name, key, entries, allowed } of lists) {
      const items = rm[name]
      if (!Array.isArray(items)) {
        errors.push(`resumeMaster.${name} must be a list`)
        continue
      }
      const seen = new Set()
      items.forEach((item, i) => {
        const where = `resumeMaster.${name}[${i}]`
        const entry = entries.get(item?.[key])
        if (!entry) errors.push(`${where}: ${key} "${item?.[key]}" is not in ${name}`)
        if (seen.has(item?.[key])) errors.push(`${where}: ${key} "${item?.[key]}" is listed twice`)
        seen.add(item?.[key])
        if (!Number.isInteger(item?.max) || item.max < 1 || item.max > 10) errors.push(`${where}: max must be a whole number from 1 to 10`)
        if (!Array.isArray(item?.bullets) || item.bullets.length === 0) {
          errors.push(`${where}: bullets must be a non-empty list`)
          return
        }
        if (Number.isInteger(item.max) && item.bullets.length > item.max) {
          errors.push(`${where}: ${item.bullets.length} bullets exceed the cap of ${item.max}`)
        }
        if (!entry) return
        const source = new Set(allowed(entry))
        item.bullets.forEach((b, j) => {
          if (!source.has(b)) errors.push(`${where}.bullets[${j}] is not verbatim from ${name} "${item[key]}": "${String(b).slice(0, 60)}"`)
        })
      })
    }
}

// now: ISO date, 3 or 4 lines, warn (do not fail) when older than 120 days.
if (!p.now || !Array.isArray(p.now.lines) || p.now.lines.length < 3 || p.now.lines.length > 4) {
  errors.push('now must carry 3 or 4 lines')
}
if (!p.now || !/^\d{4}-\d{2}-\d{2}$/.test(p.now.date) || Number.isNaN(Date.parse(p.now.date))) {
  errors.push('now.date must be an ISO date (YYYY-MM-DD)')
} else {
  const ageDays = Math.floor((Date.now() - Date.parse(p.now.date)) / 86_400_000)
  if (ageDays > 120) warnings.push(`now.date is ${ageDays} days old; refresh the now lines`)
}

// recommendations[].person must match a slug in people.json when present.
const people = existsSync(peopleUrl) ? JSON.parse(readFileSync(peopleUrl, 'utf8')) : null
const peopleSlugs = new Set(Array.isArray(people) ? people.map((x) => x.slug) : [])
for (const r of p.recommendations) {
  if (r.person === undefined) continue
  if (!people) errors.push(`recommendation ${r.name}: person set but content/people.json is missing`)
  else if (!peopleSlugs.has(r.person)) errors.push(`recommendation ${r.name}: person "${r.person}" not in people.json`)
}

for (const w of warnings) console.warn(`${label} warning: ${w}`)

if (expected !== null) {
  // Negative test: the file must fail, and one error must name the expected text.
  if (!errors.length) {
    console.error(`check-profile: expected ${label} to fail on "${expected}", but it passed`)
    process.exit(1)
  }
  if (!errors.some((e) => e.includes(expected))) {
    console.error(`check-profile: ${label} failed, but no error names "${expected}":\n - ${errors.join('\n - ')}`)
    process.exit(1)
  }
  console.log(`check-profile: ${label} fails as expected (${errors.length} error(s)):\n - ${errors.join('\n - ')}`)
  process.exit(0)
}
if (errors.length) {
  console.error(`${label} drift guard failed:\n - ` + errors.join('\n - '))
  process.exit(1)
}
console.log(`${label} ok: ${p.projects.length} projects, ${p.publications.length} publications, ${p.experience.length} roles, now ${p.now.date}`)
