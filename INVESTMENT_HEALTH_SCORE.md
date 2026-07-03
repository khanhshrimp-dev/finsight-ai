# Investment Health Score

The Investment Health Score is a composite research signal. It is not a buy, sell, hold, valuation, credit-rating, audit, or fraud conclusion.

## Current Scaffold

Implemented files:

- `types/investment.ts`
- `lib/investment/investment-health.ts`
- `app/api/investment/analyze/route.ts`
- `components/investment/investment-health-panel.tsx`

Current route:

- `POST /api/investment/analyze`

## Formula

Current formula:

```text
0.35 * Financial Health Score
+ 0.20 * Market Momentum Score
+ 0.15 * News Sentiment Score
+ 0.15 * Valuation Score
+ 0.15 * (100 - Risk Score)
```

Current implementation note:

- Financial Health Score is currently a proxy derived from the deterministic financial risk model.
- Valuation Score is a placeholder until real valuation metrics are implemented.
- Market Momentum Score and News Sentiment Score currently use mock providers.

## Labels

Current labels:

- Strong
- Watchlist
- Mixed
- Weak
- High Uncertainty

These labels describe research monitoring status, not action recommendations.

## Responsibilities

The score should:

- Combine numeric signals from the financial model, market intelligence, news intelligence, valuation placeholder, and inverse risk score.
- Generate clear drivers.
- Preserve score components and weights for auditability.
- Carry a disclaimer wherever shown.

The score should not:

- Recommend buying, selling, holding, shorting, or avoiding a security.
- Override deterministic financial risk scoring.
- Make fraud, audit, solvency, or credit-rating conclusions.
- Use AI-generated text as a numerical input.

## Future Enhancements

- Replace the valuation placeholder with comparable multiples, DCF assumptions, and sector-relative valuation metrics.
- Separate Financial Health Score from the inverse Risk Score once the financial health model is calibrated.
- Persist component scores by analysis run.
- Add confidence and data freshness scores.
- Add tests for formula stability, label thresholds, and edge cases.
