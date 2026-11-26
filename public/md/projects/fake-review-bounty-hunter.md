# Fake Review Bounty Hunter: fraud signals in Yelp reviews

Fraud detection with NLP and graph analytics.

- Problem: A business with high star ratings can have reviews whose sentiment says otherwise.
- What was done: Scored reviews with DistilBERT and mapped reviewer links in Neo4j, with PySpark and PostgreSQL behind it.
- What changed: On 5,000 Yelp reviews, it flagged 15% of businesses whose high ratings did not match their review sentiment.

> A fraud-signal pipeline that scores reviews with DistilBERT and maps reviewer links in a Neo4j graph. On a 5,000-review Yelp sample it flagged 15% of businesses whose high ratings did not match their review sentiment.

- Kind: NLP
- Period: Feb 2025 to May 2025 (completed)
- Repository: https://github.com/AnkitGole007/Fake-Review-Bounty-Hunter

## Problem

Star ratings and review text can disagree. A business whose high ratings do not match the sentiment of its reviews is a fraud signal worth a closer look.

## Approach

DistilBERT scores the sentiment of each review. A Neo4j graph maps the links between reviewers. PySpark and PostgreSQL handle the data. The sample was 5,000 reviews drawn from a 6M-review Yelp dataset.

## Results

- Scored reviews with DistilBERT and mapped reviewer links in Neo4j.
- Sampled 5,000 reviews from a 6M-review Yelp dataset.
- Flagged 15% of businesses whose high ratings did not match review sentiment.

## Key numbers

- Businesses flagged, ratings vs sentiment: 15%
- Yelp reviews in the sample: 5,000

## Stack

DistilBERT, Neo4j, PySpark, PostgreSQL, fraud detection

## Image

![Frame from the project's demo video: the Streamlit app accepts a new review and flags it twice, for a burst of positive or negative reviews in the last 48 hours and for a star rating that does not match the review.](https://ankitgole.dev/projects/fake-review-bounty-hunter/review-flags.webp)

Canonical page: https://ankitgole.dev/projects/fake-review-bounty-hunter. This markdown: https://ankitgole.dev/md/projects/fake-review-bounty-hunter.md. Written by Ankit Gole; generated from the site content model, last updated 2026-11-23.
