'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { totalItems, totalPrice } = useCart();

  return (
    <nav className="w-full flex justify-between items-center py-6 px-12">
      {/* Logo */}
      <div className="w-32 h-16 bg-primary rounded-sm flex items-center justify-center font-bold text-white text-xs">
        LOGO
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-8 text-white font-bold tracking-wide text-sm">
        <Link href="/" className="text-primary hover:opacity-80">HOME</Link>
        <Link href="/classes" className="hover:text-gray-300">CLASSES</Link>
        <Link href="/events" className="hover:text-gray-300">EVENTS</Link>

        {/* Separator */}
        <span className="w-px h-4 bg-white/50 mx-2"></span>

        <Link href="/store" className="hover:text-gray-300">STORE</Link>

        {/* Separator */}
        <span className="w-px h-4 bg-white/50 mx-2"></span>

        <Link href="/team" className="hover:text-gray-300">MEET OUR TEAM</Link>
      </div>

      {/* Cart Button */}
      <Link href="/cart">
        <button className="bg-primary hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer">
          <ShoppingCart size={18} />
          <span>{totalItems} items - ${totalPrice}</span>
        </button>
      </Link>
    </nav>
  );
}