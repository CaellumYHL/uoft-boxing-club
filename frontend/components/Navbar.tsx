'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BASE_PATH } from '@/lib/site';

/** The nav destinations, in display order. Hash entries scroll within the home page. */
const NAV_LINKS = [
  { label: 'HOME', target: 'home', kind: 'hash' as const },
  { label: 'CLASSES', target: 'classes', kind: 'hash' as const },
  { label: 'EVENTS', target: 'events', kind: 'hash' as const },
  { label: 'STORE', target: '/store', kind: 'page' as const },
  { label: 'MEET OUR TEAM', target: '/team', kind: 'page' as const },
];

export default function Navbar() {
  const { totalItems, totalPrice } = useCart();
  const { logoUrl, clubName } = useSiteConfig();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock background scrolling while the full-screen mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Scroll Spy Logic
  useEffect(() => {
    if (pathname !== '/') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveSection('');
      return;
    }

    // Default to 'home' on initial load if at top
    if (window.scrollY < 100) {
      setActiveSection('home');
      window.history.replaceState(null, '', `${BASE_PATH}/#home`);
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
                window.history.replaceState(null, '', `${BASE_PATH}/#${id}`);
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

  const linkBaseClasses = 'hover:text-gray-300 transition-colors cursor-pointer';

  // Helper for hrefs (Hash links if on Home, Full URL otherwise)
  const getHref = (section: string) => (pathname === '/' ? `#${section}` : `/#${section}`);

  /** Resolves a nav entry to the href it should link to. */
  const hrefFor = (link: (typeof NAV_LINKS)[number]) =>
    link.kind === 'hash' ? getHref(link.target) : link.target;

  return (
    // The panel is a sibling of <nav>, not a child: the navbar's backdrop-blur
    // creates a containing block, which would trap a fixed-position descendant
    // inside the 72px-tall bar.
    <>
    <nav className="fixed top-0 left-0 right-0 z-50 w-full flex justify-between items-center gap-3 py-4 px-4 sm:px-6 lg:px-12 lg:py-6 backdrop-blur-md bg-background/70 shadow-md">
      {/* Logo */}
      <Link href={getHref('home')} className="flex-shrink-0">
        <img
          src={logoUrl || `${BASE_PATH}/favicon.ico`}
          alt={clubName}
          width={64}
          height={64}
          className="w-11 h-11 lg:w-16 lg:h-16 object-contain hover:opacity-80 transition-opacity"
        />
      </Link>

      {/* Desktop navigation links */}
      <div className="hidden lg:flex items-center gap-8 font-bold tracking-wide text-sm">
        {NAV_LINKS.map((link) => (
          <div key={link.label} className="flex items-center gap-8">
            {/* Separators sit before the two standalone pages, matching the original design */}
            {(link.target === '/store' || link.target === '/team') && (
              <span className="w-px h-4 bg-white/50" aria-hidden="true"></span>
            )}
            <Link
              href={hrefFor(link)}
              className={linkBaseClasses}
              style={getLinkStyle(link.target)}
            >
              {link.label}
            </Link>
          </div>
        ))}
      </div>

      {/* Cart + mobile menu toggle */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link href="/cart" onClick={() => setMenuOpen(false)}>
          <button className="bg-[#C92C2C] hover:bg-red-700 text-white px-3 sm:px-6 py-2 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-lg">
            <ShoppingCart size={18} className="flex-shrink-0" />
            {/* Only the count fits on narrow phones; the full label returns at sm */}
            <span className="hidden sm:inline whitespace-nowrap">{totalItems} items - ${totalPrice}</span>
            <span className="sm:hidden">{totalItems}</span>
          </button>
        </Link>

        <button
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className="lg:hidden p-2 -mr-1 text-white hover:text-gray-300 transition-colors cursor-pointer"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

    </nav>

    {/* Mobile drop-down panel */}
    {menuOpen && (
      <div className="lg:hidden fixed inset-x-0 top-[68px] bottom-0 z-40 bg-background border-t border-white/10 flex flex-col items-center py-6 px-6 overflow-y-auto">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={hrefFor(link)}
            onClick={() => setMenuOpen(false)}
            className="w-full text-center py-4 font-bold tracking-wide text-lg border-b border-white/10 last:border-0 hover:bg-white/5 rounded transition-colors"
            style={getLinkStyle(link.target)}
          >
            {link.label}
          </Link>
        ))}
      </div>
    )}
    </>
  );
}
