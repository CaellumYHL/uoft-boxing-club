import { useEffect, useState } from 'react';
import { ClassEvent } from "@/types/calendar";

/**
 * Fetches and normalises Google Calendar events for the given week window.
 * Classifies each event as 'free' or 'paid' based on whether its title
 * contains 'drop' (drop-in classes are free). Silently no-ops if the
 * calendar ID / API key env vars are missing.
 * 
 * @param startOfWeek - Inclusive lower bound of the fetch window.
 * @param endOfWeek - Exclusive upper bound of the fetch window.
 * @returns `classes` (normalised events) and `loading` (fetch in flight).
 */
export function useGoogleCalendarEvents(startOfWeek: Date, endOfWeek: Date): { classes: ClassEvent[]; loading: boolean } {
    const calendarId = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    const [classes, setClasses] = useState<ClassEvent[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!calendarId || !apiKey) return;
        setLoading(true);
        fetch(
            `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events` +
            `?key=${apiKey}&singleEvents=true&orderBy=startTime` +
            `&timeMin=${startOfWeek.toISOString()}&timeMax=${endOfWeek.toISOString()}`
        )
            .then(r => r.json())
            .then((data: any) => {
                const rawEvents = data.items || [];
                const mapped: ClassEvent[] = rawEvents.map(mapApiEventToClass);
                setClasses(mapped);
            })
            .catch(e => console.error('Calendar fetch failed', e))
            .finally(() => setLoading(false));
    }, [startOfWeek, endOfWeek]);

    return { classes, loading };
}

/**
 * Maps a raw Google Calendar API event resource into the app's ClassEvent
 * shape, defaulting missing dates to "now" and inferring the free/paid
 * type from the title.
 * 
 * @param ev - Raw event object from the Calendar API `items` array.
 * @returns Normalised ClassEvent.
 */
function mapApiEventToClass(ev: any): ClassEvent {
    const startStr = ev.start?.dateTime || ev.start?.date;
    const endStr = ev.end?.dateTime || ev.end?.date;
    const summary = ev.summary || '';

    return {
        id: ev.id,
        title: summary,
        startDate: startStr ? new Date(startStr) : new Date(),
        endDate: endStr ? new Date(endStr) : new Date(),
        description: ev.description || '',
        type: summary.toLowerCase().includes('drop') ? 'free' : 'paid',
        // TODO: remove the link option
        signupLink: '#'
    };
}