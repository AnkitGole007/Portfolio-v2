# Credit risk LLM: Phi-4-mini on anonymized credit records

PayPal-sponsored WPI Graduate Qualifying Project, team of 4.

- Problem: The project tested whether an LLM can assess credit risk from 692,922 anonymized tabular records.
- What was done: Fine-tuned Phi-4-mini with LoRA on Azure, turning each record into a text prompt of 22 features selected from 216.
- What changed: Matched XGBoost while training on about 5% of the data, and a re-check traced most of every model's score to one feature.

> A PayPal-sponsored WPI Graduate Qualifying Project. I fine-tuned Phi-4-mini with LoRA to score anonymized credit records as text and matched XGBoost. A re-check then showed one binary feature carries most of every model's score.

- Kind: LLM systems
- Period: Aug 2025 to Dec 2025 (completed)
- Affiliation: PayPal-sponsored WPI Graduate Qualifying Project
- Role: Owned the LLM fine-tuning and the encrypted data transfer
- Team: Ankit Gole with Om Sawant, Edward Smith, Taya Yakovenko
- Recognition: Data Science GQP MVP and 3rd Best Data Science GQP Team, Fall 2025

## Problem

PayPal Global Credit Risk sponsored the project, titled Applications of LLM Generalization Potential for Credit Risk Assessment. The data held 692,922 anonymized records with 216 attributes, 215 features plus the label. The question was whether a fine-tuned LLM could match classic baselines, with the data moved to a GPU cluster without leakage.

## Approach

I owned all the LLM fine-tuning, on Azure AI Foundry and on the WPI Turing HPC cluster with Slurm. Records became CALM-style text prompts over 22 selected features. Phi-4-mini was fine-tuned with LoRA on Azure AI Foundry. Baselines were XGBoost, random forest and SVM over 10 seeds. I moved the data to Slurm over an AES-GCM encrypted transfer. Feature selection and imputation were a teammate's work.

## Results

- Fine-tuned Phi-4-mini with LoRA on Azure, on 22 features selected from 216.
- Matched XGBoost: accuracy 0.947 vs 0.944, MCC 0.835 vs 0.826.
- The two scores come from different test sets, so the result is a match.
- Baselines were XGBoost, random forest and SVM over 10 seeds, on 692,922 records.
- Trained on about 5% of the data.
- Shuffling input fields moved KS only from 0.743 to 0.733.
- F1, MCC and KS held steady across cutoffs from 0.2 to 0.8 (Phi-3.5-mini).
- Over 30 Phi-3.5-mini runs, accuracy averaged 0.9431 with SD 0.0023.
- LoRA adapter capacity, not base model size, was the main performance limit.
- Moved the data to WPI's Slurm GPU cluster over an AES-GCM encrypted transfer.
- Re-check: one binary feature, attribute213, alone scores accuracy 0.9441 and MCC 0.8261.
- Most of every model's score comes from that feature, a likely leak.
- The feature also pointed at the 27% of good cases no model separates.

## Key numbers

- Accuracy, Phi-4-mini vs XGBoost (different test sets): 0.947 vs 0.944
- MCC, Phi-4-mini vs XGBoost: 0.835 vs 0.826
- Anonymized records: 692,922
- One binary feature alone (attribute213), accuracy and MCC: 0.9441 and 0.8261
- KS, Phi-4-mini: 0.743
- Share of the data used for training: about 5%
- Good cases no model separates: 27%

## Stack

Phi-4-mini, LoRA, Azure AI Foundry, Slurm, WPI Turing HPC, XGBoost, AES-GCM

Canonical page: https://ankitgole.dev/projects/paypal-gqp-credit-risk. This markdown: https://ankitgole.dev/md/projects/paypal-gqp-credit-risk.md. Written by Ankit Gole; generated from the site content model, last updated 2026-11-23.
