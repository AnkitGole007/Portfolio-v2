# TrendEd Pathfinder: course to job matching

Job recommendations from university course catalogs.

- Problem: Students cannot easily see which jobs their courses prepare them for.
- What was done: Matched course catalogs to scraped job postings with TF-IDF, LDA topics and cosine similarity, in a team of 5.
- What changed: Users rated relevance 4/5 on average in surveys, though life sciences postings matched poorly.

> Matches university course catalogs to scraped job postings from LinkedIn, Handshake and the Adzuna API with TF-IDF, LDA topics and cosine similarity. Users rated its recommendations 4/5 for relevance on average in surveys.

- Kind: NLP
- Team: Ankit Gole with Blake Bruell, Harrison Taylor, Shreya Boyane, Sakshi Kulkarni
- Repository: https://github.com/Sonica-B/TrendED

## Problem

A course catalog says what a student learns. A job posting says what an employer wants. The two rarely use the same words.

## Approach

Job postings came from LinkedIn, Handshake and the Adzuna API. TF-IDF and LDA topics describe each course and each posting, and cosine similarity ranks the matches.

## Results

- Average 4/5 relevance in user surveys.
- Scraped postings from LinkedIn, Handshake and the Adzuna API.
- The model struggled with life sciences postings.

## Key numbers

- Relevance in user surveys, average: 4/5

## Stack

TF-IDF, LDA, cosine similarity, web scraping, Adzuna API

Canonical page: https://ankitgole.dev/projects/trended-pathfinder. This markdown: https://ankitgole.dev/md/projects/trended-pathfinder.md. Written by Ankit Gole; generated from the site content model, last updated 2026-11-23.
