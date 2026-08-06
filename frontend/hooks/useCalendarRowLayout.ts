import { RefObject, useLayoutEffect, useState, useMemo } from 'react';
import { ClassEvent, RowDef } from '@/types/calendar';
import { hoursForClass } from '@/lib/calendar/time';
import { computeHourRowPx, computePaddedRowLayout } from "@/lib/calendar/layout";

/**
 * Measures the available pixel height for the scrollable calendar body
 * (box height minus header height minus padding), re-measuring on window
 * resize and whenever the event list changes.
 * 
 * @param boxRef - Ref to the outer calendar container.
 * @param headerRef - Ref to the sticky day-header row.
 * @param classes - Current event list (used only as a re-measure trigger).
 * @returns Available body height in pixels.
 */
export function useAvailableBodyHeight(
    boxRef: RefObject<HTMLDivElement | null>,
    headerRef: RefObject<HTMLDivElement | null>,
    classes: ClassEvent[]
): number {
    const [availableBodyPx, setAvailableBodyPx] = useState(0);

    useLayoutEffect(() => {
        const measure = () => {
            if (!boxRef.current) return;
            const boxH = boxRef.current.clientHeight;
            const headerH = headerRef.current?.clientHeight ?? 0;
            setAvailableBodyPx(Math.max(0, boxH - headerH - 32));
        };
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, [classes]);

    return availableBodyPx;
}

/**
 * Dervies the full row/column layout for the current week: which hours
 * have events, which days have events, events grouped by day, the padded
 * row definitions, the hour->row lookup, and the resolved per-row pixel
 * height. This is the single hook a component needs to render the grid.
 * 
 * @param classes - Normalised events for the visible week.
 * @param availableBodyPx - Pixel height available for the grid body.
 * @returns Everything needed to render `CalendarGrid`.
 */
export function useCalendarLayout(
    classes: ClassEvent[],
    availableBodyPx: number
): {
    coreHours: number[];
    daysWithEvents: Date[];
    classesByDay: Record<string, ClassEvent[]>;
    rowDefs: RowDef[];
    hourToRow: Record<number, number>;
    hourRowPx: number;
} {
    const coreHours = useMemo(() => computeCoreHours(classes), [classes]);
    const daysWithEvents = useMemo(() => computeDaysWithEvents(classes), [classes]);
    const classesByDay = useMemo(() => computeClassesByDay(classes), [classes]);

    const { rowDefs, hourToRow } = useMemo(() => {
        return computePaddedRowLayout(coreHours, availableBodyPx);
    }, [coreHours, availableBodyPx]);

    const hourRowPx = useMemo(() => {
        return computeHourRowPx(rowDefs, availableBodyPx);
    }, [rowDefs, availableBodyPx]);

    return { coreHours, daysWithEvents, classesByDay, rowDefs, hourToRow, hourRowPx };
}

/**
 * Extracts every whole hour (in SCHEDULE_TIMEZONE) that appears across all
 * given classes, deduplicated and sorted ascending.
 *
 * @param classes - Normalized events for the visible week.
 * @returns Ascending, deduplicated hour numbers.
 */
function computeCoreHours(classes: ClassEvent[]): number[] {
    const hourSet = new Set<number>();
    classes.forEach((cls) => hoursForClass(cls).forEach((h) => hourSet.add(h)));
    return Array.from(hourSet).sort((a, b) => a - b);
}

/**
 * Extracts every distinct calendar day (by local date, no time component)
 * that has at least one class starting on it, sorted chronologically.
 *
 * @param classes - Normalized events for the visible week.
 * @returns Ascending list of distinct days with events.
 */
function computeDaysWithEvents(classes: ClassEvent[]): Date[] {
    const daySet = new Set<string>();
    classes.forEach((cls) => {
        if (cls.startDate) daySet.add(cls.startDate.toDateString());
    });
    return Array.from(daySet)
        .map((s) => new Date(s))
        .sort((a, b) => a.getTime() - b.getTime());
}

/**
 * Groups classes by the calendar day (via `Date.toDateString()`) they
 * start on.
 *
 * @param classes - Normalized events for the visible week.
 * @returns Events grouped by day, keyed by `Date.toDateString()`.
 */
function computeClassesByDay(classes: ClassEvent[]): Record<string, ClassEvent[]> {
    const cByDay: Record<string, ClassEvent[]> = {};
    classes.forEach((cls) => {
        if (!cls.startDate) return;
        const key = cls.startDate.toDateString();
        if (!cByDay[key]) cByDay[key] = [];
        cByDay[key].push(cls);
    });
    return cByDay;
}