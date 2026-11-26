# Ankit Gole

AI/ML engineer building LLM applications that ease real workflows, with retrieval, evaluation and fine-tuning behind them.

> I build LLM-based applications that help people with real workflows and daily tasks. I rebuilt the search backend of Research Agent, an open-source paper search tool at the B2 Foundation, and I run blinded evaluations of AI coding agents at Handshake AI. At WPI I fine-tuned Phi-4-mini with LoRA for a credit risk Graduate Qualifying Project and co-built PRISEM, a budget-aware entity matching system. MS in Artificial Intelligence, May 2026, GPA 3.88.

I would rather take one LLM application all the way to deployable, with observability and guardrails, than build many prototypes that never ship.

## Now (2026-11-23)

- AI Trainer at Handshake AI since August 2026, ranking and grading blinded AI coding-agent runs.
- AI Research Contributor at the B2 Foundation, a volunteer role on Research Agent, an open-source paper search tool.
- Finished an MS in Artificial Intelligence at WPI in May 2026 with a 3.88 GPA.
- Open to AI/ML, LLM and applied AI engineering roles anywhere in the US, including remote.

## At a glance

- Title: AI/ML Engineer
- Location: San Jose, CA
- Availability: Open to AI/ML, LLM and applied AI engineering roles anywhere in the US, including remote.
- Work authorization: OPT starting June 2026, with the 24-month STEM OPT extension available, about 3 years total. Will need H-1B sponsorship later.
- Target roles: AI/ML Engineer, LLM or GenAI Engineer, Applied AI Engineer, ML Research Engineer, Applied Scientist, MLOps or ML Infrastructure Engineer, LLM fine-tuning, AI evaluation
- Target locations: Anywhere in the US, Remote
- Contact: LinkedIn https://www.linkedin.com/in/ankit-gole/, contact card (vCard) https://ankitgole.dev/vcard.vcf
- Resume: https://ankitgole.dev/resume (HTML), https://ankitgole.dev/md/resume.md (markdown)

## Recognition

- Data Science GQP MVP, Worcester Polytechnic Institute, 2025. MVP of the PayPal-sponsored Graduate Qualifying Project team, Fall 2025.
- 3rd Best Data Science GQP Team, Worcester Polytechnic Institute, 2025. Awarded to the PayPal-sponsored Graduate Qualifying Project team, Fall 2025.

## Featured projects

### Research Agent: open-source paper search

Search backend rebuild for the B2 Foundation. LLM systems, Feb 2026 to present, The Benevolent Bandwidth Foundation (B2 Foundation).

- Problem: Long searches stalled for 24+ minutes and then crashed, and 50.8% of the corpus had no embeddings.
- What was done: Merged SQLite, FAISS and BM25 into one LanceDB index, traced the crash to five bugs, and backfilled embeddings for 196,082 rows.
- What changed: After the fixes, a search that had stalled 24+ minutes and crashed finished in 47.7 seconds with zero errors.

Research Agent turns a plain-English research need into a short ranked reading list with evidence for each paper. I rebuilt its search backend into one LanceDB index of 385,000+ papers served by FastAPI on Google Cloud Run.

Key numbers: Long search, stall and crash fixed (zero errors after): 24+ min to 47.7 s; Papers in the corpus (2026-07-22 build): 385,655; Two slow queries after the embedding backfill: 185.2 s to 14.3 s and 10.4 s; Reranker speed on CPU: about 3x faster; Reranker MTEB score, new vs old: 0.584 vs 0.553; Reranker size: 568M to 150M parameters; Cloud Run peak memory: 100% (OOM) to about 55% of 8 GiB; Ranking baseline, Kendall's tau over 16 queries (built, not shipped): 0.316; NDCG@10 over 19 queries (built, not shipped): 0.81.

Details: https://ankitgole.dev/projects/b2-research-agent (markdown: https://ankitgole.dev/md/projects/b2-research-agent.md). Code: https://github.com/AnkitGole007/researchagent

### Credit risk LLM: Phi-4-mini on anonymized credit records

PayPal-sponsored WPI Graduate Qualifying Project, team of 4. LLM systems, Aug 2025 to Dec 2025, PayPal-sponsored WPI Graduate Qualifying Project. Data Science GQP MVP and 3rd Best Data Science GQP Team, Fall 2025.

- Problem: The project tested whether an LLM can assess credit risk from 692,922 anonymized tabular records.
- What was done: Fine-tuned Phi-4-mini with LoRA on Azure, turning each record into a text prompt of 22 features selected from 216.
- What changed: Matched XGBoost while training on about 5% of the data, and a re-check traced most of every model's score to one feature.

A PayPal-sponsored WPI Graduate Qualifying Project. I fine-tuned Phi-4-mini with LoRA to score anonymized credit records as text and matched XGBoost. A re-check then showed one binary feature carries most of every model's score.

Key numbers: Accuracy, Phi-4-mini vs XGBoost (different test sets): 0.947 vs 0.944; MCC, Phi-4-mini vs XGBoost: 0.835 vs 0.826; Anonymized records: 692,922; One binary feature alone (attribute213), accuracy and MCC: 0.9441 and 0.8261; KS, Phi-4-mini: 0.743; Share of the data used for training: about 5%; Good cases no model separates: 27%.

Details: https://ankitgole.dev/projects/paypal-gqp-credit-risk (markdown: https://ankitgole.dev/md/projects/paypal-gqp-credit-risk.md).

### PRISEM: budget-aware entity matching

Research demo system at the WPI YOSSI Lab. Research, Aug 2025 to Mar 2026, Worcester Polytechnic Institute, YOSSI Lab.

- Problem: Checking every record pair with an LLM or a person costs more than a fixed budget allows.
- What was done: Co-built a four-tier router: rules, an embedding model, 4-bit LLMs on CPU and human review, routed by uncertainty.
- What changed: On a 91-pair demo, raising the budget from 150 to 250 units cut human review from 80 pairs to 2.

PRISEM splits record pairs across four cost tiers under a fixed budget: rules, a sentence-embedding model, CPU-only quantized LLMs and human review. Uncertain pairs move up a tier, and overflow shifts to cheaper tiers to stay on budget.

Key numbers: Pairs flagged for human review out of 91, budget 150 then 250 units: 80 to 2; Cost tiers: 4; Lexical features in the rule tier: 8.

Details: https://ankitgole.dev/projects/prisem (markdown: https://ankitgole.dev/md/projects/prisem.md).

### Blinded evaluation of AI coding agents

Head-to-head agent evaluation at Handshake AI. AI evaluation, Aug 2026 to present, Handshake AI.

- Problem: A green test suite can hide a broken build, so agent claims need checking by hand.
- What was done: Ranked and rubric-scored 20 blinded coding-agent sessions across 10 tasks, re-running every build to verify agent claims.
- What changed: Caught failures a green suite missed, including a run where every test passed while a required field was missing.

Each task gives two AI coding agents the same prompt in the same Docker container. I run both sessions, verify each build by hand, rank the pair on a 7-point preference scale and grade each on a 4-dimension rubric.

Key numbers: Blinded sessions graded, across 10 tasks: 20; Evaluation snapshot size: 658 MB to 7.7 MB (98.8% smaller); Verification run on one task: 477 checks, 0 failed; Failure taxonomy: 19 codes; Rubric dimensions: 4; Largest session trace reviewed: 5.2 MB.

Details: https://ankitgole.dev/projects/handshake-eval (markdown: https://ankitgole.dev/md/projects/handshake-eval.md).

### FairnessEM: fairness-aware entity matching

A fairness loss for the Ditto entity matcher. Research, Jan 2026 to May 2026.

- Problem: An entity matcher can score a good F1 while its errors fall unevenly across groups of records.
- What was done: Added a PPVP fairness loss to Ditto in PyTorch and swept 11 loss weights across 10 configurations, 110 runs.
- What changed: Average disparity fell 74%, from 0.0355 to 0.0094 at the best weight per configuration, with F1 near 0.82.

Added a PPVP fairness loss to the Ditto entity matcher in PyTorch. Across 110 runs, average group disparity fell from 0.0355 to 0.0094 at the best alpha per configuration, while F1 held near 0.82.

Key numbers: Average group disparity cut, best alpha per configuration: 74%; Average group disparity, best alpha per configuration: 0.0355 to 0.0094; Average F1: 0.816 to 0.820; Runs, 10 configurations x 11 alpha values: 110; F1 at alpha 1.0, false fairness: 0.0113.

Details: https://ankitgole.dev/projects/fairness-em (markdown: https://ankitgole.dev/md/projects/fairness-em.md). Code: https://github.com/AnkitGole007/Fairness-In-Entity-Matching/tree/ag/phase3

All 15 projects: https://ankitgole.dev/projects (markdown: https://ankitgole.dev/md/projects.md).

## Experience

- AI Trainer, Handshake AI, Aug 2026 to present, Remote. Run blinded head-to-head evaluations of two AI coding agents, verifying each build by hand before ranking and grading.
- AI Research Contributor, The Benevolent Bandwidth Foundation (B2 Foundation), Feb 2026 to present, Remote. Rebuilt the search backend of Research Agent, a free open-source tool that turns a research brief into a ranked reading list.
- AI Researcher, Worcester Polytechnic Institute, YOSSI Lab, Aug 2025 to Mar 2026, Worcester, MA. Co-built PRISEM, a budget-aware entity matching demo system that splits record pairs across four cost tiers under a fixed budget.
- Graduate Learning Assistant, FIN3330/FIN540 Financial Analytics, Worcester Polytechnic Institute, Jan 2026 to present, Worcester, MA. Grade work that covers 90% of course weight, debug student pipelines and support students across 7 modules.
- Graduate Assistant, FIN 530 Cryptocurrencies and Financial Markets, Worcester Polytechnic Institute, Apr 2025 to Dec 2025, Worcester, MA. Ran labs on stablecoins and CBDCs with Hyperledger Fabric, Docker and Python, and handled grading and office hours.
- Graduate Assistant, FIN 540 Financial Analytics, Worcester Polytechnic Institute, Jan 2025 to Mar 2025, Worcester, MA. Graduate assistant for the Financial Analytics course.
- AI Intern (AI Agent Builder), NeuralSeek, Aug 2025 to Sep 2025. Built natural-language AI agents on NeuralSeek's no-code generative AI platform, completed platform certifications and ran competitive analyses.
- Systems Engineer, Atos, Jul 2022 to Jul 2024, Pune, India. IT operations for a US client's multi-tenant service desk, and my first hands-on ML work. Title steps: Digital Workplace Trainee, then Associate Engineer, then System Engineer.
- Web Developer intern, Larsen & Toubro (Defence), Aug 2020 to Nov 2020, Remote. Updated elements of a company portal and worked on the Defence Newsletter site as a basic UI/UX developer.

## Education

- Master of Science in Artificial Intelligence, Worcester Polytechnic Institute, Aug 2024 to May 2026. GPA 3.88/4.0.
- Bachelor of Engineering in Information Technology, PES Modern College of Engineering, Jun 2018 to Aug 2022.

## Skills

- Languages and ML: Python, PyTorch, SQL, Hugging Face Transformers, scikit-learn, TensorFlow, XGBoost, PEFT and LoRA, pandas, NumPy, 4-bit quantization (GGUF, llama.cpp), isotonic calibration
- LLMs and retrieval: LoRA fine-tuning, RAG and retrieval, hybrid search, reranking (SPECTER2, cross-encoders), LLM-as-judge, prompt engineering, Reciprocal Rank Fusion, multi-provider LLM fallback (Groq, OpenRouter, Ollama, OpenAI, Anthropic, Gemini, Vertex AI), LangChain, LangGraph
- Evaluation: pairwise preference ranking, rubric scoring, agent trace review, NDCG, Kendall's tau, failure taxonomies, Recall@k, MCC, KS, F1, multi-seed stability, threshold sweeps
- Risk modeling: credit risk, fraud and anomaly detection, model validation, threshold tuning, fairness metrics
- Infrastructure and data: FastAPI, Docker, Google Cloud Run, GitHub Actions CI/CD, Azure AI Foundry, Server-Sent Events, pytest, Azure ML, Slurm (WPI Turing HPC), Cloudflare R2, AES-GCM encryption, LanceDB, Neo4j, Gradio

## Writing

- DeepSeek-R1: The Open-Source AI Model Shaking Up the Industry (blog post, Medium)

## Elsewhere

- LinkedIn: https://www.linkedin.com/in/ankit-gole/
- GitHub: https://github.com/AnkitGole007

Contact: LinkedIn https://www.linkedin.com/in/ankit-gole/. Contact card (vCard, includes the email address): https://ankitgole.dev/vcard.vcf.

Canonical page: https://ankitgole.dev/. This markdown: https://ankitgole.dev/md/index.md. Written by Ankit Gole; generated from the site content model, last updated 2026-11-23.
