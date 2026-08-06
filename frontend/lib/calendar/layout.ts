import { MIN_HOUR_PX, MAX_HOUR_PX } from './constants';
import { RowDef } from '@/types/calendar';

/**
 * Converts a sorted list of hour numbers into a list of row definitions,
 * inserting a `{ type: 'gap' }` row whenever consecutive hours are not
 * adjacent (e.g. 9, 10, 14 -> hour(9), hour(10), gap, hour(14)).
 * 
 * @param sortedHours - Ascending, deduplicated hour numbers.
 * @returns Row definitions in display order.
 */
export function buildRowDefs(sortedHours: number[]): RowDef[] {
    const rows: RowDef[] = [];
    for (let i = 0; i < sortedHours.length; i++) {
        if (i > 0 && sortedHours[i] - sortedHours[i - 1] > 1) rows.push({ type: 'gap' });
        rows.push({ type: 'hour', value: sortedHours[i] });
    }
    return rows;
}

/** 
 * Given the real hours that contain events and the pixel height available
 * to render the calendar body, expands the hour range with empty padding
 * hours (before the earliest / after the latest) until the average row
 * height falls at or below MAX_HOUR_PX, without exceeding the 0-23 day
 * bounds. This keeps short schedules from rendering with awkwardly tall
 * rows.
 * 
 * @param coreHours - Ascending hour numbers that actually contiain events.
 * @param availableBodyPx - Pixel height available for the scrollable grid body.
 * @returns The finalised (possibly padded) row definitions, plus a lookup
 *          from hour number to its 1-based grid row index.
 */
export function computePaddedRowLayout(coreHours: number[], availableBodyPx: number): { rowDefs: RowDef[]; hourToRow: Record<number, number> } {
    if (coreHours.length === 0) return { rowDefs: [], hourToRow: {} };
    let minHour = coreHours[0];
    let maxHour = coreHours[coreHours.length - 1];

    let gapCount = 0;
    for (let i = 1; i < coreHours.length; i++) {
        if (coreHours[i] - coreHours[i - 1] > 1) gapCount++;
    }

    let totalSlots = coreHours.length + gapCount;
    const paddedSet = new Set(coreHours);

    if (availableBodyPx > 0) {
        while ((availableBodyPx / totalSlots) > MAX_HOUR_PX && (minHour > 0 || maxHour < 23)) {
            if (maxHour < 23) {
                maxHour++;
                paddedSet.add(maxHour);
                totalSlots++;
            } else if (minHour > 0) {
                minHour--;
                paddedSet.add(minHour);
                totalSlots++;
            }
        }
    }

    const finalHours = Array.from(paddedSet).sort((a, b) => a - b);
    const rdefs = buildRowDefs(finalHours);
    const h2r: Record<number, number> = {};
    rdefs.forEach((row, i) => { if (row.type === 'hour') h2r[row.value] = i + 1; });

    return { rowDefs: rdefs, hourToRow: h2r };
}

/**
 * Determines the pixel height to use for every hour row, clamped between
 * MIN_HOUR_PX and MAX_HOUR_PX, given how much vertical space is available
 * and how many row "slots" (hours + gaps) must fit in it.
 * 
 * @param rowDefs - The finalised row definitions (from computePaddedRowLayout).
 * @param availableBodyPx - Pixel height available for the scrollable grid body.
 * @returns Clamped, floored row height in pixels.
 */
export function computeHourRowPx(rowDefs: RowDef[], availableBodyPx: number): number {
    const hourCount = rowDefs.filter(r => r.type === 'hour').length;
    const gapCount = rowDefs.filter(r => r.type === 'gap').length;
    const totalSlots = hourCount + gapCount;

    const natural = availableBodyPx > 0 && totalSlots > 0
        ? availableBodyPx / totalSlots
        : MAX_HOUR_PX;

    const clamped = Math.max(MIN_HOUR_PX, Math.min(MAX_HOUR_PX, natural));

    return Math.floor(clamped)
}