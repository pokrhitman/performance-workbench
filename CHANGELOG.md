# Changelog

All notable changes to this project are documented here.

# Changelog

All notable changes to this project are documented here.

## 2026-08-15 — Housekeeping: ARIA tabs refactor, restored missing formula-engine functions, legal.html

### Added
- `tabs.js` now implements the full WAI-ARIA APG "tabs" pattern instead
  of just toggling `aria-selected`: each tab button gets `aria-controls`
  pointing at its panel, each panel gets `role="tabpanel"` and
  `aria-labelledby` pointing back at its tab, and the buttons use a
  roving `tabindex` (only the active tab sits in the page's Tab order).
  Left/Right arrow keys move between tabs (wrapping at the ends), and
  Home/End jump to the first/last tab. Applied consistently across all
  eight topic pages (Why Numbers Disagree, What a Return Measures,
  Method Is a Choice, Simple Return, Why Cash Flows Break Simple
  Return, Compounding and Geometric Linking, Annualizing a Return,
  Return Conventions) — the `id`/`aria-controls`/`aria-labelledby`
  wiring is hand-added markup per page, matching each page's existing
  `data-tab`/`data-tab-panel` values.
- `aria-label="Section navigation"` on the `#sidebar` `<nav>` on every
  page, so the landmark has a name for screen-reader users even though
  its contents are injected by `nav.js` after load.
- `perf-calculations.js`: `logReturn(beginValue, endValue)` and
  `toBasisPoints(decimalReturn)` were restored — both were documented
  as added in the 2026-08-13 entry below and are called directly by
  `return-conventions/index.html`'s calculator and chart, but neither
  function actually existed in this file. Same "logged as fixed but not
  actually present in the files worked from" pattern already called out
  twice in this changelog (see the 2026-08-13 and 2026-08-09 entries) —
  this time it broke a shipped page's Interactive tab outright, not just
  a nav path. `tests.html` coverage for both functions (documented in
  the same 2026-08-13 entry) was restored alongside them, along with the
  previously-undone `annualize(0.02, 60, 252)` ≈ 0.0867 case and the
  tightened `annualize(0.02, 60)` expected value (0.1280, not the old
  0.1288 that only passed on a loose tolerance).
- `legal.html` — was a blank file despite being referenced from the
  homepage, the footer of every page, and the README. Built out as a
  full page (site header/footer, sidebar nav, no tabs — it isn't a
  topic page) covering: educational-purpose-only / not investment,
  financial or legal advice; no warranty on the accuracy of any
  calculation or explanation; a note that all portfolio data entered or
  CSV-imported into the verification widgets stays client-side and is
  never transmitted anywhere, since the site has no backend; the
  project's independence from any employer; and a pointer to
  `LICENSING.md` for how the site's content and code may be reused.

### Changed
- Softened "the German BVI method" framing on the three surfaces that
  still named it as if it were the only unit-based (NAV-per-unit) fund
  performance convention worth naming: `legal.html`'s "Educational
  purpose only" section, `index.html`'s "Scope & disclaimer" section,
  and `what-a-return-measures/index.html` (its Explainer paragraph and
  its Reference list item). All three now read "unit-based (NAV-per-unit)
  fund performance — including national conventions such as Germany's
  BVI method," matching the jurisdiction-neutral framing
  `method-is-a-choice/index.html` already used ("Germany's BVI
  convention and the United States' SEC-standardized return are two
  examples") and the intent of the 2026-07-19 BVI scope-correction entry
  below. `why-numbers-disagree/index.html` was checked and didn't need
  the same edit — its Reference list already read "the fund-unit
  (NAV-based) convention used for pooled investments," with no direct
  BVI naming to soften.

### Fixed
- `return-conventions/index.html`: `formaMoney()` (missing a "t") was
  called instead of `formatMoney()` in the negative-start-value branch
  of the calculator — threw instead of rendering.
- `simple-return/index.html`: the invalid-input branch of the calculator
  removed a class named `is-visble` (typo) instead of `is-visible`, so
  the margin/loan note could get stuck visible after the input became
  invalid; the End Value `<label>` carried the wrong class
  (`calc-field` — the wrapping div's class — instead of
  `calc-field-label`), so it rendered unstyled next to Start Value's
  label.
- `what-a-return-measures/index.html` and `method-is-a-choice/index.html`:
  both Reference tabs used `class="=reference-list"` (stray leading
  `=`), so the arrow-bullet list styling silently never applied.
  `what-a-return-measures` also had a stray `<me>...</me>` tag (should
  be `<em>`) and a `tpye="button"` typo on the % Return toggle button.
- `components.css`: `#breadcrumg a` (typo) meant the breadcrumb's Home
  link never got its intended color/hover underline; `#breadcrumb-current`
  targeted an ID but `nav.js` only ever sets a *class* of that name, so
  that rule never matched either — both fixed (`#breadcrumb a`,
  `.breadcrumb-current`). `.cf-fixed-numbers` referenced a nonexistent
  `--scpace-sm` custom property instead of `--space-sm`, silently
  dropping its grid gap. `.sidebar-tier-header` had `width: 100;` with
  no unit — invalid, so the browser dropped the declaration; changed to
  `100%`. The intended hover rule for the sidebar's expand/collapse
  chevron was `.sidebar-tier-toggle:hover .sidebar-tier-toggle`, which
  can never match anything (an element isn't a descendant of itself);
  changed to `.sidebar-tier-header:hover .sidebar-tier-toggle` so
  hovering the tier header actually brightens its chevron.
  `.result-table` referenced `var(--inline)`, which was never defined
  anywhere in `main.css`; changed to the actual token, `var(--line)`.
- `annualizing-a-return/index.html`: the `<link rel="canonical">` URL
  pointed at `.../annualzing-a-return/...` (missing an "i") instead of
  the page's real path; the Period Length field's label read
  "Period Lenght (days))", with both a typo and a stray closing paren.
- `perf-calculations.js`: `validateEntries()`'s two non-numeric-field
  error messages used `` $(i) `` instead of the template-literal syntax
  `` ${i} `` inside backtick strings, so a thrown error read literally
  as "entry $(i) has a non-numeric value" instead of naming the actual
  index.
- Assorted transcription typos affecting the on-page text: "ration"
  should have read "ratio", "indentical" → "identical", a stray
  `<me>`/duplicate "here there in the name" on Simple Return, several
  European-style comma decimals (`0,99`, `3,95%`, `10,56%`) that should
  have been periods per this project's own stated numeric convention,
  "Timme-Weighted Return" → "Time-Weighted Return", and a handful of
  comment-only typos in `perf-calculations.js`'s JSDoc (`giess` →
  `guess`, `peformance` → `performance`, `exampkes` → `examples`, plus
  a few `(number)` JSDoc tags that should have been `{number}`).

### Notes
- No visual/behavioral change for sighted mouse users from the ARIA
  work — the tabs already worked by click. The fixes are for
  keyboard-only and screen-reader users, who previously had no
  Tab-key-reachable way into the tab list's non-active panels' proper
  semantics, and no announced relationship between a tab and the panel
  it controls.
- The repeated "changelog says it's fixed, file doesn't actually have
  it" pattern (now three occurrences: `return-conventions` nav path,
  two `tests.html` cases, and now the two missing formula functions
  outright) suggests changes made in one session aren't reliably
  surviving into what the next session reads from. Worth double-checking
  that a session's edits actually landed in the synced project files
  before closing out, not just trusting the changelog entry that
  describes them.

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

  