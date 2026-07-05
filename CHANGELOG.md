# Changelog

## 2026-07-05

### Added

- Added `PREMIUM_UI_REDESIGN_PLAN.md`, `LANDING_PAGE_STRATEGY.md`, and `DASHBOARD_UX_STRATEGY.md`.
- Added premium landing/product primitives: `MotionReveal`, `PremiumPanel`, `BentoCard`, and `FloatingMetric`.
- Added premium dashboard primitives: `DemoDataNotice`, `CommandCard`, `MetricDeltaCard`, `AnalystMemoCard`, `FilterToolbar`, and `SplitWorkspaceLayout`.
- Added global premium background, reveal, and reduced-motion utilities.
- Added `VISUAL_QA_CHECKLIST.md` for route and viewport visual review coverage.

### Changed

- Rebuilt the landing page into a premium product experience with a command-center preview, intelligence-layer story, scenario simulator highlight, AI analyst workspace, responsible-use disclaimer, and dashboard CTAs.
- Updated root font handling for Tailwind v4 and Next.js font variables.
- Tightened dashboard overview KPI hierarchy to five primary command-center signals.
- Refined dashboard sidebar grouping labels.
- Updated company detail hero with mock price context and primary Copilot, Simulator, and Report actions.
- Redesigned `/dashboard/copilot` as a split mock analyst workspace with prompt categories, chat output, active context, and explicit AI boundaries.
- Redesigned `/dashboard/reports` with report templates, best-use cases, consulting-style memo preview, and mock export framing.
- Redesigned `/dashboard/simulator` with grouped assumption controls, before/after score cards, and deterministic scenario explanation.
- Redesigned `/dashboard/compare` with optional peer selectors, score summaries, and a direct analyst comparison answer.
- Redesigned `/dashboard/market` with focused ticker analysis, 52-week range visualization, top movers, and market interpretation.
- Redesigned `/dashboard/news` with event-intelligence filters, richer timeline cards, critical-events panel, and impact memo.
- Redesigned `/dashboard/alerts` with command metrics, category tabs, clearer rule/watchlist framing, and analyst guidance.
- Redesigned `/dashboard/upload` with mock intake framing, validation metrics, premium drop zone, parser preview, and ingestion guidance.
- Redesigned `/dashboard/settings` with settings coverage cards, mock provider boundaries, disabled placeholder-only controls, and governance memo.
- Updated README, roadmap, feature tracker, design system, and architecture documentation for the premium UI pass.

### Validation

- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run build` passed.
- Browser smoke passed for `/dashboard/copilot`, `/dashboard/reports`, `/dashboard/simulator`, `/dashboard/compare`, `/dashboard/market`, `/dashboard/news`, `/dashboard/alerts`, `/dashboard/upload`, and `/dashboard/settings` with expected headings and no captured console errors.
- Responsive browser matrix passed 72 route/viewport checks across 360, 390, 430, 768, 1024, 1280, 1440, and 1920px widths with no detected horizontal overflow or clipped buttons.
- HTTP route smoke returned 200 for `/dashboard/copilot`, `/dashboard/reports`, `/dashboard/simulator`, `/dashboard/compare`, `/dashboard/market`, `/dashboard/news`, `/dashboard/alerts`, `/dashboard/upload`, and `/dashboard/settings`.

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
