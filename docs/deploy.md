# Deploy

The site runs on Vercel at your own `.dev` domain, bought at Name.com. The old GitHub Pages address becomes a redirect to the new domain. This page is the checklist, in the order to follow.

In this page, `<domain>` means the domain you bought, for example `example.dev`. Replace it everywhere, including in commands.

## Order of operations

1. Create the Vercel project.
2. Set the environment variables.
3. Merge the redesign into `main`.
4. Add the domain in Vercel and set the DNS records at Name.com.
5. Verify the domain and the live site.
6. Create the deploy hook and add the `VERCEL_DEPLOY_HOOK_URL` secret.
7. Add the `SITE_URL` repository variable.
8. Run the "Deploy to GitHub Pages" workflow once by hand.

Each step is described below.

## 1. Vercel project

- In Vercel, import the GitHub repository `AnkitGole007/Portfolio-v2`.
- Framework preset: Next.js. `vercel.json` also sets it.
- Root directory: `.` (the repository root). Leave the build command, output directory and install command at their defaults.
- Production branch: `main`.
- Node.js version: 20 or newer (project settings, build settings).
- Turn on Web Analytics and Speed Insights in the project. The site loads both scripts on Vercel deployments only. Vercel serves them, and collects data, only after you enable them; until then every page logs two 404s in the console.

Vercel builds `main` right after the import. Before the merge, `main` still holds the old Vite app, so this first build can fail. That is fine, because no domain points at the project yet.

## 2. Environment variables

Set these in the Vercel project settings, under Environment Variables. Values that start with `NEXT_PUBLIC_` are read at build time, so a change needs a new deployment.

| Variable | Environments | Value |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production only | `https://<domain>`, exactly the primary domain (see "Apex and www"), with no trailing slash. |
| `GITHUB_TOKEN` | Production and Preview | Optional. A GitHub token with read access to public repositories. It raises the API rate limit for the build-time GitHub snapshot. Without it, a failed fetch keeps the committed snapshot. |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Production | Optional. The bare domain registered in Plausible, for example `<domain>`. Loads Plausible. |
| `NEXT_PUBLIC_UMAMI_SRC` and `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Production | Optional. The Umami script URL and the website ID. Set both, or Umami does not load. |
| `PRIVATE_TERMS` | Production and Preview | Optional and sensitive: turn on Sensitive when you add it. Names that must never appear on the site, separated by commas: `<first term>,<second term>`. The build's content check and leak scan fail when one appears. Without it, the build still passes, and its log prints a warning that the private-term rule did not run. Never put the value in the repository, an issue or a pull request. |

Use Plausible or Umami, not both.

Set `NEXT_PUBLIC_SITE_URL` even if your domain is `ankitgole.dev`. Without it, a production build uses that placeholder, and every canonical URL, the sitemap and the social images depend on it.

Do not set `NEXT_PUBLIC_SITE_URL` for Preview. A preview build without it is `noindex` and uses its own address. A preview build with it is indexable and points its canonical URLs at the real domain.

The variables are also listed in the README.

## 3. Merge

Merge the redesign branch into `main`. Vercel builds it as the production deployment, with the variables from step 2.

## 4. Domain and DNS

### Add the domain in Vercel

- In the project's domain settings, add `<domain>` and `www.<domain>`.
- Make `<domain>` (the apex) the primary domain. Set `www.<domain>` to redirect to `<domain>` with a permanent redirect (308).
- When you add `<domain>`, Vercel offers to add `www.<domain>` too, and its recommended option redirects `<domain>` to `www.<domain>`. Do not take that option. Choose the one that redirects `www.<domain>` to `<domain>`. Browsers cache a permanent redirect, so pick the right option the first time. If you already took the recommended one, fix it in the domain settings: choose Edit on `<domain>` and remove its redirect, then choose Edit on `www.<domain>` and set it to redirect to `<domain>`.
- Vercel shows a card for each domain with the DNS records it needs. Copy the values from these cards. Vercel often shows values that are specific to your project. The documented fallbacks are `76.76.21.21` for the apex A record and `cname.vercel-dns.com` for the `www` CNAME.

### Apex and www

The apex is the primary domain. `www` only redirects to it. `NEXT_PUBLIC_SITE_URL` must match the primary domain exactly: `https://<domain>`. If you change the variable, redeploy the latest production deployment so the build reads the new value.

### Name.com DNS

1. In your Name.com account, open the DNS records of the domain.
2. Delete the default parking records on `@` (the apex), `www` and `*`. Leave other records, such as mail records, if you added any.
3. Add the apex record. Type `A`, host the apex (shown as `@` or as an empty host field), answer the A value from the Vercel card. If the Vercel card asks for an `ALIAS` record for the apex instead, use Name.com's apex alias record type with that value.
4. Add the `www` record. Type `CNAME`, host `www`, answer the CNAME value from the Vercel card.
5. Keep the default TTL, or use 300 seconds.
6. Wait for propagation. It takes from a few minutes to a few hours.

When the records are correct, the Vercel domain panel shows "Valid Configuration" for both domains. If the panel reports a different problem, follow its message.

Alternative: point the domain to Vercel's nameservers at Name.com, and Vercel manages all DNS records.

### .dev is HTTPS-only

The `.dev` top-level domain is on the HSTS preload list. Browsers never load a `.dev` site over plain HTTP. Vercel issues the certificate automatically after the DNS records verify. Until then, the browser shows a connection or certificate error, not a page. This is expected. Wait for "Valid Configuration" and the certificate, then reload.

## 5. Verify

Open `https://<domain>` and `https://www.<domain>`. The second must end on the first. Then run the checks in "After launch".

## 6. Deploy hook

The workflow `.github/workflows/refresh.yml` rebuilds the site every Monday, so the GitHub snapshot stays current. It calls a Vercel deploy hook. Until the secret exists, it does nothing and passes.

1. In Vercel: project Settings, Git, Deploy Hooks. Create a hook with any name (for example `weekly-refresh`) for branch `main`. Copy the URL.
2. In GitHub: repository Settings, Secrets and variables, Actions, Secrets tab. Add a repository secret named `VERCEL_DEPLOY_HOOK_URL` with the hook URL as its value.
3. To test it, open the Actions tab, select "Refresh site" and run it. A new production deployment starts in Vercel.

Keep the hook URL private. Anyone who has it can start a build.

## 7. Repository variable `SITE_URL`

In GitHub: repository Settings, Secrets and variables, Actions, Variables tab (not Secrets). Add a repository variable named `SITE_URL` with the value `https://<domain>`. Use the same value as `NEXT_PUBLIC_SITE_URL`.

This variable switches on the GitHub Pages redirect. The workflow accepts only `https://` followed by a hostname. It fails with a clear message for anything else, such as a path, a port or `http://`.

## 8. GitHub Pages redirect

The workflow `.github/workflows/deploy.yml` publishes `redirect/index.html` to GitHub Pages as `index.html` and `404.html`. The page sends visitors to `https://<domain>` with a meta refresh. It also carries a canonical link to the new domain, a `noindex` tag, and a plain link for browsers that do not follow the refresh. Old deep links on `https://ankitgole007.github.io/Portfolio-v2/...` get the same page through `404.html`, so they land on the new domain's root. The old app's paths have no equivalent on the new site.

- The job runs on every push to `main` and by hand. While `SITE_URL` is unset, the job is skipped and the old Pages site keeps its last deployment.
- In the repository's Pages settings, the source must stay "GitHub Actions". Do not switch it to a branch.
- After step 7, open the Actions tab, select "Deploy to GitHub Pages" and run it on `main` once.

## After launch

Run these checks. Replace `<domain>` first.

```bash
# HTTPS works. Expect HTTP/2 200 and these security headers: strict-transport-security,
# x-content-type-options, x-frame-options, referrer-policy and permissions-policy.
curl -I https://<domain>

# Production is indexable. Expect no output.
curl -sI https://<domain> | grep -i x-robots-tag

# www redirects to the apex. Expect a 308 with location https://<domain>/.
curl -I https://www.<domain>

# Plain HTTP redirects to HTTPS. Expect a 308 to https://<domain>/.
curl -I http://<domain>

# robots.txt and the sitemap. Expect a 200 for both, and sitemap URLs on https://<domain>.
curl -s https://<domain>/robots.txt
curl -s https://<domain>/sitemap.xml | head -20

# The old Pages address. This is a meta refresh, not an HTTP redirect, so curl shows the
# page itself: status 200 on the root, 404 on an old deep link. Both must print the refresh
# line that points to https://<domain>.
curl -sI https://ankitgole007.github.io/Portfolio-v2/ | head -1
curl -s https://ankitgole007.github.io/Portfolio-v2/ | grep -i refresh
curl -s https://ankitgole007.github.io/Portfolio-v2/some/old/path | grep -i refresh
```

In a browser, the old address must land on `https://<domain>`.

### Search engines

- Google Search Console: add a property of type Domain for `<domain>`. Google shows a TXT record. At Name.com, add a `TXT` record on the apex (shown as `@` or as an empty host field) with that value. Verify the property. Then submit `https://<domain>/sitemap.xml` under Sitemaps.
- Bing Webmaster Tools: add the site by importing it from Google Search Console.

If something here does not match what Vercel or Name.com shows, ask the site's maintainer.
