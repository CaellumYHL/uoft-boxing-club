import { ClassEvent } from '@/types/calendar';

const CALENDAR_ID = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

/** True when the Google Calendar env vars are both present. */
export function isCalendarConfigured(): boolean {
    return Boolean(CALENDAR_ID && API_KEY);
}

/**
 * Fetches events from the club's public Google Calendar and normalises them
 * into ClassEvent objects.
 *
 * @param timeMin - Inclusive lower bound of the window.
 * @param timeMax - Exclusive upper bound of the window.
 * @param maxResults - Optional cap on how many events to return.
 * @returns Normalised events in start-time order.
 */
export async function fetchCalendarEvents(
    timeMin: Date,
    timeMax: Date,
    maxResults?: number
): Promise<ClassEvent[]> {
    if (!isCalendarConfigured()) return [];

    const params = new URLSearchParams({
        key: API_KEY!,
        singleEvents: 'true',
        orderBy: 'startTime',
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
    });
    if (maxResults) params.set('maxResults', String(maxResults));

    const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID!)}/events?${params}`
    );
    if (!res.ok) throw new Error(`Calendar request failed (${res.status})`);

    const data = await res.json();
    return (data.items || []).map(mapApiEventToClass);
}

/**
 * Maps a raw Google Calendar API event resource into the app's ClassEvent
 * shape, defaulting missing dates to "now" and inferring both its free/paid
 * type and its class/event kind from the title.
 *
 * @param ev - Raw event object from the Calendar API `items` array.
 * @returns Normalised ClassEvent.
 */
export function mapApiEventToClass(ev: {
    id: string;
    summary?: string;
    description?: string;
    location?: string;
    start?: { dateTime?: string; date?: string };
    end?: { dateTime?: string; date?: string };
}): ClassEvent {
    const startStr = ev.start?.dateTime || ev.start?.date;
    const endStr = ev.end?.dateTime || ev.end?.date;
    const summary = ev.summary || '';
    const lower = summary.toLowerCase();

    return {
        id: ev.id,
        title: summary,
        startDate: startStr ? new Date(startStr) : new Date(),
        endDate: endStr ? new Date(endStr) : new Date(),
        description: ev.description || '',
        location: ev.location || '',
        // Drop-in sessions are free; everything else needs a membership.
        type: lower.includes('drop') ? 'free' : 'paid',
        // Execs mark one-off events by starting the calendar entry with "Event:".
        kind: lower.startsWith('event:') || lower.includes('[event]') ? 'event' : 'class',
    };
}

/**
 * Builds the Google Calendar "add another calendar by ID" URL for the club's
 * calendar, letting visitors subscribe to the live schedule in one click
 * rather than copying individual events.
 *
 * @returns The subscribe URL, or an empty string when no calendar is configured.
 */
export function googleCalendarSubscribeUrl(): string {
    if (!CALENDAR_ID) return '';
    return `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(CALENDAR_ID)}`;
}
