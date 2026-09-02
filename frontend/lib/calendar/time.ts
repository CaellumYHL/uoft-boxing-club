import { ClassEvent } from '@/types/calendar';
import { SCHEDULE_TIMEZONE } from './constants';

/** 
 * Extracts the hour and minute of a given Date as displayed in
 * SCHEDULE_TIMEZONE, regardless of the runtime's local timezone.
 * 
 * @param date - The instant to convert.
 * @returns An object with 24-hour `hour` (0-23) and `minute` (0-59).
 */
export function getTorontoTimeParts(date: Date) {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: SCHEDULE_TIMEZONE,
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
    }).formatToParts(date);

    let hour = 0;
    let minute = 0;
    for (const part of parts) {
        if (part.type === 'hour') hour = parseInt(part.value, 10);
        if (part.type === 'minute') minute = parseInt(part.value, 10);
    }
    if (hour === 24) hour = 0;
    return { hour, minute };
}

/** 
 * Computes every whole hour (in SCHEDULE_TIMEZONE) that a class occupies,
 * inclusive of both its start and end hour. Used to know which grid rows
 * a class's card must span.
 * 
 * @param cls - The class event to inspect.
 * @returns An ascending array of hour numbers (e.g. [14, 15, 16]), or []
 *          if the class has no valid start/end date.
 */
export function hoursForClass(cls: ClassEvent): number[] {
    const start = cls.startDate;
    const end = cls.endDate;
    if (!start || !end) return [];

    const tStart = getTorontoTimeParts(start);
    const tEnd = getTorontoTimeParts(new Date(end.getTime() - 1));

    const hours: number[] = [];
    for (let h = tStart.hour; h <= tEnd.hour; h++) hours.push(h);
    return hours;
}

/** 
 * Formats a Date as a human-readable clock time in SCHEDULE_TIMEZONE,
 * e.g. "6:30 PM". Used for the "start - end" caption on event cards.
 * 
 * @param date - The instant to format.
 * @returns Localised 12-hour time string.
 */
export function formatClassTime(date: Date) {
    return new Intl.DateTimeFormat('en-US', {
        timeZone: SCHEDULE_TIMEZONE,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).format(date);
}

/** 
 * Formats a raw hour number (0-23, may exceed 23 for display padding math)
 * as a short 12-hour label, e.g. formatHour(13) -> "1 PM".
 * 
 * @param hour - Hour to format: normalised modulo 24 before formatting.
 * @returns Two-part label string "H AM"/"H PM".
 */
export function formatHour(hour: number): string {
    const norm = hour % 24;
    const suffix = norm >= 12 ? 'PM' : 'AM';
    const h12 = norm % 12 || 12;
    return `${h12} ${suffix}`;
}
/**
 * The title to show for a calendar entry, with the "Event:" / "[event]"
 * marker execs use to tag one-off events removed - the colour coding already
 * says it is an event, so the prefix is just noise on screen.
 *
 * @param title - Raw calendar entry summary.
 * @returns The title as it should be displayed.
 */
export function displayTitle(title: string): string {
    return title.replace(/^\s*event:\s*/i, '').replace(/\s*\[event\]\s*/i, ' ').trim();
}
