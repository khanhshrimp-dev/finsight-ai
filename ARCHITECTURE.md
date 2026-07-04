# FinSight AI Architecture

## Current Stack

- Framework: Next.js 16.2.4 App Router
- Language: TypeScript with `strict` mode
- Package manager: npm (`package-lock.json`)
- UI: Tailwind CSS v4, shadcn-style component files, Base UI/Radix primitives, Lucide icons
- Charts: Recharts
- State: local React state; Zustand is installed but not currently central to the observed flows
- Data: mock TypeScript data in `lib/mock`, `lib/market`, and `lib/news`
- Backend: Next.js route handlers under `app/api`
- Persistence: none
- Auth: mock login/signup UI only
- Python/FastAPI/ML services: none found
- Supabase: none found

## Current App Architecture

The application uses the App Router with top-level routes in `app/`.

- `app/layout.tsx` defines root metadata, fonts/theme provider, and global shell.
- `app/page.tsx` is the marketing landing page.
- `app/login/page.tsx` and `app/signup/page.tsx` are auth UI surfaces without a backend.
- `app/dashboard/layout.tsx` wraps dashboard routes with sidebar and top navigation.
- Dashboard routes are mostly static/client-rendered demo pages backed by mock data.
- API route handlers return mock JSON responses and simulate async work.

## Current Frontend Routes

| Route | Purpose | Data source |
| --- | --- | --- |
| `/` | Marketing landing page | Static content |
| `/login` | Login UI | Local form UI only |
| `/signup` | Signup UI | Local form UI only |
| `/dashboard` | Portfolio overview | `lib/mock` |
| `/dashboard/companies` | Company list | `lib/mock/companies.ts` |
| `/dashboard/company/[id]` | Company detail, metrics, risk, fraud, market, news, and investment health sections | `getCompanyById`, `lib/risk`, `lib/market`, `lib/news`, `lib/investment` |
| `/dashboard/compare` | Benchmark comparison | `lib/mock` |
| `/dashboard/market` | Standalone market intelligence dashboard | `lib/market`, `lib/mock/company-intelligence.ts` |
| `/dashboard/news` | Standalone news intelligence dashboard | `lib/news`, `lib/mock/company-intelligence.ts` |
| `/dashboard/copilot` | Mock AI copilot | Local state plus `/api/copilot` style logic |
| `/dashboard/reports` | Reports dashboard | Local mock reports plus chart data |
| `/dashboard/upload` | Upload UI | Local state/mock processing |
| `/dashboard/alerts` | Alerts/watchlist UI | `lib/mock/alerts.ts` |
| `/dashboard/settings` | Settings UI | Local UI only |
| `/dashboard/simulator` | Scenario Simulator | `lib/mock`, `lib/risk`, local state |

## Current Component Structure

- `components/ui`: local shadcn-style primitives such as buttons, cards, inputs, tabs, badges, tables, progress, skeletons, and risk-specific UI.
- `components/charts`: Recharts wrappers for trend, benchmark, risk drivers, distribution, and related charts.
- `components/dashboard`: dashboard sidebar and top navigation.
- `components/market`: market intelligence presentation components.
- `components/news`: news intelligence presentation components.
- `components/investment`: investment health presentation components.
- `components/theme-provider.tsx`: theme integration.

## Current Mock Data Structure

- `types/index.ts` defines the main domain types: `Company`, `FinancialPeriod`, `FinancialMetrics`, `RiskDriver`, `FraudSignal`, `BenchmarkData`, `Alert`, `Recommendation`, `TimelineEvent`, `CopilotResponse`, and related app types.
- `lib/mock/companies.ts` defines eight demo companies:
  - Apex Technologies: healthy profile
  - Redstone Retail Group: critical/distressed profile
  - Novara BioSciences: high fraud signal profile
  - Cascade Manufacturing: cyclical medium-risk profile
  - Meridian Health Systems: declining margin medium-risk profile
  - Solara Energy Networks: renewable infrastructure growth with cash-flow and refinancing risk
  - Harbor Foods: stable consumer staples quality profile
  - Northstar Property Trust: leveraged real estate refinancing watchlist profile
- `lib/mock/alerts.ts` defines alert/watchlist-style mock data.
- `lib/mock/company-intelligence.ts` combines company, risk, market, news, alert, and investment-health outputs for UI and API routes.
- `lib/mock/index.ts` exports dashboard stats and risk trend data.
- `lib/market/mock-market-data.ts` defines mock market snapshots and historical prices by ticker.
- `lib/news/mock-news-data.ts` defines mock company news items and event metadata by ticker.

## Current API Route Structure

| Route | Status | Notes |
| --- | --- | --- |
| `POST /api/analyze` | Mock Only | Returns company analysis slices from mock data. |
| `POST /api/copilot` | Mock Only | Returns structured mock copilot responses. |
| `POST /api/reports` | Mock Only | Returns JSON reports or placeholder download URLs. |
| `POST /api/upload` | Mock Only | Simulates file upload/processing. |
| `GET /api/companies` | Mock Only | Returns enriched mock company universe and portfolio intelligence stats. |
| `GET /api/companies/[id]` | Mock Only | Returns one enriched mock company or a mock 404 response. |
| `POST /api/risk/analyze` | Mock Only | Runs deterministic scoring and fraud rules against mock/company metrics. |
| `POST /api/risk/simulate` | Mock Only | Runs deterministic scenario delta calculations. |
| `GET /api/market/[ticker]` | Mock Only | Returns provider-ready mock market data and Market Momentum Score. |
| `GET /api/news/[ticker]` | Mock Only | Returns provider-ready mock news items and News Sentiment Score. |
| `POST /api/investment/analyze` | Mock Only | Combines financial, risk, market, news, and valuation placeholder scores. |
| `POST /api/ai/risk-analysis` | Mock Only | Returns structured AI analyst output from a mock provider abstraction. |
| `POST /api/reports/generate` | Mock Only | Returns mock report content from deterministic risk and AI analyst output. |

## Current Model/Data Architecture

Current model behavior is a mix of mock-authored data and deterministic logic:

- Company risk scores are stored in mock data.
- Company risk drivers, fraud signals, recommendations, and AI summaries are hand-authored mock values.
- `lib/risk` contains deterministic scoring, classification, driver generation, fraud signal rules, scenario deltas, and sensitivity analysis.
- `lib/market` contains mock market data normalization and Market Momentum Score logic.
- `lib/news` contains mock news data, event classification, and News Sentiment Score logic.
- `lib/investment` contains Investment Health Score composition.
- `lib/ai` contains a mock AI Risk Analyst abstraction and prompt builder.
- No trained ML model, feature engineering pipeline, real data pipeline, or persistence layer exists.

## Target Architecture

### Frontend

Next.js App Router + TypeScript + Tailwind CSS + shadcn-style UI components.

The dashboard should use server components where static or data-driven rendering is enough, and push client components down to interactive controls such as the copilot, upload UI, settings controls, and scenario simulator.

### API Layer

Next.js route handlers should expose frontend-facing contracts:

- `POST /api/risk/analyze`
- `POST /api/risk/simulate`
- `GET /api/market/[ticker]`
- `GET /api/news/[ticker]`
- `POST /api/investment/analyze`
- `POST /api/ai/risk-analysis`
- `POST /api/reports/generate`
- `GET /api/companies`
- `GET /api/companies/[id]`

These routes should return typed JSON contracts and remain deployable on Vercel.

### Risk Model Layer

Model progression:

1. Deterministic risk scoring
2. Classical baseline ML models
3. Advanced tabular ML models

The deterministic layer should live in `lib/risk` and expose pure TypeScript functions that can be used by UI and API routes.

### Accounting Rules Layer

Rules should detect financial warning signs such as:

- Revenue growth without cash flow support
- Receivables growth faster than revenue
- Declining gross margin
- Negative operating cash flow
- High leverage
- Weak interest coverage
- Liquidity deterioration
- Margin volatility
- Profitability decline despite revenue growth

### Market Intelligence Layer

Near term:

- Mock share price and historical price series
- Market cap, volume, volatility, moving averages, drawdown, and relative performance
- Market Momentum Score from deterministic rules

Later:

- API-first provider adapters for Finnhub, Alpha Vantage, Polygon, or Financial Modeling Prep
- Provider metadata, delayed/real-time labels, split-adjustment handling, and persistence

### News Intelligence Layer

Near term:

- Mock company news items
- Event type, severity, relevance, confidence, sentiment, and risk impact
- News Sentiment Score from deterministic rules

Later:

- API-first ingestion from Finnhub company news, Alpha Vantage News Sentiment, NewsAPI, or GDELT
- Deduplication, entity matching, source tracking, and compliant scraping only after TOS/robots.txt review

### Investment Health Layer

The Investment Health Score combines:

- Financial Health Score
- Market Momentum Score
- News Sentiment Score
- Valuation Score placeholder
- Inverse Risk Score

It is a research signal only and must not produce buy/sell/hold recommendations.

### Explainability Layer

Near term:

- Deterministic risk drivers
- Scenario deltas
- Rule-trigger explanations

Later:

- Logistic regression coefficients
- Random forest feature importance
- Gradient boosting feature importance
- SHAP values

### AI Layer

The AI layer should explain and communicate outputs. It should not independently calculate the numerical score.

Responsibilities:

- Plain-English executive summaries
- Risk driver explanations
- Fraud concern summaries
- Recommendations
- Copilot answers
- Report narratives

AI may reference market/news/investment-health scores, but those scores must remain computed by deterministic or model-owned layers.

### Data Layer

Planned progression:

1. Mock JSON/TypeScript data
2. API-backed market/news providers
3. Real CSV datasets and upload parser
4. Supabase/Postgres persistence

### Future Optional Services

- FastAPI model service for Python-based ML inference
- LLM provider API
- CSV parser/normalization service
- PDF/report generator
