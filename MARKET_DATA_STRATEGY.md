# Market Data Strategy

FinSight AI will use market data as a research context layer, not as a buy/sell engine. The current implementation uses mock provider fixtures and does not call real-time or paid market data APIs.

## Current Scaffold

Implemented files:

- `types/market.ts`
- `lib/market/mock-market-data.ts`
- `lib/market/market-score.ts`
- `app/api/market/[ticker]/route.ts`
- `components/market/market-intelligence-card.tsx`

Current route:

- `GET /api/market/[ticker]`

Current supported mock fields:

- Latest share price
- Daily change and percentage change
- Historical price chart data
- 1W, 1M, 6M, and 1Y performance
- 52-week high and low
- Market cap
- Current and average volume
- Volume change
- Volatility
- Moving averages
- Drawdown
- Relative performance versus a mock index

## Market Momentum Score

The Market Momentum Score is 0-100 and currently combines:

- Price trend
- Volatility
- Volume change
- Moving average position
- Drawdown

It is a research signal only. It is not a recommendation and should not override the financial health model.

## Future Providers

Candidate market data providers:

- Finnhub
- Alpha Vantage
- Polygon
- Financial Modeling Prep

Provider integration should be API-first. Do not add scraping for market data while stable licensed APIs are available. Real-time or paid data should only be enabled when environment variables and provider terms are configured.

## Provider Abstraction Plan

Future provider module shape:

```text
lib/market/providers/
  mock.ts
  finnhub.ts
  alpha-vantage.ts
  polygon.ts
  financial-modeling-prep.ts
```

Provider functions should normalize vendor responses into `CompanyMarketData`. The UI and investment-health score should never depend on vendor-specific fields.

## Data Quality Rules

Before using real data:

- Store provider name and retrieval timestamp.
- Preserve raw provider identifiers where possible.
- Validate currency, exchange, and ticker matching.
- Handle delayed data labels clearly.
- Avoid mixing split-adjusted and unadjusted prices.
- Never imply real-time accuracy unless the provider contract supports it.
