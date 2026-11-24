# PRISEM: budget-aware entity matching

Research demo system at the WPI YOSSI Lab.

- Problem: Checking every record pair with an LLM or a person costs more than a fixed budget allows.
- What was done: Co-built a four-tier router: rules, an embedding model, 4-bit LLMs on CPU and human review, routed by uncertainty.
- What changed: On a 91-pair demo, raising the budget from 150 to 250 units cut human review from 80 pairs to 2.

> PRISEM splits record pairs across four cost tiers under a fixed budget: rules, a sentence-embedding model, CPU-only quantized LLMs and human review. Uncertain pairs move up a tier, and overflow shifts to cheaper tiers to stay on budget.

- Kind: Research
- Period: Aug 2025 to Mar 2026 (completed)
- Affiliation: Worcester Polytechnic Institute, YOSSI Lab
- Role: AI Researcher
- Team: Ankit Gole with Nicholas Pulsone

## Problem

Entity matching decides whether two records describe the same thing. LLM matchers cost money per pair, and human review costs more. A system with a fixed budget has to decide which pairs deserve the expensive check.

## Approach

A rule-based scorer over 8 lexical features, such as Jaccard, Levenshtein and token sort, keeps confident pairs. The least certain go to a BGE sentence-embedding model with isotonic calibration, then to 4-bit quantized LLMs run CPU-only through llama.cpp (Qwen2.5-1.5B, Phi-3.5-mini, Jellyfish-8B), scored by reading Yes and No token log-probabilities. A Gradio interface tracks the budget live.

## Results

- Co-built PRISEM, a four-tier entity matcher that stays within a fixed budget.
- A rule scorer over 8 lexical features keeps confident pairs out of costly tiers.
- Turned 4-bit Qwen2.5-1.5B, Phi-3.5-mini and Jellyfish-8B into CPU-only match scorers.
- Scored matches from Yes and No token log-probabilities, with no GPU or paid API.
- Calibrated embedding scores with isotonic regression.
- Built the Gradio review interface, so people check only uncertain matches.
- A larger demo budget cut human review from 80 to 2 of 91 pairs.

## Key numbers

- Pairs flagged for human review out of 91, budget 150 then 250 units: 80 to 2
- Cost tiers: 4
- Lexical features in the rule tier: 8

## Stack

entity matching, llama.cpp, GGUF, Qwen2.5-1.5B, Phi-3.5-mini, Jellyfish-8B, BGE, isotonic regression, Gradio

## Role

AI Researcher, Worcester Polytechnic Institute, YOSSI Lab, Aug 2025 to Mar 2026. Co-built PRISEM, a budget-aware entity matching demo system that splits record pairs across four cost tiers under a fixed budget.

Canonical page: https://ankitgole.dev/projects/prisem. This markdown: https://ankitgole.dev/md/projects/prisem.md. Written by Ankit Gole; generated from the site content model, last updated 2026-11-23.
