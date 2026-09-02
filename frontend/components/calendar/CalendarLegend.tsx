'use client';

import { EVENT_COLORS, KIND_COLORS } from '@/lib/calendar/constants';
import { useSiteConfig } from '@/context/SiteConfigContext';

/**
 * Colour key for the schedule grid. The free/paid wording is editable from
 * the Config tab of the content spreadsheet, so execs can relabel it (e.g.
 * "Members only") without a code change.
 */
export function CalendarLegend() {
    const { freeClassLabel, paidClassLabel } = useSiteConfig();

    return (
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 bg-white/5 rounded-lg px-4 py-2 border border-white/10">
            <LegendItem color={EVENT_COLORS.free} label={freeClassLabel} />
            <LegendItem color={EVENT_COLORS.paid} label={paidClassLabel} />
            <LegendItem color={KIND_COLORS.event} label="Events" />
        </div>
    );
}

/** One swatch + label pair in the key. */
function LegendItem({ color, label }: { color: string; label: string }) {
    return (
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
            <span className="w-3 h-3 rounded shadow-sm flex-shrink-0" style={{ backgroundColor: color }} />
            {label}
        </span>
    );
}
