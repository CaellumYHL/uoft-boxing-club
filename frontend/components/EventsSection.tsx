'use client';

import { useSheetEvents } from '@/hooks/useSheetEvents';
import { useSiteConfig } from '../context/SiteConfigContext';
import { ClubEvent } from '@/types/content';

/**
 * The "Upcoming Events" section of the home page. Event cards are driven by
 * the Events tab of the content spreadsheet so execs can add or remove events
 * without a code change or redeploy.
 */
export default function EventsSection() {
    const { data: events, loading } = useSheetEvents();
    const { eventSignupUrl } = useSiteConfig();

    return (
        <section id="events" className="w-full flex flex-col items-center px-4 sm:px-6 py-20 lg:py-28">
            <div className="max-w-4xl w-full flex flex-col gap-6 sm:gap-8">
                <h2 className="text-center text-2xl sm:text-3xl font-bold mb-2">Upcoming Events</h2>

                {loading && <EventsSkeleton />}

                {!loading && events.length === 0 && (
                    <p className="text-center text-white/60 py-10">
                        No events scheduled right now - follow us on Instagram for announcements.
                    </p>
                )}

                {!loading &&
                    events.map((event) => (
                        <EventCard key={event.id} event={event} fallbackSignupUrl={eventSignupUrl} />
                    ))}
            </div>
        </section>
    );
}

/**
 * A single event card: image (or emoji placeholder), title, when/where, blurb
 * and a sign-up button. The button is hidden entirely when neither the event
 * nor the site config supplies a sign-up link, rather than linking nowhere.
 *
 * @param event - The event to render.
 * @param fallbackSignupUrl - Site-wide sign-up URL used when the event has none.
 */
function EventCard({ event, fallbackSignupUrl }: { event: ClubEvent; fallbackSignupUrl: string }) {
    const signupUrl = event.signupUrl || fallbackSignupUrl;

    return (
        <article className="bg-[#3B71CA] rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row gap-5 sm:gap-6 items-center shadow-lg border border-white/10">
            <div className="w-28 h-28 sm:w-32 sm:h-32 bg-black/20 rounded-lg flex-shrink-0 flex items-center justify-center text-4xl overflow-hidden">
                {event.image ? (
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                    <span>{event.emoji}</span>
                )}
            </div>

            <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-bold text-white">{event.title}</h3>
                {(event.when || event.location) && (
                    <p className="text-sm text-blue-100 italic mb-2">
                        {[event.when, event.location].filter(Boolean).join(' at ')}
                    </p>
                )}
                {event.description && <p className="text-sm mb-4 text-white">{event.description}</p>}

                {signupUrl && (
                    <a href={signupUrl} target="_blank" rel="noopener noreferrer">
                        <button className="bg-[#C92C2C] hover:bg-red-700 text-white px-6 py-1.5 rounded-full text-sm font-bold transition cursor-pointer shadow-md transform hover:scale-105">
                            Sign Up
                        </button>
                    </a>
                )}
            </div>
        </article>
    );
}

/** Placeholder cards shown while the Events tab is loading. */
function EventsSkeleton() {
    return (
        <div className="flex flex-col gap-8 animate-pulse">
            {[0, 1].map((i) => (
                <div key={i} className="bg-white/5 rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-center border border-white/10">
                    <div className="w-32 h-32 bg-white/10 rounded-lg flex-shrink-0" />
                    <div className="flex-1 w-full space-y-3">
                        <div className="h-5 bg-white/10 rounded w-1/2" />
                        <div className="h-3 bg-white/10 rounded w-1/3" />
                        <div className="h-3 bg-white/10 rounded w-full" />
                        <div className="h-8 bg-white/10 rounded-full w-28" />
                    </div>
                </div>
            ))}
        </div>
    );
}
