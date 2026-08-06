import { RowDef } from '@/types/calendar';
import { formatHour } from '@/lib/calendar/time';

/**
 * Renders the left-hand gutter of the calendar grid: an hour label for
 * every `hour` row, and a compressed "⋮"-style indicator for every `gap`
 * row (representing a skipped block of empty hours).
 *
 * @param rowDefs - Finalized row definitions for the current week's grid.
 */
export function TimeColumn({ rowDefs }: { rowDefs: RowDef[] }) {
    return (
        <>
            {rowDefs.map((row, i) => {
                if (row.type === 'gap') {
                    return <GapIndicatorCell key={`tgap-${i}`} rowIndex={i} rowDefs={rowDefs} />;
                }

                return (
                    <div
                        key={`t-${row.value}`}
                        style={{ gridColumn: 1, gridRow: i + 1 }}
                        className={`flex flex-col pr-3 text-xs text-white/40 pt-1 ${i === rowDefs.length - 1 ? 'justify-between pb-1' : 'justify-start'
                            }`}
                    >
                        <span className="self-end leading-none">{formatHour(row.value)}</span>
                        {i === rowDefs.length - 1 && (
                            <span className="self-end leading-none">{formatHour(row.value + 1)}</span>
                        )}
                    </div>
                );
            })}
        </>
    );
}

/**
 * Renders a single gap indicator cell showing the hour label immediately
 * following the gap, plus three small dots signifying skipped time.
 *
 * @param rowIndex - Index of this gap row within `rowDefs`.
 * @param rowDefs - Full row definitions array (used to find the preceding hour).
 */
function GapIndicatorCell({
    rowIndex,
    rowDefs,
}: {
    rowIndex: number;
    rowDefs: RowDef[];
}) {
    const nextHourStr = formatHour((rowDefs[rowIndex - 1] as any).value + 1);
    const [h12, suffix] = nextHourStr.split(' ');
    const char1 = suffix[0];
    const char2 = suffix[1];

    return (
        <div
            style={{ gridColumn: 1, gridRow: rowIndex + 1 }}
            className="flex flex-col w-full h-full pt-1 pr-3"
        >
            <div className="flex self-end text-xs text-white/40 leading-none h-full">
                <span className="whitespace-pre">{h12} </span>
                <div className="flex flex-col items-center h-full">
                    <span>{char1}</span>
                    <div className="flex-1 flex flex-col items-center justify-center gap-[2px] opacity-25">
                        <span className="w-[3px] h-[3px] rounded-full bg-white" />
                        <span className="w-[3px] h-[3px] rounded-full bg-white" />
                        <span className="w-[3px] h-[3px] rounded-full bg-white" />
                    </div>
                </div>
                <div className="flex flex-col h-full">
                    <span>{char2}</span>
                </div>
            </div>
        </div>
    );
}