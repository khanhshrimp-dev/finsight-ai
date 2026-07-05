# FinSight AI Visual QA Checklist

Date: 2026-07-05

Use this checklist when running browser smoke or screenshot review for the premium dashboard redesign. The current app has no committed automated screenshot regression suite.

## Routes

- `/dashboard/copilot`
- `/dashboard/reports`
- `/dashboard/simulator`
- `/dashboard/compare`
- `/dashboard/market`
- `/dashboard/news`
- `/dashboard/alerts`
- `/dashboard/upload`
- `/dashboard/settings`

## Viewports

- 360px mobile
- 390px mobile
- 430px mobile
- 768px tablet
- 1024px small desktop
- 1280px desktop
- 1440px desktop
- 1920px wide desktop

## Global Checks

- Page loads without runtime errors or console errors.
- No unintended horizontal page overflow.
- Header, top navigation, sidebar/drawer, and page actions remain reachable.
- Primary content is not hidden behind sticky navigation.
- Text does not overlap buttons, badges, charts, tables, or adjacent cards.
- Long labels, tickers, company names, and report titles wrap or truncate cleanly.
- Tables either fit, scroll horizontally inside their container, or collapse into usable cards.
- Charts have stable height and do not collapse to zero pixels.
- Dark mode colors preserve contrast and semantic status meaning.
- Focus-visible rings remain visible on tabs, buttons, inputs, selects, and switches.
- Mock/demo notices remain visible and do not imply real APIs, LLMs, persistence, or market feeds.

## Route-Specific Checks

### Copilot

- Prompt library, chat stream, and active context panels stack cleanly on mobile.
- Chat input stays usable and does not cover response content.
- Company context and mock AI boundaries are visible.

### Reports

- Template cards, builder controls, and preview memo remain readable.
- Mock export status is explicit.
- Report preview sections do not overflow on narrow screens.

### Simulator

- Controls and outcome panels reorder logically across mobile and desktop.
- Sliders, number inputs, deltas, and memo panels remain aligned.
- Changed assumptions are visibly distinguished without relying only on color.

### Compare

- Two required company selectors and optional peer selectors remain usable.
- Score summary answers the comparison question before dense tables.
- Radar/chart panels have stable dimensions.

### Market

- Focused ticker header, range visualization, top movers, and table all remain legible.
- Price and percentage values use tabular spacing and do not wrap awkwardly.
- Mock market-data boundary is visible.

### News

- Filter toolbar wraps without clipping.
- Timeline cards show event type, severity, relevance, sentiment, and impact clearly.
- Critical events panel remains readable on mobile.

### Alerts

- Category tabs wrap cleanly and remain keyboard reachable.
- Alert severity, status, company, rule type, and actions are distinguishable.
- Empty/filter states are understandable.

### Upload

- Drop zone remains large enough for touch and pointer use.
- Supported formats, sample datasets, manual input, and validation preview are all visible.
- Upload progress state does not shift the layout unexpectedly.

### Settings

- Settings coverage cards and tabs wrap cleanly across widths.
- Disabled provider/API/avatar controls look intentionally unavailable.
- Save Changes communicates local mock behavior.
