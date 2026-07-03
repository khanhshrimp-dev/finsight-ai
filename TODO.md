# TODO

## High Priority

- Add focused tests for `lib/risk/scoring.ts`, `lib/risk/fraud-signals.ts`, and `lib/risk/scenario.ts`.
- Add focused tests for `lib/market/market-score.ts`, `lib/news/news-score.ts`, and `lib/investment/investment-health.ts`.
- Align the company fraud tab with generated fraud rules instead of only authored mock fraud cards.
- Persist saved scenarios once backend persistence exists.
- Add named scenario templates such as liquidity rescue, leverage stress, margin compression, and growth-quality review.
- Add a real LLM provider adapter behind `lib/ai/risk-analyst.ts` after provider and key management decisions are made.
- Replace the Investment Health Score valuation placeholder with a documented valuation model.

## Stabilisation

- Review `npm audit` findings: 10 total, including 3 high severity.
- Keep lint, typecheck, and build clean after each feature pass.

## Product and Data

- Define real financial statement import schema.
- Add CSV parser and validation.
- Choose market data provider strategy: Finnhub, Alpha Vantage, Polygon, Financial Modeling Prep, or a staged combination.
- Choose news provider strategy: Finnhub company news, Alpha Vantage News Sentiment, NewsAPI, GDELT, or a staged combination.
- Define market/news storage schema with provider metadata, source URLs, data freshness, and deduplication keys.
- Decide Supabase/Postgres schema for companies, periods, metrics, alerts, scenarios, and reports.
- Add test fixtures for scoring and fraud signal rules.
- Add test fixtures for market data, news events, and investment health score labels.

## Future

- Add baseline logistic regression once real labeled data is available.
- Add random forest and feature importance after baseline evaluation.
- Add gradient boosting and SHAP only after the baseline models and data pipeline are stable.
- Add compliant scraping research only after API-first sources and source terms are evaluated.
- Add real-time market data only after provider licensing and env vars are configured.
- Add real PDF/report export.
- Add CI checks for lint, typecheck, build, and tests.
