'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ExternalLink } from 'lucide-react';
import { SHEETS_ID } from '@/lib/site';

/**
 * The store used to be edited through this page, which POSTed to /api/products.
 * That route can't exist on a static export (there is no server), so the
 * catalogue now lives in the Products tab of the content spreadsheet and this
 * page just points execs at it.
 */
export default function Admin() {
    const sheetUrl = SHEETS_ID
        ? `https://docs.google.com/spreadsheets/d/${SHEETS_ID}/edit`
        : '';

    return (
        <main className="min-h-screen bg-background text-white flex flex-col">
            <Navbar />

            <div className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pt-28 lg:pt-32 pb-20">
                <h1 className="text-3xl sm:text-4xl font-bold mb-6">Editing the Site</h1>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5">
                    <p className="text-white/80 leading-relaxed">
                        Everything on this site - the logo, team, events, store items, class sign-up
                        links and contact details - is edited in the club&apos;s Google Sheet. Changes
                        show up on the site within a minute; there is nothing to rebuild or deploy.
                    </p>

                    <ul className="text-white/70 space-y-2 list-disc list-inside">
                        <li><strong className="text-white">Config</strong> - logo, contact details, sign-up and waiver links</li>
                        <li><strong className="text-white">Team</strong> - the Meet Our Team page</li>
                        <li><strong className="text-white">Events</strong> - the Upcoming Events cards</li>
                        <li><strong className="text-white">Products</strong> - memberships and merch</li>
                        <li><strong className="text-white">Orders</strong> - incoming orders, with Paid / Delivered checkboxes</li>
                    </ul>

                    {sheetUrl ? (
                        <a href={sheetUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
                            <button className="flex items-center gap-2 bg-[#C92C2C] hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition">
                                Open the Sheet <ExternalLink size={18} />
                            </button>
                        </a>
                    ) : (
                        <p className="text-yellow-300/90 text-sm">
                            No spreadsheet is configured yet. See <code>docs/EXEC_GUIDE.md</code> in the
                            repository for the one-time setup steps.
                        </p>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
