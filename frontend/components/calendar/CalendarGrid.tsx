import { ClassEvent, RowDef } from '@/types/calendar';
import { getTorontoTimeParts, hoursForClass } from '@/lib/calendar/time';
import { TimeColumn } from './TimeColumn';
import { EventCard } from './EventCard';

/**
 * Renders the scrollable grid body: time column + one column per visible
 * day, placing each event's EventCard into the correct row span and
 * marking already-occupied rows so overlapping start hours don't
 * double-render empty cells.
 *
 * @param rowDefs - Finalized row definitions (hours + gaps) for the week.
 * @param hourToRow - Lookup from hour number to its 1-based grid row.
 * @param daysWithEvents - Ordered list of dates with events this week.
 * @param classesByDay - Events grouped by `Date.toDateString()` key.
 * @param hourRowPx - Resolved pixel height per hour row.
 * @param colCount - Number of day columns for the grid template.
 */
export function CalendarGrid({
    rowDefs,
    hourToRow,
    daysWithEvents,
    classesByDay,
    hourRowPx,
    colCount,
}: {
    rowDefs: RowDef[];
    hourToRow: Record<number, number>;
    daysWithEvents: Date[];
    classesByDay: Record<string, ClassEvent[]>;
    hourRowPx: number;
    colCount: number;
}) {
    const bodyGridTemplateRows = rowDefs
        .map(() => `minmax(${hourRowPx}px, auto)`)
        .join(' ');

    return (
        <div
            className="grid py-4"
            style={{
                gridTemplateColumns: `72px repeat(${colCount}, 1fr)`,
                gridTemplateRows: bodyGridTemplateRows,
            }}
        >
            {/* Time labels & gap indicators */}
            <TimeColumn rowDefs={rowDefs} />

            {/* Current day highlight background */}
            {daysWithEvents.map((day, di) => {
                const isToday = day.toDateString() === new Date().toDateString();
                if (!isToday) return null;
                return (
                    <div
                        key={`bg-${di}`}
                        style={{ gridColumn: di + 2, gridRow: '1 / -1' }}
                        className="bg-white/[0.02] rounded-b-lg mx-1 pointer-events-none -my-4"
                    />
                );
            })}

            {/* Day columns */}
            {daysWithEvents.flatMap((day, di) => {
                const dayKey = day.toDateString();
                const dayEvents = classesByDay[dayKey] || [];
                const gridCol = di + 2;

                return buildDayColumnCells(day, dayEvents, gridCol, rowDefs, hourToRow);
            })}
        </div>
    );
}

/**
 * Builds the list of EventCard/empty-cell nodes for a single day column,
 * walking each hour row once and skipping rows already marked occupied
 * by a multi-hour event that started earlier.
 *
 * @param day - The date this column represents.
 * @param dayEvents - Events starting on this day.
 * @param gridCol - 1-based CSS grid column index for this day.
 * @param rowDefs - Finalized row definitions for the week.
 * @param hourToRow - Lookup from hour number to its 1-based grid row.
 */
function buildDayColumnCells(
    day: Date,
    dayEvents: ClassEvent[],
    gridCol: number,
    rowDefs: RowDef[],
    hourToRow: Record<number, number>
): React.ReactNode[] {
    const occupied = new Set<number>();
    const cells: React.ReactNode[] = [];

    rowDefs.forEach((row, ri) => {
        const gridRow = ri + 1;
        if (row.type === 'gap') return;
        if (occupied.has(gridRow)) return;

        const hour = row.value;
        const starting = dayEvents.filter((cls) => {
            if (!cls.startDate) return false;
            const th = getTorontoTimeParts(cls.startDate).hour;
            return th === hour;
        });

        if (starting.length > 0) {
            starting.forEach((cls) => {
                const evHours = hoursForClass(cls);
                const lastHour = evHours[evHours.length - 1];
                const endRow = (hourToRow[lastHour] ?? gridRow) + 1;
                for (let r = gridRow + 1; r < endRow; r++) occupied.add(r);

                cells.push(
                    <EventCard
                        key={`ev-${cls.id}`}
                        cls={cls}
                        gridColumn={gridCol}
                        gridRowSpan={`${gridRow} / ${endRow}`}
                    />
                );
            });
        } else {
            cells.push(
                <div key={`empty-${gridCol}-${ri}`} style={{ gridColumn: gridCol, gridRow }} />
            );
        }
    });

    return cells;
}