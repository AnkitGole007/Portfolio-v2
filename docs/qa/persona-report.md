# Persona report

QA pass before the first pull request of the 2026 redesign. Four readers, each given only what they would see in the stated time, judged from screenshots of a production build (`next build`, then `next start`). Widths: 390 x 844 for the phone, 1440 x 900 for the desktop.

Severity scale: blocker (the reader cannot do what they came for), high (the reader leaves with a wrong or missing answer to their main question), medium (the reader slows down or doubts a detail), low (polish).

## 1. Recruiter on a phone, 6 seconds

What they see: the first screen of the home page at 390 x 844, no scrolling.

Before the fixes:

- Name, the headline ("AI/ML engineer building LLM applications that ease real workflows, with retrieval, evaluation and fine-tuning behind them"), a Copy email button, LinkedIn, GitHub and View work, the tools line, and the one measured result (a 24+ minute search crash brought to 47.7 seconds with zero errors).
- Conclusion: an AI/ML engineer who builds LLM applications, with one hard debugging result, and a contact button within reach.
- Where they stall: nothing on the first screen says what level he is (MS in AI, 2026), what he does now (AI Trainer, Handshake AI), whether he is looking, or his work authorization. All of it sat one to two screens down, under the funnel figure, and the availability sentence only at the end of the page.

| Problem | Severity | Status |
|---|---|---|
| Degree, current role, availability and work authorization are below the first phone screen | high | Fixed: the credentials and one availability line now sit under the actions, above the funnel. At 390 x 844 they end at 798 px. Name, headline and Copy email stay on the first screen at 375 x 667 and 360 x 640. |
| Copy email copies the address instead of opening a mail app | low | Kept by design (no address in the markup). The button confirms the copy, and the footer and contact section repeat it. |

After the fixes the same six seconds answer: who (name), what (headline), level and current role (MS in AI, WPI, 2026; AI Trainer, Handshake AI), looking or not (open to AI/ML, LLM and applied AI engineering roles anywhere in the US, including remote), work authorization (both sentences, as stated), and how to reach him.

## 2. Non-technical recruiter, 30 seconds

What they see: the home page at 1440 x 900, the first screen and about three scrolls.

- First screen: the name at display size, the headline, the tools, the result line, the actions, and the retrieval funnel (385,655 papers, then 1,200, then 200, then a reading list). The credentials line sits at the bottom edge of the first screen.
- Scrolling: Selected work (5 of 15 projects, each with problem, what was done and what changed), Experience (9 roles at 6 organizations, 2020 to present), The work in numbers.
- Conclusion: a 2026 MS in AI graduate from WPI, working as an AI Trainer at Handshake AI, with open-source search work and a Graduate Qualifying Project award.

| Problem | Severity | Status |
|---|---|---|
| The funnel's stage names ("hybrid search and Reciprocal Rank Fusion", "SPECTER2 rerank", "cross-encoder rerank") are jargon to this reader | low | Kept. The counts carry the meaning (a corpus narrowed to a short list), and the glossary tips explain the terms on hover or tap. |
| "Data Science GQP MVP" uses an acronym this reader may not know | low | Kept. The About page and the recognition table spell it out (Graduate Qualifying Project, PayPal-sponsored). |
| On desktop the availability sentence was only at the page end; the work authorization sat under the hero, just below the first screen | medium | Fixed with the phone change: the availability sentence now opens the status line under the credentials, beside the work authorization, one short scroll from the top. |
| Awards appear in the education entry and in the recognition table | low | Not noticed in 30 seconds; this reader saw them once on the home page. Kept as briefed. |

## 3. Hiring manager, 2 minutes

What they see: home, then the Research Agent project page, the experience timeline and the resume.

- Conclusion: hands-on with retrieval, reranking and evaluation; the claims are framed honestly ("volunteer", "PayPal-sponsored WPI Graduate Qualifying Project", "built, not shipped"); every result has a number and a scope; the current role is a contract; the resume is one click away on every page (the nav and the scroll island).
- The project page leads with problem, what was done and what changed, then measured results, then two instruments.

| Problem | Severity | Status |
|---|---|---|
| The project page title broke inside "open-source" ("open-" at a line end) and sat below display size, so the page's first screen read as a grid of tiles with no lead | medium | Fixed: project titles take the display step from 1024 px and never break inside a hyphenated word. |
| A result tile split a number from its unit ("14.3" at a line end, "s" on the next line), and a project card split a date ("2026-07-" then "22") | medium | Fixed: a number with its unit and an ISO date stay on one line in metric tiles, result lists and project cards. |
| The short "Work" breadcrumb and the footer "Work" and "About" links were smaller than a 44 px target on phones | high | Fixed: each is now at least 44 by 44 px. |
| The Research Agent page lists teammates by GitHub handle | low | Kept: they are credited co-contributors on the public repository, not references. |
| On the Research Agent page the text under the instruments jumps about 400 px when the instruments load during a scroll (the reserved space is 384 px, the two instruments take 841 px at 1440) | medium | Fixed: the instruments are now in the page HTML at their real size, so nothing below them moves when their code arrives. Layout shift measured on a wheel scroll: 0.11 at 390 before, 0 after on every project page at 320, 390 and 1440. After a Tab past the instruments, or a fast scroll on a slow network with 4x CPU slowdown: 0.48 before, 0 after. |

## 4. ML engineer, 5 minutes

What they see: the Research Agent page and both instruments ("Step through a search, then compare search times"), then the project index.

- Conclusion: a real retrieval system with numbers at every stage (385,655 papers, 1,200 candidates after fusion, 200 after the SPECTER2 rerank); the reranker swap is reported with its trade-offs (568M to 150M parameters, about 3x faster on CPU, MTEB 0.584 vs 0.553); the ranking evaluation is labelled "built, not shipped" with its query counts (Kendall's tau 0.316 over 16 queries, NDCG@10 0.81 over 19 queries).
- Every stage and timing control in the instruments is a 44 px button and switches state on click at 320, 390 and 1440 with no console error; the stall bar marks the 24+ minute run as a dashed stall that ended in a crash.

| Problem | Severity | Status |
|---|---|---|
| No latency percentiles beyond the two slow-query timings | low | Content question, not a defect. Only verified numbers are shown. |
| The glossary tips are noise to this reader | low | Kept. They open only on hover, focus or tap and never move the text. |
| NDCG has no glossary tip | low | Decision: none needed. NDCG appears only in a result label read by technical readers and as a one-word item in the skills list, where single names stay plain words. |

## Open questions for Ankit

- Should the home page also show the city (San Jose, CA) in the first screen? The availability line already says "anywhere in the US, including remote", so it was left out to keep the phone screen short.
- The RealmWeaver-AI (MADWE) title runs to three lines on a phone. A shorter display name (for example the part before the colon) would keep it to two; the name is Ankit's to choose.
- The approach text on the Research Agent page says "hybrid full-text and vector search". Its glossary tip was dropped there because a five-word trigger cannot wrap on a phone; "hybrid search" keeps its tip everywhere else. Reword the sentence to "hybrid search" if you want the tip back on that page.
