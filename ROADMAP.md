# FinSight AI Roadmap

Audit date: 2026-07-05

FinSight AI is intended to be a hybrid company intelligence and investment health platform. Numerical scores should come from financial models, deterministic accounting rules, market intelligence, and news/event intelligence. AI should explain, summarize, and support copilot/report workflows; it should not be the core numerical risk predictor.

Target architecture:

```text
Financial data
-> financial health model
-> risk score
-> accounting red flag rules
-> market data score
-> news/event sentiment score
-> AI analyst explanation
-> dashboard/report output
```

Near-term expansion modules:

- Market Intelligence
- News Intelligence
- Investment Health Score
- Future scraping/data ingestion
- Future real-time market data integration

## Phase 0 - Repo Audit and Stabilisation

Goal: Understand the existing codebase, document current capabilities, and keep the app buildable.

Current status: Done for current pass

Completed items:
- Confirmed Next.js 16.2.4 App Router with TypeScript, Tailwind CSS v4, shadcn-style UI components, Recharts, Radix/Base UI, and mock TypeScript data.
- Confirmed npm as package manager via `package-lock.json`.
- Confirmed routes under `app/` and route handlers under `app/api/`.
- Ran baseline install, lint, typecheck, and build.
- Cleaned lint warnings from the prior audit.
- Fixed the observed Recharts chart dimension warning.

Remaining items:
- Add automated tests once model and API contracts stabilize.
- Review npm audit findings before dependency upgrades.

Priority: High

Dependencies:
- Stable local Next.js 16 docs and build pipeline.
- Consistent mock data shapes.

Risks/unknowns:
- No test framework is configured.
- `npm install` reports 10 dependency audit findings.
- Current API routes are mock-only and do not persist data.

## Phase 1 - Complete Dashboard UI

Goal: Finish the demo-grade dashboard UI across portfolio, company detail, alerts, reports, upload, compare, and copilot surfaces.

Current status: Mock UI and premium visual sprint complete

Completed items:
- Marketing landing page exists.
- Login and signup UI exists.
- Dashboard overview exists with summary cards and charts.
- Company list, company detail, compare, reports, upload, alerts, settings, and copilot routes exist.
- Reusable UI components and chart components exist.
- Mock company data covers multiple risk profiles.
- `UI_COMPLETION_PLAN.md` defines the required route, API, and mock-data completion checklist.
- `UI_UX_REDESIGN_PLAN.md` and `DESIGN_SYSTEM.md` document the current UI scan, design direction, and implementation outcome.
- Add standalone `/dashboard/market` and `/dashboard/news` pages.
- Add `GET /api/companies` and `GET /api/companies/[id]` for enriched mock company data.
- Expand the mock company universe to 6-8 profiles with sector, country, exchange, ticker, financial, risk, market, news, and alert context.
- Enrich dashboard, company list, compare, simulator, copilot, reports, alerts, upload, and settings surfaces with shared mock intelligence.
- Add shared dashboard page shell, page header, KPI card, status badge, and error state primitives.
- Group sidebar navigation and add mobile dashboard navigation.
- Add responsive company cards, route loading/error states, and stronger empty states on market/news/company search surfaces.
- Rebuilt the marketing landing page as a premium, mock-honest product story with command-center preview, intelligence layers, scenario simulator, AI analyst workspace, and responsible-use disclaimer.
- Added premium landing primitives: `MotionReveal`, `PremiumPanel`, `BentoCard`, and `FloatingMetric`.
- Refined dashboard overview KPI hierarchy and company detail hero actions.
- Updated `PREMIUM_UI_REDESIGN_PLAN.md`, `LANDING_PAGE_STRATEGY.md`, and `DASHBOARD_UX_STRATEGY.md`.
- Added premium dashboard primitives for demo notices, metric deltas, analyst memos, filter shells, command cards, and split workspaces.
- Completed premium pass-two redesign for Copilot, Reports, Simulator, Compare, Market, News, Alerts, Upload, and Settings.
- Added `VISUAL_QA_CHECKLIST.md` for route and viewport review coverage until automated screenshot regression exists.

Remaining items:
- Add automated visual regression coverage when a browser runner is available.
- Continue targeted accessibility review with broader browser-assisted checks across secondary routes.
- Remove dead references as product behavior changes.

Priority: High

Dependencies:
- Mock company dataset.
- Deterministic risk scoring layer.

Risks/unknowns:
- Some pages are visually complete but operationally mock-only.
- Report downloads are placeholder URLs.

## Phase 2 - Financial Model Foundation

Goal: Add a transparent deterministic risk scoring foundation that can power demos, APIs, and scenario simulation.

Current status: Partial

Completed items:
- A small `computeMockRiskScore` helper exists in `lib/utils/risk.ts`.
- Mock company records include precomputed risk scores, drivers, fraud signals, recommendations, and benchmarks.
- Added reusable deterministic scoring, classification, driver, recommendation, and analysis functions under `lib/risk`.
- Added `POST /api/risk/analyze`.

Remaining items:
- Ensure UI and APIs can use a single deterministic scoring path.
- Document formula assumptions.
- Calibrate scoring weights against real data when available.

Priority: High

Dependencies:
- Mock financial metrics in `types/index.ts`.
- Scenario Simulator implementation.

Risks/unknowns:
- Current mock risk scores are authored, not fully recomputed from the latest metrics.
- Deterministic formula is a demo model and must not be represented as a validated credit model.

## Phase 3 - Scenario Simulator

Goal: Let users change key financial assumptions and immediately see before/after risk impact.

Current status: Partial

Completed items:
- Mock financial metrics already contain the ratios required by the simulator.
- Existing UI patterns support cards, inputs, badges, charts, and progress indicators.
- Added `/dashboard/simulator`.
- Added sidebar navigation.
- Added local-state save/reset, score delta, changed drivers, sensitivity insight, deterministic explanation, and AI-ready placeholder.
- Added `POST /api/risk/simulate`.

Remaining items:
- Persist saved scenarios after backend persistence exists.
- Add richer scenario templates and named assumptions.
- Add test coverage for scenario helper functions.

Priority: High

Dependencies:
- Deterministic scoring functions.
- Scenario helper functions.

Risks/unknowns:
- Saved scenarios can start as local state only; persistence belongs to Phase 7.

## Phase 4 - Explainability Layer

Goal: Explain what drives risk scores using transparent drivers first, then model explainability as models mature.

Current status: Partial

Completed items:
- Company detail pages show mock risk drivers and benchmark charts.
- Risk drivers include category, direction, impact, and description.
- Deterministic drivers are generated from scoring rules.
- Scenario deltas expose top changed drivers and most sensitive metric.

Remaining items:
- Normalize driver impact semantics across mock data and generated analysis.
- Later add logistic regression coefficients, random forest feature importance, gradient boosting importance, and SHAP.

Priority: High

Dependencies:
- Stable risk model foundation.
- Baseline ML models when real data is available.

Risks/unknowns:
- Current risk drivers are manually authored mock explanations.

## Phase 5 - AI Risk Analyst / AI Copilot

Goal: Use AI-style analysis to explain model outputs, risk drivers, fraud signals, benchmark data, recommendations, and scenarios.

Current status: Partial

Completed items:
- `/dashboard/copilot` exists with a mock chat UI.
- `/api/copilot` returns structured mock responses.
- Company records contain AI-style summaries.
- Added `lib/ai/risk-analyst.ts` and `lib/ai/prompts.ts`.
- Added `POST /api/ai/risk-analysis`.
- Company detail, copilot, and simulator surfaces now use AI-style output based on deterministic model/rule outputs.
- AI analyst context now supports market momentum, news sentiment, investment health score, and recent company events when available.

Remaining items:
- Add a real provider implementation when API keys and model choice are defined.
- Add API-backed copilot calls instead of local mock generation in the page component.

Priority: Medium

Dependencies:
- Risk model results.
- Fraud signal results.
- Benchmark data.

Risks/unknowns:
- No LLM provider or API keys are configured.
- AI must not become the numerical risk scoring source.

## Phase 6 - Market Intelligence

Goal: Add market context around each company without implementing real-time or paid market data yet.

Current status: Mock scaffold

Completed items:
- Added market types under `types/market.ts`.
- Added mock market provider data under `lib/market/mock-market-data.ts`.
- Added Market Momentum Score logic under `lib/market/market-score.ts`.
- Added `GET /api/market/[ticker]`.
- Added a Market Intelligence card to company overview pages.

Remaining items:
- Add provider adapters for Finnhub, Alpha Vantage, Polygon, or Financial Modeling Prep when keys and terms are configured.
- Store provider metadata and data freshness once persistence exists.
- Add tests for market score thresholds and edge cases.

Priority: Medium

Dependencies:
- Provider selection and environment variable strategy.
- Persistence for market snapshots.

Risks/unknowns:
- Real-time data may require paid licensing.
- Split-adjusted versus unadjusted price handling must be explicit.

## Phase 7 - News Intelligence

Goal: Add company news, event classification, severity scoring, and sentiment scoring.

Current status: Mock scaffold

Completed items:
- Added news types under `types/news.ts`.
- Added mock news data under `lib/news/mock-news-data.ts`.
- Added event classification and News Sentiment Score logic under `lib/news`.
- Added `GET /api/news/[ticker]`.
- Added a News Intelligence card to company overview pages.

Remaining items:
- Add API-first integrations for Finnhub company news, Alpha Vantage News Sentiment, NewsAPI, or GDELT.
- Add deduplication and entity matching.
- Add compliant scraping only after API sources and source terms are evaluated.
- Add tests for event classification and scoring.

Priority: Medium

Dependencies:
- Provider selection.
- Storage schema for articles/events.

Risks/unknowns:
- News licensing, copyright, source attribution, and robots.txt/TOS compliance.
- Entity matching false positives.

## Phase 8 - Investment Health Score

Goal: Combine financial health, risk, market, news, and valuation placeholder signals into one research score.

Current status: Mock scaffold

Completed items:
- Added investment types under `types/investment.ts`.
- Added `lib/investment/investment-health.ts`.
- Added `POST /api/investment/analyze`.
- Added Investment Health Overview to company overview pages.
- Added market/news/investment-health context to mock AI analyst and mock report payloads.

Remaining items:
- Replace valuation placeholder with real valuation model inputs.
- Separate Financial Health Score from inverse Risk Score after calibration.
- Persist component scores by analysis run.
- Add formula and threshold tests.

Priority: High

Dependencies:
- Stable risk model, market score, and news score contracts.
- Future valuation model.

Risks/unknowns:
- Composite score labels must avoid buy/sell implication.
- Weights are product assumptions until calibrated.

## Phase 9 - Data Pipeline

Goal: Move from mock TypeScript data to real financial statements and normalized features.

Current status: Missing

Completed items:
- Upload page and upload API route exist as mock surfaces.

Remaining items:
- Define CSV schema and validation.
- Add financial statement parser/normalizer.
- Create feature engineering pipeline.
- Add sample public datasets.

Priority: Medium

Dependencies:
- Model feature schema.
- Upload API contract.

Risks/unknowns:
- No real data source is selected.
- Statement taxonomy differences can make normalization complex.

## Phase 10 - Backend Persistence

Goal: Persist companies, statements, analysis runs, alerts, saved scenarios, reports, and user settings.

Current status: Missing

Completed items:
- None.

Remaining items:
- Choose backend. Target is Supabase/Postgres unless requirements change.
- Design schema and migrations.
- Add auth-aware data access.
- Persist saved scenarios and reports.

Priority: Medium

Dependencies:
- Stable data model.
- Authentication requirements.

Risks/unknowns:
- No Supabase client, schema, or environment variables currently exist.

## Phase 11 - Reporting/Export

Goal: Generate exportable analyst-ready reports.

Current status: Mock only

Completed items:
- Reports UI exists.
- `/api/reports` returns JSON or mock download URLs.

Remaining items:
- Add real artifact generation behind the existing `POST /api/reports/generate` contract.
- Generate real PDF or DOCX/PPTX artifacts.
- Include risk model output, fraud signals, market intelligence, news intelligence, investment health score, explainability, AI analyst narrative, and disclaimers.

Priority: Medium

Dependencies:
- Risk analysis results.
- AI analyst narrative.
- Persistence for report records.

Risks/unknowns:
- Current download URLs do not point to generated files.

## Phase 12 - Deployment and Portfolio Polish

Goal: Make the project portfolio-ready, reliable, and deployable on Vercel.

Current status: Partial

Completed items:
- Next.js app builds successfully.
- Basic Vercel-compatible app structure exists.

Remaining items:
- Add deployment environment guidance.
- Resolve lint warnings and dependency audit strategy.
- Add tests and CI.
- Add accessible empty/error/loading states where missing.
- Document limitations honestly.

Priority: Medium

Dependencies:
- Stabilized feature scope.
- No unresolved build warnings.

Risks/unknowns:
- No CI workflow exists.
- No production data, auth, persistence, or provider credentials are configured.
