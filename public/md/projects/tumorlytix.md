# TumorLytix: unsupervised brain tumor detection

A conditional diffusion U-Net that needs no labeled masks.

- Problem: Supervised tumor detectors need a labeled mask for every training scan.
- What was done: Trained a conditional diffusion U-Net in PyTorch to rebuild each MRI scan's healthy version and flag the difference.
- What changed: Reached 92.17% reconstruction accuracy and lifted average precision over CycleGAN from 0.47 to 0.52 on 4 test scans.

> A conditional diffusion U-Net in PyTorch rebuilds a healthy version of each MRI scan, and the difference flags the tumor. No labeled masks needed. Compared against a CycleGAN baseline on 4 hand-labeled test scans.

- Kind: Computer vision
- Period: Sep 2024 to Dec 2024 (completed)
- Repository: https://github.com/Sonica-B/TumorLytix

## Problem

Supervised tumor detectors learn from labeled masks. This project detects tumors without them, by learning what a healthy scan looks like.

## Approach

A conditional diffusion U-Net in PyTorch rebuilds the healthy version of each MRI scan. The difference between the scan and its healthy rebuild flags the tumor. A CycleGAN baseline does the same job for comparison, scored on 4 hand-labeled test scans.

## Results

- Detected tumors without labeled masks by rebuilding each scan's healthy version.
- Reached 92.17% healthy-reconstruction accuracy.
- Average precision 0.52 vs 0.47 for CycleGAN on 4 hand-labeled test scans.
- Higher average precision than CycleGAN on 3 of 4 scans.
- Average Dice was lower than CycleGAN: 0.57 vs 0.60.
- 4 test scans is a small sample.

## Key numbers

- Healthy-reconstruction accuracy: 92.17%
- Average precision vs CycleGAN, 4 test scans: 0.52 vs 0.47
- Average Dice vs CycleGAN, 4 test scans: 0.57 vs 0.60

## Stack

PyTorch, diffusion models, U-Net, CycleGAN, MRI

Canonical page: https://ankitgole.dev/projects/tumorlytix. This markdown: https://ankitgole.dev/md/projects/tumorlytix.md. Written by Ankit Gole; generated from the site content model, last updated 2026-11-23.
