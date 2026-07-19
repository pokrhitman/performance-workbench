/**
 * perf-calculations.js
 * Performance Workbench - shared formula engine.
 * 
 * Pure functions only. No DOM access, no page-specific logic.
 * Every topic page, the comparison guide and the gross/net page call
 * into this same file - formulas are never duplicated inline on a page.
 * 
 * ----------------------------------------------------------------------------
 * DATA SHAPE
 * ----------------------------------------------------------------------------
 * Functions in this file that take portfolio data expect an array of 
 * entries, one per valuation point, sorted ascending by date:
 * 
 *  { date: "2026-01-31", value: 104250.00, cashFlow: 0 }
 *  { date: "2026-02-15", value: 98000.00, cashFlow: -10000 }
 * 
 * Conventions (fixed deliberately, keep consistent everywhere):
 * -cashFlow: contribution INTO the portfolio is positive, withdrawal 
 * is negative.
 * -value: portfolio value AFTER the cash flow is reflected, at that
 *  date.
 * -date: ISO format only (YYYY-MM-DD), ascending order. Sorting is
 *  the CALLER's responsibility - these functions assume sorted input
 *  rather than defensively re-sorting.
 * - Numbers: plain JS numbers using "." as the decimal separator
 *  (EN-US / ISO convention). Any local-format input (comma decimal,
 *  DD.MM.YYYY dates) must be converted before reaching these
 *  functions - see csv-import.js for that conversion and the 
 *  accompanying UI note on format requirements.
 * ----------------------------------------------------------------------
 */

/**
 * Shared Helper - number of whole days between two ISO date strings.
 * 
 * @param {string} dateA - ISO date (YYYY-MM-DD)
 * @param {string} dateB - ISO date (YYYY-MM-DD), expected on/ after dateA
 * @returns {number} whole days between the two dates
 */
function daysBetween(dateA, dateB) {
    const msPerDay = 1000 * 60 * 60 *24;
    return Math.round((new Date(dateB) - new Date(dateA)) / msPerDay);
}

/**
 * Shared validation for all functions that accept a full entries array.
 * Catches shape/sign problems early, in one place, rather than letting
 * five different formulas fall with five different confusing symptoms
 * (e.g. a stray blank row silently producing NaN deep inside TWR).
 * 
 * @param {Array<{date: string, value: number, cashFlow: number}>} entries
 * @throws {Error} if entries is empty, unsorted, has duplicate dates,
 * has non-numeric value/cashFlow or a non-zero cashFlow on entry 0
 */
function validateEntries(entries) {
    if (!Array.isArray(entries) || entries.length === 0)  {
        throw new Error("validateEntries: entries must be a non-empty array");
    }

    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        if (typeof entry.value !== "number" || Number.isNaN(entry.value)) {
            throw new Error(`validateEntries: entry $(i) has a non-numeric value`);
        }
        if (typeof entry.cashFlow !== "number" || Number.isNaN(entry.cashFlow)) {
            throw new Error(`validateEntries: entry $(i) has a non-numeric cashFlow`);
        }
        if (i > 0 && new Date(entry.date) <= new Date(entries[i - 1].date)) {
            throw new Error (
                `validateEntries: entry ${i} (${entry.date}) is not after the ` +
                `previous entry's date - entries must be sorted ascending with no duplicates`
            );
        }
    }

    if (entries[0].cashFlow !==0) {
        throw new Error(
            "validateEntries: the first entry's cashFlow must be 0 &mdash; it represents " +
            "the opening balance, not a flow during the period. If you meant to " +
            "record a contribution, add it as a second entry instead."
        );
    }
}


// --- Beginner tier ---

/**
 * Simple (holding period) return.
 * Assumes no cash flows during the period -  see modifiedDietz/TWR for
 * periods that include contributions or withdrawals.
 * 
 * @param (number) beginValue - portfolio value at period start
 * @param (number) endValue - portfolio value at period end
 * @returns (number) return as a decimal (0.10 = 10 %)
 */
function simpleReturn(beginValue, endValue) {
    if (beginValue === 0) {
        throw new Error("simpleReturn: beginValue cannot be zero");
    }
    return (endValue - beginValue) / beginValue;
}

/**
 * Annualizes a periodic return using geometric (compounding) scaling - 
 * not a simple linear multiply, since returns compound rather than add.
 * 
 * @param {number} periodReturn - the return for the fixed period, as a decimal (0.02 = 2%)
 * @param {number} periodDays - number of days the periodReturn covers
 * @param {number} [basis=365] - days per year to annualize against
 * @returns {number} annualized return as decimal
 */
function annualize(periodReturn, periodDays, basis = 365) {
    if (periodDays <= 0) {
        throw new Error("annualize: periodDays must be greater than zero");
    }
    if (periodReturn <= -1) {
        throw new Error("annualize: periodReturn cannot be -100% or lower &mdash; the base (1+ periodReturn) must be positive");
    }
    return Math.pow(1+ periodReturn, basis / periodDays) - 1;
}


// --- Intermediate tier ---

/**
 * Geometrically links (compounds) a sequence of sub-period returns.
 * This is the code chaining operation behind TWR - it deliberately
 * knows nothing about *how* the sub-periods were chosen, only how to
 * combine them once you have them.
 * 
 * @param (number[]) returnsArray - sub-period returns as decimals, e.g. [0.10, 0.10, 0.10]
 * @returns (number) linked return as a decimal 
 */
function linkReturns(returnsArray) {
    if (returnsArray.length === 0) {
        throw new Error("linkReturns: returnsArray cannot be empty");
    }
    const compounded = returnsArray.reduce((acc, r) => acc * (1 + r), 1);
    return compounded -1;
}

/**
 * Time-Weighted Return (TWR).
 * Splits entries into sub-periods at each cash flow, computes a simple
 * return for each sub-period (removing that period's cash flow before
 * comparing to the prior value, since the flow itself isn't
 * performance), then geometrically links the sub-period returns.
 * 
 * @param {Array<{date: string, value: number, cashFlow: number}>} entries
 * Sorted ascending by date. Entry 0 is the opening valuation.
 * @returns {number} TWR as a decimal
 */
function timeWeightedReturn(entries) {
    validateEntries(entries);

    const subPeriodReturns = [];
    let priorValue = entries[0].value;

    for (let i = 1; i < entries.length; i++) {
        const entry = entries[i];
        //The value just before this entry's cash flow is what actually
        //grew (or shrank) from priorValue - the cash flow itself is new 
        //money, not peformance.
        const valueBeforeFlow = entry.value - entry.cashFlow;
        subPeriodReturns.push(simpleReturn(priorValue, valueBeforeFlow));
        priorValue = entry.value;
    }

    return linkReturns(subPeriodReturns);
}

/**
 * Modified Dietz return.
 * Estimates a return using only a start value, end value and a list
 * of cash flows with dates - no interim valuations required, unlike TWR.
 * Each cash flow is weighted by the fraction of the period it
 * was outstanding for (a flow on day 1 of 30 counts almost fully;
 * a flow on day 29 barely counts).
 * 
 * Note: for interior entries (cash flow dates between the sart and 
 * end), only `date`and `cashFlow`are used - `value`is ignored.
 * The data shape still requires `value`on every entry for
 * consistency with the other formulas sharing this same entries
 * array; strictly speaking Modified Dietz doesn't need it there.
 * 
 * @param {Array<{date: string, value: number, cashFlow: number}>} entries
 *  Entry 0 = period start (its value is the beginning value).
 *  Last entry = period end (its value is the ending value).
 * @returns {number} Modified Dietz return as decimal
 */
function modifiedDietz(entries) {
    validateEntries(entries);

    const beginValue = entries[0].value;
    const endValue = entries[entries.length - 1].value;
    const totalDays = daysBetween(entries[0].date, entries[entries.length - 1].date);

    let sumCashFlows = 0;
    let sumWeightedCashFlows = 0;

    for (let i = 1; i < entries.length; i++) {
        const cf = entries[i].cashFlow;
        const daysFromStart = daysBetween(entries[0].date, entries[i].date);
        const weight = (totalDays - daysFromStart) / totalDays;

        sumCashFlows += cf;
        sumWeightedCashFlows += cf * weight;
    }

    return (endValue - beginValue - sumCashFlows) / (beginValue + sumWeightedCashFlows);
}

/** Unit value return - chains returns computed directly from published 
 * fund unit values (NAV per unit) - no cash-flow adjustment step, 
 * because unit value already excludes the effect of subscriptions and 
 * redemptions (new units are issued/redeemed at the prevailing NAV, so 
 * per-unit value isn't moved by the flow itself). This is the key 
 * structural difference from timeWeightedReturn, which must actively 
 * strip cash flows out of portfolio value.
 * 
 * This is the general technique used for retail fund performance
 * reporting worldwide - the underlying math isn't specific to any one
 * market. What DOES vary by jurisdiction is which investor-level costs
 * (front-load fees, custody fees, taxes) stay excluded from this
 * published figure and whether that's a market convention or a legal
 * disclosure requirement. Germany's BVI method and the United States'
 * SEC-standardized total return are two named, codified exampkes of
 * this same core technique - see the Intermediate tier for the 
 * national comparison. 
 * 
 * Note: `value`here means value/NAV per unit, not portfolio value.
 * 'cashFlow`is required by validateEntries for shape consistency but
 * is ignored by this formula.
 * 
 * @param {Array<{date: string, value: number, cashFlow: number}>} entries
 *  entries[i].value = unit value at that date, sorted ascending.
 * @returns {number} unit-value returns as a decimal.
 */
function unitValueReturn(entries) {
    validateEntries(entries);

    const subPeriodReturns = [];
    for (let i = 1; i < entries.length; i++) {
        subPeriodReturns.push(simpleReturn(entries[i - 1].value, entries[i].value));
    }

    return linkReturns(subPeriodReturns);
}

// --- shared helper, used only by irrReturn ---

/**
 * Converts entries into dated cash flows from the investor's
 * perspective, for IRR/NPV purposes.
 * - Entry 0's value becomes a full outflow (the initial investment).
 * - Middle entries: their cashFlow, sign-flipped (a contribution is 
 *   money leaving the investor; a withdrawal is money returning). 
 * - Last entry: its cashFlow (sign-flipped) plus its value - the
 *   remaining portfolio is treated as hypothetical liquidation.
 */
function buildInvestorCashFlow(entries) {
    const flows = [];
    const n = entries.length;
    for (let i = 0; i < n; i++) {
        const entry = entries[i];
        let amount;
        if (i === 0 ) {
            amount = -entry.value;
        } else if (i === n -1 ) {
            amount = entry.value - entry.cashFlow;
        } else {
            amount = -entry.cashFlow;
        }
        flows.push({ date: entry.date, amount });
    }
    return flows;
}

function npv(rate, flows, baseDate) {
    return flows.reduce((sum, f) => {
        const t = daysBetween(baseDate, f.date) / 365;
        return sum + f.amount / Math.pow(1 + rate, t);
    }, 0);
}

function npvDerivative(rate, flows, baseDate) {
    return flows.reduce((sum, f) => {
        const t = daysBetween(baseDate, f.date) / 365;
        if ( t === 0) return sum;
        return sum - (t * f.amount) / Math.pow(1 + rate, t + 1);
    }, 0);
}

/**
 * IRR / Money-Weighted Return, via Newton-Raphson.
 * Finds the rate at which the net present value of the investor's
 * actual dated cash flow equals zero. Unlike TWR, this does not 
 * require interim valuations - only entry/exit dates and amounts - 
 * which is why it's the standard method for private equity, property
 * funds and other illiquid structures where the investor doesn't
 * control cash-flow timing and interim marks are sparse or unreliable.
 * 
 * @param {Array<{date: string, value: number, cashFlow: number}>} entries
 * @param {number} [giess=0.01] - starting rate guess for Newton-Raphson
 * @returns {number} IRR as a decimal (annualized)
 * @throws {Error} if the derivative vanishes or the solve doesn't
 *  converge within maxIterations - both real possibilities with
 *  pathological cash-flow patterns, not just theoretical edge cases
 */
function irrReturn(entries, guess = 0.01) {
    validateEntries(entries);

    const flows = buildInvestorCashFlow(entries);
    const baseDate = entries[0].date;

    let rate = guess;
    const tolerance = 1e-9;
    const maxIterations = 100;

    for (let iter = 0; iter < maxIterations; iter++) {
        const value = npv(rate, flows, baseDate);
        const derivative = npvDerivative(rate, flows, baseDate);

        if (Math.abs(derivative) < 1e-12) {
            throw new Error("irrReturn: derivative too small to continue -  try a different guess or check for a degenerate cash-flow pattern");
        }

        let newRate = rate - value / derivative;
        if (newRate <= -1) {
            newRate = -0.999999; // guard: (1 + rate) must stay positive
        }

        if (Math.abs(newRate - rate) < tolerance) {
            return newRate;
        }
        rate = newRate;    
    }
    throw new Error("irrReturn: did not converge within " + maxIterations + " iterations");
}


