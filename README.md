# FinSight AI

FinSight AI is a Next.js + TypeScript company intelligence and investment health demo app. The product direction is hybrid: deterministic financial scoring, accounting rules, mock market intelligence, and mock news intelligence produce numerical research signals, while the AI layer explains those outputs in analyst-style language.

The app currently uses mock company, market, and news data. It is suitable as a portfolio/demo foundation, not as a validated credit model, fraud detector, audit system, or investment decision engine.

## Current Status

Working today:

- Premium marketing landing page
- Premium dashboard route pass for Copilot, Reports, Simulator, Compare, Market, News, Alerts, Upload, and Settings
- Login/signup UI mockups
- Dashboard command-center overview
- Enriched company list and company detail pages
- Financial metric cards and charts
- Risk driver and benchmark visualizations
- Fraud signal panels using mock data
- AI-style copilot UI with mock responses
- Reports UI with mock report metadata
- Upload UI with mock processing
- Alerts/watchlist UI backed by mock data
- Next.js route handlers for mock analysis, copilot, reports, and upload flows
- Deterministic financial scoring and scenario helpers under `lib/risk`
- Rules-based accounting red flag detection under `lib/risk/fraud-signals.ts`
- Scenario Simulator at `/dashboard/simulator`
- Standalone Market Intelligence dashboard at `/dashboard/market`
- Standalone News Intelligence dashboard at `/dashboard/news`
- Mock AI Risk Analyst abstraction under `lib/ai`
- Mock market intelligence module, market momentum score, and `GET /api/market/[ticker]`
- Mock news intelligence module, event scoring, and `GET /api/news/[ticker]`
- Investment Health Score module and `POST /api/investment/analyze`
- Shared enriched company intelligence helper and `GET /api/companies`, `GET /api/companies/[id]`
- Premium landing/product UI primitives for reveal motion, panels, bento cards, and floating metrics
- Premium dashboard UI primitives for mock notices, metric deltas, analyst memos, filter bars, command cards, and split workspaces
- Visual QA checklist for the redesigned dashboard routes
- Typed placeholder route contracts for risk analysis, simulation, market, news, investment analysis, AI risk analysis, and report generation

Still in progress:

- Real data ingestion
- Real market data provider integration
- Real news provider integration
- Persistence/authentication
- Real report/PDF export
- Trained ML models
- Test coverage for the model and API helper functions

See [ROADMAP.md](./ROADMAP.md), [FEATURE_TRACKER.md](./FEATURE_TRACKER.md), [ARCHITECTURE.md](./ARCHITECTURE.md), [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md), [PREMIUM_UI_REDESIGN_PLAN.md](./PREMIUM_UI_REDESIGN_PLAN.md), [LANDING_PAGE_STRATEGY.md](./LANDING_PAGE_STRATEGY.md), [DASHBOARD_UX_STRATEGY.md](./DASHBOARD_UX_STRATEGY.md), [VISUAL_QA_CHECKLIST.md](./VISUAL_QA_CHECKLIST.md), [MODEL_STRATEGY.md](./MODEL_STRATEGY.md), [MARKET_DATA_STRATEGY.md](./MARKET_DATA_STRATEGY.md), [NEWS_INTELLIGENCE_STRATEGY.md](./NEWS_INTELLIGENCE_STRATEGY.md), and [INVESTMENT_HEALTH_SCORE.md](./INVESTMENT_HEALTH_SCORE.md).

## Tech Stack

- Next.js 16.2.4 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn-style local UI components
- Base UI and Radix UI primitives
- Lucide icons
- Recharts
- Mock TypeScript data in `lib/mock`
- Eight-company demo universe with sector, country, exchange, market, news, alert, and investment-health context

## Project Structure

```text
app/
  api/                  Mock route handlers
  dashboard/            Dashboard routes and layouts
  login/                Login UI
  signup/               Signup UI
components/
  charts/               Recharts wrappers
  dashboard/            Sidebar and top nav
  ui/                   Local UI primitives
lib/
  ai/                   Mock AI analyst prompts and response shaping
  investment/           Investment Health Score logic
  market/               Mock market data and momentum scoring
  mock/                 Demo company, alert, and dashboard data
    company-intelligence.ts  Enriched mock company/portfolio view model
  news/                 Mock news data, event classification, and scoring
  risk/                 Deterministic financial risk and fraud rules
  utils/                Shared helpers
types/
  index.ts              Core financial/company domain types
  market.ts            Market intelligence types
  news.ts              News intelligence types
  investment.ts        Investment health types
```

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build and Validate

```bash
npm run lint
npm run typecheck
npm run build
```

Latest validation from the 2026-07-05 premium UI pass:

- `npm run lint`: passes.
- `npm run typecheck`: passes.
- `npm run build`: passes.
- Baseline screenshots: `visual-audit/baseline/`.
- Post-redesign screenshots: `visual-audit/redesign/`.
- Visual audit: `VISUAL_AUDIT.md`.
- Responsive QA: `RESPONSIVE_QA.md`.
- Responsive overflow audit: `node scripts/check-responsive-overflow.mjs http://localhost:3000` passes all audited routes at 390, 768, 1024, and 1440px widths with contained data/table scroll treated as local scroll regions.

## Mock Data Limitations

The current company, market, and news data is hand-authored demo data. Risk scores, risk drivers, fraud signals, benchmark metrics, market metrics, news sentiment, recommendations, alerts, and AI summaries are not generated from validated production data.

The upload flow does not parse real financial statements yet. Report downloads are placeholders unless a future export generator is added.

## Research Signal Limitations

FinSight AI can display Financial Health Score, Risk Score, Market Momentum Score, News Sentiment Score, and Investment Health Score. These are research and monitoring signals only. The app must not make buy, sell, hold, valuation, credit-rating, audit, or fraud conclusions.

## Deterministic Scoring Plan

The next model step is a transparent deterministic scoring layer under `lib/risk`. It should score 0-100 using liquidity, leverage, profitability, cash flow, and growth metrics. This foundation will power the Scenario Simulator and mock APIs until real datasets and baseline ML models are ready.

## Future Financial Model Plan

When real data is available, the first baseline models should be:

- Logistic regression for explainable distress classification
- Random forest for non-linear baseline performance and feature importance

Later models may include XGBoost, LightGBM, CatBoost, and SHAP explainability after data quality and evaluation are mature.

## Future AI Analyst Plan

The AI layer should explain model outputs, fraud signals, benchmarks, scenarios, and recommendations. It should not calculate the numerical risk score. Provider integrations such as OpenAI or Anthropic can be added behind a clean abstraction once API keys and product requirements are defined.

## Deployment

The app is structured for Vercel-compatible Next.js deployment. Before production deployment, add real environment variables, auth, persistence, audit remediation strategy, and CI checks.
