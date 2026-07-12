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

Landing page, sidebar navigation, and the formula engine are complete.
The first topic page (Beginner → Introduction → Why Numbers Disagree) is
live, establishing the template — tabs, breadcrumb, full SEO head block —
that every future topic page will follow. See `CHANGELOG.md` for details.

## License

This repository uses two licenses for two different kinds of content —
see [`LICENSING.md`](LICENSING.md) for the plain-language explanation,
or the license files directly: [`LICENSE`](LICENSE) (code) and
[`LICENSE-CONTENT.md`](LICENSE-CONTENT.md) (written content).

## Disclaimer

This project is for educational purposes only and does not constitute
investment, financial, or legal advice. See [`legal.html`](legal.html).

This is an independent personal project and is not affiliated with or endorsed by, nor represents the views of, any organization.