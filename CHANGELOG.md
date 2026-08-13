# Changelog

All notable changes to this project are documented here.

## 2026-08-13 — Beginner → Foundations: Return Conventions (tier complete)

### Added
- Fifth and final Foundations-tier page:
  `beginner/foundations/return-conventions/index.html` — Explainer
  covers percent, basis points and log return as three notations for
  the same underlying number (percent/bps are unit conversions of each
  other; log return is genuinely different, agreeing with simple
  return only at 0%). Closes with the additivity payoff: the same
  10%/−10%/5% quarters from the Compounding chapter, shown to sum
  correctly in log-return space (+3.87%, matching ln(1.0395) exactly)
  where naive addition failed in simple-return space. Two new
  formula-engine functions: `logReturn(beginValue, endValue)` —
  ln(endValue ÷ beginValue), requires both values positive — and
  `toBasisPoints(decimalReturn)`, a pure unit conversion. Interactive
  tab combines a three-output Start/End Value calculator (reusing
  Simple Return's own inputs) with a live Chart.js line chart plotting
  simple return against log return, marking the user's own numbers on
  the curve where the two diverge — the site's first chart outside the
  Introduction tier.
- New `components.css` component `.calc-results--triple`, a
  three-column variant of `.calc-results` for widgets with three
  simultaneous outputs.

### Changed
- `nav.js`: `return-conventions` entry flipped from `comingSoon: true`
  to `false`; also re-fixed the `return-convetions` path typo — this
  had been logged as fixed in the previous (Annualizing) session's
  changelog entry but wasn't actually present in the files worked
  from, reapplied here.

### Fixed
- `tests.html`: reapplied two more fixes also logged as complete in
  the previous session but missing from the actual file — tightened
  `annualize(0.02, 60)`'s expected value to 0.1280 (dropping the
  now-unneeded loose 0.001 tolerance) and added the
  `annualize(0.02, 60, 252)` ≈ 0.0867 case. Added new coverage for
  `logReturn()` (base case, flat case, the additivity identity, two
  throw cases) and `toBasisPoints()` (base case, negative case, zero
  case, one throw case).

### Notes
- Resolves the standing title-wording question — not by unifying it,
  but by accepting the asymmetry as a deliberate rule: `<h1>` can
  carry the fuller planning-doc title when the extra words name real
  content (this page's does), `nav.js`'s label stays short regardless,
  since sidebar width is the binding constraint there. Compounding and
  Geometric Linking's own pre-existing h1/label mismatch predates this
  rule and wasn't touched this session.
- Closes out the Beginner tier: all three Introduction pages and all
  five Foundations pages are now live.

## 2026-08-09 — Beginner → Foundations: Annualizing a Return

### Added
- Fourth Foundations-tier page:
  `beginner/foundations/annualizing/index.html` — Explainer opens on
  the same geometric-vs-naive lesson from Compounding and Geometric
  Linking, applied to a single period instead of a chain: a 2.00%
  return over 60 days scales naively to 12.17% but annualizes to
  12.80%; the same 2.00% over just 10 days shows the danger vividly
  (naive 73.00% vs. geometric 106.02%, a 33-point gap). Cites the real
  GIPS rule barring compliant firms from annualizing any sub-annual
  period at all, then covers the basis parameter (365/360/252) as a
  second, separate methodology choice baked into the same formula.
  Interactive tab is a 3-input calculator (period return %, period
  length in days, basis dropdown) computing naive linear scaling and
  `annualize()`'s geometric result side by side, with a dynamic note
  that names GIPS for any sub-annual stretch, flags the long-period
  compression case as the ordinary/legitimate use of annualizing, and
  reports the naive/geometric gap's size and direction either way.
  Reference tab discloses that period length is always taken as
  elapsed calendar days regardless of which basis is selected — a
  deliberate simplification, not a full 30/360 or trading-day
  recount.
- New `components.css` component `.calc-select` — first `<select>`
  styling on the site,"matching .calc-input's visual language 
  (border, radius, padding, focus outline), with a smaller font-size 
  to keep longer option text from clipping in the narrow grid column"

### Changed
- `nav.js`: `annualizing` entry flipped from `comingSoon: true` to
  `false`; label updated to "Annualizing a Return" to match the
  page's own `<h1>`. Also fixed a pre-existing path typo on the
  (still-`comingSoon`) `return-conventions` entry —
  `return-convetions` → `return-conventions` — caught while editing
  the same array, before it could turn into a broken link.
- `tests.html`: tightened `annualize(0.02, 60)`'s expected value from
  0.1288 to 0.1280 — the true value is ≈0.12802, which the old
  expected value only passed by virtue of a loose 0.001 tolerance,
  not because it was itself precise. Added a new case,
  `annualize(0.02, 60, 252)` ≈ 0.0867, covering the `basis` parameter
  directly — previously untested even though the parameter has
  existed since the formula-engine session.

### Notes
- Resolves the day-count basis selector item deferred since the
  formula-engine session: a native `<select>` (365/360/252), decided
  per-page rather than site-wide, consistent with the original
  deferral note.
- No `perf-calculations.js` changes — `annualize()` already supported
  everything this page needed.

## 2026-08-08 — Beginner → Foundations: Compounding and Geometric Linking

### Added
- Third Foundations-tier page:
  `beginner/foundations/compounding-and-linking/index.html` — Explainer
  builds from the classic +10%/−10% ≠ 0% see-saw to a 3-period
  extension (+10%, −10%, +5% → +3.95%, not the naively-summed +5.00%),
  then closes the loop by showing the linked answer exactly matches
  `simpleReturn()` applied directly to the first and last value.
  Interactive tab is a 3-input version of the Simple Return calculator
  pattern: three editable period-return percentages, live naive-sum vs.
  `linkReturns()` comparison, plus a growth-factor formula readout and
  an overstates/understates gap note.
- New `components.css` modifier `.calc-inputs--triple` — first 3-column
  variant of the calc-widget input grid (previously hardcoded to 2).

### Changed
- `perf-calculations.js`: `linkReturns()` moved from the
  `Intermediate tier` section to a new `Shared / tier-agnostic` section,
  positioned right after `annualize()`. The function's own logic is
  unchanged — it never depended on cash-flow timing — but its section
  placement no longer implies it's off-limits to Beginner-tier pages,
  which this chapter's whole premise needed.
- `nav.js`: `compounding-and-linking` entry flipped from
  `comingSoon: true` to `false`; label updated to "Compounding and
  Geometric Linking" to match the page's own H1.

### Notes
- No `tests.html` changes required — `linkReturns()` already had three
  passing cases, including `linkReturns([0.05, -0.05])` commented "up
  then down doesn't cancel to zero," which is this chapter's exact
  lesson at a smaller scale.

## 2026-07-30 — Beginner → Foundations: Why Cash Flows Break Simple Return

### Added
- Second Foundations-tier page:
  `beginner/foundations/cash-flows-break-simple-return/index.html` —
  Explainer walks one worked example (a $10,000 contribution inside a
  $100k→$119.4k period) two ways: the whole-period naive return
  (19.40%, folding the deposit in as if it were profit) and a
  sub-period reading showing the original capital briefly losing money
  while posting a positive naive return. Interactive tab computes both
  live from `simpleReturn()`: a two-row ledger (first dynamic use of
  the homepage hero's `.verify-table`/status-badge components) plus a
  reconciliation stat block reusing Why Numbers Disagree's `.cf-widget`
  pattern.
- New `components.css` modifier `.cf-stat--flag` — second stat-highlight
  variant, coloring a stat with `--flag` instead of `--accent` to signal
  "this number is misleading" rather than "this is the answer."
- New `components.css` modifier `.verify-preview--inline` — un-centers
  the hero's verification-table styling for use inside a topic page.

### Fixed
- `components.css`: `.cf-stat-highlight` → `.cf-stat--highlight`
  (double dash). Why Numbers Disagree's fourth stat has carried the
  `cf-stat--highlight` class since that page was built, but the CSS
  selector never matched it — that stat has never actually been
  accent-colored. Caught while adding `.cf-stat--flag` next to it.

### Changed
- `nav.js`: `cash-flows-break-simple-return` entry flipped from
  `comingSoon: true` to `false`; label updated to "Why Cash Flows Break
  Simple Return" to match the page's own H1 (the breadcrumb reads
  directly from this field, not from the page's H1).

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

  