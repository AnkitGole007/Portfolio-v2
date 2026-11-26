#!/usr/bin/env node
// Link and control guard: crawls the built site on a running server and fails on what a visitor would
// hit as broken. It reads the served HTML only (Node fetch, no browser), so it finds:
//
//   - an internal link or a palette row whose page does not answer 200 (a 404, a 500)
//   - a link to "#name" on a page that has no element with that id
//   - an empty link target: href="" or href="#"
//   - a link or button with no name: no text, no aria-label, no aria-labelledby, no title, no img alt
//     (icon-only controls; screen-reader-only text counts as a name)
//   - an image with no source, a width or height attribute of 0, or a source that does not answer
//     with a non-empty image whose header reports a width and height above 0
//
// The size an image renders at after CSS needs a browser; the browser pass of each task checks that.
//
//   node scripts/check-links.mjs http://localhost:3126      crawl from "/" and from /palette-index.json
//   node scripts/check-links.mjs --self-test                serve scripts/fixtures/links and expect each
//                                                           planted fault to be reported
//
// Exit 0 when nothing is wrong, 1 with one line per fault otherwise, 2 on a usage error.
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { dirname, extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const FIXTURE = join(ROOT, 'scripts', 'fixtures', 'links')
const MAX_PAGES = 400

// ---------- HTML reading (regular expressions are enough for markup this site generates) ----------

const ENTITIES = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' }
const decode = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : Number(e.slice(1)))
    return ENTITIES[e.toLowerCase()] ?? m
  })

/** Attributes of one start tag, lowercased names, decoded values; a bare attribute maps to "". */
function attrs(tag) {
  const out = {}
  const body = tag.replace(/^<\w+/, '').replace(/\/?>$/, '')
  for (const m of body.matchAll(/([^\s"'=<>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
    out[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? m[4] ?? '')
  }
  return out
}

/** The page without scripts, styles, templates and comments, so their contents are never read as markup. */
const visibleMarkup = (html) =>
  html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|template|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, '')

/** Text a screen reader would read inside an element: hidden subtrees and SVG drawings removed. */
function accessibleText(inner) {
  let s = inner
  // Repeat so nested hidden elements of the same tag are removed from the inside out.
  for (let i = 0; i < 4; i += 1) {
    s = s.replace(/<(\w+)\b[^>]*\baria-hidden=(?:"true"|'true'|true)[^>]*>(?:(?!<\1\b)[\s\S])*?<\/\1>/gi, '')
  }
  s = s.replace(/<svg\b[\s\S]*?<\/svg>/gi, '')
  const alts = [...s.matchAll(/<img\b[^>]*>/gi)].map((m) => attrs(m[0]).alt ?? '').join(' ')
  return `${decode(s.replace(/<[^>]+>/g, ' '))} ${alts}`.replace(/\s+/g, ' ').trim()
}

/** Every link, button and image on a page, plus the ids a fragment can land on. */
function readPage(html) {
  const markup = visibleMarkup(html)
  const ids = new Set()
  for (const m of markup.matchAll(/<[a-z][\w-]*\b[^>]*\s(?:id|name)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)) ids.add(decode(m[1] ?? m[2]))
  const controls = []
  for (const m of markup.matchAll(/<(a|button)\b([^>]*)>([\s\S]*?)<\/\1>/gi)) {
    controls.push({ tag: m[1].toLowerCase(), attrs: attrs(`<${m[1]}${m[2]}>`), text: accessibleText(m[3]), raw: m[0].slice(0, 120) })
  }
  const images = [...markup.matchAll(/<img\b[^>]*>/gi)].map((m) => ({ attrs: attrs(m[0]), raw: m[0].slice(0, 120) }))
  return { ids, controls, images }
}

// ---------- Image headers: width and height without decoding the picture ----------

function imageSize(buf) {
  const u8 = new Uint8Array(buf)
  const dv = new DataView(buf)
  const ascii = (o, n) => String.fromCharCode(...u8.slice(o, o + n))
  if (u8.length >= 24 && ascii(1, 3) === 'PNG') return { width: dv.getUint32(16), height: dv.getUint32(20) }
  if (u8.length >= 10 && ascii(0, 3) === 'GIF') return { width: dv.getUint16(6, true), height: dv.getUint16(8, true) }
  if (u8.length >= 30 && ascii(0, 4) === 'RIFF' && ascii(8, 4) === 'WEBP') {
    const kind = ascii(12, 4)
    if (kind === 'VP8 ') return { width: dv.getUint16(26, true) & 0x3fff, height: dv.getUint16(28, true) & 0x3fff }
    if (kind === 'VP8L') {
      const b = dv.getUint32(21, true)
      return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 }
    }
    if (kind === 'VP8X') return { width: 1 + (u8[24] | (u8[25] << 8) | (u8[26] << 16)), height: 1 + (u8[27] | (u8[28] << 8) | (u8[29] << 16)) }
  }
  if (u8.length >= 4 && u8[0] === 0xff && u8[1] === 0xd8) {
    let o = 2
    while (o + 9 < u8.length) {
      if (u8[o] !== 0xff) return null
      const marker = u8[o + 1]
      const len = dv.getUint16(o + 2)
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { width: dv.getUint16(o + 7), height: dv.getUint16(o + 5) }
      o += 2 + len
    }
    return null
  }
  // AVIF and other boxed formats: look for the "ispe" box (image spatial extents).
  const ispe = ascii(0, Math.min(u8.length, 4096)).indexOf('ispe')
  if (ispe > 0 && ispe + 16 <= u8.length) return { width: dv.getUint32(ispe + 8), height: dv.getUint32(ispe + 12) }
  if (/<svg\b/i.test(new TextDecoder().decode(u8.slice(0, 512)))) return { width: 1, height: 1 } // vector: no pixel size to read
  return null
}

// ---------- Crawl ----------

export async function crawl(base) {
  const origin = new URL(base).origin
  const faults = []
  const fault = (where, what) => faults.push(`${where}: ${what}`)
  const status = new Map() // path -> Promise<{ ok, code, type, html?, ids? }>
  const pagesDone = new Set()
  const queue = ['/']
  let links = 0
  let images = 0

  const fetchPath = (path) => {
    if (!status.has(path)) {
      status.set(
        path,
        fetch(origin + path, { redirect: 'follow', headers: { accept: 'text/html,application/json,image/webp,image/*;q=0.8,*/*;q=0.5' } })
          .then(async (res) => {
            const type = res.headers.get('content-type') ?? ''
            if (/text\/html/.test(type)) return { ok: res.ok, code: res.status, type, html: await res.text() }
            if (/^image\//.test(type)) return { ok: res.ok, code: res.status, type, size: imageSize(await res.arrayBuffer()) }
            if (/json/.test(type)) return { ok: res.ok, code: res.status, type, json: await res.json().catch(() => null) }
            await res.arrayBuffer()
            return { ok: res.ok, code: res.status, type }
          })
          .catch((error) => ({ ok: false, code: 0, type: '', error: String(error) })),
      )
    }
    return status.get(path)
  }

  /** Splits an href into an internal path and fragment, or null for another origin or scheme. */
  const internal = (href, from) => {
    if (/^(mailto|tel|javascript|data|blob):/i.test(href)) return null
    let url
    try {
      url = new URL(href, origin + from)
    } catch {
      return { bad: true }
    }
    if (url.origin !== origin) return null
    return { path: url.pathname + url.search, hash: decodeURIComponent(url.hash.slice(1)) }
  }

  const checkTarget = async (where, href, path, hash) => {
    links += 1
    const res = await fetchPath(path)
    if (!res.ok) {
      fault(where, `${href} answers ${res.code || res.error}`)
      return
    }
    if (hash && res.html) {
      const ids = res.ids ?? (res.ids = readPage(res.html).ids)
      if (!ids.has(hash)) fault(where, `${href} has no element with id "${hash}"`)
    }
    if (res.html && !pagesDone.has(path) && pagesDone.size + queue.length < MAX_PAGES && !queue.includes(path)) queue.push(path)
  }

  // The command palette's rows are links too, served as JSON rather than markup.
  const palette = await fetchPath('/palette-index.json')
  if (palette.ok && Array.isArray(palette.json)) {
    for (const row of palette.json) {
      if (typeof row.href !== 'string') continue
      if (row.href === '' || row.href === '#') fault('/palette-index.json', `row "${row.title}" has an empty href`)
      const target = internal(row.href, '/')
      if (target?.bad) fault('/palette-index.json', `row "${row.title}" has an unreadable href ${row.href}`)
      else if (target) await checkTarget(`/palette-index.json "${row.title}"`, row.href, target.path, target.hash)
    }
  }

  while (queue.length > 0) {
    const path = queue.shift()
    if (pagesDone.has(path)) continue
    pagesDone.add(path)
    const res = await fetchPath(path)
    if (!res.ok) {
      fault(path, `page answers ${res.code || res.error}`)
      continue
    }
    if (!res.html) continue
    const page = readPage(res.html)
    res.ids = page.ids

    for (const c of page.controls) {
      const a = c.attrs
      const named = c.text || a['aria-label']?.trim() || a['aria-labelledby']?.trim() || a.title?.trim()
      if (!named) fault(path, `${c.tag} with no accessible name: ${c.raw}`)
      if (c.tag !== 'a' || !('href' in a)) continue
      const href = a.href.trim()
      if (href === '' || href === '#') {
        fault(path, `link with an empty target (href="${href}"): ${c.raw}`)
        continue
      }
      const target = internal(href, path)
      if (target?.bad) fault(path, `unreadable href ${href}`)
      else if (target) await checkTarget(path, href, target.path, target.hash)
    }

    for (const img of page.images) {
      images += 1
      const a = img.attrs
      if (a.width === '0' || a.height === '0') fault(path, `image with a zero width or height attribute: ${img.raw}`)
      const src = (a.src ?? '').trim() || (a.srcset ?? '').trim().split(/\s+/)[0] || ''
      if (!src) {
        fault(path, `image with no source: ${img.raw}`)
        continue
      }
      if (src.startsWith('data:')) {
        if (src.length < 30) fault(path, `image with an empty data source: ${img.raw}`)
        continue
      }
      const target = internal(src, path)
      if (!target || target.bad) continue
      const res2 = await fetchPath(target.path)
      if (!res2.ok) fault(path, `image ${src} answers ${res2.code || res2.error}`)
      else if (!/^image\//.test(res2.type)) fault(path, `image ${src} is served as ${res2.type || 'nothing'}, not an image`)
      else if (!res2.size || res2.size.width <= 0 || res2.size.height <= 0) fault(path, `image ${src} has no readable width and height`)
    }
  }

  return { faults, pages: pagesDone.size, links, images }
}

// ---------- Self-test: a fixture site with one of each fault ----------

const TYPES = { '.html': 'text/html; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp' }

async function selfTest() {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x')
    let file = normalize(join(FIXTURE, decodeURIComponent(url.pathname)))
    if (!file.startsWith(FIXTURE)) {
      res.writeHead(403).end()
      return
    }
    if (!extname(file)) file = join(file, 'index.html')
    try {
      const body = await readFile(file)
      res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' }).end(body)
    } catch {
      res.writeHead(404, { 'content-type': 'text/html' }).end('<!doctype html><title>Not found</title>')
    }
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const { port } = server.address()
  const result = await crawl(`http://127.0.0.1:${port}`)
  server.closeAllConnections()
  await new Promise((resolve) => server.close(resolve))
  // Each planted fault, and the text its report line must carry.
  const expected = [
    ['planted 404 link', /\/missing-page answers 404/],
    ['planted missing fragment', /has no element with id "nowhere"/],
    ['planted empty href', /empty target \(href=""\)/],
    ['planted icon-only button', /button with no accessible name/],
    ['planted zero-size image', /zero width or height attribute/],
    ['planted missing image file', /missing\.png answers 404/],
    ['planted palette row', /palette-index\.json "Gone".*answers 404/],
  ]
  const missed = expected.filter(([, re]) => !result.faults.some((f) => re.test(f)))
  // The clean controls on the fixture page (named icon link, sr-only text, a real image) must not be reported.
  const false_ = result.faults.filter((f) => /Named icon|sr-only|One pixel|A page that exists|A fragment that exists/.test(f))
  for (const f of result.faults) console.log(`  found  ${f}`)
  if (missed.length || false_.length) {
    for (const [name] of missed) console.error(`self-test: MISSED ${name}`)
    for (const f of false_) console.error(`self-test: FALSE ALARM ${f}`)
    process.exitCode = 1
    return
  }
  console.log(`check-links self-test ok: ${expected.length} planted faults reported, no false alarms`)
}

// ---------- CLI ----------

const arg = process.argv[2]
if (arg === '--self-test') {
  await selfTest()
} else if (arg && /^https?:\/\//.test(arg)) {
  const { faults, pages, links, images } = await crawl(arg)
  if (faults.length) {
    for (const f of faults) console.error(`check-links: ${f}`)
    console.error(`check-links FAIL: ${faults.length} fault(s) across ${pages} pages`)
    process.exitCode = 1
  } else {
    console.log(`check-links ok: ${pages} pages, ${links} internal links, ${images} images, no faults`)
  }
} else {
  console.error('usage: node scripts/check-links.mjs <http://host:port> | --self-test')
  process.exitCode = 2
}
