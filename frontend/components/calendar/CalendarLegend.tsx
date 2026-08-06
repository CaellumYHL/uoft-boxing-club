import { EVENT_COLORS } from '@/lib/calendar/constants';

/**
 * Static colour legend explaining the Free (red) vs Paid (blue) event colours.
 * No props - purely presentational.
 */
export function CalendarLegend() {
    return (
        <div className="flex items-center gap-4 bg-white/5 rounded-lg px-4 py-2 border border-white/10">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                <span
                    className="w-3 h-3 rounded shadow-sm"
                    style={{ backgroundColor: EVENT_COLORS.free }}
                ></span>{' '}
                Free Classes
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                <span
                    className="w-3 h-3 rounded shadow-sm"
                    style={{ backgroundColor: EVENT_COLORS.paid }}
                ></span>{' '}
                Paid Classes
            </div>
        </div>
    );
}