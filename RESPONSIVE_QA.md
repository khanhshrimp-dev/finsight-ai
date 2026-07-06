# Responsive QA

Date: 2026-07-07

## Screenshot Evidence

Final progressive-disclosure pass screenshots are saved in `visual-audit/ia-pass-final/`.

Captured routes:

- `/`
- `/dashboard`
- `/dashboard/companies`
- `/dashboard/company/apex-technologies`
- `/dashboard/copilot`
- `/dashboard/reports`
- `/dashboard/simulator`
- `/dashboard/compare`
- `/dashboard/market`
- `/dashboard/news`
- `/dashboard/alerts`
- `/dashboard/upload`
- `/dashboard/settings`

Captured widths:

- 390px
- 768px
- 1024px
- 1440px

## Responsive Gates

| Gate | Result | Notes |
| --- | --- | --- |
| 390px page-level overflow | Pass | All audited routes passed the CDP overflow audit. Company header actions and metadata stack on mobile. |
| 768px tablet compression | Pass | Disclosure tabs, drawers, accordions, and contained tables prevent route-level overflow. |
| 1024px compact desktop | Pass | Workbench routes avoid cramped all-at-once layouts by using tabs and accordions. |
| 1440px desktop | Pass | Desktop layouts preserve richer density while keeping secondary sections gated. |
| Dense data tables | Pass with contained scroll | Compare, market, company financials, and upload validation tables use contained scroll where needed. |
| Scrollable tabs/pills | Pass with contained scroll | Company, dashboard, compare, alerts, upload, and settings tabs remain route-contained. |
| Mobile drawers | Pass | Alert, news, report, metric, and simulator driver details open in responsive drawer surfaces. |

## Automated Checks

Commands run successfully:

```bash
npm run lint
npm run typecheck
npm run build
node scripts/check-responsive-overflow.mjs http://localhost:3000
node scripts/capture-visual-audit.mjs ia-pass-final http://localhost:3000
```

`check-responsive-overflow.mjs` checked all 13 routes across 4 widths, for 52 route/viewport checks total.

## Manual Spot Checks

Spot-checked screenshots after the final capture:

- `visual-audit/ia-pass-final/company-detail-390.png`
- `visual-audit/ia-pass-final/compare-390.png`
- `visual-audit/ia-pass-final/upload-390.png`
- `visual-audit/ia-pass-final/dashboard-1440.png`

Findings:

- No page-level horizontal overflow detected.
- Company detail mobile actions stack correctly.
- Company detail mobile metadata no longer clips inside the header.
- Upload wizard tabs are visible and compact at 390px.
- Compare page no longer exposes the full analysis stack before tab selection.
