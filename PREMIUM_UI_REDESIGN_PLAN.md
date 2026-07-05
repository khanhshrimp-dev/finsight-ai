# FinSight AI Premium UI Redesign Plan

Date: 2026-07-05

Scope: elevate FinSight AI from a complete mock dashboard into a premium product experience. This pass stays strictly visual/product-facing: no real APIs, scraping, trained ML, live market data, LLM provider calls, auth, persistence, or investment advice.

## Repo Scan Summary

- App stack: Next.js 16.2.4 App Router, React 19.2.4, TypeScript, Tailwind CSS v4, shadcn-style local primitives, Lucide icons, Recharts, Framer Motion installed.
- Routes: marketing landing page, auth mock pages, dashboard overview, companies, company detail, compare, simulator, market, news, copilot, reports, alerts, upload, settings, and mock API routes.
- Dashboard shell: grouped sidebar, top navigation, mobile drawer, route loading/error boundaries already exist from the prior redesign pass.
- Component system: base UI primitives plus dashboard shell/header/KPI/status/error components exist; landing-specific premium sections are still mostly page-local.
- Data layer: all financial, market, news, alert, report, and AI content remains mock/local.

## Current UI Issues

- Landing page still reads like an earlier SaaS template and overstates maturity with phrases such as LLM-powered analysis and testimonials.
- The hero does not yet feel like a high-end financial intelligence product and lacks a strong product-preview composition.
- Product storytelling is not clear enough: financials, risk model, market/news intelligence, AI analyst, and reports should be shown as an integrated system.
- Dashboard overview still shows too many equal-weight KPI cards for a command-center first screen.
- Company detail header needs stronger product framing with price context and direct next actions.
- Existing motion is mostly basic Tailwind transitions; landing page needs premium entrance/reveal motion without becoming distracting.
- Global font token setup still uses a Tailwind v4 circular variable pattern and should follow the local Next.js guidance.

## Redesign Goals

- Make the first viewport feel premium, intelligent, and finance-grade.
- Replace generic marketing copy with confident, mock-honest product storytelling.
- Add a reusable premium visual layer for landing/product sections.
- Tighten dashboard command-center hierarchy.
- Make company detail feel like the core intelligence terminal.
- Preserve calm analytics-first density and avoid flashy crypto-style visuals.
- Maintain accessibility, responsive behavior, and build stability.

## Pages To Redesign

- `/`: full premium landing-page rebuild.
- `/dashboard`: KPI hierarchy and command-center copy refinement.
- `/dashboard/company/[id]`: company hero/action polish.
- Dashboard shell: sidebar label refinement and typography/background polish.

## Component System Changes

Planned additions:

- `MotionReveal`: reduced-motion-aware Framer Motion reveal wrapper.
- `PremiumPanel`: refined bordered/glow panel primitive.
- `BentoCard`: landing bento/feature card primitive.
- `FloatingMetric`: landing product-preview score card.
- Landing-specific product preview, intelligence layer, AI memo, and scenario highlight sections.

Pass 2 dashboard additions:

- `DemoDataNotice`: route-level mock-data and no-provider-call boundary.
- `CommandCard`: compact premium action/context card for dashboard workspaces.
- `MetricDeltaCard`: reusable tabular metric card with optional semantic delta badge.
- `AnalystMemoCard`: reusable explanation/memo panel for mock analyst guidance.
- `FilterToolbar`: responsive filter shell for dense intelligence pages.
- `SplitWorkspaceLayout`: reusable three-column analyst-workspace layout.

## Animation Strategy

- Use Framer Motion only for landing reveal/entrance where it improves perceived quality.
- Keep dashboard route animations CSS-based and subtle.
- Respect `prefers-reduced-motion`.
- Avoid long-running decorative loops except a very small floating product-preview effect.

## Responsive Strategy

- Landing hero stacks cleanly on 360-430px mobile widths.
- Product preview uses a constrained responsive grid and never depends on fixed desktop widths.
- Bento cards collapse into one column on mobile and keep touch-friendly spacing.
- CTA groups wrap cleanly.
- Dashboard tables/cards keep the previous mobile-card behavior.

## Completed Changes

- Rebuilt `/` as a premium product landing page with a fixed navigation bar, finance-grade hero, product command-center preview, intelligence-layer story, feature bento, simulator highlight, AI analyst workspace, responsible-use disclaimer, and final dashboard CTAs.
- Added `MotionReveal`, `PremiumPanel`, `BentoCard`, and `FloatingMetric` primitives for reusable landing/product polish.
- Updated global typography tokens to use literal Geist font names under Tailwind v4 and moved font variables to the root `<html>` element.
- Added subtle premium background utilities, reduced-motion handling, and a controlled floating metric animation.
- Tightened `/dashboard` KPI hierarchy from six equal cards to five primary command-center signals.
- Refined sidebar group labels to `Overview`, `Intelligence`, and `Operations`.
- Updated `/dashboard/company/[id]` header with price context and primary actions: Ask Copilot, Open Simulator, and Generate Report.
- Updated design, landing, dashboard, roadmap, tracker, README, changelog, and architecture docs.

## Remaining Visual Issues

- Some dense secondary dashboard pages still use older `rounded-xl` card patterns from the existing component system.
- Auth pages were not included in this premium pass beyond ensuring they remain buildable.
- No automated screenshot regression suite exists yet.
- Future visual work should target compare, reports, copilot, upload, and settings with the same premium command-center language.

## Validation

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- Browser smoke: `/` and `/dashboard/company/apex-technologies` loaded in the in-app browser with expected content and no console errors.
- Mobile browser smoke at 390px: no horizontal overflow on `/` or `/dashboard/company/apex-technologies`.
- HTTP route smoke: main landing and dashboard routes returned 200 from the local dev server.

## Pass 2 Scan - 2026-07-05

Baseline before implementation:

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.

Routes still needing premium polish:

- `/dashboard/copilot`: functional mock chat, but still reads as a basic chatbot rather than a split analyst workspace.
- `/dashboard/reports`: has templates and previews, but needs consulting-style memo framing, clearer report cards, and mock export status.
- `/dashboard/simulator`: deterministic scenario logic is strong, but layout needs clearer model-workbench hierarchy and grouped assumption controls.
- `/dashboard/compare`: useful comparison data exists, but the page is table-heavy and should answer the health/investability question faster.
- `/dashboard/market`: needs premium price-header framing, top movers, market interpretation, and clearer mock-market boundary.
- `/dashboard/news`: needs stronger event-intelligence framing, critical-event panel, timeline feel, and "what this means" summary.
- `/dashboard/alerts`: useful local state exists, but alerts need a more actionable command-center layout and clearer rule/watchlist treatment.
- `/dashboard/upload`: upload/mock parser flow is functional, but should look like a future ingestion product surface.
- `/dashboard/settings`: has many controls, but needs professional grouped settings sections and clearer mock provider configuration.

Pass 2 implementation direction:

- Add reusable dashboard-level premium components for notices, command cards, analyst memos, metric deltas, and filter/workspace panels.
- Preserve all local mock state and deterministic helpers.
- Improve visual hierarchy, copy, responsiveness, and accessibility without adding real APIs, persistence, model training, scraping, live feeds, auth, or LLM calls.

## Pass 2 Completed Changes - 2026-07-05

- Added shared premium dashboard primitives in `components/ui/premium-dashboard.tsx`.
- Redesigned `/dashboard/copilot` as a split analyst workspace with context, grouped prompts, chat output, active scores, and mock AI boundaries.
- Redesigned `/dashboard/reports` with report templates, consulting-style preview memo, export framing, health/risk/investment metrics, and clear mock generation limits.
- Redesigned `/dashboard/simulator` into a model workbench with grouped assumptions, before/after score cards, scenario deltas, and deterministic explanation.
- Redesigned `/dashboard/compare` to support two required companies plus optional peer selectors, faster score summaries, and a plain-English analyst answer.
- Redesigned `/dashboard/market` with a focused ticker header, 52-week range, performance metrics, top movers, and market interpretation memo.
- Redesigned `/dashboard/news` with event-intelligence filters, richer timeline cards, critical-event panel, and a "what this means" memo.
- Redesigned `/dashboard/alerts` with command-center metrics, category tabs, clearer alert taxonomy, and action-oriented memo framing.
- Redesigned `/dashboard/upload` with a mock intake notice, validation metrics, premium drop zone, sample/manual input cards, parser preview, and ingestion guidance.
- Redesigned `/dashboard/settings` with settings coverage cards, mock provider boundaries, disabled placeholder-only controls, and governance memo.
- Added `VISUAL_QA_CHECKLIST.md` to document route and viewport review coverage until an automated screenshot suite exists.

## Pass 2 Remaining Issues

- The app remains intentionally mock-only; real ingestion, persistence, auth, provider calls, LLM calls, and PDF generation are still future work.
- Automated visual regression tests are not committed.
- Some low-level legacy `Card` usage remains in dense panels where replacing it would not change the route-level experience.

## Pass 2 Validation

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- In-app browser smoke: `/dashboard/copilot`, `/dashboard/reports`, `/dashboard/simulator`, `/dashboard/compare`, `/dashboard/market`, `/dashboard/news`, `/dashboard/alerts`, `/dashboard/upload`, and `/dashboard/settings` loaded with expected headings and no captured console errors.
- Responsive browser matrix: 72 route/viewport checks passed across 360, 390, 430, 768, 1024, 1280, 1440, and 1920px widths with no detected horizontal overflow or clipped buttons.
