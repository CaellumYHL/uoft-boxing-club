import { RefObject } from 'react';

/**
 * Sticky header row showing each visible day's weekday abbreviation and
 * date number, with a subtle highlight for today's column.
 *
 * @param days - Ordered list of dates with events this week.
 * @param colCount - Number of day columns, used to size the grid template.
 * @param headerRef - Ref forwarded to the outer row, used by the parent to
 *                     measure header height for body-height calculations.
 */
export function DayHeaderRow({
    days,
    colCount,
    headerRef,
}: {
    days: Date[];
    colCount: number;
    headerRef?: RefObject<HTMLDivElement | null>;
}) {
    return (
        <div
            ref={headerRef}
            className="grid border-b border-white/20 bg-[#15335C] flex-shrink-0"
            style={{ gridTemplateColumns: `72px repeat(${colCount}, 1fr)` }}
        >
            <div />
            {days.map((day, i) => {
                const isToday = day.toDateString() === new Date().toDateString();
                return (
                    <div key={i} className={`text-center py-2 flex flex-col items-center rounded-t-lg mx-1 ${isToday ? 'bg-white/[0.02]' : ''}`}>
                        <span className={`text-[11px] uppercase tracking-widest ${isToday ? 'text-white/70 font-bold' : 'text-white/50'}`}>
                            {day.toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                        <span className="text-lg font-extrabold leading-tight">
                            {day.toLocaleDateString('en-US', { day: 'numeric' })}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}