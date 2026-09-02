import ItemDetailClient from '../../../components/ItemDetailClient';
import { FALLBACK_PRODUCTS } from '@/lib/products';

/**
 * Pre-builds an HTML file for every product in the bundled catalogue. Items
 * that exist only in the spreadsheet are served by the 404 handler instead,
 * which resolves them client-side (see app/not-found.tsx).
 */
export function generateStaticParams() {
  return FALLBACK_PRODUCTS.map((product) => ({ slug: product.id }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ItemDetailClient slug={slug} />;
}
