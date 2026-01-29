'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import GloveIcon from './GloveIcon';

export default function Navbar() {
  const { totalItems, totalPrice } = useCart();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('');

  // Scroll Spy Logic
  useEffect(() => {
    if (pathname !== '/') {
      setActiveSection('');
      return;
    }

    // Default to 'home' on initial load if at top
    if (window.scrollY < 100) {
      setActiveSection('home');
      window.history.replaceState(null, '', '/#home');
    }

    const sections = ['home', 'classes', 'events'];
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(id);
                // Update URL hash when section becomes visible
                window.history.replaceState(null, '', `/#${id}`);
              }
            });
          },
          { threshold: 0.3 } // Trigger when 30% of section is visible
        );
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [pathname]);

  // Helper to determine active state
  const isLinkActive = (sectionOrPath: string) => {
    if (pathname === '/') {
      return activeSection === sectionOrPath;
    }
    const normalizedPath = sectionOrPath.startsWith('/') ? sectionOrPath : `/${sectionOrPath}`;
    return pathname === normalizedPath || (sectionOrPath === 'home' && pathname === '/');
  };

  const getLinkStyle = (sectionOrPath: string) => {
    return isLinkActive(sectionOrPath) ? { color: '#C92C2C' } : { color: 'white' };
  };

  const linkBaseClasses = "hover:text-gray-300 transition-colors cursor-pointer";

  // Helper for hrefs (Hash links if on Home, Full URL otherwise)
  const getHref = (section: string) => (pathname === '/' ? `#${section}` : `/#${section}`);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full flex justify-between items-center py-6 px-12 bg-background/95 backdrop-blur-md shadow-md">
      {/* Logo */}
      <Link href={getHref('home')}>
        <GloveIcon className="w-16 h-16 text-primary hover:opacity-80 transition-opacity" />
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-8 font-bold tracking-wide text-sm">
        <Link href={getHref('home')} className={linkBaseClasses} style={getLinkStyle('home')}>HOME</Link>
        <Link href={getHref('classes')} className={linkBaseClasses} style={getLinkStyle('classes')}>CLASSES</Link>
        <Link href={getHref('events')} className={linkBaseClasses} style={getLinkStyle('events')}>EVENTS</Link>

        {/* Separator */}
        <span className="w-px h-4 bg-white/50 mx-2"></span>

        <Link href="/store" className={linkBaseClasses} style={getLinkStyle('/store')}>STORE</Link>

        {/* Separator */}
        <span className="w-px h-4 bg-white/50 mx-2"></span>

        <Link href="/team" className={linkBaseClasses} style={getLinkStyle('/team')}>MEET OUR TEAM</Link>
      </div>

      {/* Cart Button */}
      <Link href="/cart">
        <button className="bg-[#C92C2C] hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-lg">
          <ShoppingCart size={18} />
          <span>{totalItems} items - ${totalPrice}</span>
        </button>
      </Link>
    </nav>
  );
}