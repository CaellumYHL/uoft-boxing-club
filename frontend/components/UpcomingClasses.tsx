'use client';

import Link from 'next/link';
import { useUpcomingClasses } from '@/hooks/useGoogleCalendarEvents';
import { ClassEvent } from '@/types/calendar';
import { formatClassTime, displayTitle } from '@/lib/calendar/time';
import { KIND_COLORS } from '@/lib/calendar/constants';
import { stripHtml } from '@/lib/calendar/dom';

/** How many sessions the strip shows. Three fits the original three-column design. */
const UPCOMING_COUNT = 3;

/**
 * The "Upcoming Classes" strip on the home page: the next few sessions pulled
 * live from Google Calendar, colour-coded by whether each is a regular class
 * or a one-off event.
 */
export default function UpcomingClasses() {
    const { classes, loading } = useUpcomingClasses(UPCOMING_COUNT);

    return (
        <section className="w-full px-4 sm:px-6 max-w-4xl mx-auto">
            <h2 className="text-center text-xl sm:text-2xl font-semibold mb-4 sm:mb-5">Upcoming Classes</h2>

            <div className="border border-white/50 rounded-2xl px-5 py-3 sm:p-8">
                {loading ? (
                    <UpcomingSkeleton />
                ) : classes.length === 0 ? (
                    <p className="text-center text-white/60 py-4">
                        No sessions scheduled right now - check back soon.
                    </p>
                ) : (
                    <>
                        <ul className="flex flex-col sm:flex-row justify-between items-stretch gap-1 sm:gap-6">
                            {classes.map((cls) => (
                                <UpcomingCard key={cls.id} cls={cls} />
                            ))}
                        </ul>

                        <div className="flex items-center justify-center gap-5 mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-white/15">
                            <LegendDot color={KIND_COLORS.class} label="Class" />
                            <LegendDot color={KIND_COLORS.event} label="Event" />
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

/**
 * A single upcoming session: its weekday + date, title, and start time.
 * Links through to the full schedule or the events section depending on kind.
 */
function UpcomingCard({ cls }: { cls: ClassEvent }) {
    const weekday = cls.startDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const dayNum = cls.startDate.toLocaleDateString('en-US', { day: 'numeric' });

    // "Event: Sparring Night" reads better as just "Sparring Night" on a card
    // that already colour-codes it as an event.
    const title = displayTitle(stripHtml(cls.title));

    return (
        // One compact row per session on phones so all three stay above the
        // fold (issue #13); the original stacked card returns at sm and up.
        <li className="flex-1 flex flex-row sm:flex-col items-center justify-between sm:justify-start gap-3 sm:gap-2 text-left sm:text-center py-2 sm:py-0 border-b border-white/10 last:border-0 sm:border-0">
            <div className="flex flex-row sm:flex-col items-baseline sm:items-center gap-2 sm:gap-2 flex-shrink-0">
                <span className="text-base sm:text-xl font-bold whitespace-nowrap">
                    {weekday} {dayNum}
                </span>
                <span className="text-xs text-white/50 whitespace-nowrap">{formatClassTime(cls.startDate)}</span>
            </div>
            <Link
                href={cls.kind === 'event' ? '#events' : '#classes'}
                className="min-w-0 sm:w-full flex justify-end sm:justify-center"
            >
                <button
                    style={{ backgroundColor: KIND_COLORS[cls.kind] }}
                    className="text-white text-xs sm:text-sm font-bold py-1.5 sm:py-2 px-4 sm:px-5 rounded-full shadow-md transition cursor-pointer transform hover:scale-105 hover:brightness-110 max-w-full truncate"
                >
                    {title || 'Session'}
                </button>
            </Link>
        </li>
    );
}

/** A colour swatch + label used in the strip's class/event key. */
function LegendDot({ color, label }: { color: string; label: string }) {
    return (
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/70">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
            {label}
        </span>
    );
}

/** Placeholder cards shown while the calendar request is in flight. */
function UpcomingSkeleton() {
    return (
        <div className="flex flex-col sm:flex-row justify-between gap-6 animate-pulse">
            {Array.from({ length: UPCOMING_COUNT }).map((_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3">
                    <div className="h-5 w-20 bg-white/15 rounded" />
                    <div className="h-3 w-14 bg-white/10 rounded" />
                    <div className="h-9 w-32 bg-white/10 rounded-full" />
                </div>
            ))}
        </div>
    );
}
