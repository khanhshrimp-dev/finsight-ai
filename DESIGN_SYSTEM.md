# FinSight AI Design System

Date: 2026-07-04

FinSight AI uses a restrained finance SaaS interface: dense information, clear hierarchy, quiet surfaces, and explicit mock-data boundaries.

## Foundations

- Framework: Next.js App Router with React and TypeScript.
- Styling: Tailwind CSS v4 tokens in `app/globals.css`.
- Components: local shadcn-style primitives in `components/ui`.
- Icons: Lucide icons inside buttons, navigation, and status markers.
- Charts: Recharts for analytical views.

## Visual Direction

- Backgrounds use neutral application surfaces with subtle bordered panels.
- Primary actions use the existing `primary` token.
- Finance signals use semantic colors:
  - Emerald for constructive health and positive momentum.
  - Amber/orange for watchlist, medium risk, and caution.
  - Red for critical risk, high-severity events, and adverse movement.
  - Sky/cyan/indigo/violet only for product category accents, not as dominant page themes.
- Cards stay compact and functional. Use cards for metrics, repeated records, and framed tools, not for full page sections.

## Typography

- Page titles: `text-2xl` or equivalent, tight line height.
- Card titles: compact `text-base` hierarchy.
- Labels: uppercase tracking only for small metric labels.
- Numeric data: `tabular-nums` for scores, prices, percentages, and counts.
- Avoid viewport-scaled type so controls remain predictable on small screens.

## Layout

- Dashboard pages use a shared max-width container with responsive padding.
- Primary page content uses `space-y-6` with 4-column, 3-column, or 2-column analytical grids.
- Long tables remain horizontally scrollable on desktop, with mobile summary cards where the same data must be usable.
- Sticky dashboard top navigation should remain visible without covering page content.

## Navigation

- Dashboard routes are grouped by intent:
  - Main: Overview, Companies, Compare, Scenario Simulator.
  - Intelligence: Market Intelligence, News Intelligence, AI Copilot, Reports.
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

## States

- Empty states should show the missing condition, not a tutorial.
- Loading states should skeletonize the page structure instead of showing a spinner alone.
- Error states should offer a retry action when possible.
- Mock-only actions should clearly remain previews, JSON outputs, or local UI state.

## Accessibility

- Dashboard shell uses semantic `header`, `nav`, `aside`, and `main`.
- Icon-only buttons include accessible labels.
- Interactive rows keep links/buttons reachable by keyboard.
- Focus-visible rings must remain visible.
- Color is not the only status signal; badges and text labels accompany semantic colors.

## Motion

- Use short, subtle transitions for hover, active, drawer, and route entrance states.
- Avoid decorative motion that competes with analytical content.
- Preserve layout dimensions so hover states and loading states do not shift the UI.
