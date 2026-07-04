# FinSight AI UI Completion Plan

Date: 2026-07-04

Scope: finish a polished, mock-only product UI for FinSight AI. This sprint must not add live API providers, scraping, real ML training, LLM calls, authentication, persistence, or investment advice.

## Sprint Principles

- Keep all data local and deterministic.
- Treat AI language as mock analyst narration only.
- Keep scores as research signals, not buy/sell/hold recommendations.
- Prefer shared mock data helpers over repeated page-specific calculations.
- Keep every required route buildable and useful without backend setup.

## Required Pages

| Route | Sprint Target | Status Before Sprint | Completion Notes |
| --- | --- | --- | --- |
| `/` | Product-aware landing page with honest mock-data positioning | Partial | Keep aligned with current feature set and limitations. |
| `/login` | Polished auth mock UI | Mock Only | No real auth in this sprint. |
| `/signup` | Polished auth mock UI | Mock Only | No real auth in this sprint. |
| `/dashboard` | Portfolio command center with KPIs, charts, alerts, news, market, and report shortcuts | Partial | Needs broader intelligence summary. |
| `/dashboard/companies` | Searchable/filterable company universe with market, news, risk, and health columns | Partial | Needs enriched company table. |
| `/dashboard/company/[id]` | Company deep dive with financials, risk, fraud, market, news, investment health, and AI narrative | Partial | Already has most modules; verify with expanded data. |
| `/dashboard/compare` | Compare selected companies across financial health, risk, investment health, market, news, and price performance | Partial | Needs intelligence comparison layer. |
| `/dashboard/simulator` | Scenario simulator with financial, risk, and investment-health deltas | Partial | Needs health/investment delta context. |
| `/dashboard/market` | Standalone market intelligence dashboard | Missing | Add page using mock market data. |
| `/dashboard/news` | Standalone news intelligence dashboard | Missing | Add page using mock news data. |
| `/dashboard/copilot` | Mock AI analyst workspace with structured answers and limitations | Mock Only | Needs market/news/investment context. |
| `/dashboard/reports` | Mock report builder with meaningful report types and preview | Mock Only | Needs fuller report catalog. |
| `/dashboard/alerts` | Alert center with risk, market, news, and investment-health alert types | Partial | Needs expanded alert taxonomy. |
| `/dashboard/upload` | Mock upload/manual input/sample dataset workflow | Mock Only | Needs preview and validation state. |
| `/dashboard/settings` | Workspace, thresholds, provider placeholders, and analyst preferences | Mock Only | Needs product-specific settings. |

## Required Mock APIs

| Route | Method | Status Before Sprint | Completion Notes |
| --- | --- | --- | --- |
| `/api/companies` | GET | Missing | Return all enriched mock companies and portfolio stats. |
| `/api/companies/[id]` | GET | Missing | Return one enriched mock company or 404. |

## Data Completion

Target: 6-8 realistic mock companies with distinct profiles:

- Healthy enterprise technology compounder.
- Distressed retailer.
- Biotech with fraud-style accounting signals.
- Cyclical manufacturer.
- Healthcare provider with margin pressure.
- Renewable energy growth company with cash-flow risk.
- Consumer staples company with stable quality.
- Real estate operator with leverage/refinancing pressure.

Each profile should have financial periods, sector/country/exchange/ticker metadata, risk state, fraud signals, benchmark context, market data, news events, alerts, recommendations, and report/copilot context.

## Completion Checklist

- [x] Update tracker docs before implementation.
- [x] Expand mock company, market, news, and alert data.
- [x] Add shared enriched company intelligence helper.
- [x] Add `GET /api/companies`.
- [x] Add `GET /api/companies/[id]`.
- [x] Add `/dashboard/market`.
- [x] Add `/dashboard/news`.
- [x] Update dashboard overview with richer mock intelligence.
- [x] Update company list with market/news/investment filters and columns.
- [x] Update compare page with cross-company intelligence.
- [x] Update simulator with health and investment deltas.
- [x] Update copilot and reports with richer mock analyst/report flows.
- [x] Update upload and settings product flows.
- [x] Update navigation for new pages.
- [x] Run lint, typecheck, build, and browser smoke.

## Sprint Outcome

Implemented routes and UI remain mock-only. The app still does not include real authentication, persistence, scraping, live market/news provider calls, LLM calls, trained ML models, or real PDF/DOCX export.
