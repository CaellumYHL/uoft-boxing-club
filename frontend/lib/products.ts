import { StoreProduct } from '@/types/content';
import { toDirectImageUrl } from '@/lib/images';
import fallbackProducts from '@/data/products.json';

/** Lowercases and hyphenates a product name for use as a URL slug. */
export function slugify(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** Default sizes offered for merch when the sheet doesn't specify any. */
const DEFAULT_SIZES = ['S', 'M', 'L', 'XL', '2XL'];

/**
 * Turns a Products-tab row into a StoreProduct.
 * Requires at minimum a name; the id falls back to a slug of the name so the
 * execs don't have to invent ids by hand.
 *
 * @param row - One header-keyed row from the Products tab.
 * @returns The product, or null when the row has no name.
 */
export function mapProductRow(row: Record<string, string>): StoreProduct | null {
    const name = row['name'];
    if (!name) return null;

    return {
        id: row['id'] || slugify(name),
        name,
        price: Number(row['price']) || 0,
        description: row['description'] || '',
        image: toDirectImageUrl(row['image'] || ''),
        sizes: (row['sizes'] || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        category: row['category']?.toLowerCase() === 'membership' ? 'membership' : 'merch',
    };
}

/**
 * The bundled products.json, normalised to StoreProduct. Used to pre-build
 * store pages at deploy time, and shown until the sheet loads (or whenever it
 * can't be reached) so the store is never empty.
 */
export const FALLBACK_PRODUCTS: StoreProduct[] = (
    fallbackProducts as Array<{
        id: string;
        name: string;
        price: number;
        description: string;
        image?: string;
    }>
).map((p) => {
    const isMembership = p.id.includes('membership');
    return {
        id: p.id,
        name: p.name,
        price: p.price,
        description: p.description,
        image: p.image,
        // Memberships have no physical size; merch defaults to a full size run.
        sizes: isMembership ? [] : DEFAULT_SIZES,
        category: isMembership ? 'membership' : 'merch',
    };
});
