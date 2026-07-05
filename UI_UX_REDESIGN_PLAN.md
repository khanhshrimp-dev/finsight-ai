# FinSight AI UI/UX Redesign Plan

Date: 2026-07-04

Scope: redesign and polish the existing mock-only FinSight AI dashboard UI. This pass must not add live APIs, scraping, trained ML, LLM provider calls, authentication, persistence, or investment advice.

## Current UI Scan Summary

The app already has a broad product surface:

- Dashboard overview, company universe, company detail, compare, simulator, market intelligence, news intelligence, copilot, reports, alerts, upload, and settings routes.
- Local shadcn-style UI primitives, Tailwind CSS v4 tokens, Lucide icons, Recharts, and mock TypeScript data.
- Mock-only route handlers and local deterministic scoring helpers.

Main UI issues found:

- Dashboard pages repeat page headers, stat cards, filter bars, and status treatments instead of using shared components.
- Sidebar navigation is a single long list, which makes information architecture harder to scan.
- Mobile dashboard navigation is incomplete because the sidebar is always rendered as a desktop rail.
- Dense tables rely on horizontal scrolling and do not offer mobile-optimized summary cards.
- Upload and settings pages still use older container sizing and larger heading scale than the rest of the dashboard.
- Empty, loading, and error states exist as components but are not wired into dashboard route boundaries.
- Several calls to action are visually useful but need clearer mock-only positioning.

## Design Goals

- Make the product feel like a focused finance SaaS workbench.
- Keep visual hierarchy calm, dense, and scan-friendly.
- Preserve all existing mock workflows and data logic.
- Make navigation understandable by grouping routes into product areas.
- Add responsive behavior for analyst workflows on small screens.
- Keep the mock-data boundary visible without turning every page into explanatory copy.
- Improve accessibility through semantic landmarks, focus states, labels, and route-level error states.

## Implementation Checklist

- [x] Document scan findings and design-system direction before editing UI.
- [x] Add shared dashboard page framing and page header components.
- [x] Add reusable score/stat/status presentation components.
- [x] Redesign dashboard layout background, spacing, and route transitions.
- [x] Group sidebar navigation and add mobile navigation access.
- [x] Normalize page headers across major dashboard routes.
- [x] Add mobile summary cards for the company universe.
- [x] Normalize upload and settings page layout.
- [x] Add dashboard loading and error boundaries.
- [x] Update product docs after implementation.
- [x] Run lint, typecheck, build, and route smoke checks.

## Page Priorities

Highest impact:

- `/dashboard`
- `/dashboard/companies`
- `/dashboard/company/[id]`
- `/dashboard/market`
- `/dashboard/news`
- `/dashboard/simulator`

Operational polish:

- `/dashboard/compare`
- `/dashboard/copilot`
- `/dashboard/reports`
- `/dashboard/alerts`
- `/dashboard/upload`
- `/dashboard/settings`

## Guardrails

- All scoring, market, news, AI, upload, report, and alert behavior remains mock-only.
- No new provider integrations, fetches, scraping, or environment variables.
- No broad rewrite of business logic.
- Existing useful workflows must remain available after the visual pass.

## Implementation Outcome

Completed:

- Added shared `DashboardPageShell`, `PageHeader`, `SectionHeader`, `InsightStatCard`, `SignalBadge`, and `ErrorState` components.
- Grouped dashboard navigation into Main, Intelligence, and Operations sections.
- Added a mobile dashboard drawer through the top navigation.
- Added dashboard route-level loading and error states.
- Updated overview, company universe, company detail, market, news, compare, simulator, reports, alerts, upload, settings, and copilot surfaces.
- Added mobile company summary cards and responsive settings tabs.
- Kept Copilot full-height while adding a mobile company selector.
- Updated upload and settings copy to make local mock behavior explicit.

Validation:

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- HTTP route smoke against the active dev server returned 200 for the dashboard route set.

Prior verification limitation:

- The 2026-07-04 pass could not complete browser visual QA because local browser access was blocked and the screenshot fallback could not run in that environment.
- The 2026-07-05 premium follow-up completed in-app browser smoke for the landing and company detail pages.

## 2026-07-05 Premium Follow-Up

Completed:

- Rebuilt the landing page around the current hybrid mock architecture.
- Added premium landing/product primitives and reduced-motion-aware reveal animation.
- Tightened dashboard KPI hierarchy and sidebar vocabulary.
- Added price context and Copilot/Simulator/Report actions to company detail.
- Updated `PREMIUM_UI_REDESIGN_PLAN.md`, `LANDING_PAGE_STRATEGY.md`, and `DASHBOARD_UX_STRATEGY.md`.

Validation:

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- In-app browser smoke passed for landing and company detail on desktop and 390px mobile.
- Main route HTTP smoke returned 200 for landing and dashboard routes.
