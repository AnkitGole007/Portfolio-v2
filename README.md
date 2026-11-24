# Ankit Gole, portfolio

The personal portfolio of Ankit Gole: a static Next.js 16 site (App Router, React 19, TypeScript, Tailwind CSS 4). Every visible string and number comes from `content/profile.json`, read through `lib/content.ts`.

## Run it

Node 20 or newer.

```bash
npm install
npm run dev     # development server on http://localhost:3000
npm run build   # prebuild (GitHub snapshot, content checks, markdown mirrors), then next build
npm run start   # serves the production build
```

Other scripts:

| Command | What it does |
|---|---|
| `npm run check` | Content drift guard (`scripts/check-profile.mjs`) and the self-tests of the link checker and the built-output scan |
| `node scripts/scan-build.mjs` | Runs on postbuild. Fails when one of these reaches the build: a banned claim; a number in the owner's area code or a US number written with separators, anywhere; a `tel:` link or a vCard TEL line; in readable text only (page text, JSON-LD, text files, OG text), a 7-digit number written with a separator, or the area code, after a phone word such as "call", or the area code on its own; the email address outside the vCard; a term from `PRIVATE_TERMS`; a Cloud Run URL; "multi-agent" outside the MADWE project on a page that names B2; an off-account repository path. Warns on a meta description outside 150 to 160 characters. `--self-test` proves its rules |
| `npm run typecheck` | `tsc --noEmit` |
| `node scripts/check-identity.mjs` | Fails when the previous owner of the engine is still named in the repo; add `--build` after a build to scan the built pages too |

## Environment variables

| Variable | Effect |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | The public origin, for example `https://example.com`, with no trailing slash. It drives canonical URLs, the sitemap, Open Graph images, JSON-LD, the llms files and the markdown mirrors. When unset, the build uses the placeholder `https://ankitgole.dev`, so set it before the first production deploy. On a Vercel preview or development build where it is unset, every page is `noindex` (meta tag and `X-Robots-Tag`) and every URL follows the deployment's own `VERCEL_URL` instead of the placeholder. |
| `GITHUB_TOKEN` | Optional. Raises the GitHub API rate limit for the build-time snapshot in `content/github.json`. |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Optional. Loads Plausible for that domain. |
| `NEXT_PUBLIC_UMAMI_SRC`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Optional. Load Umami (both are required). |
| `PRIVATE_TERMS` | Optional and sensitive. Names that must never appear on the site, separated by commas: `<first term>,<second term>`. `scripts/check-profile.mjs` and `scripts/scan-build.mjs` fail when one appears as whole words, in any case and with any punctuation between its words. Never commit the value. On Vercel, add it as a sensitive variable. Locally, put the `PRIVATE_TERMS=` line in the git-ignored `.env.local`, which both scripts read (a value set in the shell wins). When it is unset, both scripts skip the rule and print one line (a warning on Vercel), and the build still passes. |

Vercel Analytics and Speed Insights load on every Vercel deployment (the build reads `VERCEL_ENV`). A build anywhere else, `next start` on your own machine included, ships neither script, so it logs no 404 for `/_vercel/insights`. On Vercel, turn both on in the project dashboard, or each page logs those two 404s.

## Content

- `content/profile.json`: identity, links, education, experience, projects, recognition, certifications and skills.
- `content/github.json`: build-time GitHub snapshot for the account in `links.github`, written by `scripts/sync-github.mjs`. A failed fetch keeps the committed file and never breaks the build.
- `content/glossary.json`, `content/logos.json`, `content/people.json`: glossary popovers, organization logos and recommender details. Empty until filled.
- Images referenced by the content must exist under `public/`; the build fails on a missing file.

## Deployment

Deployment details (Vercel project, domain, DNS and the deploy hook) live in `docs/deploy.md`.
