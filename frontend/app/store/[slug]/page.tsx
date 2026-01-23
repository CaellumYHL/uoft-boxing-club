import ItemDetailClient from '../../../components/ItemDetailClient';
import { getProducts, getProductBySlug } from '../../../utils/productService';

// This function tells Next.js which HTML pages to build (e.g., /store/t-shirt.html)
// It MUST run in a Server Component
export async function generateStaticParams() {
  const products = getProducts();
  return products.map((product) => ({
    slug: product.id,
  }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  // Pass the product to the Client Component
  return <ItemDetailClient product={product} />;
}