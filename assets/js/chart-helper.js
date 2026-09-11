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
 * @param {Array<{date: string, value: number, cashFlow: number}>} entries
 *  sorted ascending, same shape perf-calculations.js expects.
 * @param {Chart|null} existingChart - a prior Chart.js instance to
 *  destroy before rendering, or null on first render.
 * @returns {Chart} the new Chart.js instance
 */
function renderPortfolioChart(canvas, entries, existingChart) {
    if (existingChart) {
        existingChart.destroy();
    }

    function cssVar(name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    const labels = entries.map(e => e.date);
    const values = entries.map(e => e.value);
    const cashFlowMarkers = entries.map(e => (e.cashFlow !== 0 ? e.value : null));

    const ctx = canvas.getContext("2d");

    return new Chart (ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Portfolio Value",
                    data: values, 
                    borderColor: cssVar("--navy"),
                    backgroundColor: cssVar("--navy"),
                    borderWidth: 2,
                    pointRadius: 3,
                    tension: 0,
                },
                {
                    label: "Cash Flow",
                    data: cashFlowMarkers,
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
                            if (context.dataset.label === "Cash Flow") {
                                const entry = entries[context.dataIndex];
                                const sign = entry.cashFlow > 0 ? "+" : "";
                                return "Cash Flow: " + sign + entry.cashFlow.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                });
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
                    title: { display: true, text: "Portfolio Value" },
                    ticks: {
                        callback: function (value) { return "$" + value.toLocaleString(); },
                    },
                },
            },
        },
    });
}