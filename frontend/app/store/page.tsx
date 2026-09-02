'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useSheetProducts } from '@/hooks/useSheetProducts';
import { StoreProduct } from '@/types/content';

export default function Store() {
  const { data: products, loading } = useSheetProducts();

  const memberships = products.filter((p) => p.category === 'membership');
  const merch = products.filter((p) => p.category === 'merch');

  return (
    <main className="min-h-screen bg-background text-white flex flex-col">
      <Navbar />

      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-28 lg:pt-32 pb-20">
        {loading ? (
          <StoreSkeleton />
        ) : products.length === 0 ? (
          <p className="text-center text-white/60 py-20">
            The store is being restocked - check back soon.
          </p>
        ) : (
          <>
            {memberships.length > 0 && (
              <>
                <h2 className="text-center text-xl sm:text-2xl font-bold mb-8">Memberships</h2>
                <ProductGrid items={memberships} size="large" />
                <div className="w-1/2 mx-auto h-px bg-white/30 my-12 sm:my-16"></div>
              </>
            )}

            {merch.length > 0 && (
              <>
                <h2 className="text-center text-xl sm:text-2xl font-bold mb-8">Merch</h2>
                <ProductGrid items={merch} size="small" />
              </>
            )}
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}

/**
 * Responsive grid of product cards. Wraps to two columns on phones and flows
 * up to four across on desktop, replacing the old fixed-width flex row that
 * overflowed narrow screens.
 *
 * @param items - Products to display.
 * @param size - Memberships render slightly larger than merch, per the design.
 */
function ProductGrid({ items, size }: { items: StoreProduct[]; size: 'large' | 'small' }) {
  // Two-up on phones for both, so a single card never fills the screen.
  const cols =
    size === 'large'
      ? 'grid-cols-2 max-w-2xl'
      : 'grid-cols-2 lg:grid-cols-3 max-w-4xl';

  return (
    <div className={`grid ${cols} gap-6 sm:gap-10 mx-auto`}>
      {items.map((item) => (
        <Link
          href={`/store/${item.id}`}
          key={item.id}
          className="group flex flex-col items-center text-center"
        >
          <div className="w-full aspect-square bg-[#3B71CA] rounded-xl mb-3 overflow-hidden group-hover:bg-blue-400 transition cursor-pointer shadow-lg shadow-blue-900/20">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
          </div>
          <h3 className="font-bold text-base sm:text-lg leading-tight">{item.name}</h3>
          <p className="text-white font-bold">${item.price}</p>
        </Link>
      ))}
    </div>
  );
}

/** Placeholder tiles shown while the Products tab is loading. */
function StoreSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-6 w-40 bg-white/10 rounded mx-auto mb-10" />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-10 max-w-4xl mx-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-3">
            <div className="w-full aspect-square bg-white/10 rounded-xl" />
            <div className="h-4 w-24 bg-white/10 rounded" />
            <div className="h-4 w-12 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
