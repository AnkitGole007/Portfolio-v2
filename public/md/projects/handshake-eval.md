# Blinded evaluation of AI coding agents

Head-to-head agent evaluation at Handshake AI.

- Problem: A green test suite can hide a broken build, so agent claims need checking by hand.
- What was done: Ranked and rubric-scored 20 blinded coding-agent sessions across 10 tasks, re-running every build to verify agent claims.
- What changed: Caught failures a green suite missed, including a run where every test passed while a required field was missing.

> Each task gives two AI coding agents the same prompt in the same Docker container. I run both sessions, verify each build by hand, rank the pair on a 7-point preference scale and grade each on a 4-dimension rubric.

- Kind: AI evaluation
- Period: Aug 2026 to present (ongoing)
- Affiliation: Handshake AI
- Role: AI Trainer

## Problem

Comparing two AI coding agents means checking what each one built. A test suite can pass on broken output, and an agent's summary can claim things that are not true.

## Approach

Both agents get the same prompt in the same Docker container. I run both sessions, re-run each build to verify it, rank the pair on a 7-point scale from -3 to +3 and grade each run on correctness, agent behavior, communication and code style. Failures go on a 19-code taxonomy. Tasks covered Python, Kotlin, Java with Maven, C++, GDScript and Mercurial history editing.

## Results

- Ran 20 blinded sessions across 10 tasks in Python, Java, Kotlin, C++ and GDScript.
- Re-ran builds in Docker to verify claims: 477 checks, 0 failed on one task.
- Logged each failure on a 19-code taxonomy.
- Read session traces up to 5.2 MB to compare agent efficiency.
- One agent took 167 turns and 158 tool calls, the other 48 and 40.
- Cut evaluation snapshot size 98.8%, from 658 MB to 7.7 MB.
- Fixed a Docker bind-mount bug that silently lost a full run.
- Wrote a six-point pre-flight checklist for every session.
- Caught an agent summary citing a string that was not a product name.
- Delivered 763 screenshots across tasks 4 to 10.

## Key numbers

- Blinded sessions graded, across 10 tasks: 20
- Evaluation snapshot size: 658 MB to 7.7 MB (98.8% smaller)
- Verification run on one task: 477 checks, 0 failed
- Failure taxonomy: 19 codes
- Rubric dimensions: 4
- Largest session trace reviewed: 5.2 MB

## Stack

Docker, Python, Kotlin, Java, Maven, C++, GDScript, Mercurial, pairwise preference ranking, rubric scoring, agent trace review

## Role

AI Trainer, Handshake AI, Aug 2026 to present. Run blinded head-to-head evaluations of two AI coding agents, verifying each build by hand before ranking and grading.

Canonical page: https://ankitgole.dev/projects/handshake-eval. This markdown: https://ankitgole.dev/md/projects/handshake-eval.md. Written by Ankit Gole; generated from the site content model, last updated 2026-11-23.
