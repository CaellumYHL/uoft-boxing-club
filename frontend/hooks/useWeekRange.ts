import { useMemo } from "react";

/**
 * Derives the Monday-start/Sunday-end week boundaries for a given
 * reference date, plus whether "now" falls within that week.
 * 
 * @param currentDate - The reference date currently selected in the UI.
 * @returns `startOfWeek` (Mon 00:00), `endOfWeek` (following Mon 00:00,
 *          exclusive), and `isCurrentWeek` (true if "now" is within range).
 */
export function useWeekRange(currentDate: Date): { startOfWeek: Date, endOfWeek: Date, isCurrentWeek: boolean } {
    return useMemo(() => {
        const d = new Date(currentDate);
        const day = d.getDay();
        const sow = new Date(d.setDate(d.getDate() - day + (day === 0 ? -6 : 1)));
        sow.setHours(0, 0, 0, 0);
        const eow = new Date(sow);
        eow.setDate(sow.getDate() + 7);

        const now = new Date();
        const isCurrent = now >= sow && now < eow;

        return { startOfWeek: sow, endOfWeek: eow, isCurrentWeek: isCurrent };
    }, [currentDate]);
}