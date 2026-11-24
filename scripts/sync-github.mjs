#!/usr/bin/env node
// Refreshes content/github.json, the build-time GitHub snapshot that lib/content.ts imports.
// Runs on prebuild before check-profile. Any failure (offline, rate limit, bad JSON) keeps the
// committed file and exits 0 with a warning, so a build never depends on the GitHub API.
// The account is the one profile.json links to (links.github), the same login lib/content.ts
// exports as `githubLogin`.
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'content', 'github.json')
const TIMEOUT_MS = 15_000

/** "https://github.com/AnkitGole007" -> "AnkitGole007"; empty when profile.json has no GitHub link. */
const profile = JSON.parse(readFileSync(join(ROOT, 'content', 'profile.json'), 'utf8'))
const USER = (profile.links?.github ?? '').match(/github\.com\/([^/?#]+)/i)?.[1] ?? ''
// Repositories the profile keeps off the site (profile.hiddenRepos, names without the owner): never written to the snapshot.
const HIDDEN = new Set((profile.hiddenRepos ?? []).map((n) => String(n).toLowerCase()))

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'portfolio-build (github-snapshot)',
  'X-GitHub-Api-Version': '2022-11-28',
}
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

async function getJson(url) {
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(TIMEOUT_MS) })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`)
  return res.json()
}

function warn(message) {
  console.warn(`sync-github: ${message}`)
  if (!existsSync(OUT)) {
    // First run without network: write an empty snapshot so the import in lib/content.ts resolves.
    const empty = { fetchedAt: null, user: null, repos: {} }
    writeFileSync(OUT, JSON.stringify(empty, null, 2) + '\n', 'utf8')
    console.warn('sync-github: wrote an empty content/github.json')
  } else {
    console.warn('sync-github: keeping the existing content/github.json')
  }
}

try {
  if (!USER) throw new Error('profile.json links.github is missing or not a github.com URL')
  const [user, repos] = await Promise.all([
    getJson(`https://api.github.com/users/${USER}`),
    getJson(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`),
  ])
  if (!Array.isArray(repos) || typeof user?.public_repos !== 'number') throw new Error('unexpected API shape')

  const snapshot = {
    fetchedAt: new Date().toISOString(),
    user: { publicRepos: user.public_repos, followers: user.followers ?? 0 },
    repos: {},
  }
  for (const r of repos) {
    if (!r?.full_name) continue
    if (HIDDEN.has(String(r.name ?? r.full_name.split('/')[1]).toLowerCase())) continue
    snapshot.repos[r.full_name] = {
      stars: r.stargazers_count ?? 0,
      pushedAt: r.pushed_at ?? '',
      language: r.language ?? null,
      description: r.description ?? null,
    }
  }

  const previous = existsSync(OUT) ? readFileSync(OUT, 'utf8') : ''
  const next = JSON.stringify(snapshot, null, 2) + '\n'
  // Only the timestamp changed: keep the committed file stable so prebuild does not churn git.
  const strip = (s) => s.replace(/"fetchedAt": "[^"]*"/, '')
  if (previous && strip(previous) === strip(next)) {
    console.log(`github snapshot unchanged: ${Object.keys(snapshot.repos).length} repos`)
  } else {
    writeFileSync(OUT, next, 'utf8')
    console.log(`github snapshot ok: ${Object.keys(snapshot.repos).length} repos, ${snapshot.user.followers} followers, fetched ${snapshot.fetchedAt}`)
  }
} catch (error) {
  warn(error instanceof Error ? error.message : String(error))
}
