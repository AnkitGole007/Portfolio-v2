# FairnessEM: fairness-aware entity matching

A fairness loss for the Ditto entity matcher.

- Problem: An entity matcher can score a good F1 while its errors fall unevenly across groups of records.
- What was done: Added a PPVP fairness loss to Ditto in PyTorch and swept 11 loss weights across 10 configurations, 110 runs.
- What changed: Average disparity fell 74%, from 0.0355 to 0.0094 at the best weight per configuration, with F1 near 0.82.

> Added a PPVP fairness loss to the Ditto entity matcher in PyTorch. Across 110 runs, average group disparity fell from 0.0355 to 0.0094 at the best alpha per configuration, while F1 held near 0.82.

- Kind: Research
- Period: Jan 2026 to May 2026 (completed)
- Team: Ankit Gole with Nicholas Pulsone
- Repository: https://github.com/AnkitGole007/Fairness-In-Entity-Matching/tree/ag/phase3

## Problem

An entity matcher can reach a good F1 while its errors fall unevenly across groups of records. A fairness fix only counts if F1 holds, because a model that stops predicting matches looks fair for the wrong reason.

## Approach

I added a PPVP fairness loss to the Ditto matcher in PyTorch, weighted by alpha. I ran 10 configurations at 11 alpha values, 110 runs in all, and compared average group disparity and F1 at each weight.

## Results

- Average disparity fell 0.0355 to 0.0094 (74%) at each configuration's best alpha.
- Average F1 moved from 0.816 to 0.820.
- Swept 10 configurations at 11 alpha values, 110 runs in all.
- Flagged false fairness at alpha 1.0, where F1 collapsed to 0.0113.
- Near-zero disparity there came from a model that made almost no positive predictions.

## Key numbers

- Average group disparity cut, best alpha per configuration: 74%
- Average group disparity, best alpha per configuration: 0.0355 to 0.0094
- Average F1: 0.816 to 0.820
- Runs, 10 configurations x 11 alpha values: 110
- F1 at alpha 1.0, false fairness: 0.0113

## Stack

PyTorch, Ditto, entity matching, fairness metrics, PPVP loss

Canonical page: https://ankitgole.dev/projects/fairness-em. This markdown: https://ankitgole.dev/md/projects/fairness-em.md. Written by Ankit Gole; generated from the site content model, last updated 2026-11-23.
