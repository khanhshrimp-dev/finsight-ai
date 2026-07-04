# Changelog

## 2026-07-04

### Added

- Added `UI_UX_REDESIGN_PLAN.md` and `DESIGN_SYSTEM.md` to guide the dashboard redesign and document reusable UI rules.
- Added shared dashboard UI components: `DashboardPageShell`, `PageHeader`, `SectionHeader`, `InsightStatCard`, `SignalBadge`, and `ErrorState`.
- Added dashboard route-level loading and error states.
- Added `UI_COMPLETION_PLAN.md` to track the mock UI completion sprint.
- Added three mock company profiles: Solara Energy Networks, Harbor Foods, and Northstar Property Trust.
- Added country and exchange metadata to company profiles.
- Added shared enriched company intelligence under `lib/mock/company-intelligence.ts`.
- Added `GET /api/companies` and `GET /api/companies/[id]`.
- Added standalone `/dashboard/market` and `/dashboard/news` pages.
- Added richer dashboard overview, company universe table, compare intelligence summary, simulator health/investment deltas, Copilot context, report builder, upload mock parser, settings preferences, and expanded alert taxonomy.
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

- Redesigned the dashboard shell with grouped navigation, a mobile drawer, improved top navigation, shared page spacing, and subtle route transitions.
- Normalized dashboard page headers across overview, companies, company detail, market, news, compare, simulator, reports, alerts, upload, and settings.
- Updated the company universe with responsive mobile cards and a cleaner filter/stat summary.
- Updated the company detail header with a compact score strip for risk, financial health, investment health, market momentum, and news sentiment.
- Improved Market Intelligence and News Intelligence pages with shared KPI cards and empty states.
- Improved Copilot responsiveness by hiding the desktop conversation rail on small screens and adding a mobile company selector.
- Tightened upload and settings copy so mock-only local behavior is explicit.
- Reframed project documentation around the intended hybrid architecture: deterministic/model-based scores first, accounting rules second, AI explanation layer third.
- Updated company detail and copilot surfaces to use reusable AI analyst output for model-backed summaries.
- Updated AI analyst output to reference financial health, market momentum, news sentiment, investment health, and recent events when available.
- Updated mock report generation payloads to include market intelligence, news intelligence, and investment health data.
- Tightened fraud signal rules to detect cash flow/revenue divergence, receivables intensity, cash earnings conversion, and high-margin rapid-growth anomalies when period context is available.
- Cleaned up unused imports and variables reported by ESLint.
- Fixed the Recharts static generation dimension warning by giving the risk trend chart a stable numeric height.
