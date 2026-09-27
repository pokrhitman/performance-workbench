# Changelog

All notable changes to this project are documented here.

## 2026-09-27 — Performance for Fund Units (Non-ETF): unit-value reinvestment, front-load cost layering, BVI/SEC/EU convention matrix

### Added
- Fifth Intermediate-tier page: `intermediate/fund-units-non-etf/index.html`
  — Explainer covers why `unitValueReturn()` telescopes to a no-op
  without distributions (nothing left to chain once cash flows are out
  of the picture entirely), the reinvestment mechanism a distribution
  breaks that cancellation, and a worked example: a fund's NAV falls
  100.00 → 94.00 → 92.00 then rises to 97.00 (a raw price read of
  −3.00%), but a 5.00-per-unit distribution on 1 July, reinvested at
  that date's post-distribution NAV, produces a real total return of
  +2.27% once reinvested units are counted. Covers three named
  conventions on the one question that actually varies — which costs
  are already embedded in the published number: BVI (Germany, industry
  convention, fund-level costs in, front-load out), the SEC's
  standardized return (US, Form N-1A Item 26(b)(1), `P(1+T)^n = ERV`,
  maximum sales load already deducted — the opposite choice), and the
  EU's KID/UCITS disclosure (binding EU-wide regulation, same cost
  choice as BVI via a different mechanism). Closes with a front-load
  basis trap: the same nominal load rate quoted as a percentage of NAV
  (BVI-style) vs. of offering price (SEC-style) produces two different
  investor-level results. Interactive tab: an editable Date/Unit
  Value/Distribution table (no CSV import), three simultaneous stats
  (Price-Only Return / Total Return, Reinvested / Investor Return,
  After Load), a load-rate input and nav-vs-offering-price basis
  selector, a reinvestment-schedule breakdown table mirroring
  `unitReinvestmentSchedule()`'s own internal loop, a chart, and a
  static-plus-live three-convention comparison matrix. Reference tab
  is a six-point recap.
- Four new functions in `perf-calculations.js`: `validateUnitEntries()`
  (validates the `{date, value, distribution}` shape — positive NAV,
  non-negative distribution, entry 0's distribution must be 0),
  `unitReinvestmentSchedule()` (tracks a hypothetical single unit held
  from the first date, reinvesting every distribution into new units at
  that date's value), `unitValueTotalReturn()` (the distribution-aware
  total return derived from the schedule), and
  `applyFrontLoad(cumulativeReturn, loadRate, basis)` — converts a
  fund-level return to an investor-level one, with `"nav"` (divides by
  `1 + load`) and `"offeringPrice"` (multiplies by `1 − load`) bases
  expressing the identical nominal rate against two different amounts,
  deliberately not interchangeable. New `tests.html` coverage for all
  four, cross-checked against BVI's own published worked example (50
  units, a €3-per-unit distribution reinvested at €102 → ≈1.471 new
  units) and an independently-derived SEC ERV calculation before
  finalizing expected values.
- `chart-helper.js`: `renderPortfolioChart()` gained a fourth, optional
  `options` parameter (`valueLabel`, `valuePrefix`, `markerLabel`,
  `markerValues`, `markerTooltip`), letting a page with a different
  entries shape (this page's `distribution` field, not `cashFlow`)
  supply its own marker logic instead of the function needing to know
  every possible entry shape. Fully backward compatible — verified via
  a jsdom dry run that every existing page's old 3-argument call
  renders identically to before.
- `components.css`: `.load-controls`/`.load-controls .calc-field`
  (front-load rate/basis controls), `.matrix-note`, and
  `#convention-matrix .numeric { text-align: left; }` (see Fixed,
  below).

### Fixed
- A three-bug crash chain, traced by reproducing the actual uploaded
  file in a jsdom harness rather than reasoning about it in the
  abstract: the load-status `<p>` carried `id="irr-status"` (left over
  from the Modified Dietz page it was transcribed from) instead of
  `id="load-status"`; `recompute()` called the original portfolio
  validator, `validateEntries(sorted)`, instead of
  `validateUnitEntries(sorted)` — since these entries have no
  `cashFlow` field, this threw on every single call, and the `catch`
  block's own `setLoadStatus("")` call is what actually crashed
  (`Cannot set properties of null`) on the `id` mismatch above; and the
  "incomplete" guard checked `e.cashFlow` instead of `e.distribution`,
  a dead check against a field that doesn't exist on these entries.
- Once that chain was fixed, a second, structurally identical crash
  surfaced one step later: the convention matrix's three headline
  cells all carried the same duplicated `id="matrix-bvi-headline"`
  instead of three distinct ids, leaving `matrixSecEl`/`matrixEuEl`
  both `null`.
- Missing semicolon in the reinvestment-row builder pulled
  `reinvestmentTbody.appendChild(tr)` into the `tr.innerHTML = "..." +
  ...` string concatenation — `appendChild()`'s return value (the row
  element itself) got stringified into the row's own HTML, rendering
  `[object HTMLTableRowElement]` as literal text in every row.
  Confirmed by reproducing the exact rendered output before fixing.
- Cross-wired catch block: the SEC matrix cell's own error handler
  wrote to `matrixEuEl` instead of `matrixSecEl`.
- `chart-helper.js`'s parameterization (see Added, above) was
  delivered as a diff but not transcribed into the live file — the
  page's call passed a fourth `options` argument that a
  three-parameter function silently ignored, so every marker default
  (`entries[i].cashFlow`, undefined on every one of these
  distribution-shaped entries) evaluated to `true`, plotting a marker
  on every date instead of only the distribution date, and the legend
  read the hardcoded "Cash Flow" instead of the page's own
  "Distribution" label. Caught from a screenshot after the crash chain
  above was fixed and the rest of the page was confirmed working.
- Two `for`/`id` label mismatches in the load controls
  (`for="load-rate-label"` pointing at nothing; a `calc-field-lablel`
  typo losing that label's styling entirely); `og:title` typo ("Funt"
  → "Fund"); several Explainer prose typos ("convenstions" →
  "conventions", "und the EU's" → "under the EU's", "unit pricey" →
  "unit prices", "a disturbing fund's" → "a distributing fund's", a
  dropped "then", and "worked 102.27, no 97.00" → "worth 102.27, not
  97.00").
- Convention-matrix headline row read right-aligned (inherited from
  `.result-table td.numeric`) while every other row in the same table
  is left-aligned text — scoped an override via `#convention-matrix
  .numeric` rather than changing the shared rule generally.

### Changed
- `nav.js`: `fund-units-non-etf` entry flipped from `comingSoon: true`
  to `false`.

### Notes
- Every bug in the crash chain and the duplicate-id bug were on the
  page's own DOM wiring, not the formula engine — `tests.html` only
  exercises `perf-calculations.js`'s pure functions with hand-written
  valid data, so it had nothing to say about any of them. The "all
  tests pass" report earlier in the session was accurate and
  simultaneously uninformative about the page-level crash that
  followed — the same "functional testing and a review pass catch
  different bugs" lesson the Modified Dietz session drew from a
  mislabeled stat, drawn again here from a harder failure mode.
- The `chart-helper.js` gap is a second, concrete instance of this
  project's standing "logged as fixed/delivered, not actually present
  in the next session's files" pattern — see `project-retrospective.md`
  for the fuller note, including the discovery that the Modified
  Dietz session's own CHANGELOG/README close-out never landed either.

## 2026-09-18 — Modified Dietz: three-way method comparison, cash-flow weighting breakdown

### Added
- Fourth Intermediate-tier page: `intermediate/modified-dietz/index.html`
  — Explainer covers Modified Dietz's origin (Peter O. Dietz, a 1966
  pension-fund study, later formalized by the Bank Administration
  Institute) and its practical motivation: a direct-solve alternative
  to Money-Weighted Return's iterative IRR, aimed at Time-Weighted
  Return's own question instead. The Time-Weighted Return page's own
  worked example ($100,000 → $90,000 → $149,000 with a +$50,000
  contribution → $134,100) run through `modifiedDietz()` produces a
  genuine, verified divergence from Time-Weighted Return: −13.61% vs.
  −10.90%, traced to what each formula is and isn't allowed to look
  at — Modified Dietz never inspects an interior entry's value, only
  its date and cash flow. Interactive tab extends the shared
  verification widget to three simultaneous stats (Time-Weighted,
  Money-Weighted, Modified Dietz), using the previously-unused
  `.calc-results--triple` layout, plus a new cash-flow weighting
  breakdown table (Date / Cash Flow / Days Invested / Weight / Weighted
  Cash Flow) mirroring `modifiedDietz()`'s own internal loop,
  deliberately omitting zero-cash-flow rows since Modified Dietz's
  weighting doesn't apply to them. Reference tab is a five-point recap.
- New `components.css` modifier: `.calc-result--neutral` (colors a
  `.calc-result-value` with `--navy`) — gives Modified Dietz its own
  stat color, distinct from Time-Weighted Return's `--highlight` and
  Money-Weighted Return's `--verify`, since none of the three is "the"
  right answer.

### Fixed
- A visible label bug ("Modified modified-dietz") only surfaced via a
  screenshot, not functional testing — the widget computed correctly
  throughout.
- Status-paragraph id mismatch: `id="modifiedDietz"` instead of
  `id="dietz-status"`, leaving the element unreachable from JS.
- `setDietzStatus()` was writing to `irrStatusEl` instead of
  `dietzStatusEl` — a genuine cross-wire, not a typo: Modified Dietz's
  own zero-denominator message would have silently landed in the IRR
  status paragraph instead.
- The new breakdown table's `<tfoot>` had `colspan="1"` instead of
  `colspan="3"`.
- Reference tab misnamed `unitValueReturn()` as `unitValueReturns()`
  (plural).
- Two user-visible text typos: "this date" → "this data", "zeor" →
  "zero". One further prose typo ("Time-Weigthed", third Explainer
  paragraph) was flagged at close-out for direct correction rather
  than looping through another upload for a single word — not
  independently confirmed applied.
- A stray "Coming soon" badge on the root `index.html`'s Intermediate
  tier card was removed — the tier itself had been live since
  Time-Weighted Return shipped, so the badge was stale. Applied
  directly, not hand-transcribed — a housekeeping fix, not page
  content.

### Changed
- `nav.js`: `modified-dietz` entry flipped from `comingSoon: true` to
  `false`.

### Notes
- A third distinct guard shape: `modifiedDietz()` never throws, but a
  large enough offsetting cash flow can drive its denominator to zero,
  producing `Infinity`/`NaN` instead of an exception — `recompute()`
  checks this with `Number.isFinite()`, a different failure mode from
  both `validateEntries()`'s throw and Money-Weighted Return's IRR
  try/catch.
- This entry was written retroactively during the following session
  (Fund Units Non-ETF, see above) — the session summary for this
  session recorded that a CHANGELOG entry and README status update had
  been drafted and handed over, but neither actually made it into the
  project files. See the 2026-09-27 entry above and
  `project-retrospective.md` for the pattern this confirms.

## 2026-09-16 — Money-Weighted Return: TWR/IRR comparison, investor cash-flow ledger

### Added
- Third Intermediate-tier page: `intermediate/money-weighted-return/index.html`
  — Explainer reuses the Time-Weighted Return page's own worked example
  ($100,000 → $90,000 → $149,000 with a +$50,000 contribution →
  $134,100) run through `irrReturn()` instead, contrasting TWR's
  −10.90% (period) / −14.30% (annualized, via the existing
  `annualize()`) against Money-Weighted Return's −17.64% — the gap
  traced to the contribution landing right before the second decline,
  so a disproportionate share of the investor's actual dollars sat
  through it. Interactive tab extends the Time-Weighted Return page's
  generic entries-table widget (rather than a fresh fixed scenario) to
  compute both TWR and MWR side by side from the same data, adds a new
  "Investor Cash Flows" ledger table (built directly from
  `buildInvestorCashFlow()` — previously an IRR-only internal helper,
  now genuinely shared) that filters out interim valuations with no
  real cash flow, and guards the IRR solve in its own try/catch,
  independent of the existing `validateEntries()` guard, so a
  Newton-Raphson convergence failure on pathological user-entered data
  degrades to a plain-language message instead of blanking the whole
  widget. Reference tab is a five-point recap.
- New `components.css` modifier: `.calc-result--verify` (colors a
  `.calc-result-value` with `--verify`) — the first actual use of the
  `--verify` token since it was defined back in Session 1; it had sat
  unused while the status-badge components ended up using
  `--status-good`/`--flag` instead. Gives Money-Weighted Return its own
  color, distinct from TWR's `--highlight` and deliberately not
  `--flag`, since neither return is "wrong" here.

### Fixed
- Re-verified `irrReturn()`'s three existing isolation tests in
  `tests.html` (clean 10%, mid-year contribution, mid-year withdrawal)
  against the current file before building anything on top of it — all
  three still pass.
- `irr-status`/`setIrrStatus()` id mismatch: the status `<p>` was
  missing or mislabeled in the first hand-transcription, so
  `document.getElementById("irr-status")` returned `null` and any call
  to `setIrrStatus()` threw `Cannot set properties of null`, aborting
  `recompute()`. Caught via a live console error.
- The Money-Weighted Return stat carried class `calc-result--highlight`
  (the same class as TWR, immediately above it) instead of
  `calc-result--verify` — not a typo, the wrong valid class, silently
  defeating the point of adding `--verify`: both stats rendered in the
  same orange instead of getting distinct colors.
- Missing semicolon: `&minus10.90%`. Without the trailing `;`, the
  browser doesn't recognize `&minus` as a named entity (unlike a small
  legacy set such as `&amp`/`&lt`, every newer named reference requires
  it) — this was very likely rendering as the literal text
  `&minus10.90%`.
- Wrong entity: `&mdash;10%` used an em dash where a minus sign was
  meant, rendering "the two clean —10% legs" instead of "−10%".
- The Explainer's worked-example ending value was stated as `$134,000`
  in two places — the actual value (correct everywhere else, including
  the widget's own default data) is `$134,100`.
- `<em>per-calculation.js</em>` → `perf-calculations.js` (misnamed the
  actual shared file) in the Reference tab.
- Prose: "from the the Time-Weighted Return chapter" (duplicate word);
  "starting a guess" → "starting *from* a guess" (dropped word); "watch
  both returns updated side by side" → "update" (wrong tense);
  "recompute live from whatsever's" → "whatever's"; `"Initial  
  investment"` → single space (the double space was user-visible in
  the rendered Type column). Lower-priority meta-tag/keyword typos:
  "dollar-weighed" → "dollar-weighted", "stripping it ou" → "out", a
  stray "sub-period" wedged into the keywords list ahead of "internal
  rate of return" — removed, since it directly contradicted the page's
  own point that IRR isn't sub-period-based; "throught" → "through";
  `<em>irrReturn</em>` → `irrReturn()` (missing parens, inconsistent
  with the rest of the page's function-name convention).

### Changed
- `nav.js`: `money-weighted-return` entry flipped from
  `comingSoon: true` to `false`.

### Decided
- The generic entries-table widget (shared by Time-Weighted Return and
  Money-Weighted Return so far) has no on-page explanation of its
  `cashFlow`/`value` sign convention. A real test — entering a
  withdrawal then a deposit — used technically-correct signs but an
  incorrect `value` (not realizing it must already include that row's
  own cash flow), producing a confusing but entirely correct
  −100%/undefined result depending on inputs. A clarifying note was
  drafted for both pages but deliberately not applied yet — batching it
  into a planned post-Intermediate-tier style refactor and full-tier
  testing pass instead of applying it piecemeal now.


## 2026-09-14 — Cash-Flow Timing: sub-period split mechanics, drag-a-cash-flow widget

### Added
- Second Intermediate-tier page: `intermediate/cash-flow-timing/index.html`
  — Explainer walks a worked scenario (a $100,000 start, one $20,000
  contribution, a constant underlying rate compounding to +8.00% over
  60 days) showing that a correctly-split TWR is invariant to exactly
  where the contribution lands, while a TWR split only at a fixed
  day-30 snapshot drifts — in the worked case, to +3.68%. Interactive
  tab is a dedicated drag-a-cash-flow-date widget (not the generic
  entries table), comparing a correct split against a naive
  fixed-snapshot split live, with two breakdown tables and a chart.
  Reference tab is a five-point recap.
- New shared helper in `perf-calculations.js`: `addDays(isoDate, days)`,
  alongside the existing `daysBetween()` — UTC-safe date arithmetic
  (`setUTCDate`/`toISOString`, matching `daysBetween()`'s own UTC-safe
  parsing) so results can't drift by a day around a local-timezone DST
  transition.
- New `components.css` modifier: `.calc-result--flag` (colors a
  `.calc-result-value` with `--flag`), extending the existing
  `.calc-result--highlight` pattern to a second, "this number is wrong"
  semantic.

### Fixed
- The "Correct TWR" stat carried class `cald-result--highlight` — a
  typo — instead of `calc-result--highlight`, silently rendering
  without its intended accent color.
- The naive breakdown table's `aria-label` read "Sub-period breakdown,
  naively split at the real cash-flow date" — backwards; corrected to
  describe the naive table's actual property (split at the fixed
  January 31 snapshot).
  
### Changed
- `nav.js`: `cash-flow-timing` entry flipped from `comingSoon: true` to
  `false`.

## 2026-09-11 — Intermediate tier begins: Time-Weighted Return and the shared verification widget

### Added
- First Intermediate-tier page: `intermediate/time-weighted-return/index.html`
  — Explainer walks a single worked example ($100,000 → $90,000 →
  $149,000 with a +$50,000 contribution → $134,100), contrasting the
  naive whole-period return (+34.10%, wrongly crediting the client's
  own contribution as manager performance) against the true chained
  Time-Weighted Return (−10.90%), and cites the GIPS rule requiring
  TWR whenever the client, not the fund, controls cash-flow timing.
  Interactive tab debuts the shared verification widget: an editable
  entries table (add/delete rows, 2-row minimum), CSV import, a live
  sub-period breakdown table that mirrors `timeWeightedReturn()`'s own
  internal loop so it can never disagree with the engine, and a
  Chart.js portfolio-value chart with cash-flow dates marked as a
  separate point dataset. Reference tab is a five-point recap
  (sub-period mechanics, timing/size independence, the GIPS citation,
  forward-reference to Money-Weighted Return).
- `assets/js/csv-import.js` — new file, hand-written CSV parser (no
  library) for the entries-table widget. `parsePortfolioCSV(text)`
  enforces the exact header `date,value,cashFlow`, ISO `YYYY-MM-DD`
  dates, and period (not comma) decimals, returning row-numbered error
  messages. Deliberately doesn't duplicate `validateEntries()`'s
  semantic rules (ascending dates, entry-0 cash flow) — that stays
  `perf-calculations.js`'s job, so the two files can't drift apart on
  what counts as valid.
- `assets/js/chart-helper.js` — new file, `renderPortfolioChart(canvas,
  entries, existingChart)`: the shared Chart.js renderer for the
  entries-table widget, reused by every future Intermediate page built
  on it. Uses a category (label) x-axis rather than Chart.js's `"time"`
  scale, which would require a separate date-adapter library this
  project doesn't carry as a second dependency.
- A permanent CSV-format hint (`.csv-hint`) above the entries table in
  the Interactive tab, stating the required header, date format, and
  decimal separator up front, so importing a file doesn't mean
  trial-and-erroring through the parser's messages to find the right
  shape.
- `components.css`: `.verify-widget` (the widget's card panel, matching
  the existing `.calc-widget`/`.cf-widget` convention), `.entries-table-wrap`/
  `.entries-table`/`.entries-input`, `.entries-row-delete` (+`:disabled`),
  `.entries-toolbar`/`.entries-toolbar-btn`, `.entries-status`
  (+`--error`/`--success`), `.breakdown-table`, `.csv-hint`, and
  `.visually-hidden` — the full CSS backing the new shared widget.
- `nav.js`: `time-weighted-return` entry flipped from `comingSoon: true`
  to `false`.

### Fixed
- `components.css`: `.calc-input` and `.calc-select` had
  `background-color: var(--paper)` — the exact same token as the page's
  own `<body>` background. Any input sitting outside a `--surface`
  panel was, by definition, invisible against the page, not just low-
  contrast. Changed both to `background-color: var(--surface)`. Also
  fixes the original Simple Return calculator, which shared the bug
  unnoticed.
- `chart-helper.js`: the "Cash Flow" dataset set `pointBackgroundColor`/
  `pointBorderColor` (which color the markers actually drawn on the
  chart) but never `backgroundColor`/`borderColor` (which Chart.js's
  default legend renderer reads for the legend swatch), so the legend
  box showed Chart.js's own default gray while the markers themselves
  were correctly orange. Added matching `backgroundColor`/`borderColor`
  to the dataset.
- `nav.js`: the Time-Weighted Return entry's `id` (`time-weighted-returns`,
  plural) didn't match `CURRENT_PAGE` (`time-weighted-return`, singular,
  set in the page's own `<head>`) or its `path`'s folder name. Every
  `nav.js` lookup keyed on `item.id === CURRENT_PAGE` silently failed as
  a result: the Intermediate tier loaded collapsed instead of auto-
  expanded, the sidebar link never got `.active`/`aria-current="page"`,
  and `findCurrentPageLocation()` returned `null` — so the breadcrumb
  didn't render on the page at all. Fixed by matching the `id` to the
  singular form used everywhere else.
- Root-cause bug found mid-build: the breakdown table's total `<td>`
  had `id="breakdown-table"` — a duplicate of its own ancestor
  `<table>`'s id — instead of `id="breakdown-total"`.
  `document.getElementById("breakdown-total")` returned `null`, and the
  resulting `TypeError` aborted `recompute()` before it ever reached the
  chart-rendering call — one bug, two symptoms (blank total, no chart).
- `formatPercent()`'s sign ternary had its branches transcribed in
  reversed order (`decimal > 0 ? "" : "+"`), so every negative return
  displayed as `+-10.00%` and the one positive case displayed with no
  sign at all.
- `components.css`: `.breakdown-table` had `width: 100;` — no unit, so
  the browser silently dropped the declaration. Changed to `width: 100%;`.
- Assorted transcription slips caught during testing: a comma-decimal
  in the Explainer prose ("+34,10%" → "+34.10%" ); a stray extra `../` in the
  footer's `LICENSING.md` link; a stray `introduction/` segment in the
  page's `canonical`/`og:url`; `innterHTML` → `innerHTML` and
  `DEFAUL_ENTRIES` → `DEFAULT_ENTRIES` typos in the widget script.

### Notes
- This is the debut of the shared entries-table/CSV/chart widget —
  every remaining Intermediate page (Cash-Flow Timing, Money-Weighted
  Return, Modified Dietz, the two Fund Units chapters) can reuse
  `csv-import.js`, `chart-helper.js`, and the `.verify-widget` CSS
  family instead of rebuilding any of it.
- IRR/MWR remains the one formula-engine function not yet wired into
  any page widget — unchanged this session; that's next chapter's job.
-

## 2026-08-21 — legal.html wired into sidebar/footers; re-transcription cleanup

### Added
- `nav.js`: `renderSidebar()` now appends a persistent, non-tiered
  utility link to `legal.html` after the tier tree, since `legal.html`
  isn't a topic page and has no natural home in `SIDEBAR_DATA`. Follows
  the same active-state pattern as tiered items (`.active` class +
  `aria-current="page"` when `CURRENT_PAGE === "legal"`). New
  `.sidebar-utility` / `.sidebar-utility-link` rules added to
  `components.css` to style it, visually separated from the tier tree
  by a top border.
- A `Legal &amp; Disclaimer` link added to the `<footer>` of `index.html`,
  `legal.html`, and all eight topic pages. Previously `legal.html` was
  reachable only from one sentence of homepage body text and its own
  direct URL — nothing in the persistent chrome linked to it.

### Fixed
- `legal.html` (re-transcribed by hand since the 2026-08-15 draft):
  invalid `&amp` entity in the `<title>` and `<h1>` (missing the
  semicolon); three section headings using `class="section heading"`
  (space instead of hyphen), so they weren't picking up
  `.section-heading` styling at all; a broken em-dash pairing in the
  "Educational purpose only" paragraph (the opening `&mdash;` before
  "including national conventions such as Germany's BVI method" had
  been dropped, leaving only the closing one); the Licensing section's
  link pointed at `LICENSE_CONTENT.md` while displaying the text
  "LICENSING.md" — now points at the file it names. Spelling: "are not
  substitute" → "are not a substitute", "lincensed" → "licensed",
  "free or error" → "free of error", "built by using proprietary" →
  "built using proprietary", "confindential" → "confidential".
- `components.css` and `index.html` had reverted several fixes from the
  2026-08-15 entry below after being re-synced from the project folder.
  Re-applied: `.sidebar-tier-toggle:hover .sidebar-tier-toggle` (can
  never match — an element isn't a descendant of itself) back to
  `.sidebar-tier-header:hover .sidebar-tier-toggle`; comment typos
  "Expainer" → "Explainer", "Regference" → "Reference", "Hereo" → "Hero".
  `index.html` typos "caculated" → "calculated", "mattters" → "matters",
  "projcet" → "project" were already caught by the time this entry was
  written — confirmed still fixed, not re-broken.
- All eight topic pages were re-transcribed by hand and picked up new
  issues on top of the ARIA/typo fixes from 2026-08-15:
  - `why-numbers-disagree/index.html`: the Interactive tab button
    carried `id="tab-explainer"` — a duplicate of the Explainer tab's
    own id — instead of `id="tab-interactive"`. Since the Interactive
    panel's `aria-labelledby="tab-interactive"` had nothing to point
    at, this broke the tab/panel relationship for assistive tech (and
    left a duplicate-id violation in the markup). Also "timiing" →
    "timing".
  - `simple-return/index.html`: the End Value `<label>` again carried
    `class="calc-field"` (the wrapping div's class) instead of
    `calc-field-label` — the same bug already fixed once in the
    2026-08-15 entry, reintroduced by the re-transcription. Also fixed
    "right here there in the name" (duplicated word) and "show up a
    negative return" / "postive" (missing "as", misspelled "positive").
  - `compounding-and-linking/index.html`: `<meta property="og:title">`
    read "Simple Return - Performance Workbench" — copied from the
    wrong page — instead of this page's own title. European-style
    comma decimals `0,99` and `+3,95%` → `0.99` / `+3.95%` (recurring
    pattern also seen in `cash-flows-break-simple-return`, below).
    "substract" → "subtract", "where split" → "were split".
  - `what-a-return-measures/index.html`: "ration" → "ratio",
    "indentical" → "identical", "speficic" → "specific", "agains" →
    "against".
  - `cash-flows-break-simple-return/index.html`: meta description
    "conntribution" → "contribution", "Componding" → "Compounding",
    another comma-decimal (`10,56%` → `10.56%`), "poss a positive
    return" → "post a positive return", "subu-period" → "sub-period".
  - `method-is-a-choice/index.html`: `class="=reference-list"` (stray
    leading `=`) meant the Reference tab's arrow-bullet styling never
    applied — same bug shape as the one fixed on two other pages in
    the 2026-08-15 entry, here on a third page. "Timme-Weighted" →
    "Time-Weighted", numbered list item "2-" → "2." (inconsistent with
    "1." and "3." either side of it), "conntribution" → "contribution",
    "fuill" → "full", "acutally" → "actually".
  - `annualizing-a-return/index.html`: the worked example
    "2.00% × (365 ÷ 60) 12.17%" was missing its `=` sign. The
    Interactive tab's dynamic note-builder JS concatenated pieces
    without a leading space in three places (`"...compress." + gapText`,
    `"...footing." + gapText`, `note + gapText`) and the `gapText`
    string itself was missing a space before "percentage points" —
    all four would have rendered run-together sentences
    ("compress.Naive linear scaling..."). Also "conspiciously" →
    "conspicuously", "your're" → "you're" (twice), and the note-builder
    function's own variable name, `formulatOut`, renamed to
    `formulaOut` for consistency with every other page's calculator
    script.
  - `return-conventions/index.html`: "log (arithmic) return" — not a
    word, and unclear what it was meant to say — simplified to plain
    "log return" to match the term's usage everywhere else on the page.
    "one-hundreth" → "one-hundredth", "continous" → "continuous", "Log
    return are additive" → "Log returns are additive" (subject-verb
    agreement), "cloe enought" → "close enough", "Time-Weighed-Return"
    → "Time-Weighted Return" (also normalizes the hyphenation to match
    how the term is written everywhere else). A stray line break
    splitting `function` from its name (`formatPercent`) in the
    calculator script was also cleaned up — valid JS either way, but
    clearly a transcription artifact.

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
  styling on the site, matching `.calc-input`'s visual language
  (border, radius, padding, focus outline), with a smaller font-size
  to keep longer option text from clipping in the narrow grid column.

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
