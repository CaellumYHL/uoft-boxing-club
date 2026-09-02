'use client';

import { Mail, Instagram, MapPin } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

/**
 * Site-wide "Contact Us" footer. Rendered at the bottom of every page and
 * directly after the events section on the home page, so there is always a
 * visible way to get in touch. All details come from the Config tab of the
 * content spreadsheet.
 */
export default function Footer() {
    const { clubName, contactEmail, instagramUrl, locationName, locationAddress } = useSiteConfig();

    return (
        <footer id="contact" className="w-full border-t border-white/15 bg-background/60 backdrop-blur-sm">
            <div className="max-w-5xl mx-auto px-6 py-12 sm:py-16">
                <h2 className="text-center text-2xl sm:text-3xl font-bold mb-3">Contact Us</h2>
                <p className="text-center text-white/60 mb-10 max-w-xl mx-auto">
                    Questions about classes, memberships or merch? Reach out - we&apos;re happy to help.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    <ContactTile
                        icon={<Mail size={22} />}
                        label="Email"
                        value={contactEmail}
                        href={`mailto:${contactEmail}`}
                    />
                    <ContactTile
                        icon={<Instagram size={22} />}
                        label="Instagram"
                        value="@uoftboxingclub"
                        href={instagramUrl}
                        external
                    />
                    <ContactTile
                        icon={<MapPin size={22} />}
                        label="Find Us"
                        value={`${locationName}, ${locationAddress}`}
                    />
                </div>

                <p className="text-center text-white/40 text-sm mt-12">
                    &copy; {new Date().getFullYear()} {clubName}. All rights reserved.
                </p>
            </div>
        </footer>
    );
}

/**
 * One contact method in the footer grid. Renders as a link when `href` is
 * given, otherwise as plain text (used for the physical address).
 */
function ContactTile({
    icon,
    label,
    value,
    href,
    external,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    href?: string;
    external?: boolean;
}) {
    const body = (
        <div className="flex flex-col items-center gap-2 p-5 rounded-xl bg-white/5 border border-white/10 h-full transition-colors hover:border-white/30">
            <span className="text-secondary">{icon}</span>
            <span className="text-xs uppercase tracking-widest text-white/50 font-bold">{label}</span>
            <span className="text-sm text-white break-words">{value}</span>
        </div>
    );

    if (!href) return body;

    return (
        <a
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="block h-full"
        >
            {body}
        </a>
    );
}
