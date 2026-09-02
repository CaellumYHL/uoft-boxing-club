import { ClassEvent } from '@/types/calendar';
import { formatClassTime, displayTitle } from '@/lib/calendar/time';
import { stripHtml } from '@/lib/calendar/dom';
import { EVENT_COLORS, KIND_COLORS } from '@/lib/calendar/constants';

/**
 * Phone-friendly view of the week's schedule: a day-by-day agenda instead of
 * the hour grid, which is unreadable once four day columns are squeezed into
 * a phone's width.
 *
 * @param days - Ordered list of dates that have sessions this week.
 * @param classesByDay - Sessions grouped by `Date.toDateString()`.
 */
export function AgendaList({
    days,
    classesByDay,
}: {
    days: Date[];
    classesByDay: Record<string, ClassEvent[]>;
}) {
    const today = new Date().toDateString();

    return (
        <div className="flex flex-col divide-y divide-white/10 overflow-y-auto">
            {days.map((day) => {
                const key = day.toDateString();
                const sessions = [...(classesByDay[key] || [])].sort(
                    (a, b) => a.startDate.getTime() - b.startDate.getTime()
                );

                return (
                    <div key={key} className="py-3 px-3">
                        <p className={`text-xs uppercase tracking-widest mb-2 ${key === today ? 'text-white font-bold' : 'text-white/50'}`}>
                            {day.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            {key === today && ' · Today'}
                        </p>

                        <ul className="flex flex-col gap-2">
                            {sessions.map((cls) => (
                                <AgendaRow key={cls.id} cls={cls} />
                            ))}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
}

/** One session in the agenda: a colour bar, the title/description, and its time. */
function AgendaRow({ cls }: { cls: ClassEvent }) {
    const color = cls.kind === 'event' ? KIND_COLORS.event : EVENT_COLORS[cls.type];
    const description = stripHtml(cls.description);

    return (
        <li className="flex gap-3 items-stretch">
            <span className="w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            <div className="min-w-0 flex-1">
                <p className="font-bold text-sm leading-snug">{displayTitle(stripHtml(cls.title))}</p>
                <p className="text-[11px] text-white/60 italic">
                    {formatClassTime(cls.startDate)} – {formatClassTime(cls.endDate)}
                    {cls.location && ` · ${cls.location}`}
                </p>
                {description && (
                    <p className="text-xs text-white/75 leading-snug mt-0.5">{description}</p>
                )}
            </div>
        </li>
    );
}
