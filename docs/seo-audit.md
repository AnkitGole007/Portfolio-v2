# SEO and AI visibility audit

Date: 2026-11-23. Scope: every route of the static build, checked against the seo-audit and ai-seo checklists, the built HTML and Lighthouse mobile on `/` and `/projects/prisem`. The domain is not live yet, so index coverage, Search Console data and live AI answers are not measured here.

## Technical

- Crawl: `robots.txt` allows every agent and names the main search and AI crawlers with the same rules; only `/_next/` internals are closed. The sitemap lists the 19 indexable pages plus `/llms.txt`, all absolute URLs from `NEXT_PUBLIC_SITE_URL`.
- Index: every page has a self-referencing absolute canonical. The 404 page is `noindex` with no canonical. `/research` is a 404 while no paper or research role is on record, and nothing links to it.
- Preview safety: a Vercel preview or development build without `NEXT_PUBLIC_SITE_URL` sets `noindex, nofollow` (meta and `X-Robots-Tag`), and every canonical, sitemap entry, JSON-LD id and markdown link follows `VERCEL_URL`. Setting the variable is the override. A local build stays indexable.
- Lighthouse mobile: SEO 100 and Accessibility 100 on both pages. Best Practices 96 comes only from the Vercel analytics scripts, which 404 outside Vercel.

## On-page

- Titles: unique on every page. A project title that would pass 60 characters with the " | <name>" suffix drops the suffix (three pages: 59, 56 and 56 characters), so results pages do not cut the descriptive half.
- Meta descriptions: all 19 indexable pages land between 150 and 160 characters, assembled from `profile.json` sentences by `lib/seo.ts`. The postbuild scan warns when one leaves that window.
- Headings and images: one `h1` per page and no image without `alt`.
- Structured data: Person (portrait only when it exists, `sameAs` LinkedIn and GitHub, `alumniOf` both schools, `worksFor` the paid current role, `affiliation` the volunteer role, `knowsAbout` from skills), WebSite, ProfilePage, BreadcrumbList, SoftwareSourceCode or CreativeWork per project, ItemList on `/projects`. All 76 blocks parse, and none carries an empty value.

## Content

- Experience and expertise are visible: named author, dated "Now" lines, degree and GPA, and numbers only from the verified record.
- Five earlier builds have one-line pages. They stay indexable and say they are listed for completeness.

## AI visibility

- `llms.txt` (llmstxt.org layout) and `llms-full.txt` (every page plus the glossary) are served as text.
- Every main page has a markdown twin under `/md/`, served on `Accept: text/markdown`, advertised by a `Link` header and, now on every main page, by a `<link rel="alternate" type="text/markdown">` tag.
- Freshness: the llms files and every mirror carry the last-updated date.
- Lighthouse Agentic Browsing: 100.

## What this pass fixed

- Leak scan `scripts/scan-build.mjs` on postbuild: banned claims, phone shapes (a number in the owner's area code, a US number with separators, a number or the area code after a phone word, the bare area code in readable text, tel: links and vCard TEL lines), the full email outside the vCard, Cloud Run URLs, "multi-agent" anywhere outside the MADWE project on a page that names B2, and off-account repository paths fail the build; description length is a warning. It covers `.next/server/app`, `.next/static`, `public` and the OG image text, and has a self-test in `npm run check`.
- A sentence's period after an allowed shared repository URL no longer fails the scan or the identity guard; any other path on that account still does.
- JSON-LD: no invented `dateCreated`, `worksFor` limited to the paid role, empty `keywords` omitted.
- `/research` removed from the mirrors, llms files and markdown proxy; no empty "Publications" heading.
- `resume.md` follows the resume master order and selection; `about.md` prints no recommendations section, matching `/about`.
- Descriptions brought into 150 to 160 characters on every route.
- The BookADDA OG card shows no "Other" kicker.
- Preview `noindex` and `VERCEL_URL` fallback when `NEXT_PUBLIC_SITE_URL` is unset.

## What remains

- Set `NEXT_PUBLIC_SITE_URL` in Vercel before the first production deploy; the default is a placeholder.
- After launch: verify the domain in Google Search Console and Bing Webmaster Tools, submit the sitemap, and request a Brave crawl, since Bing and Brave feed ChatGPT, Copilot and Claude search.
- Run 10 to 20 role and name queries in ChatGPT, Perplexity and Google three times each; log the rates monthly.
- Make LinkedIn and GitHub describe the same role and focus as the home page, since engines look for consensus.
- Decide whether training crawlers (GPTBot, ClaudeBot, Google-Extended) stay allowed. Search crawlers should stay allowed either way.
