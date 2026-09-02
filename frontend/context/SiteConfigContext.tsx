'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CONFIG_DEFAULTS, SHEET_RANGES, SiteConfig } from '@/lib/site';
import { fetchSheetRows, isSheetsConfigured, rowsToKeyValues } from '@/lib/sheets/client';
import { toDirectImageUrl } from '@/lib/images';

const SiteConfigContext = createContext<SiteConfig>({ ...CONFIG_DEFAULTS });

/**
 * Loads the Config tab of the content spreadsheet once per page load and
 * exposes it to the whole app. Any key the execs leave blank (or the whole
 * sheet being unreachable) falls back to CONFIG_DEFAULTS, so the site never
 * renders empty because of a spreadsheet problem.
 */
export function SiteConfigProvider({ children }: { children: ReactNode }) {
    const [config, setConfig] = useState<SiteConfig>({ ...CONFIG_DEFAULTS });

    useEffect(() => {
        if (!isSheetsConfigured()) return;
        let cancelled = false;

        fetchSheetRows(SHEET_RANGES.config)
            .then((rows) => {
                if (cancelled) return;
                const overrides = rowsToKeyValues(rows);
                const merged = { ...CONFIG_DEFAULTS } as SiteConfig;

                // Only non-empty values override defaults, so a blank cell in the
                // sheet doesn't wipe out a sensible built-in value.
                (Object.keys(CONFIG_DEFAULTS) as (keyof SiteConfig)[]).forEach((key) => {
                    if (overrides[key]) merged[key] = overrides[key];
                });

                merged.logoUrl = toDirectImageUrl(merged.logoUrl);
                setConfig(merged);
            })
            .catch((err) => console.error('Site config fetch failed', err));

        return () => { cancelled = true; };
    }, []);

    return <SiteConfigContext.Provider value={config}>{children}</SiteConfigContext.Provider>;
}

/** Reads the current site configuration (never null - defaults are always present). */
export function useSiteConfig(): SiteConfig {
    return useContext(SiteConfigContext);
}
