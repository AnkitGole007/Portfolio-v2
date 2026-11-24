# Research Agent: open-source paper search

Search backend rebuild for the B2 Foundation.

- Problem: Long searches stalled for 24+ minutes and then crashed, and 50.8% of the corpus had no embeddings.
- What was done: Merged SQLite, FAISS and BM25 into one LanceDB index, traced the crash to five bugs, and backfilled embeddings for 196,082 rows.
- What changed: After the fixes, a search that had stalled 24+ minutes and crashed finished in 47.7 seconds with zero errors.

> Research Agent turns a plain-English research need into a short ranked reading list with evidence for each paper. I rebuilt its search backend into one LanceDB index of 385,000+ papers served by FastAPI on Google Cloud Run.

- Kind: LLM systems
- Period: Feb 2026 to present (ongoing)
- Affiliation: The Benevolent Bandwidth Foundation (B2 Foundation)
- Role: AI Research Contributor (volunteer)
- Team: Ankit Gole with Nurtekin Savas, Shan Ali Shah Sayed, Zulfa Mohamed, pavithrakumar1118, sabooshagun, eman-cickusic
- Repository: https://github.com/AnkitGole007/researchagent

## Problem

Research Agent searches a stored library of about 385,000 to 390,000 computer science papers from arXiv and Semantic Scholar. Search ran across SQLite, FAISS and BM25. Long searches stalled and crashed, 50.8% of the corpus had no embeddings, and Cloud Run ran out of memory.

## Approach

A query parser reads the brief, with a 4-tier fallback from Groq to OpenRouter to Ollama Cloud to rules. LanceDB hybrid full-text and vector search on Cloudflare R2 fuses results with Reciprocal Rank Fusion to 1,200 candidates. SPECTER2 reranks them to 200, then a gte-reranker-modernbert-base cross-encoder ranks the reading list and MiniLM picks evidence sentences. FastAPI streams results over Server-Sent Events.

## Pipeline

- Papers in the corpus, 2026-07-22 build: 385,655
- Candidates after hybrid search and Reciprocal Rank Fusion: 1,200
- Papers after the SPECTER2 rerank: 200
- Reading list after the cross-encoder rerank

## Results

- Merged SQLite, FAISS and BM25 into one LanceDB index of 385,000+ papers.
- Traced a 24+ minute crash to five bugs in LLM timeouts and connection pooling.
- After the fix, the same search finished in 47.7 seconds with zero errors.
- Cut two slow queries from 185.2 s to 14.3 s and 10.4 s.
- Backfilled embeddings for 196,082 rows in a 14-hour checkpointed run.
- Swapped a 568M cross-encoder for a 150M ModernBERT model, about 3x faster on CPU.
- The new reranker scores higher on MTEB, 0.584 vs 0.553.
- Cut Cloud Run peak memory from out-of-memory crashes to about 55% of 8 GiB.
- Rebuilt two broken filters that matched only 21 and 2 of about 390,000 papers.
- Built, not shipped: an LLM-as-judge ranking evaluation, Kendall's tau 0.316 over 16 queries.
- That evaluation caught a scoring change that would have cut tau to 0.080.

## Key numbers

- Long search, stall and crash fixed (zero errors after): 24+ min to 47.7 s
- Papers in the corpus (2026-07-22 build): 385,655
- Two slow queries after the embedding backfill: 185.2 s to 14.3 s and 10.4 s
- Reranker speed on CPU: about 3x faster
- Reranker MTEB score, new vs old: 0.584 vs 0.553
- Reranker size: 568M to 150M parameters
- Cloud Run peak memory: 100% (OOM) to about 55% of 8 GiB
- Ranking baseline, Kendall's tau over 16 queries (built, not shipped): 0.316
- NDCG@10 over 19 queries (built, not shipped): 0.81

## Stack

Python, FastAPI, Server-Sent Events, LanceDB, Cloudflare R2, Reciprocal Rank Fusion, SPECTER2, cross-encoder reranking, Google Cloud Run, Docker, GitHub Actions, pytest

## Role

AI Research Contributor, The Benevolent Bandwidth Foundation (B2 Foundation), Feb 2026 to present. Rebuilt the search backend of Research Agent, a free open-source tool that turns a research brief into a ranked reading list.

Canonical page: https://ankitgole.dev/projects/b2-research-agent. This markdown: https://ankitgole.dev/md/projects/b2-research-agent.md. Written by Ankit Gole; generated from the site content model, last updated 2026-11-23.
