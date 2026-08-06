import { ClassEvent } from '@/types/calendar';
import { formatClassTime } from '@/lib/calendar/time';
import { stripHtml } from '@/lib/calendar/dom';
import { EVENT_COLORS } from '@/lib/calendar/constants';

/**
 * A single event's card within the grid: title, optional description, and
 * a "start – end" time caption. Background color reflects free vs paid.
 * HTML in title/description is stripped to plain text before rendering.
 *
 * @param cls - The event to render.
 * @param gridColumn - 1-based CSS grid column this card occupies.
 * @param gridRowSpan - CSS grid-row value, e.g. "3 / 6", spanning its duration.
 */
export function EventCard({
    cls,
    gridColumn,
    gridRowSpan,
}: {
    cls: ClassEvent;
    gridColumn: number;
    gridRowSpan: string;
}) {
    return (
        <div
            style={{
                gridColumn,
                gridRow: gridRowSpan,
                backgroundColor: EVENT_COLORS[cls.type],
            }}
            className="rounded-xl shadow-lg mx-2 my-1.5 p-2.5 flex flex-col justify-start text-left"
        >
            <p className="font-bold text-sm leading-snug">{stripHtml(cls.title)}</p>
            {cls.description && (
                <p className="text-xs opacity-90 leading-snug mt-0.5">
                    {stripHtml(cls.description)}
                </p>
            )}
            <p className="text-[10.5px] italic text-white/70 mt-1">
                {formatClassTime(cls.startDate)} – {formatClassTime(cls.endDate)}
            </p>
        </div>
    );
}