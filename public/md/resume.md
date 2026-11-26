# Ankit Gole

AI/ML Engineer. San Jose, CA. https://ankitgole.dev

- LinkedIn: https://www.linkedin.com/in/ankit-gole/
- GitHub: https://github.com/AnkitGole007

Contact: LinkedIn https://www.linkedin.com/in/ankit-gole/. Contact card (vCard, includes the email address): https://ankitgole.dev/vcard.vcf.

Open to AI/ML, LLM and applied AI engineering roles anywhere in the US, including remote. OPT starting June 2026, with the 24-month STEM OPT extension available, about 3 years total. Will need H-1B sponsorship later.

## Summary

I build LLM-based applications that help people with real workflows and daily tasks. I rebuilt the search backend of Research Agent, an open-source paper search tool at the B2 Foundation, and I run blinded evaluations of AI coding agents at Handshake AI. At WPI I fine-tuned Phi-4-mini with LoRA for a credit risk Graduate Qualifying Project and co-built PRISEM, a budget-aware entity matching system. MS in Artificial Intelligence, May 2026, GPA 3.88.

## Education

### Worcester Polytechnic Institute

Master of Science in Artificial Intelligence. Worcester, MA. Aug 2024 to May 2026. GPA 3.88/4.0.

Coursework: Large Language Models, Generative AI, Deep Learning, Natural Language Processing, MLOps.

- Data Science GQP MVP, Fall 2025
- 3rd Best Data Science GQP Team, Fall 2025

### PES Modern College of Engineering

Bachelor of Engineering in Information Technology. Pune, India. Jun 2018 to Aug 2022.

Leadership: NSS Technical Team Head, President of Graphix Club.

## Experience

### AI Trainer

Handshake AI, Remote. Contract. Aug 2026 to present.

- Rank and rubric-score 20 blinded coding-agent runs across 10 tasks, re-running every build to verify claims.

### AI Research Contributor

The Benevolent Bandwidth Foundation (B2 Foundation), Remote. Volunteer, open source. Feb 2026 to present.

- Merged SQLite, FAISS and BM25 into one LanceDB index of 385,000+ papers on Google Cloud Run.
- Fixed five bugs behind a 24+ minute stall and crash. Afterward: 47.7 seconds, zero errors.
- Sped up reranking about 3x on CPU with a 150M ModernBERT cross-encoder, MTEB 0.584 vs 0.553.
- Built, not shipped: LLM-as-judge ranking evaluation, Kendall's tau 0.316 over 16 queries.

### AI Researcher

Worcester Polytechnic Institute, YOSSI Lab, Worcester, MA. Research role. Aug 2025 to Mar 2026.

- Co-built PRISEM, which splits record pairs across rules, an embedding model, LLMs and human review.
- Ran 4-bit Qwen2.5-1.5B, Phi-3.5-mini and Jellyfish-8B on CPU as match scorers, with no paid APIs.
- A larger demo budget cut human review from 80 to 2 of 91 pairs.

Advisor: Prof. Roee Shraga.

### Systems Engineer

Atos, Pune, India. IT operations. Jul 2022 to Jul 2024.

- Automated about 25% of daily ticket work with Python and a TensorFlow classifier.

## Projects

### Credit risk LLM: Phi-4-mini on anonymized credit records

PayPal-sponsored WPI Graduate Qualifying Project, team of 4. Owned the LLM fine-tuning and the encrypted data transfer. Aug 2025 to Dec 2025. Data Science GQP MVP and 3rd Best Data Science GQP Team, Fall 2025.

- Fine-tuned Phi-4-mini with LoRA on Azure, on 22 features selected from 216.
- Matched XGBoost: accuracy 0.947 vs 0.944, MCC 0.835 vs 0.826.
- Shuffling input fields moved KS only from 0.743 to 0.733.

Page: https://ankitgole.dev/projects/paypal-gqp-credit-risk (markdown: https://ankitgole.dev/md/projects/paypal-gqp-credit-risk.md).

### FairnessEM: fairness-aware entity matching

A fairness loss for the Ditto entity matcher. Jan 2026 to May 2026.

- Average disparity fell 74%, from 0.0355 to 0.0094 at the best weight per configuration, with F1 near 0.82.

Page: https://ankitgole.dev/projects/fairness-em (markdown: https://ankitgole.dev/md/projects/fairness-em.md).

### RealmWeaver-AI (MADWE): a four-agent diffusion world engine

Game worlds built by four generative agents and rendered in Unity. Architecture and Integration Lead. 2025.

- Led architecture and integration: four agents on a shared world state graph, connected to Unity over named-pipe IPC.

Page: https://ankitgole.dev/projects/realmweaver-madwe (markdown: https://ankitgole.dev/md/projects/realmweaver-madwe.md).

### TumorLytix: unsupervised brain tumor detection

A conditional diffusion U-Net that needs no labeled masks. Sep 2024 to Dec 2024.

- Reached 92.17% reconstruction accuracy and lifted average precision over CycleGAN from 0.47 to 0.52 on 4 test scans.

Page: https://ankitgole.dev/projects/tumorlytix (markdown: https://ankitgole.dev/md/projects/tumorlytix.md).

## Technical skills

- Languages and ML: Python, PyTorch, SQL, Hugging Face Transformers, scikit-learn, TensorFlow, XGBoost, PEFT and LoRA, pandas, NumPy, 4-bit quantization (GGUF, llama.cpp), isotonic calibration
- LLMs and retrieval: LoRA fine-tuning, RAG and retrieval, hybrid search, reranking (SPECTER2, cross-encoders), LLM-as-judge, prompt engineering, Reciprocal Rank Fusion, multi-provider LLM fallback (Groq, OpenRouter, Ollama, OpenAI, Anthropic, Gemini, Vertex AI), LangChain, LangGraph
- Evaluation: pairwise preference ranking, rubric scoring, agent trace review, NDCG, Kendall's tau, failure taxonomies, Recall@k, MCC, KS, F1, multi-seed stability, threshold sweeps
- Risk modeling: credit risk, fraud and anomaly detection, model validation, threshold tuning, fairness metrics
- Infrastructure and data: FastAPI, Docker, Google Cloud Run, GitHub Actions CI/CD, Azure AI Foundry, Server-Sent Events, pytest, Azure ML, Slurm (WPI Turing HPC), Cloudflare R2, AES-GCM encryption, LanceDB, Neo4j, Gradio

Canonical page: https://ankitgole.dev/resume. This markdown: https://ankitgole.dev/md/resume.md. Written by Ankit Gole; generated from the site content model, last updated 2026-11-23.
