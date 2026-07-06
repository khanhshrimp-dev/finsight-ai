# UX Information Architecture Audit

Date: 2026-07-07

Evidence reviewed:

- Current route implementations under `app/dashboard/**`
- Existing rendered screenshot set in `visual-audit/redesign/`
- Existing responsive QA notes in `RESPONSIVE_QA.md`

## Summary

FinSight AI has strong feature breadth, but many routes still expose too much depth at once. The common pattern is: page header, score cards, several large panels, then more secondary lists or tables. This makes pages feel capable but long, especially on mobile. The IA pass should keep summary content visible and move drill-down detail into tabs, drawers, modals, accordions, or dedicated detail surfaces.

## 2026-07-07 Implementation Result

The progressive disclosure pass is implemented across the main dashboard workspace. The audit was created before code changes, then the route bodies were restructured to keep first-screen decisions visible and move supporting detail into click-based surfaces.

Implemented patterns:

- Added shared disclosure primitives in `components/ui/progressive-disclosure.tsx`: `PremiumTabs`, `DetailDrawer`, `InsightDrawer`, `MetricDrilldownDrawer`, `NewsEventDrawer`, `ReportPreviewDrawer`, `MobileFilterSheet`, `CommandModal`, `ExpandableSection`, `MethodologyPopover`, `TooltipInfo`, and `SectionSummaryCard`.
- Converted dashboard overview from a long module dump into a command-center summary with tabs for Attention, Signals, Quick Actions, and Portfolio Context.
- Shortened company overview to executive summary, top strengths, top risks, and next actions; moved AI, reports, market, news, financials, risk, and fraud detail into tabs/drawers.
- Converted compare lower content into tabs for Signals, Financials, Radar, and Risk Trend.
- Converted upload into a three-step wizard: Input, Validate, Review.
- Converted reports generation/preview to modal and report preview drawers, with supporting charts behind an accordion.
- Converted news feed cards into compact event rows with `NewsEventDrawer` detail.
- Converted market performance metrics into drilldown drawers and secondary rail content into accordions.
- Converted simulator saved scenarios and advanced assumptions into accordions, and driver details into drawers.
- Converted alerts into compact rows with detail drawers.
- Converted copilot prompt groups into accordions.
- Preserved settings tabs and mock-only provider boundaries.

Validation:

- `npm run lint`: pass.
- `npm run typecheck`: pass.
- `npm run build`: pass.
- `node scripts/check-responsive-overflow.mjs http://localhost:3000`: pass across all 13 audited routes at 390px, 768px, 1024px, and 1440px.
- Final screenshot evidence saved in `visual-audit/ia-pass-final/`.

## Route Audit

| Route | Page purpose | Main user question | Current scrolling/clutter problems | Keep visible | Move behind tabs | Move into drawers | Move into modals | Make expandable | Separate detail page candidates | Mobile-specific issues |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Product entry and demo positioning | Why should I open FinSight? | Long product narrative can feel like a brochure after the hero. | Hero, product preview, primary CTA, demo disclaimer. | Feature grid sections can be grouped by module. | Feature details and methodology notes. | None required. | Trust/disclaimer details. | None. | Product preview must stack and avoid oversized text. |
| `/dashboard` | Executive command center | What needs my attention today? | Shows chart, distribution, module previews, attention stream, and alerts together. | 4-5 KPIs, attention panel, one chart, quick actions. | Market/news/investment preview groups. | Company preview, alert detail. | Generate report command. | Secondary signal previews. | Company detail, alerts, market/news pages. | Avoid stacked endless module previews. |
| `/dashboard/companies` | Company triage and navigation | Which company should I open or monitor? | Filters, summary cards, mobile cards, and large desktop table compete. | Search/filter summary, top metrics, compact company list/table. | Advanced filters. | Company quick preview. | Add/import company mock flow. | Table methodology/score definitions. | Company detail pages. | Filters should collapse; table must remain contained scroll or cards. |
| `/dashboard/company/[id]` | Core company research terminal | What is happening with this company? | Overview still contains investment panel, full AI panel, market/news cards, KPI strip, chart, timeline, recommendations. | Compact company header, score strip, top summary. | Financials, Risk, Market, News, AI Analyst, Reports. | Risk driver, metric, news event, market metric, report preview. | Generate report flow. | Methodology notes and advanced assumptions. | Report detail/export surface. | Tabs should scroll; overview must stay short. |
| `/dashboard/copilot` | AI analyst workspace | Explain this to me. | Prompt library, context, chat, right context can form a long stack when collapsed. | Context selector, prompt category summary, chat stream. | Prompt categories and company context on smaller screens. | Company context and response source detail. | New command modal for report/analysis presets. | Long AI response sections. | Company detail/reports. | Side panels should collapse and long responses should not dominate. |
| `/dashboard/reports` | Report generation workflow | Turn this analysis into a memo. | Template library, generator form, full preview, memo logic, charts, history all render together. | Selected template, selected company, preview summary, compact history. | Templates, preview, history/charts. | Report preview and history item detail. | Generate report settings. | Report sections and export limitations. | Future report detail page. | Workflow should be step-like, not every section expanded. |
| `/dashboard/simulator` | Modelling console | What happens if assumptions change? | Inputs, outputs, drivers, saved scenarios, and notes can stack into a report. | Assumptions panel and outcome panel. | Mobile Inputs/Results/Saved tabs. | Driver explanation and sensitivity detail. | Save scenario details. | Advanced assumptions and saved scenarios. | Scenario detail page later. | Use tabs at 390px and avoid full saved scenario lists. |
| `/dashboard/compare` | Peer comparison workbench | Which company looks stronger based on current signals? | Selectors, company cards, score cards, memo, table, charts, and detailed comparisons can become giant. | Selectors, score matrix, key differences. | Scores, Financials, Market, News/Risk, AI Summary. | Company preview and metric explanation. | Save/export comparison. | Full ratio table. | Company detail pages. | Avoid giant tables; prioritize cards and tabs. |
| `/dashboard/market` | Market signal terminal | What is the market saying? | Price context, metrics, table, top movers, drivers, and limits stack. | Selected company price summary, chart/momentum, compact metrics. | Universe table, top movers, methodology. | Market metric detail. | None required. | Momentum drivers and data limits. | Company detail pages. | Table should be compact/contained; metric details click-based. |
| `/dashboard/news` | Event intelligence feed | What external events matter? | Stat cards, filters, long article cards, watchlist, notes, and critical events stack. | Sentiment summary, critical events, compact event list. | Watchlist and classification notes. | News event detail. | None required. | Filters and classification methodology. | Company detail pages. | Article list should be compact; details in drawer. |
| `/dashboard/alerts` | Action center | What changed, and why should I care? | Alerts, watchlist, simulator controls, and filter groups compete in one route. | Summary cards, severity tabs, compact alert list. | Alerts, Watchlist, Simulator. | Alert detail. | Add watchlist/rule command. | Watchlist table and simulator advanced controls. | Company detail pages. | Alert details should open in full-screen drawer/sheet. |
| `/dashboard/upload` | Guided data intake | How do I bring new data into the system? | Upload area, sample data, manual input, validation table, quick actions, history all visible. | Current step and next action. | Upload/manual/sample, validation, mock result. | Validation row detail. | Confirm mock analysis. | Upload history and parser notes. | None. | Needs stepper/wizard to avoid showing all intake modes at once. |
| `/dashboard/settings` | Workspace configuration | How do I configure the workspace? | Already tabbed, but many sections are long and dense. | One settings category and save action. | Workspace, Profile, Risk thresholds, Model preferences, AI analyst, Market/news providers, Notifications, Appearance. | Provider detail and threshold explanation. | Reset/save confirmation. | Advanced provider/API notes. | None. | Tabs should scroll and categories should not reveal all settings at once. |

## Primary IA Changes Required

- Keep page summaries above the fold and move supporting details behind tabs/drawers/accordions.
- Convert long route bodies into focused workflows: command center, research workbench, modelling console, report workflow, event feed, guided upload.
- Use click-based drawers for important details because mobile cannot rely on hover.
- Use popovers only for definitions or methodology hints.
- Treat mobile as a first-class IA: one visible task, one action area, and full-screen drawer behavior.
