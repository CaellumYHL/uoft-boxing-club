import { SHEETS_API_KEY, SHEETS_ID } from '@/lib/site';

/** Thrown when the spreadsheet hasn't been configured via env vars yet. */
export class SheetsNotConfiguredError extends Error {
    constructor() {
        super('Google Sheets configuration missing.');
        this.name = 'SheetsNotConfiguredError';
    }
}

/** True when both the API key and spreadsheet ID are present. */
export function isSheetsConfigured(): boolean {
    return Boolean(SHEETS_API_KEY && SHEETS_ID);
}

/**
 * Fetches one A1 range from the content spreadsheet as raw rows.
 *
 * @param range - A1 notation range, e.g. `Events!A:G`.
 * @returns The `values` array from the Sheets API (empty when the tab is blank).
 * @throws SheetsNotConfiguredError when env vars are missing, or Error on a
 *         non-2xx response.
 */
export async function fetchSheetRows(range: string): Promise<string[][]> {
    if (!isSheetsConfigured()) throw new SheetsNotConfiguredError();

    const url =
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_ID}` +
        `/values/${encodeURIComponent(range)}?key=${SHEETS_API_KEY}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Sheets request failed for "${range}" (${res.status})`);

    const data = await res.json();
    return data.values || [];
}

/**
 * Converts a sheet's rows into objects keyed by its header row, so column
 * order in the spreadsheet doesn't matter - only the header names do.
 * Header names are lowercased and trimmed; blank rows are dropped.
 *
 * @param rows - Raw rows where `rows[0]` is the header row.
 * @returns One object per data row.
 */
export function rowsToObjects(rows: string[][]): Record<string, string>[] {
    if (rows.length < 2) return [];

    const headers = rows[0].map((h) => (h || '').trim().toLowerCase());

    return rows
        .slice(1)
        .map((row) => {
            const entry: Record<string, string> = {};
            headers.forEach((header, i) => {
                if (header) entry[header] = (row[i] || '').trim();
            });
            return entry;
        })
        .filter((entry) => Object.values(entry).some(Boolean));
}

/**
 * Converts a two-column key/value sheet into a plain object. Used for the
 * Config tab, where column A is the setting name and column B its value.
 * The header row is skipped only if it looks like one (`key` in column A).
 *
 * @param rows - Raw rows from a two-column range.
 * @returns Trimmed key/value pairs, ignoring rows with a blank key.
 */
export function rowsToKeyValues(rows: string[][]): Record<string, string> {
    const out: Record<string, string> = {};
    if (rows.length === 0) return out;

    const start = (rows[0]?.[0] || '').trim().toLowerCase() === 'key' ? 1 : 0;

    for (const row of rows.slice(start)) {
        const key = (row[0] || '').trim();
        const value = (row[1] || '').trim();
        if (key) out[key] = value;
    }
    return out;
}
