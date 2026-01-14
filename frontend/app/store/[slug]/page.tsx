import ItemDetailClient from '../../../components/ItemDetailClient';
import { products } from '../../../utils/data';

// This function tells Next.js which HTML pages to build (e.g., /store/t-shirt.html)
// It MUST run in a Server Component
export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.id,
  }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Pass the slug to the Client Component
  return <ItemDetailClient slug={slug} />;
}