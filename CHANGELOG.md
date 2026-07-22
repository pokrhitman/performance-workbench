# Changelog

All notable changes to this project are documented here.

## 2026-07-22 — Beginner → Foundations: Simple Return page, live calculator widget

### Added
- First Foundations-tier page: `beginner/foundations/simple-return/index.html`
  — Explainer walks the (End − Start) ÷ Start formula and the "simple
  return" / "holding period return" naming; Interactive tab is the
  site's first live number-input calculator, wired directly to
  `simpleReturn()` for real-time dollar gain, percent return, and a
  formula-substitution readout.
- New `components.css` blocks: `.calc-widget` / `.calc-input` /
  `.calc-result` / `.calc-note` — the site's first real form-input
  styling, deliberately named generic rather than page-specific so the
  Intermediate tier's shared verification widget can extend these same
  classes instead of starting over.

### Fixed
- `simpleReturn()` in `perf-calculations.js`: denominator changed from
  the signed `beginValue` to `Math.abs(beginValue)`. With a negative
  starting value (e.g. a margin/loan position starting the period in
  debt), dividing by the signed value flipped the return's sign — a
  real debt-shrinking improvement showed up as a negative return, and
  a real debt-growing deterioration showed up as positive. Caught via
  hands-on testing of the new calculator with negative inputs. The fix
  is a strict generalization: for any positive `beginValue` (every
  existing test, every other page) `Math.abs(beginValue) === beginValue`,
  so no other behavior changes. Also quietly hardens
  `timeWeightedReturn`/`unitValueReturn`, both of which call
  `simpleReturn()` for their sub-periods.
- Calculator widget's formula-substitution line now displays `|start|`
  (bars) in the denominator whenever Start Value is negative, so the
  displayed arithmetic always matches the actual computed result —
  otherwise a reader hand-checking the math would land on a different,
  wrong answer than the one shown.

### Changed
- `nav.js`: `simple-return` entry flipped from `comingSoon: true` to `false`.
- `tests.html`: three new `simpleReturn` cases covering negative-start
  scenarios (debt shrinking, debt growing, crossing zero).

### Notes
- Confirmed via research that the negative-denominator sign flip is a
  known, documented issue in performance measurement generally —
  Modified Dietz has the identical problem when its denominator goes
  negative from large early outflows in leveraged accounts. The
  absolute-value fix here mirrors a real, industry-recognized
  approach, not an invented workaround.
  

## 2026-07-19 — BVI scope correction: jurisdiction-neutral fund-unit language

### Changed
- Renamed `bviReturn()` → `unitValueReturn()` in `perf-calculations.js`
  and `tests.html` — the NAV-per-unit chaining technique isn't
  Germany-specific, so the function name shouldn't imply it is.
- Introduction tier (all three pages) revised to remove "BVI method"
  naming in favor of jurisdiction-neutral "fund-unit / NAV-based
  return" language, with national conventions forward-referenced to
  Intermediate rather than named early.
- `nav.js`: single `bvi-method` Intermediate entry split into two
  planned chapters — "Performance for Fund Units (Non-ETF)" and
  "Performance for Fund Units (ETFs)."
- Homepage `<head>`: description/keywords/og text updated to match;
  long-standing `github-io` → `github.io` typo in `canonical`/`og:url`
  finally fixed.

### Fixed
- Two dormant bugs caught during the `unitValueReturn` rename: a test
  that claimed to verify cash-flow-independence but called the wrong
  variable, and an unused test dataset with three duplicate dates that
  would have failed `validateEntries` had it ever actually run.


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