# Changelog

## 2026-07-04

### Added

- Added roadmap, feature tracker, architecture, model strategy, changelog, and TODO documentation.
- Added deterministic risk scoring, classification, breakdown, driver, recommendation, fraud signal, and scenario helper modules under `lib/risk`.
- Added mock AI Risk Analyst abstraction and prompt builder under `lib/ai`.
- Added Scenario Simulator route at `/dashboard/simulator` with company selection, ratio controls, before/after score, score delta, changed drivers, recommendations, AI-ready narrative, reset, local save, and saved scenarios list.
- Added sidebar navigation entry for Scenario Simulator.
- Added typed API contracts and routes for `POST /api/risk/analyze`, `POST /api/risk/simulate`, `POST /api/ai/risk-analysis`, and `POST /api/reports/generate`.
- Added `npm run typecheck` script using `next typegen && tsc --noEmit`.
- Added market intelligence types, mock provider data, Market Momentum Score logic, `GET /api/market/[ticker]`, and a company overview Market Intelligence card.
- Added news intelligence types, mock news data, event classification, News Sentiment Score logic, `GET /api/news/[ticker]`, and a company overview News Intelligence card.
- Added Investment Health Score types, scoring logic, `POST /api/investment/analyze`, and a company overview Investment Health panel.
- Added `MARKET_DATA_STRATEGY.md`, `NEWS_INTELLIGENCE_STRATEGY.md`, and `INVESTMENT_HEALTH_SCORE.md`.

### Audit Findings

- Framework is Next.js 16.2.4 with App Router and TypeScript.
- Package manager is npm.
- Tailwind CSS v4 and shadcn-style UI components are present.
- Mock data lives in `lib/mock`.
- Existing API routes are mock route handlers under `app/api`.
- No Python, FastAPI, Supabase, persistence layer, test framework, or real ML pipeline was found.
- Baseline `npm install` completed successfully and reported 10 audit findings.
- Baseline `npm run lint` passed with warnings only.
- Baseline `npx tsc --noEmit` passed.
- Baseline `npm run build` passed with a Recharts chart dimension warning during static generation.

### Changed

- Reframed project documentation around the intended hybrid architecture: deterministic/model-based scores first, accounting rules second, AI explanation layer third.
- Updated company detail and copilot surfaces to use reusable AI analyst output for model-backed summaries.
- Updated AI analyst output to reference financial health, market momentum, news sentiment, investment health, and recent events when available.
- Updated mock report generation payloads to include market intelligence, news intelligence, and investment health data.
- Tightened fraud signal rules to detect cash flow/revenue divergence, receivables intensity, cash earnings conversion, and high-margin rapid-growth anomalies when period context is available.
- Cleaned up unused imports and variables reported by ESLint.
- Fixed the Recharts static generation dimension warning by giving the risk trend chart a stable numeric height.
