# Performance Workbench

A hands-on field manual for investment performance measurement — built
for the people who get the "your report is wrong" tickets, and the
people who send them.

Performance Workbench explains and lets you independently verify, how
investment returns are actually calculated: simple return, time-weighted
return (TWR), money-weighted return (IRR/MWR), the Modified Dietz method,
and unit-based (NAV-per-unit) fund performance, with Germany's BVI method 
as a named example. This project treats all five as first-class methods, 
because in practice, disputes over "wrong" performance numbers are almost always a disagreement about *method*, not a calculation error.

## Why this exists

Performance figures generate more support tickets and client disputes
than almost any other part of investment reporting — not because the
math is wrong, but because different, equally valid methods can produce
different numbers for the same portfolio. Most explanations of why
such differences exist stop at a formula instead of building the underlying 
intuition. This project exists to close that gap: plain-English mental models, 
paired with a tool that lets you enter your own portfolio data (or import a
CSV) and watch the different methods diverge in front of you.

## Structure

Each topic page follows a three-tab pattern:

- **Explainer** — the mental model, in plain English, before any formula
- **Interactive** — a hands-on widget; several topics share a
  verification table where you can enter or import your own portfolio
  values and cash flows and see each method computed live
- **Reference** — a cheat-sheet summary for quick lookup

Topics are organised into three tiers:

- **Beginner** — concepts you can reason about from a start value and an
  end value alone
- **Intermediate** — concepts that require understanding what happens
  *between* valuation points: sub-periods, cash-flow timing, chaining
- **Advanced** — concepts that matter once numbers leave the spreadsheet
  and get reported, compared, or defended: cost layering (gross vs.
  net), GIPS, composites, benchmarking

## Tech stack

Plain HTML, CSS, and JavaScript. No framework, no build step. Every page
works by opening the file in a browser. The one exception is Chart.js,
loaded via CDN for the interactive charts — no other external
dependencies.

## Status

The Beginner tier is complete: all three Introduction pages (Why
Numbers Disagree, What a Return Measures, Method Is a Choice) and all
five Foundations pages (Simple Return, Why Cash Flows Break Simple
Return, Compounding and Geometric Linking, Annualizing a Return,
Return Conventions) are live, alongside the landing page, sidebar
navigation, and formula engine.

The Intermediate tier is nearly complete: six of seven pages are live —
Time-Weighted Return, Cash-Flow Timing and Sub-Period Breaks,
Money-Weighted Return, Modified Dietz, Performance for Fund Units
(Non-ETFs), and Performance for Fund Units (ETFs). Time-Weighted Return
debuted the site's shared verification widget (an editable entries
table, CSV import, a live sub-period breakdown table, and a chart);
Money-Weighted Return extends it to compute two different return
methods side by side from the same data, plus a dedicated "Investor
Cash Flows" ledger showing exactly what `irrReturn()` solves against;
and Modified Dietz extends it again to three simultaneous methods
(Time-Weighted, Money-Weighted, Modified Dietz), with its own cash-flow
weighting breakdown table. Cash-Flow Timing uses a second widget shape
— a fixed scenario with a drag-a-cash-flow-date slider — built for a
question the generic table doesn't answer well: what happens when the
recorded cash-flow date doesn't match a real valuation point.

The two Fund Units pages are built on a different entries shape (unit
value and distribution, not portfolio value and cash flow). Performance
for Fund Units (Non-ETFs) covers why published fund-unit returns
reinvest distributions, and compares BVI, the SEC's standardized return,
and the EU's KID/UCITS disclosure on which costs are already embedded in
a published number versus which still need applying, including a
front-load calculator with both a NAV-basis and an offering-price-basis
convention. Performance for Fund Units (ETFs) covers the two-price
problem specific to exchange-traded funds: a NAV return and a
market-price return computed by the same function on two price series,
the premium or discount that separates them, and the bid-ask spread as
the cost layer neither published number contains — with a
premium/discount table, two charts, and a cost-layer matrix. Eight
pages now use Chart.js: What a Return Measures and Return Conventions
in the Beginner tier, and all six Intermediate pages so far.

The engine covers every method through Money-Weighted Return (IRR) and
Modified Dietz, plus six fund-unit functions — `validateUnitEntries()`,
`unitReinvestmentSchedule()`, `unitValueTotalReturn()`,
`applyFrontLoad()`, `premiumDiscount()`, and `applyRoundTripSpread()` —
each built and tested in isolation before any page depended on it.
`chart-helper.js` has two renderers: `renderPortfolioChart()`, for a
value line with marked cash-flow or distribution dates, and
`renderLineSeriesChart()`, for one or more plain line series. See
`CHANGELOG.md` for details.

Next up: Choosing the Right Lens — the Intermediate tier's closing
comparison page.

## License

This repository uses two licenses for two different kinds of content —
see [`LICENSING.md`](LICENSING.md) for the plain-language explanation,
or the license files directly: [`LICENSE`](LICENSE) (code) and
[`LICENSE_CONTENT.md`](LICENSE_CONTENT.md) (written content).

## Disclaimer

This project is for educational purposes only and does not constitute
investment, financial, or legal advice. See [`legal.html`](legal.html).

This is an independent personal project and is not affiliated with or endorsed by, nor represents the views of, any organization.