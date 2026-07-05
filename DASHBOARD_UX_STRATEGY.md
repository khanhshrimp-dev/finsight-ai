# FinSight AI Dashboard UX Strategy

Date: 2026-07-05

## Product Role

The dashboard is the analyst workbench after the landing page promise. It should prioritize fast triage over marketing polish.

## Navigation Model

Groups:

- Overview: Command Center, Companies, Compare, Simulator
- Intelligence: Market, News, AI Copilot, Reports
- Operations: Alerts, Upload, Settings

The shell should feel like a financial intelligence command center, not a generic admin panel.

## Command Center Rules

- Keep the above-the-fold KPI row to five or fewer cards.
- Prioritize financial health, average risk, investment health, high-risk companies, and negative events.
- Move secondary signals into attention, market, news, and leader panels.
- Use clear visual hierarchy: one main chart area, one attention panel, supporting intelligence panels below.

## Company Detail Rules

- Treat company detail as the core product page.
- Header should include identity, exchange/country, sector, price context, risk badges, and primary next actions.
- Score strip should always show financial health, risk, investment health, market momentum, and news sentiment.
- Tabs should keep detailed financial, risk, market, news, and AI content progressively disclosed.

## Interaction Rules

- Filters and tabs must remain keyboard reachable.
- Tables should stay readable on desktop and become cards or scroll safely on mobile.
- Buttons should use icons only when meaning is familiar or accompanied by labels.
- Mock/demo status should be visible but not visually dominant.

## Remaining UX Risks

- Some dense panels still use legacy base `Card` wrappers where the local primitive is sufficient.
- Automated screenshot regression coverage is still missing.
- All secondary dashboard routes now have premium route-level framing, but they remain mock-only and need future backend/product integration.

## Implementation Status

Implemented on 2026-07-05:

- Dashboard overview KPI row now prioritizes five primary command-center signals.
- Sidebar labels now use shorter product-area language.
- Company detail header now includes price context, risk badges, confidence, and the primary next actions.
- Desktop and 390px browser smoke passed for landing and company detail without console errors or horizontal overflow.

Implemented in pass two on 2026-07-05:

- Copilot now uses a split analyst workspace with prompt categories, active company context, score cards, and mock AI boundaries.
- Reports now uses premium templates, consulting-style preview memo, export framing, and clear report-content scope.
- Simulator now groups assumptions by liquidity, leverage, profitability, cash flow, and growth with before/after health and investment deltas.
- Compare now supports optional peers and surfaces the strongest/lowest-risk answer before detailed tables.
- Market now includes focused ticker analysis, 52-week range visualization, top movers, and market interpretation.
- News now uses a stronger event-intelligence timeline, critical-events panel, and impact summary.
- Alerts now includes category tabs, command metrics, clearer rule/watchlist treatment, and analyst memo guidance.
- Upload now presents mock intake, sample/manual data, parser validation preview, and no-persistence boundaries.
- Settings now exposes workspace, profile, model, threshold, AI analyst, provider, notification, and appearance coverage with disabled placeholder-only controls.
- `VISUAL_QA_CHECKLIST.md` now documents route and viewport review coverage for future visual QA.
