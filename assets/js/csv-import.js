/**
 * csv-import.js
 * Performance Workbench - shared CSV import for the verification widget.
 * 
 * Pure parsing/validation only - no DOM access, matching perf-calculations.js's
 * own "no page logic in here" rule.
 * 
 * ---------------------------------------------------------------------------------
 * EXPECTED FORMAT
 * ---------------------------------------------------------------------------------
 * First line: header, exactly "date, value, cashFlow" (case-insensitive).
 * Every line after that: one entry per line, exactly three
 * comma-separated fields:
 * - date: ISO format only (YYYY-MM-DD)
 * - value: a plain number, "-" as the decimal separator
 * - cashFlow: a plain number, "." as the decimal separatro
 * Blank lines are skipped. Extra whitespace around a field is trimmed.
 * 
 * This function does NOT enforce the "first entry's cashFlow must be 0"
 * rule, or check date ordering/duplicates - that's validateEntries()'
 * job in perf-calculations.js, and the caller is expected to run parsed
 * entries through it before computing anything. 
 */

const CSV_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Parses raw CSV text info into a portfolio entries array, matching the
 * {date, value, cashFlow} shape perf-calculations.js expects.
 * 
 * @param {string} text - raw CSV File contents
 * @returns {{entries: Array<{date: string, value: number, cashFlow: number} > errors: string []}}
 *  entries is onyl safe to use when errors is empty.
 */
function parsePortfolioCSV(text) {
    const errors = [];
    const entries = [];

    const lines = text
        .split(/\r\n|\r/)
        .map(line => line.trim())
        .filter(line => line.length > 0);

    if (lines.length === 0) {
        return { entries, errors: ["The file is empty."] };
    }

    const header = lines[0].split(",").map(cell => cell.trim().toLowerCase());
    if (header.length !== 3 || header[0] !== "date" || header[1] !=="value" || header[2] !== "cashflow") {
        errors.push('Row 1: expected a header row reading exactly "date,value,cashFlow".');
        return { entries, errors };
    }

    for (let i = 1; i < lines.length; i++) {
        const rowNumber = i + 1; // matches the row a spreadsheet app would show
        const cells = lines[i].split(",");

        if (cells.length !== 3) {
            errors.push(`Row ${rowNumber}: expected 3 columns (date,value,cashFlow), found ${cells.length}.`);
            continue;
        }

        const [rawDate, rawValue, rawCashFlow] = cells.map(cell => cell.trim());

        if (!CSV_DATE_PATTERN.test(rawDate)) {
            errors.push(`Row ${rowNumber}: "${rawDate}" isn't a date in YYYY-MM-DD format.`);
            continue;
        }

        const value = Number (rawValue);
        if (rawValue === "" || Number.isNaN(value)) {
            errors.push(`Row ${rowNumber}: "${rawValue}" isn't a valid number for value. Use "." as the decimal separator, not ",".`);
            continue;
        }

        const cashFlow = Number(rawCashFlow);
        if (rawCashFlow === "" || Number.isNaN(cashFlow)) {
            errors.push(`Row ${rowNumber}: "${rawCashFlow}" isn't a valid number for cashFlow. Use "." as the decimal separator, not ",".`);
            continue;
        }

        entries.push({ date: rawDate, value, cashFlow });
    }

    return { entries, errors };
}