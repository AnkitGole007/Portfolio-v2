#!/usr/bin/env node
// Identity guard: fails when the previous owner of this engine is still named anywhere in the repo.
// Walks every file under the repo root and checks its path and, for text files, its contents.
//
//   node scripts/check-identity.mjs                    source tree only
//   node scripts/check-identity.mjs --build            also the built pages under .next/server/app
//   node scripts/check-identity.mjs --skip <path>      leave out a file or folder (repeatable)
//
// Exit 0 when nothing matches, 1 with one line per hit otherwise.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SELF = relative(ROOT, fileURLToPath(import.meta.url)).split(sep).join('/')

// Assembled from parts so the terms read differently here than they match.
const TERMS = ['shr' + 'eya', 'boy' + 'ane', 'son' + 'ica', 'shreyaboyane\\.dev', 'latent' + '-cot', 'skip' + 'legal', 'einstein' + '-vision', 'robo' + 'fusion']
const PATTERN = new RegExp(TERMS.join('|'), 'i')

// The previous owner is a real teammate on two of the new owner's projects, so her name is allowed as
// this exact string and nowhere else: as an item of a `team` array in a content JSON file, on a "Team:"
// line of the markdown mirrors (public/md, generated from those arrays), and in the built pages
// (--build), which render the same arrays. Any other spelling, and the name in any other field, is a hit.
const TEAM_ALLOW = ['Shr' + 'eya Boy' + 'ane']
const withoutTeam = (text) => TEAM_ALLOW.reduce((s, name) => s.split(name).join(''), text)
const TEAM_LINE = /^(- )?Team: /
const TEAM_ITEM = /\.team\[\d+\]$/

// Three of the new owner's team projects live in the previous owner's GitHub account. These exact
// URLs are allowed as a project `repo` value in a content JSON file, and in the markdown mirrors and
// built pages that render those fields. Any other URL or path on that account is still a hit.
const REPO_OWNER = 'https://github.com/' + 'Son' + 'ica-B/'
const REPO_ALLOW = ['TumorLytix', 'RealmWeaver-MADWE', 'TrendED'].map((name) => REPO_OWNER + name)
const REPO_ITEM = /^projects\[\d+\]\.repo$/
// Longest first, so a URL that extends another is removed whole. A following letter, digit, "/" or "-"
// keeps the match from counting, and so does a "." followed by one of those, so "/TrendED.github.io",
// "/TrendED.git" and "/TrendED/tree/x" still fail while a sentence's period ("... /TrendED.") passes.
const withoutRepos = (text) =>
  [...REPO_ALLOW]
    .sort((a, b) => b.length - a.length)
    .reduce((s, url) => s.replace(new RegExp(url.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&') + '(?![\\w/-]|\\.[\\w/-])', 'g'), ''), text)

// Folders that are not part of the site: git data, dependencies, build output (checked only with
// --build), and the planning notes, which name the previous owner by necessity.
const SKIP = new Set(['.git', 'node_modules', '.next', '.vercel', 'docs/superpowers', '.superpowers', SELF])

const args = process.argv.slice(2)
const build = args.includes('--build')
for (let i = 0; i < args.length; i += 1) {
  if (args[i] !== '--skip') continue
  const value = args[i + 1]
  if (!value) {
    console.error('check-identity: --skip needs a path')
    process.exit(2)
  }
  SKIP.add(value.replace(/\\/g, '/').replace(/^\.\//, '').replace(/\/+$/, ''))
  i += 1
}

const skipped = (rel) => [...SKIP].some((s) => rel === s || rel.startsWith(`${s}/`))

/** Binary when the first 8 KB hold a NUL byte; only the path of a binary file is checked. */
const isBinary = (buf) => buf.subarray(0, 8192).includes(0)

const hits = []

/** Checks every key and string value of a JSON document by its path; null when the text is not JSON. */
function jsonHits(rel, text) {
  let data
  try {
    data = JSON.parse(text)
  } catch {
    return null
  }
  const out = []
  const visit = (value, path) => {
    if (typeof value === 'string') {
      const teamCredit = TEAM_ITEM.test(path) && TEAM_ALLOW.includes(value)
      const sharedRepo = REPO_ITEM.test(path) && REPO_ALLOW.includes(value)
      const m = teamCredit || sharedRepo ? null : PATTERN.exec(value)
      if (m) out.push(`${rel}: ${path}: "${m[0]}" in ${value.slice(0, 140)}`)
    } else if (Array.isArray(value)) {
      value.forEach((item, i) => visit(item, `${path}[${i}]`))
    } else if (value && typeof value === 'object') {
      for (const [key, item] of Object.entries(value)) {
        const at = path ? `${path}.${key}` : key
        const k = PATTERN.exec(key)
        if (k) out.push(`${rel}: key ${at}: "${k[0]}"`)
        visit(item, at)
      }
    }
  }
  visit(data, '')
  return out
}

function checkFile(abs, rel, { built }) {
  const name = PATTERN.exec(rel)
  if (name) hits.push(`${rel}: file name contains "${name[0]}"`)
  const buf = readFileSync(abs)
  if (isBinary(buf)) return
  const text = buf.toString('utf8')
  if (!built && rel.endsWith('.json')) {
    const found = jsonHits(rel, text)
    if (found) {
      hits.push(...found)
      return
    }
  }
  const mirror = rel.startsWith('public/md/')
  text.split(/\r?\n/).forEach((line, i) => {
    const team = built || (mirror && TEAM_LINE.test(line)) ? withoutTeam(line) : line
    const checked = built || mirror ? withoutRepos(team) : team
    const m = PATTERN.exec(checked)
    if (m) hits.push(`${rel}:${i + 1}: "${m[0]}" in ${line.trim().slice(0, 140)}`)
  })
}

function walk(dir, { honourSkip, built }) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name)
    const rel = relative(ROOT, abs).split(sep).join('/')
    if (honourSkip && skipped(rel)) continue
    if (entry.isDirectory()) walk(abs, { honourSkip, built })
    else if (entry.isFile()) checkFile(abs, rel, { built })
  }
}

walk(ROOT, { honourSkip: true, built: false })

if (build) {
  const builtDir = join(ROOT, '.next', 'server', 'app')
  if (!existsSync(builtDir)) {
    console.error('check-identity: .next/server/app is missing; run `npm run build` first')
    process.exit(2)
  }
  walk(builtDir, { honourSkip: false, built: true })
}

const scope = build ? 'source and build' : 'source'
if (hits.length) {
  console.error(`check-identity: ${hits.length} hit(s) in the ${scope}:`)
  for (const h of hits) console.error(` - ${h}`)
  process.exit(1)
}
console.log(`check-identity ok: no previous-owner identity in the ${scope}`)
