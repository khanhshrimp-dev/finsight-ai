# News Intelligence Strategy

FinSight AI will use news intelligence to identify relevant company events, classify sentiment, and explain event risk. The current implementation uses mock news data only. It does not call real news APIs and does not scrape websites.

## Current Scaffold

Implemented files:

- `types/news.ts`
- `lib/news/mock-news-data.ts`
- `lib/news/news-score.ts`
- `lib/news/event-classifier.ts`
- `app/api/news/[ticker]/route.ts`
- `components/news/news-intelligence-card.tsx`

Current route:

- `GET /api/news/[ticker]`

News item fields:

- `id`
- `ticker`
- `companyId`
- `title`
- `source`
- `url`
- `publishedAt`
- `summary`
- `sentiment`
- `eventType`
- `severity`
- `relevanceScore`
- `confidenceScore`
- `riskImpact`

## Event Types

Supported event types:

- `earnings`
- `guidance`
- `lawsuit`
- `regulatory`
- `management_change`
- `m_and_a`
- `product`
- `restructuring`
- `debt`
- `analyst_rating`
- `macro`
- `accounting_issue`
- `fraud_investigation`
- `other`

## News Sentiment Score

The News Sentiment Score is 0-100 and currently combines:

- Sentiment classification
- Event severity
- Risk impact
- Relevance score
- Confidence score
- Recency weighting

The score is a research signal and should trigger review. It is not a finding of fraud, an audit conclusion, or an investment recommendation.

## Future News Sources

Candidate API sources:

- Finnhub company news
- Alpha Vantage News Sentiment
- NewsAPI
- GDELT

Scraping may be considered later only where it is compliant with source terms, robots.txt, copyright constraints, and internal policy. API-first ingestion should remain the default.

## Future Pipeline

Target pipeline:

```text
Source fetch
-> source metadata capture
-> entity matching
-> deduplication
-> event classification
-> sentiment classification
-> severity scoring
-> recency weighting
-> AI summarization
-> dashboard/report output
```

## Data Governance Rules

Future ingestion should:

- Store source, URL, author or publisher when available, and retrieval timestamp.
- Deduplicate syndicated articles and near-identical headlines.
- Track confidence for entity matching.
- Separate event classification from AI-generated summary text.
- Preserve enough metadata to audit why an event affected the score.
