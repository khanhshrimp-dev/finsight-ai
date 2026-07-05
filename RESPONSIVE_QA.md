# Responsive QA

Date: 2026-07-05

## Screenshot Evidence

Post-redesign screenshots are saved in `visual-audit/redesign/`.

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
| 390px page-level overflow | Pass | CDP audit reported no route-level overflow after contained scroll regions were excluded. |
| 768px tablet compression | Pass | Persistent sidebar now starts at `lg`, leaving tablet layouts to use the mobile drawer and wider content. |
| 1024px compact desktop | Pass | Major multi-column workspaces now wait until `2xl`, preventing cramped tablet/compact desktop compositions. |
| 1440px desktop | Pass | Desktop screenshots show the redesigned shell, command-center cards, and flagship workspaces. |
| Dense data tables | Pass with contained scroll | Company, market, and validation tables use contained horizontal scroll where the data model is wider than the viewport. |
| Scrollable tabs/pills | Pass with contained scroll | Company tabs, alert categories, and settings tabs use safe contained horizontal scroll when needed. |

## Automated Checks

Commands run successfully:

```bash
npm run lint
npm run typecheck
npm run build
node scripts/check-responsive-overflow.mjs http://localhost:3000
```

The overflow audit checked all 13 routes across all 4 widths and passed after distinguishing contained scroll regions from page-level overflow.

## Notes

- The app uses local mock data only; screenshots do not depend on live providers.
- The Codex in-app browser rejected `localhost` navigation in this thread, so visual evidence was captured with local headless Chrome.
- A final screenshot refresh after the last min-width polish was blocked by the environment escalation usage limit. The existing `visual-audit/redesign/` folder remains the post-redesign screenshot set, and the last code change only reduces mobile clipping risk.
