'use client';

import { useMemo } from 'react';
import { SHEET_RANGES } from '@/lib/site';
import { StoreProduct } from '@/types/content';
import { FALLBACK_PRODUCTS, mapProductRow } from '@/lib/products';
import { useSheetData, SheetState } from './useSheetData';

/** Loads the store catalogue from the Products tab, falling back to products.json. */
export function useSheetProducts(): SheetState<StoreProduct> {
    return useSheetData(SHEET_RANGES.products, mapProductRow, FALLBACK_PRODUCTS);
}

/**
 * Looks up a single product by slug from the live catalogue.
 *
 * @param slug - The product id from the URL.
 * @returns The matching product plus the catalogue's loading state, so callers
 *          can tell "still loading" apart from "genuinely not found".
 */
export function useSheetProduct(slug: string): { product: StoreProduct | undefined; loading: boolean } {
    const { data, loading } = useSheetProducts();
    const product = useMemo(() => data.find((p) => p.id === slug), [data, slug]);
    return { product, loading };
}
