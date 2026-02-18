'use client'; // This directive allows us to use useState

import { useState } from 'react';
import Navbar from './Navbar';
import { useCart } from '../context/CartContext';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Product } from '../utils/data';

export default function ItemDetailClient({ product }: { product: Product | undefined }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const { addToCart } = useCart();

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <Link href="/store" className="text-primary hover:underline">Return to Store</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      size: selectedSize
    });
    alert(`Added ${quantity} x ${product.name} to cart!`);
  };

  return (
    <main className="min-h-screen bg-background-light text-white pt-32">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row gap-16">

        {/* Left: Image Placeholder */}
        <div className="flex-1">
          <div className="aspect-square bg-[#3B71CA] rounded-xl shadow-2xl"></div>
        </div>

        {/* Right: Details */}
        <div className="flex-1 pt-4">
          <Link href="/store" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
            <ArrowLeft size={20} /> Back to Store
          </Link>

          <h1 className="text-4xl font-bold mb-2 capitalize">
            {product.name}
          </h1>
          <p className="text-2xl font-mono text-gray-300 mb-6">${product.price}</p>

          <p className="text-gray-400 mb-8 italic leading-relaxed">
            {product.description}
          </p>

          {/* Size Selector */}
          <div className="mb-8">
            <span className="text-xl mr-4">Size</span>
            <div className="inline-flex gap-2">
              {['S', 'M', 'L', 'XL', '2XL'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-10 h-10 rounded border border-white/30 hover:border-white transition
                    ${selectedSize === size ? 'bg-[#3B71CA] border-[#3B71CA]' : 'bg-transparent'}
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-8 mb-10">
            <span className="text-xl">Quantity</span>
            <div className="flex items-center gap-4 text-xl">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="hover:text-primary">-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="hover:text-primary">+</button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="bg-[#C92C2C] hover:bg-red-700 text-white font-bold py-3 px-10 rounded-full transition shadow-lg shadow-red-900/20 active:scale-95"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
}