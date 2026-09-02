'use client';

import { useEffect, useState } from 'react';
import { ClassEvent } from '@/types/calendar';
import { fetchCalendarEvents, isCalendarConfigured } from '@/lib/calendar/api';

/**
 * Fetches and normalises Google Calendar events for the given week window.
 * Silently no-ops if the calendar ID / API key env vars are missing.
 *
 * @param startOfWeek - Inclusive lower bound of the fetch window.
 * @param endOfWeek - Exclusive upper bound of the fetch window.
 * @returns `classes` (normalised events) and `loading` (fetch in flight).
 */
export function useGoogleCalendarEvents(startOfWeek: Date, endOfWeek: Date): { classes: ClassEvent[]; loading: boolean } {
    const [classes, setClasses] = useState<ClassEvent[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isCalendarConfigured()) return;
        let cancelled = false;

        // Shows the spinner while the week's fetch is in flight.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        fetchCalendarEvents(startOfWeek, endOfWeek)
            .then((events) => { if (!cancelled) setClasses(events); })
            .catch((e) => console.error('Calendar fetch failed', e))
            .finally(() => { if (!cancelled) setLoading(false); });

        return () => { cancelled = true; };
    }, [startOfWeek, endOfWeek]);

    return { classes, loading };
}

/** How far ahead the "upcoming" strip looks for sessions. */
const UPCOMING_WINDOW_DAYS = 60;

/**
 * Fetches the next few sessions starting from now, for the "Upcoming Classes"
 * strip on the home page.
 *
 * @param count - Maximum number of sessions to return.
 * @returns `classes` (soonest first) and `loading` (fetch in flight).
 */
export function useUpcomingClasses(count: number): { classes: ClassEvent[]; loading: boolean } {
    const [classes, setClasses] = useState<ClassEvent[]>([]);
    const [loading, setLoading] = useState(isCalendarConfigured());

    useEffect(() => {
        if (!isCalendarConfigured()) return;
        let cancelled = false;

        const now = new Date();
        const horizon = new Date(now);
        horizon.setDate(horizon.getDate() + UPCOMING_WINDOW_DAYS);

        fetchCalendarEvents(now, horizon, count)
            .then((events) => { if (!cancelled) setClasses(events.slice(0, count)); })
            .catch((e) => console.error('Upcoming classes fetch failed', e))
            .finally(() => { if (!cancelled) setLoading(false); });

        return () => { cancelled = true; };
    }, [count]);

    return { classes, loading };
}