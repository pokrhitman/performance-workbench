/**
 * chart-helper.js
 * Performance Workbench - shared chart renderer for the verification 
 * widget's portfolio-value-over-time-chart, reused across every
 * Intermediate page built on the entries-table widget.
 * 
 * Requires Chart.js to already be loaded on the page (via the CDN
 * script tag) before this file runs. Deliberately uses a category
 * (label-based) x-axis, not Chart.js's "time" scale - a time scale
 * needs a separate date-adapter library, which this project doesn't 
 * carry as a second dependency.
 */

/**
 * Renders (or re-renders) a portfolio-value-over-time line chart, with
 * cash-flow dates marked as a separate point dataset on top of the 
 * value line.
 * 
 * @param {HTMLCanvasElement} canvas
 * @param {Array<{date: string, value: number, cashFlow?: number}>} entries
 *  sorted ascending, Only `date` and `value` are read directly here - a
 * page whose entries carry a different field (e.g. `distribution`
 * instead of `cashFlow`) supplies its own `markerValues`/`markerTooltip`
 * in `options`rather than this file needing to know every entry shape.
 * @param {Chart|null} existingChart - a prior Chart.js instance to
 *  destroy before rendering, or null on first render.
 * @param {object} [options] - optional overrides, all backward-compatible:
 * - valueLabel {string} - y-axis title and line-dataset label
 *  (default "Portfolio Value")
 * - valuePrefix {string) - prefix for y-axis tick labels, e.g. "$"
 *   (default "$"; pass "" for a unit-less series like NAV per unit)
 * - markerLabel {string} - legend label for the marker dataset
 *   (default "Cash Flow")
 * - markerValues {Array<number|null>} - one entry per row, a y-value to 
 *   plot as a marker or null to skip that point (default: derived from 
 *   entries[i].cashFlow, matching this file's original behavior)
 * - markerTooltip {entry(entry) => string} - tooltip line for a marker point
 *   (default: the original cashFlow-based "Cash Flow: +/-N" line)
 * @returns {Chart} the new Chart.js instance
 */
function renderPortfolioChart(canvas, entries, existingChart, options = {}) {
    if (existingChart) {
        existingChart.destroy();
    }

    const {
        valueLabel = "Portfolio Value",
        valuePrefix = "$",
        markerLabel =  "Cash Flow",
        markerValues = entries.map(e => (e.cashFlow !== 0 ? e.value: null)),
        markerTooltip = function (entry) {
            const sign = entry.cashFlow > 0 ? "+" : "";
            return "Cash Flow: " + sign + entry.cashFlow.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        },
    } = options;


    function cssVar(name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    const labels = entries.map(e => e.date);
    const values = entries.map(e => e.value);

    const ctx = canvas.getContext("2d");

    return new Chart (ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: valueLabel,
                    data: values, 
                    borderColor: cssVar("--navy"),
                    backgroundColor: cssVar("--navy"),
                    borderWidth: 2,
                    pointRadius: 3,
                    tension: 0,
                },
                {
                    label: markerLabel,
                    data: markerValues,
                    showLine: false,
                    pointRadius: 7,
                    pointBackgroundColor: cssVar("--accent-soft"),
                    pointBorderColor: cssVar("--accent"),
                    backgroundColor: cssVar("--accent-soft"),
                    borderColor: cssVar("--accent"),
                    pointBorderWidth: 2,
                    spanGaps: false,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "bottom" }, 
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            if (context.dataset.label === markerLabel) {
                                const entry = entries[context.dataIndex];
                                return markerTooltip(entry);
                            }
                            return "Value: " + context.raw.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            });
                        },
                    },
                },
            },
            scales: {
                x: {
                    title: { display: true, text: "Date" },
                },
                y: {
                    title: { display: true, text: valueLabel },
                    ticks: {
                        callback: function (value) { return valuePrefix + value.toLocaleString(); },
                    },
                },
            },
        },
    });
}

/**
 * Renders (or re-renders) one or more plain line series against a shared 
 * set of x-axis labels. A sibling to renderPortfolioChart(), not a 
 * replacement: that function is built around ONE value line plus a
 * marker dataset, and its four-argument contract is relied on by every
 * earlier Intermediate page. This one is for pages that need several
 * lines of equal standing (e.g. an ETF's NAV and market price), or a 
 * single derived series (e.g. premium/ discount in percent), and knows
 * nothing about entries shapes at all - the page passes plain arrays.
 * 
 * @param {HTMLCanvasElement} canvas
 * @param {string[]} labels - x-axis labels, one per point (usually ISO dates)
 * @param {Array<{label: string, data: number[], colorVar: string, dashed?:boolean}>} series
 * one object per line. colorVar is a CSS custom property name from 
 * main.css (e.g. "--navy"), read live - never a hardcoded hex value.
 * @param {Chart|null} existingChart - a prior Chart.js instance to
 *  destroy before rendering, or null on first render.
 * @param {object} [options] - optional:
 * - yTitle {string} - y-axis title (default "Value")
 * - tickPrefix {string} - prefix for y-axis tick labels (default "")
 * - tickSuffix {string} - suffix for y-axis ticks and tooltips, e.g. "%" (default "")
 * - decimals {number} - decimal places in tooltips (default 2)
 * @returns {Chart} the new Chart.js instance
 */
function renderLineSeriesChart(canvas, labels, series, existingChart, options = {}) {
    if (existingChart) {
        existingChart.destroy();
    }

    const {
        yTitle = "Value",
        tickPrefix = "",
        tickSuffix = "",
        decimals = 2,
    } = options;


    function cssVar(name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    const datasets = series.map(function (s) {
        const color = cssVar(s.colorVar);
        return {
            label: s.label,
            data: s.data,
            borderColor: color,
            backgroundColor: color,
            borderWidth: 2,
            borderDash: s.dashed ? [6, 4] : [],
            pointRadius: 3,
            tension: 0,
        };
    });

    const ctx = canvas.getContext("2d");

    return new Chart (ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: datasets,
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "bottom" }, 
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return context.dataset.label + ": " + tickPrefix + 
                            context.raw.toLocaleString("en-US", {
                                minimumFractionDigits: decimals,
                                maximumFractionDigits: decimals,
                            }) + tickSuffix;
                        },
                    },
                },
            },
            scales: {
                x: {
                    title: { display: true, text: "Date" },
                },
                y: {
                    title: { display: true, text: yTitle },
                    ticks: {
                        callback: function (value) { return tickPrefix + value.toLocaleString() + tickSuffix; },
                    },
                },
            },
        },
    });
}

