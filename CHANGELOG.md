# Changelog

All notable changes to this project are documented here.

## 2026-07-18 — Introduction tier complete: two new topic pages

### Added
- Second Introduction-tier page: `beginner/introduction/what-a-return-measures/index.html` — Explainer on dollar gain vs. percent return and why time is the other half of the equation; Interactive tab is the site's first Chart.js widget, a toggleable bar chart (four preset portfolios, $ Gain vs. % Return views) with color-coded bars per view.
- Third Introduction-tier page: `beginner/introduction/method-is-a-choice/index.html` — Explainer walks a three-question checklist (valuation history? NAV or portfolio value? who controls cash-flow timing?) that sorts into TWR, MWR/IRR, Modified Dietz, and BVI; Interactive tab is a 2×2 expandable card grid, one per method, reusing the sidebar's collapse/expand pattern.
- New `components.css` blocks: `.return-chart-widget` / `.chart-toggle-group` (chart toggle controls) and `.method-grid` / `.method-card` (expandable comparison cards).

### Changed
- `nav.js`: both new pages flipped from `comingSoon: true` to `false`.

### Fixed
- `.method-grid` needed `align-items: start` — CSS Grid's default `stretch` was making sibling cards visually "expand" (empty whitespace) whenever one card's detail text toggled open, even though only one card's own state had actually changed.

### Notes
- Chart bar colors are driven from JS (`cssVar("--accent")` / `cssVar("--accent-soft")`), read live from `main.css` custom properties — not hardcoded hex values. Deliberately kept in the brand-color family, separate from `--verify`/`--flag`/`--status-good`, which stay reserved for the verification-table status pair.
- This closes out the Introduction tier. Next planned page: Beginner → Foundations → Simple Return — the first page where a formula-engine function is the actual subject matter, not a supporting calculation.


## 2026-07-12 — Sidebar interactivity, tabs, and first topic page

### Added
- `assets/js/tabs.js` — shared Explainer/Interactive/Reference tab control, reused by every topic page.
- First topic page: `beginner/introduction/why-numbers-disagree/index.html` — Explainer prose (fund manager vs. financial controller framing), a cash-flow-timing slider widget, and a Reference summary.
- Sidebar tiers in `nav.js` are now collapsible — single toggle button per tier, current tier auto-expanded on load, everything else collapsed.
- "Coming soon" badges on unbuilt sidebar topics, driven by a per-item `comingSoon` flag.
- Breadcrumb trail (`#breadcrumb`, driven by `SIDEBAR_DATA`) on topic pages, with a working Home link.
- Full SEO/Open Graph `<head>` block on the first topic page, matching the homepage's existing pattern.

### Changed
- Sidebar's standalone Introduction tier folded into Beginner's own "Introduction" group — removed duplicate top-level tier.
- Homepage tier-grid: Beginner card now points at the one real topic page; Intermediate and Advanced cards are non-clickable "coming soon" cards instead of dead links.

### Decided
- No standalone tier index pages (`beginner/index.html`, etc.) — sidebar tier headers only toggle collapse/expand, they don't link anywhere. Diverges from the original file skeleton.


## Session 1 - 2026-07-11

### Added
- Formula engine (`assets/js/perf-calculations.js`): simple return,
  annualize, linkReturns, time-weighted return, Modified Dietz, BVI
  return, and IRR/MWR (Newton-Raphson), plus shared validation and
  date helpers. Fully covered by a hand-written test harness
  (`tests.html`).
- Root landing page (`index.html`): hero section with a static
  verification-table preview, "Who is this for?" and "Explore by
  tier" sections.
- CSS token system (`assets/css/main.css`) and component styles
  (`assets/css/components.css`), including the site's color palette
  and fixed header/sidebar layout.
- Sidebar navigation (`assets/js/nav.js`), rendering the full planned
  site tree from a single `SIDEBAR_DATA` structure.