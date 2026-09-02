'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ItemDetailClient from '../components/ItemDetailClient';
import { BASE_PATH } from '@/lib/site';

/**
 * Static export pre-builds one HTML file per known route, so a product added
 * to the spreadsheet after the last deploy lands here instead of on its own
 * page. When the requested path looks like a store item we render the item
 * detail view (which resolves the product from the sheet at runtime); anything
 * else gets a normal not-found page.
 */
export default function NotFound() {
    const [storeSlug, setStoreSlug] = useState<string | null>(null);
    const [resolved, setResolved] = useState(false);

    useEffect(() => {
        // Strip the GitHub Pages basePath and any trailing slash before matching.
        const path = window.location.pathname
            .replace(new RegExp(`^${BASE_PATH}`), '')
            .replace(/\/$/, '');

        const match = path.match(/^\/store\/([^/]+)$/);
        // Reads window.location after mount; running once is the point.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStoreSlug(match ? decodeURIComponent(match[1]) : null);
        setResolved(true);
    }, []);

    if (!resolved) return null;
    if (storeSlug) return <ItemDetailClient slug={storeSlug} />;

    return (
        <main className="min-h-screen bg-background text-white flex flex-col">
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-32">
                <h1 className="text-5xl sm:text-6xl font-bold mb-4">404</h1>
                <p className="text-lg text-white/70 mb-8">We couldn&apos;t find that page.</p>
                <Link href="/">
                    <button className="bg-[#C92C2C] hover:bg-red-700 text-white font-bold py-2.5 px-8 rounded-full shadow-lg transition-transform hover:scale-105 cursor-pointer">
                        Back Home
                    </button>
                </Link>
            </div>
            <Footer />
        </main>
    );
}
