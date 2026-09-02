'use client';

import { useEffect, useState } from 'react';
import { fetchSheetRows, isSheetsConfigured, rowsToObjects } from '@/lib/sheets/client';

/** What a sheet-backed hook reports back to the component rendering it. */
export type SheetState<T> = {
    data: T[];
    loading: boolean;
    /** Set when the spreadsheet is unreachable AND no fallback was supplied. */
    error: string | null;
};

/**
 * Generic loader for one tab of the content spreadsheet.
 *
 * Rows are mapped through `mapRow`; anything that maps to `null` is dropped,
 * which lets each caller ignore rows the execs half-filled in. When the sheet
 * isn't configured or the request fails, `fallback` is used instead so the
 * page still shows content rather than an error.
 *
 * @param range - A1 range of the tab to load.
 * @param mapRow - Converts one header-keyed row (plus its 0-based index) into a
 *                 domain object, or null to skip it.
 * @param fallback - Rows to show when the sheet can't be read.
 */
export function useSheetData<T>(
    range: string,
    mapRow: (row: Record<string, string>, index: number) => T | null,
    fallback: T[] = []
): SheetState<T> {
    const [state, setState] = useState<SheetState<T>>({
        data: fallback,
        loading: isSheetsConfigured(),
        error: null,
    });

    useEffect(() => {
        if (!isSheetsConfigured()) {
            setState({ data: fallback, loading: false, error: fallback.length ? null : 'Google Sheets configuration missing.' });
            return;
        }

        let cancelled = false;

        fetchSheetRows(range)
            .then((rows) => {
                if (cancelled) return;
                const mapped = rowsToObjects(rows)
                    .map(mapRow)
                    .filter((item): item is T => item !== null);

                // An empty tab is a legitimate answer ("no events yet"), but an
                // empty tab plus a fallback almost always means it isn't filled in.
                setState({
                    data: mapped.length > 0 ? mapped : fallback,
                    loading: false,
                    error: null,
                });
            })
            .catch((err) => {
                if (cancelled) return;
                console.error(`Sheet load failed for ${range}`, err);
                setState({
                    data: fallback,
                    loading: false,
                    error: fallback.length ? null : 'Could not load content. Please try again later.',
                });
            });

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [range]);

    return state;
}