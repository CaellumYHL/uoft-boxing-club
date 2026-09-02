/**
 * Legacy shared types. Store items now come from the Products tab of the
 * content spreadsheet - see `types/content.ts` and `hooks/useSheetProducts.ts`.
 */

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image?: string;
}
