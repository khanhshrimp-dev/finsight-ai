# FinSight AI Visual Audit

Date: 2026-07-05

Baseline screenshots were captured before redesign using headless Chrome against the active local dev server at `http://localhost:3000`.

Baseline screenshot folder: `visual-audit/baseline/`

Breakpoints captured:

- 390px mobile
- 768px tablet
- 1024px compact desktop
- 1440px desktop

## Baseline Summary

- The landing page first viewport renders as an almost empty grid/background in automated screenshots; the hero and product story are not reliably visible before capture. This makes the product look broken in screenshot/video contexts and suggests the reveal system depends too heavily on client-side viewport observation.
- Dashboard pages have a consistent dark visual language, but the composition still resembles a generic shadcn/admin template: left rail, top bar, equal cards, rounded panels, and repeated page headers.
- Mobile 390px screenshots show frequent horizontal clipping: page actions, filters, tab bars, score cards, and comparison/simulator panels extend beyond the viewport.
- Tablet layouts often preserve desktop patterns instead of using a tablet-specific composition. The sidebar remains wide at 768px, squeezing the page content.
- Chart and data sections often sit in boxed cards with weak visual priority; many pages read as disconnected panels rather than an advanced research terminal.
- Typography hierarchy is serviceable but not premium: labels, titles, metric values, and explanatory text repeat similar sizes and weights across pages.
- The card system relies on borders and dark fills more than depth, density, and composition. The result is polished enough for a dark dashboard but not a substantial visual reset.

## Baseline Route Findings

| Route | Screenshots | 390px Mobile | 768px Tablet | 1024px Compact | 1440px Desktop |
| --- | --- | --- | --- | --- | --- |
| `/` | [390](visual-audit/baseline/home-390.png), [768](visual-audit/baseline/home-768.png), [1024](visual-audit/baseline/home-1024.png), [1440](visual-audit/baseline/home-1440.png) | Hero/content is not visible; only nav and background appear. CTA clips at the right edge. | Same blank-first-viewport behavior; product preview is not visible. | Background dominates; hierarchy is missing. | Looks like an empty technical backdrop, not a product homepage. Must rebuild with visible hero, preview, architecture, bento, simulator, AI memo, and CTA sections. |
| `/dashboard` | [390](visual-audit/baseline/dashboard-390.png), [768](visual-audit/baseline/dashboard-768.png), [1024](visual-audit/baseline/dashboard-1024.png), [1440](visual-audit/baseline/dashboard-1440.png) | KPI cards stack but the page still feels like a narrowed desktop dashboard. Some content is pushed off to the right. | Sidebar consumes too much width; content becomes narrow and card-heavy. | Layout is readable but generic: equal cards plus chart grid. | Strongest current page, but still resembles a stock analytics admin screen. Needs command-center composition and stronger score/attention modules. |
| `/dashboard/companies` | [390](visual-audit/baseline/companies-390.png), [768](visual-audit/baseline/companies-768.png), [1024](visual-audit/baseline/companies-1024.png), [1440](visual-audit/baseline/companies-1440.png) | Filters and company cards clip horizontally; search/filter area is crowded. | Sidebar plus filters make the page feel compressed. | Company table/cards remain utilitarian and template-like. | Useful data density, but hierarchy is weak and lacks terminal-like research framing. |
| `/dashboard/company/apex-technologies` | [390](visual-audit/baseline/company-detail-390.png), [768](visual-audit/baseline/company-detail-768.png), [1024](visual-audit/baseline/company-detail-1024.png), [1440](visual-audit/baseline/company-detail-1440.png) | Header badges, action buttons, score cards, and tabs clip right. Core product page is not mobile-safe. | Tab workbench remains too wide and desktop-derived. | More usable but still built from stacked cards rather than a research-terminal layout. | Has good data, but page needs a dramatically stronger company intelligence header, score strip, and tabbed workbench. |
| `/dashboard/copilot` | [390](visual-audit/baseline/copilot-390.png), [768](visual-audit/baseline/copilot-768.png), [1024](visual-audit/baseline/copilot-1024.png), [1440](visual-audit/baseline/copilot-1440.png) | Prompt chips and chat structure clip; panels do not collapse into mobile modes. | Sidebar and three-panel workspace crowd the page. | Three columns are visible but cramped. | Looks like a prompt/card workspace rather than a premium AI analyst terminal; response hierarchy needs executive-summary sections and right context. |
| `/dashboard/reports` | [390](visual-audit/baseline/reports-390.png), [768](visual-audit/baseline/reports-768.png), [1024](visual-audit/baseline/reports-1024.png), [1440](visual-audit/baseline/reports-1440.png) | Cards and preview sections stack but still feel like generic form panels. | Sidebar constrains content; report cards feel repetitive. | Better but not report-workspace-like. | Needs clearer split between report library, generation panel, memo preview, and history. |
| `/dashboard/simulator` | [390](visual-audit/baseline/simulator-390.png), [768](visual-audit/baseline/simulator-768.png), [1024](visual-audit/baseline/simulator-1024.png), [1440](visual-audit/baseline/simulator-1440.png) | Before/after score panel is horizontally clipped. This is a hard responsive failure. | Controls and outcomes stack without a strong modeling-console feel. | Workbench is readable but not premium. | Strong feature concept, but layout needs assumptions/outcomes/drivers/saved scenarios as a deliberate console. |
| `/dashboard/compare` | [390](visual-audit/baseline/compare-390.png), [768](visual-audit/baseline/compare-768.png), [1024](visual-audit/baseline/compare-1024.png), [1440](visual-audit/baseline/compare-1440.png) | Selectors and company comparison cards clip horizontally. | Four selectors remain crowded. | More usable but still looks like forms plus cards. | Needs score matrix, comparison memo, and better compact-table/card behavior. |
| `/dashboard/market` | [390](visual-audit/baseline/market-390.png), [768](visual-audit/baseline/market-768.png), [1024](visual-audit/baseline/market-1024.png), [1440](visual-audit/baseline/market-1440.png) | Header and data panels clip; terminal feeling is weak. | Market panels are stacked but visually repetitive. | Good information, weak composition. | Looks like a card dashboard rather than a market intelligence terminal. Needs stronger price console, chart panel, movers, and signal rail. |
| `/dashboard/news` | [390](visual-audit/baseline/news-390.png), [768](visual-audit/baseline/news-768.png), [1024](visual-audit/baseline/news-1024.png), [1440](visual-audit/baseline/news-1440.png) | Filter controls and text clip right; timeline is pushed below generic stat cards. | Still too card-heavy. | Needs more event-feed hierarchy. | Needs timeline-first composition and AI "what this means" panel with stronger severity/sentiment language. |
| `/dashboard/alerts` | [390](visual-audit/baseline/alerts-390.png), [768](visual-audit/baseline/alerts-768.png), [1024](visual-audit/baseline/alerts-1024.png), [1440](visual-audit/baseline/alerts-1440.png) | Alert filters and rows need a mobile-specific card/action layout. | Wide sidebar and tabs make controls crowded. | Functional but generic. | Needs actionable alert center with severity rail, rules/watchlist, and clearer triage hierarchy. |
| `/dashboard/upload` | [390](visual-audit/baseline/upload-390.png), [768](visual-audit/baseline/upload-768.png), [1024](visual-audit/baseline/upload-1024.png), [1440](visual-audit/baseline/upload-1440.png) | Dropzone and validation table need stronger mobile adaptation. | Good basic flow but reads as admin upload form. | Generic two-column sections. | Needs premium ingestion workspace, parser pipeline, validation states, and sample/manual data split. |
| `/dashboard/settings` | [390](visual-audit/baseline/settings-390.png), [768](visual-audit/baseline/settings-768.png), [1024](visual-audit/baseline/settings-1024.png), [1440](visual-audit/baseline/settings-1440.png) | Tabs/coverage cards are long and can feel like a stacked settings dump. | Sidebar constrains content; cards are repetitive. | Usable, but not a console. | Needs grouped settings console with stronger sections and less card repetition. |

## Required Visual Changes Before Coding

- Replace the landing page with a visible, screenshot-safe hero and product preview that does not depend on hidden initial animation.
- Replace generic dashboard framing with a stronger app shell: compact intelligence rail, command bar, grouped navigation, responsive drawer, and a more technical workspace background.
- Introduce a new shared premium design system and apply it broadly rather than tuning individual cards.
- Treat 390px as a first-class layout, not a compressed desktop: controls must wrap, tabs need scroll or responsive tabs, comparison/simulator score panels must stack, and filter groups need collapsed patterns.
- Treat 768px as a tablet-specific layout: reduce side rail pressure, avoid three-column grids, and use two-column or stacked workspaces.
- Redesign the company detail page as the core research terminal with a differentiated header, score strip, and tabbed workbench.
- Redesign Copilot, Reports, and Simulator as flagship workspaces, not generic card pages.
- Redesign Compare, Market, News, Alerts, Upload, and Settings using the same shared primitives so none feel forgotten.

## Post-Redesign QA

Post-redesign screenshots were captured after implementation using the same local dev server and screenshot script.

Post-redesign screenshot folder: `visual-audit/redesign/`

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

Captured breakpoints:

- 390px
- 768px
- 1024px
- 1440px

Verification:

- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run build` passed.
- `node scripts/check-responsive-overflow.mjs http://localhost:3000` passed all 13 routes across all 4 widths when contained table/tab scroll regions were treated as intentional local scroll surfaces.

Key improvements:

- Landing page now renders visible hero/product content in the first viewport and no longer relies on a blank animated reveal state.
- Dashboard shell uses a later persistent-sidebar breakpoint so tablet views keep content width.
- Page headers, notices, and premium cards use shrink-safe layout rules to prevent mobile right-edge clipping.
- Company detail, Copilot, Reports, Simulator, Compare, Market, News, Alerts, Upload, and Settings now use shared premium primitives instead of generic card-only admin layouts.
- Major two- and three-column workspaces now activate at `2xl`, preventing crowded 768px and 1024px layouts.

Remaining notes:

- Dense tables and long tab/category lists use contained horizontal scroll where a compact card view would remove too much scan-ready data.
- A final screenshot refresh after the last min-width polish was blocked by the environment escalation usage limit; the code-level QA and overflow audit were completed after those fixes.
