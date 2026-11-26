# Projects by Ankit Gole

15 projects, featured work first, then 5 older and minor projects under Earlier work. Kinds: LLM systems, Research, AI evaluation, Computer vision, NLP, Generative AI, Other, Augmented reality. Each entry with an outcome on record opens with the three-second strip (problem, what was done, what changed), and every entry links to a full page with the approach, results and stack.

## Research Agent: open-source paper search

Search backend rebuild for the B2 Foundation. LLM systems, Feb 2026 to present, The Benevolent Bandwidth Foundation (B2 Foundation).

- Problem: Long searches stalled for 24+ minutes and then crashed, and 50.8% of the corpus had no embeddings.
- What was done: Merged SQLite, FAISS and BM25 into one LanceDB index, traced the crash to five bugs, and backfilled embeddings for 196,082 rows.
- What changed: After the fixes, a search that had stalled 24+ minutes and crashed finished in 47.7 seconds with zero errors.

Research Agent turns a plain-English research need into a short ranked reading list with evidence for each paper. I rebuilt its search backend into one LanceDB index of 385,000+ papers served by FastAPI on Google Cloud Run.

Key numbers: Long search, stall and crash fixed (zero errors after): 24+ min to 47.7 s; Papers in the corpus (2026-07-22 build): 385,655; Two slow queries after the embedding backfill: 185.2 s to 14.3 s and 10.4 s; Reranker speed on CPU: about 3x faster; Reranker MTEB score, new vs old: 0.584 vs 0.553; Reranker size: 568M to 150M parameters; Cloud Run peak memory: 100% (OOM) to about 55% of 8 GiB; Ranking baseline, Kendall's tau over 16 queries (built, not shipped): 0.316; NDCG@10 over 19 queries (built, not shipped): 0.81.

Stack: Python, FastAPI, Server-Sent Events, LanceDB, Cloudflare R2, Reciprocal Rank Fusion, SPECTER2, cross-encoder reranking, Google Cloud Run, Docker, GitHub Actions, pytest.

Details: https://ankitgole.dev/projects/b2-research-agent (markdown: https://ankitgole.dev/md/projects/b2-research-agent.md). Code: https://github.com/AnkitGole007/researchagent

## Credit risk LLM: Phi-4-mini on anonymized credit records

PayPal-sponsored WPI Graduate Qualifying Project, team of 4. LLM systems, Aug 2025 to Dec 2025, PayPal-sponsored WPI Graduate Qualifying Project. Data Science GQP MVP and 3rd Best Data Science GQP Team, Fall 2025.

- Problem: The project tested whether an LLM can assess credit risk from 692,922 anonymized tabular records.
- What was done: Fine-tuned Phi-4-mini with LoRA on Azure, turning each record into a text prompt of 22 features selected from 216.
- What changed: Matched XGBoost while training on about 5% of the data, and a re-check traced most of every model's score to one feature.

A PayPal-sponsored WPI Graduate Qualifying Project. I fine-tuned Phi-4-mini with LoRA to score anonymized credit records as text and matched XGBoost. A re-check then showed one binary feature carries most of every model's score.

Key numbers: Accuracy, Phi-4-mini vs XGBoost (different test sets): 0.947 vs 0.944; MCC, Phi-4-mini vs XGBoost: 0.835 vs 0.826; Anonymized records: 692,922; One binary feature alone (attribute213), accuracy and MCC: 0.9441 and 0.8261; KS, Phi-4-mini: 0.743; Share of the data used for training: about 5%; Good cases no model separates: 27%.

Stack: Phi-4-mini, LoRA, Azure AI Foundry, Slurm, WPI Turing HPC, XGBoost, AES-GCM.

Details: https://ankitgole.dev/projects/paypal-gqp-credit-risk (markdown: https://ankitgole.dev/md/projects/paypal-gqp-credit-risk.md).

## PRISEM: budget-aware entity matching

Research demo system at the WPI YOSSI Lab. Research, Aug 2025 to Mar 2026, Worcester Polytechnic Institute, YOSSI Lab.

- Problem: Checking every record pair with an LLM or a person costs more than a fixed budget allows.
- What was done: Co-built a four-tier router: rules, an embedding model, 4-bit LLMs on CPU and human review, routed by uncertainty.
- What changed: On a 91-pair demo, raising the budget from 150 to 250 units cut human review from 80 pairs to 2.

PRISEM splits record pairs across four cost tiers under a fixed budget: rules, a sentence-embedding model, CPU-only quantized LLMs and human review. Uncertain pairs move up a tier, and overflow shifts to cheaper tiers to stay on budget.

Key numbers: Pairs flagged for human review out of 91, budget 150 then 250 units: 80 to 2; Cost tiers: 4; Lexical features in the rule tier: 8.

Stack: entity matching, llama.cpp, GGUF, Qwen2.5-1.5B, Phi-3.5-mini, Jellyfish-8B, BGE, isotonic regression, Gradio.

Details: https://ankitgole.dev/projects/prisem (markdown: https://ankitgole.dev/md/projects/prisem.md).

## Blinded evaluation of AI coding agents

Head-to-head agent evaluation at Handshake AI. AI evaluation, Aug 2026 to present, Handshake AI.

- Problem: A green test suite can hide a broken build, so agent claims need checking by hand.
- What was done: Ranked and rubric-scored 20 blinded coding-agent sessions across 10 tasks, re-running every build to verify agent claims.
- What changed: Caught failures a green suite missed, including a run where every test passed while a required field was missing.

Each task gives two AI coding agents the same prompt in the same Docker container. I run both sessions, verify each build by hand, rank the pair on a 7-point preference scale and grade each on a 4-dimension rubric.

Key numbers: Blinded sessions graded, across 10 tasks: 20; Evaluation snapshot size: 658 MB to 7.7 MB (98.8% smaller); Verification run on one task: 477 checks, 0 failed; Failure taxonomy: 19 codes; Rubric dimensions: 4; Largest session trace reviewed: 5.2 MB.

Stack: Docker, Python, Kotlin, Java, Maven, C++, GDScript, Mercurial, pairwise preference ranking, rubric scoring, agent trace review.

Details: https://ankitgole.dev/projects/handshake-eval (markdown: https://ankitgole.dev/md/projects/handshake-eval.md).

## FairnessEM: fairness-aware entity matching

A fairness loss for the Ditto entity matcher. Research, Jan 2026 to May 2026.

- Problem: An entity matcher can score a good F1 while its errors fall unevenly across groups of records.
- What was done: Added a PPVP fairness loss to Ditto in PyTorch and swept 11 loss weights across 10 configurations, 110 runs.
- What changed: Average disparity fell 74%, from 0.0355 to 0.0094 at the best weight per configuration, with F1 near 0.82.

Added a PPVP fairness loss to the Ditto entity matcher in PyTorch. Across 110 runs, average group disparity fell from 0.0355 to 0.0094 at the best alpha per configuration, while F1 held near 0.82.

Key numbers: Average group disparity cut, best alpha per configuration: 74%; Average group disparity, best alpha per configuration: 0.0355 to 0.0094; Average F1: 0.816 to 0.820; Runs, 10 configurations x 11 alpha values: 110; F1 at alpha 1.0, false fairness: 0.0113.

Stack: PyTorch, Ditto, entity matching, fairness metrics, PPVP loss.

Details: https://ankitgole.dev/projects/fairness-em (markdown: https://ankitgole.dev/md/projects/fairness-em.md). Code: https://github.com/AnkitGole007/Fairness-In-Entity-Matching/tree/ag/phase3

## TumorLytix: unsupervised brain tumor detection

A conditional diffusion U-Net that needs no labeled masks. Computer vision, Sep 2024 to Dec 2024.

- Problem: Supervised tumor detectors need a labeled mask for every training scan.
- What was done: Trained a conditional diffusion U-Net in PyTorch to rebuild each MRI scan's healthy version and flag the difference.
- What changed: Reached 92.17% reconstruction accuracy and lifted average precision over CycleGAN from 0.47 to 0.52 on 4 test scans.

A conditional diffusion U-Net in PyTorch rebuilds a healthy version of each MRI scan, and the difference flags the tumor. No labeled masks needed. Compared against a CycleGAN baseline on 4 hand-labeled test scans.

Key numbers: Healthy-reconstruction accuracy: 92.17%; Average precision vs CycleGAN, 4 test scans: 0.52 vs 0.47; Average Dice vs CycleGAN, 4 test scans: 0.57 vs 0.60.

Stack: PyTorch, diffusion models, U-Net, CycleGAN, MRI.

Details: https://ankitgole.dev/projects/tumorlytix (markdown: https://ankitgole.dev/md/projects/tumorlytix.md). Code: https://github.com/Sonica-B/TumorLytix

## Fake Review Bounty Hunter: fraud signals in Yelp reviews

Fraud detection with NLP and graph analytics. NLP, Feb 2025 to May 2025.

- Problem: A business with high star ratings can have reviews whose sentiment says otherwise.
- What was done: Scored reviews with DistilBERT and mapped reviewer links in Neo4j, with PySpark and PostgreSQL behind it.
- What changed: On 5,000 Yelp reviews, it flagged 15% of businesses whose high ratings did not match their review sentiment.

A fraud-signal pipeline that scores reviews with DistilBERT and maps reviewer links in a Neo4j graph. On a 5,000-review Yelp sample it flagged 15% of businesses whose high ratings did not match their review sentiment.

Key numbers: Businesses flagged, ratings vs sentiment: 15%; Yelp reviews in the sample: 5,000.

Stack: DistilBERT, Neo4j, PySpark, PostgreSQL, fraud detection.

Details: https://ankitgole.dev/projects/fake-review-bounty-hunter (markdown: https://ankitgole.dev/md/projects/fake-review-bounty-hunter.md). Code: https://github.com/AnkitGole007/Fake-Review-Bounty-Hunter

## RealmWeaver-AI (MADWE): a four-agent diffusion world engine

Game worlds built by four generative agents and rendered in Unity. Generative AI, 2025.

- Problem: A game world needs terrain, assets, characters and story that fit together.
- What was done: Led architecture and integration: four agents on a shared world state graph, connected to Unity over named-pipe IPC.
- What changed: The Day 8 monitor measured about 19 to 28 FPS against a 30 FPS target, about 35 to 49 ms per frame.

Four agents share a neural world state graph: environment (VAE plus diffusion), assets (Stable Diffusion 1.5 with LoRA adapters per biome), characters (GAN plus RNN) and narrative (fine-tuned GPT-J). Unity renders the world.

Key numbers: Frame rate on Day 8, 30 FPS target: about 19 to 28 FPS; Frame time: about 35 to 49 ms; Memory, 8 GB limit: about 6.0 to 6.5 GB; Agent messages per second, 200 target: about 190 to 300.

Stack: Stable Diffusion 1.5, LoRA, GPT-J, VAE, GAN, Wave Function Collapse, Unity, LangGraph.

Details: https://ankitgole.dev/projects/realmweaver-madwe (markdown: https://ankitgole.dev/md/projects/realmweaver-madwe.md). Code: https://github.com/Sonica-B/RealmWeaver-MADWE

## TrendEd Pathfinder: course to job matching

Job recommendations from university course catalogs. NLP.

- Problem: Students cannot easily see which jobs their courses prepare them for.
- What was done: Matched course catalogs to scraped job postings with TF-IDF, LDA topics and cosine similarity, in a team of 5.
- What changed: Users rated relevance 4/5 on average in surveys, though life sciences postings matched poorly.

Matches university course catalogs to scraped job postings from LinkedIn, Handshake and the Adzuna API with TF-IDF, LDA topics and cosine similarity. Users rated its recommendations 4/5 for relevance on average in surveys.

Key numbers: Relevance in user surveys, average: 4/5.

Stack: TF-IDF, LDA, cosine similarity, web scraping, Adzuna API.

Details: https://ankitgole.dev/projects/trended-pathfinder (markdown: https://ankitgole.dev/md/projects/trended-pathfinder.md). Code: https://github.com/Sonica-B/TrendED

## Drag-A-GAN: a DragGAN reimplementation

Point-drag image editing on StyleGAN2. Generative AI, Feb 2025 to May 2025.

A reimplementation of the DragGAN paper: StyleGAN2-based image editing where you drag points on a generated image to reshape it.

Stack: StyleGAN2, DragGAN, GANs.

Details: https://ankitgole.dev/projects/drag-a-gan (markdown: https://ankitgole.dev/md/projects/drag-a-gan.md). Code: https://github.com/AnkitGole007/Drag-A-GAN

## Earlier work

### Stable Diffusion 2D game asset generator

Coursework build. Generative AI.

Listed for completeness. No outcome is on record for this build.

A coursework build: a Stable Diffusion 2D game asset generator.

Stack: Stable Diffusion.

Details: https://ankitgole.dev/projects/sd-game-assets (markdown: https://ankitgole.dev/md/projects/sd-game-assets.md).

### StyleGAN2 with WGAN-GP

Coursework build. Generative AI.

Listed for completeness. No outcome is on record for this build.

A coursework build: StyleGAN2 with WGAN-GP.

Stack: StyleGAN2, WGAN-GP.

Details: https://ankitgole.dev/projects/stylegan2-wgan-gp (markdown: https://ankitgole.dev/md/projects/stylegan2-wgan-gp.md).

### Diffusion U-Net face generation

Coursework build. Generative AI.

Listed for completeness. No outcome is on record for this build.

A coursework build: diffusion U-Net face generation.

Stack: diffusion U-Net.

Details: https://ankitgole.dev/projects/diffusion-face-generation (markdown: https://ankitgole.dev/md/projects/diffusion-face-generation.md).

### BookADDA: online book rental

Undergraduate project.

Listed for completeness. No outcome is on record for this build.

An undergraduate project: BookADDA, online book rental.

Details: https://ankitgole.dev/projects/bookadda (markdown: https://ankitgole.dev/md/projects/bookadda.md).

### Map.AR: AR navigation

Undergraduate project. Augmented reality.

Listed for completeness. No outcome is on record for this build.

An undergraduate project: Map.AR, AR navigation with Unity and Firebase.

Stack: Unity, Firebase.

Details: https://ankitgole.dev/projects/map-ar (markdown: https://ankitgole.dev/md/projects/map-ar.md).

Canonical page: https://ankitgole.dev/projects. This markdown: https://ankitgole.dev/md/projects.md. Written by Ankit Gole; generated from the site content model, last updated 2026-11-23.
