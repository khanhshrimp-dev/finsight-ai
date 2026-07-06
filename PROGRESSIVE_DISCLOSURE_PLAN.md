# Progressive Disclosure Plan

Date: 2026-07-07

## Objective

Reduce endless scrolling and card dumps across the FinSight dashboard without removing major mock features or introducing real APIs, scraping, ML, provider feeds, persistence, or LLM behavior.

## Shared Component Layer

Implemented in `components/ui/progressive-disclosure.tsx`:

- `PremiumTabs` for major route-level content modes.
- `DetailDrawer`, `InsightDrawer`, `MetricDrilldownDrawer`, `NewsEventDrawer`, `ReportPreviewDrawer`, and `MobileFilterSheet` for click-based detail on desktop and mobile.
- `CommandModal` for focused mock commands such as report generation.
- `ExpandableSection` for optional details, saved items, methodology, and advanced controls.
- `MethodologyPopover` and `TooltipInfo` for definitions and scoring notes.
- `SectionSummaryCard` for compact action/context summaries.

## Route Plan and Status

| Route | Disclosure pattern | Status | Notes |
| --- | --- | --- | --- |
| `/dashboard` | Tabs and summary cards | Done | Main view asks what needs attention; secondary signal groups are tabbed. |
| `/dashboard/company/[id]` | Tabs, drawers, popover, accordion | Done | Overview shortened; AI, reports, market, news, risk, fraud, and financials remain available through tabs. |
| `/dashboard/reports` | Command modal, preview drawers, accordion | Done | Report generation moved to modal; generated report rows open preview drawers. |
| `/dashboard/news` | Event drawers | Done | Feed rows are compact; full event context opens in drawer. |
| `/dashboard/market` | Metric drilldown drawers and accordions | Done | Focused market summary stays visible; top movers, drivers, and data limits are expandable. |
| `/dashboard/simulator` | Accordions and driver drawers | Done | Only primary assumption groups are open; advanced assumptions and saved scenarios are collapsed. |
| `/dashboard/compare` | Tabs | Done | Signals, Financials, Radar, and Risk Trend are separate modes. |
| `/dashboard/copilot` | Accordions | Done | Prompt library is grouped by category with only the first group open by default. |
| `/dashboard/alerts` | Tabs and detail drawers | Done | Alert list rows are compact; full alert context opens in drawer. |
| `/dashboard/upload` | Stepper/wizard tabs | Done | Input, Validate, and Review replace the previous all-at-once intake page. |
| `/dashboard/settings` | Existing tabs | Done | Category tabs remain the correct structure; provider/API limitations stay explicit. |

## Mobile Rules

- Use one primary task per route section.
- Keep tabs horizontally scrollable when labels exceed the viewport.
- Use drawers for row detail instead of expanding cards inline.
- Stack header action buttons and metadata on mobile when they risk clipping.
- Keep wide tables in contained scroll regions only.

## Validation

Final validation commands passed:

```bash
npm run lint
npm run typecheck
npm run build
node scripts/check-responsive-overflow.mjs http://localhost:3000
```

Responsive screenshot evidence:

- `visual-audit/ia-pass-final/`
- Routes: `/`, `/dashboard`, `/dashboard/companies`, `/dashboard/company/apex-technologies`, `/dashboard/copilot`, `/dashboard/reports`, `/dashboard/simulator`, `/dashboard/compare`, `/dashboard/market`, `/dashboard/news`, `/dashboard/alerts`, `/dashboard/upload`, `/dashboard/settings`
- Widths: 390px, 768px, 1024px, 1440px
