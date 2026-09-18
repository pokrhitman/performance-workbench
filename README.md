# Performance Workbench

A hands-on field manual for investment performance measurement — built
for the people who get the "your report is wrong" tickets, and the
people who send them.

Performance Workbench explains and lets you independently verify, how
investment returns are actually calculated: simple return, time-weighted
return (TWR), money-weighted return (IRR/MWR), the Modified Dietz method,
and the German BVI method. Most resources treat TWR/MWR as the whole
story and leave industry specific methods such as Modified Dietz and 
German BVI method as footnotes, if they cover them at all. This project 
treats all four as first-class methods, because in practice, disputes 
over "wrong" performance numbers are almost always a disagreement 
about *method*, not a calculation error.

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

The Intermediate tier is underway: four of seven pages are live — Time-
Weighted Return, Cash-Flow Timing and Sub-Period Breaks, Money-Weighted
Return and Modified Dietz. Time-Weighted Return debuted the site's shared
verification widget (an editable entries table, CSV import, a live
sub-period breakdown table, and a chart); Money-Weighted Return extended
it to compute two return methods side by side; Modified Dietz extends it
further still — the widget now computes and displays Time-Weighted,
Money-Weighted and Modified Dietz side by side from the same data, using
the `.calc-results--triple` three-stat layout, plus a dedicated cash-flow
weighting breakdown table mirroring `modifiedDietz()`'s own internal loop.
Cash-Flow Timing uses a second widget shape — a fixed scenario with a
drag-a-cash-flow-date slider — built for a question the generic table
doesn't answer well: what happens when the recorded cash-flow date
doesn't match a real valuation point. Six pages now use Chart.js: What a
Return Measures and Return Conventions in the Beginner tier, and all four
Intermediate pages so far.

The engine itself already covers every method the site plans to use,
including Modified Dietz and IRR/MWR — both built and tested in isolation
before any page depended on them. See `CHANGELOG.md` for details.

Next up: Performance for Fund Units (Non-ETF and ETF), then Choosing the
Right Lens — the Intermediate tier's closing comparison page.

## License

This repository uses two licenses for two different kinds of content —
see [`LICENSING.md`](LICENSING.md) for the plain-language explanation,
or the license files directly: [`LICENSE`](LICENSE) (code) and
[`LICENSE_CONTENT.md`](LICENSE_CONTENT.md) (written content).

## Disclaimer

This project is for educational purposes only and does not constitute
investment, financial, or legal advice. See [`legal.html`](legal.html).

This is an independent personal project and is not affiliated with or endorsed by, nor represents the views of, any organization.