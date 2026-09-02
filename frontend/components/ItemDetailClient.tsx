'use client';

import { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { useSheetProduct } from '@/hooks/useSheetProducts';

/**
 * Store item detail page body. The product is looked up live from the
 * Products tab by slug, so prices and descriptions stay current without a
 * redeploy and items added to the sheet work on this page too.
 *
 * @param slug - Product id taken from the URL.
 */
export default function ItemDetailClient({ slug }: { slug: string }) {
  const { product, loading } = useSheetProduct(slug);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-white pt-32 px-6">
        <Navbar />
        <div className="max-w-5xl mx-auto animate-pulse flex flex-col md:flex-row gap-16">
          <div className="flex-1 aspect-square bg-white/10 rounded-xl" />
          <div className="flex-1 space-y-4 pt-4">
            <div className="h-9 w-2/3 bg-white/10 rounded" />
            <div className="h-6 w-24 bg-white/10 rounded" />
            <div className="h-20 w-full bg-white/10 rounded" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-background text-white flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Product Not Found</h1>
        <Link href="/store" className="text-primary hover:underline">Return to Store</Link>
      </main>
    );
  }

  // A size must be chosen before adding, but only for items that come in sizes.
  const needsSize = product.sizes.length > 0;
  const size = selectedSize ?? (needsSize ? product.sizes[0] : undefined);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      size,
    });
    // Inline confirmation rather than alert(), which blocks the page.
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <main className="min-h-screen bg-background text-white flex flex-col">
      <Navbar />

      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-28 lg:pt-32 pb-20 flex flex-col md:flex-row gap-8 md:gap-16">

        {/* Left: Product image */}
        <div className="flex-1">
          <div className="aspect-square bg-[#3B71CA] rounded-xl shadow-2xl overflow-hidden">
            {product.image && (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            )}
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex-1 pt-2 md:pt-4">
          <Link href="/store" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6">
            <ArrowLeft size={20} /> Back to Store
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl font-mono text-gray-300 mb-6">${product.price}</p>

          {product.description && (
            <p className="text-gray-400 mb-8 italic leading-relaxed">{product.description}</p>
          )}

          {/* Size Selector - only for items that come in sizes */}
          {needsSize && (
            <div className="mb-8">
              <span className="block text-lg mb-3">Size</span>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedSize(option)}
                    className={`min-w-10 h-10 px-3 rounded border transition
                      ${size === option
                        ? 'bg-[#3B71CA] border-[#3B71CA]'
                        : 'bg-transparent border-white/30 hover:border-white'}
                    `}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-8 mb-10">
            <span className="text-lg">Quantity</span>
            <div className="flex items-center gap-5 text-xl">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
                className="w-8 h-8 rounded border border-white/25 hover:border-white hover:text-primary transition"
              >
                -
              </button>
              <span className="w-6 text-center font-mono">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
                className="w-8 h-8 rounded border border-white/25 hover:border-white hover:text-primary transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#C92C2C] hover:bg-red-700 text-white font-bold py-3 px-10 rounded-full transition shadow-lg shadow-red-900/20 active:scale-95"
          >
            {added ? (<><Check size={20} /> Added to Cart</>) : 'Add to Cart'}
          </button>
        </div>
      </div>

      <Footer />
    </main>
  );
}
