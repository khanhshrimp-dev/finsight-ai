# FinSight AI Design System

Date: 2026-07-05

FinSight AI uses a premium finance SaaS interface: precise information density, calm hierarchy, high-trust surfaces, and explicit mock-data boundaries.

## Foundations

- Framework: Next.js App Router with React and TypeScript.
- Styling: Tailwind CSS v4 tokens in `app/globals.css`.
- Components: local shadcn-style primitives in `components/ui`.
- Icons: Lucide icons inside buttons, navigation, and status markers.
- Charts: Recharts for analytical views.

## Visual Direction

- Backgrounds use neutral application surfaces with subtle radial depth and low-contrast grid texture where useful.
- Primary actions use one restrained blue-violet brand accent.
- Finance signals use semantic colors:
  - Emerald for constructive health and positive momentum.
  - Amber/orange for watchlist, medium risk, and caution.
  - Red for critical risk, high-severity events, and adverse movement.
  - Sky/cyan/indigo/violet only for product category accents, not as dominant page themes.
- Cards stay compact and functional in the dashboard. Landing panels can be more editorial, but should still feel precise, analytical, and consistent with the app's restrained radius and border language.

## Color System

- Light background: near-white neutral with visible but quiet borders.
- Dark background: deep neutral, not saturated blue.
- Primary: sophisticated blue-violet for CTAs, active navigation, and product emphasis.
- Supporting accents: emerald, amber, red, sky, and violet only for semantic or product-category meaning.
- Borders: low contrast but visible enough to separate dense financial content.
- Text: high contrast for labels and values; muted text only for metadata and secondary explanations.

## Typography

- Landing hero: large, confident, tight, and concise.
- Dashboard page titles: `text-2xl` or equivalent, tight line height.
- Card titles: compact `text-base` hierarchy.
- Labels: uppercase tracking only for small metric labels.
- Numeric data: `tabular-nums` for scores, prices, percentages, and counts.
- Avoid viewport-scaled type so controls remain predictable on small screens.
- Geist Sans is the default interface font; Geist Mono is reserved for metrics, tickers, IDs, timestamps, and code-like strings.

## Spacing System

- Dashboard shell: responsive `px-4 sm:px-6 lg:px-8`, `space-y-6`.
- Landing sections: larger vertical rhythm, generally `py-20` to `py-28`.
- Cards: compact dashboard padding, more generous landing/editorial padding.
- Dense metrics: align values on a tabular baseline and avoid oversized labels.

## Layout

- Dashboard pages use a shared max-width container with responsive padding.
- Primary page content uses `space-y-6` with 4-column, 3-column, or 2-column analytical grids.
- Long tables remain horizontally scrollable on desktop, with mobile summary cards where the same data must be usable.
- Sticky dashboard top navigation should remain visible without covering page content.

## Navigation

- Dashboard routes are grouped by intent:
  - Overview: Command Center, Companies, Compare, Simulator.
  - Intelligence: Market, News, AI Copilot, Reports.
  - Operations: Alerts, Upload, Settings.
- Active state must be visible by color, background, and a left-edge indicator.
- Mobile navigation uses a compact menu button and overlay drawer.

## Components

Shared dashboard components should cover:

- `PageHeader` for title, eyebrow, description, icon, breadcrumbs, and actions.
- `DashboardPageShell` for consistent page padding, max width, and route fade-in.
- `SectionHeader` for card and section headings with optional actions.
- `InsightStatCard` for KPI cards with icon, trend, and semantic tone.
- `SignalBadge` for health, risk, sentiment, severity, status, and mock/demo badges.
- `ErrorState` for recoverable route and panel failures.

Premium landing/product components should cover:

- `MotionReveal` for reduced-motion-aware reveal animation.
- `PremiumPanel` for premium bordered/glow panels.
- `BentoCard` for feature bento layouts.
- `FloatingMetric` for product-preview metric overlays.

Premium dashboard components should cover:

- `DemoDataNotice` for route-level mock-data, no-provider-call, and no-persistence boundaries.
- `MetricDeltaCard` for compact tabular score, status, and delta summaries.
- `AnalystMemoCard` for explanation panels, decision framing, and responsible-use notes.
- `CommandCard` for compact action/context choices.
- `FilterToolbar` for responsive intelligence filters with result counts.
- `SplitWorkspaceLayout` for analyst workspaces such as Copilot.

Implemented premium page patterns:

- Landing hero plus dashboard CTA cluster.
- Product-preview command center.
- Intelligence-layer section.
- Scenario simulator highlight.
- AI analyst workspace.
- Responsible-use disclaimer band.
- Dashboard Copilot split workspace with grouped prompt library, chat output, and active context.
- Reports builder with template cards and professional memo preview.
- Simulator model workbench with grouped assumptions and before/after deltas.
- Compare page with optional peers and fast health/investability answer.
- Market page with focused ticker header, range visualization, and top movers.
- News page with timeline, critical events, and interpretation memo.
- Alerts page with category tabs, command metrics, and rule/watchlist framing.
- Upload page with mock intake, parser preview, and validation guidance.
- Settings page with coverage cards, provider placeholders, and disabled unavailable controls.

## Button System

- Primary buttons are reserved for the main next action.
- Secondary buttons use bordered/quiet surfaces.
- CTA groups must wrap on mobile.
- Buttons with icons should keep text labels unless the icon is universally familiar.

## Chart Style

- Use muted grids, restrained color, and nearby written interpretation.
- Avoid rainbow palettes.
- Charts should support quick reading, not decoration.

## States

- Empty states should show the missing condition, not a tutorial.
- Loading states should skeletonize the page structure instead of showing a spinner alone.
- Error states should offer a retry action when possible.
- Mock-only actions should clearly remain previews, JSON outputs, or local UI state.
- Disabled placeholder-only controls should explain why they are unavailable rather than appearing broken.

## Accessibility

- Dashboard shell uses semantic `header`, `nav`, `aside`, and `main`.
- Icon-only buttons include accessible labels.
- Interactive rows keep links/buttons reachable by keyboard.
- Focus-visible rings must remain visible.
- Color is not the only status signal; badges and text labels accompany semantic colors.

## Motion

- Use short, subtle transitions for hover, active, drawer, route entrance, and landing reveal states.
- Avoid decorative motion that competes with analytical content.
- Preserve layout dimensions so hover states and loading states do not shift the UI.
- Respect reduced motion for Framer Motion landing effects.
