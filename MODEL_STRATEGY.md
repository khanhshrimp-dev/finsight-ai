# FinSight AI Model Strategy

FinSight AI should use a hybrid architecture. Financial models, accounting rules, market intelligence, and news intelligence produce numerical scores and red flags. AI explains the results, drafts analyst narratives, and supports the copilot experience.

## 1. Current Stage - Deterministic Risk Scoring

Use a transparent formula-based risk score for UI demos and scenario simulation.

Purpose:

- Fast to implement
- Explainable
- Stable for demos
- Easy to debug
- Good for scenario simulator

The deterministic score should range from 0 to 100:

- 0-24: Low Risk
- 25-49: Moderate Risk
- 50-74: High Risk
- 75-100: Critical Risk

The score should be based on interpretable financial dimensions:

- Liquidity risk
- Leverage risk
- Profitability risk
- Cash flow risk
- Growth risk

Expected signals:

- Lower current ratio increases risk.
- Lower quick ratio increases risk.
- Higher debt-to-equity increases risk.
- Lower interest coverage increases risk.
- Negative margins increase risk.
- Negative operating cash flow increases risk.
- Revenue decline increases distress risk.
- Revenue growth without cash flow support increases fraud concern.
- Rising receivables versus revenue increases fraud concern when available.

The current Financial Health Score is a research proxy derived from the deterministic financial risk layer. It should become a separate calibrated score once real data is available.

Limitations:

- This is not a validated credit model.
- It should be clearly labeled as a deterministic demo foundation.
- It should be easy to replace or calibrate when real financial datasets are available.

## 2. Baseline Financial Models

Implement these first when real data is ready.

### A. Logistic Regression

Purpose:

- Simple
- Explainable
- Strong interview value
- Useful coefficients
- Good baseline for financial distress classification

Expected features:

- Current ratio
- Quick ratio
- Debt-to-equity
- Interest coverage
- Gross margin
- Net margin
- ROA
- ROE
- Operating cash flow ratio
- Revenue growth
- Debt-to-assets
- Asset turnover
- Altman-style ratios

Expected output:

- Probability of distress or high-risk classification
- Coefficients by feature
- Directional explanation for each coefficient

### B. Random Forest

Purpose:

- Captures non-linear relationships
- Gives feature importance
- Stronger than a simple linear baseline
- Still easy to explain

Expected output:

- Risk classification probability
- Feature importance ranking
- Confusion matrix and performance metrics

## 3. Advanced Financial Models For Later

Do not implement these until the data pipeline, baselines, and evaluation process are ready.

### A. XGBoost

Use later as a high-performance gradient boosting model for structured/tabular financial data.

### B. LightGBM

Use later for fast, scalable gradient boosting, especially if the dataset becomes larger.

### C. CatBoost

Use later if the project includes more categorical variables such as industry, sector, listing market, audit opinion type, company category, or region.

## 4. Explainability Strategy

The explainability layer should include:

- Logistic regression coefficients
- Random forest feature importance
- Gradient boosting feature importance later
- SHAP values later

Near-term deterministic explainability should include:

- Risk category subscores
- Top risk drivers
- Accounting red flag rules
- Scenario before/after deltas
- Most sensitive metric analysis

## 5. AI Layer Strategy

The AI layer should not replace the financial model.

The AI layer should:

- Explain model outputs
- Explain risk drivers
- Generate executive summaries
- Generate recommendations
- Answer user questions through the copilot
- Generate report-style narratives

The AI layer should clearly state that its narrative is based on:

- The numerical model output
- Financial ratios
- Accounting red flag rules
- Benchmark data
- Scenario changes when relevant

It should not claim to independently calculate, validate, or certify the risk score.

## 6. Market And News Intelligence

Market and news signals should be separate from the financial risk model.

Market intelligence should provide:

- Latest share price
- Historical price trend
- 1W, 1M, 6M, and 1Y performance
- 52-week high/low
- Market cap
- Volume and average volume
- Volatility
- Moving average position
- Drawdown
- Relative performance versus index

News intelligence should provide:

- Company news ingestion
- Source tracking
- Deduplication
- Entity matching
- Sentiment classification
- Financial event classification
- Severity scoring
- Recency weighting
- Event risk impact
- AI summarization after deterministic classification

Current implementation uses mock market/news providers only. Future provider integrations should be API-first. Scraping should only be considered later where it is compliant with robots.txt, source terms, and copyright constraints.

## 7. Investment Health Score

The Investment Health Score is a composite research signal, not a recommendation.

Current formula:

```text
0.35 * Financial Health Score
+ 0.20 * Market Momentum Score
+ 0.15 * News Sentiment Score
+ 0.15 * Valuation Score
+ 0.15 * (100 - Risk Score)
```

Current labels:

- Strong
- Watchlist
- Mixed
- Weak
- High Uncertainty

The score should always include component scores, weights, drivers, and a disclaimer.

## 8. Final Hybrid Architecture

Final intended system:

```text
Financial data
-> feature engineering
-> financial health model
-> numerical risk model
-> accounting red flag rules
-> market data score
-> news/event sentiment score
-> investment health composite
-> explainability layer
-> AI analyst narrative
-> dashboard/report/copilot output
```

This architecture keeps the platform credible: numbers come from financial models, rules, and deterministic/provider-backed signal layers; language comes from AI.
