import { ACCENT_COLOR } from '@/lib/calendar/constants';

/**
 * A single pill-shaped navigation button (Prev / Today / Next) with a
 * bold-on-hover label that reserves space up front to avoid layout shift.
 *
 * @param onClick - Handler invoked on click.
 * @param active - If true, renders in the highlighted "current" state.
 * @param children - Button label content.
 */
function NavButton({ onClick, children, active }: { onClick: () => void, children: React.ReactNode, active?: boolean }) {
    return (
        <button
            onClick={onClick}
            style={active ? { backgroundColor: ACCENT_COLOR } : undefined}
            className={`relative px-4 py-1.5 rounded-md text-xs transition group ${active ? 'text-white shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white'}`}
        >
            <div className="font-bold opacity-0 pointer-events-none whitespace-nowrap">
                {children}
            </div>
            <div className="absolute inset-0 flex items-center justify-center font-medium group-hover:font-bold transition-all whitespace-nowrap">
                {children}
            </div>
        </button>
    );
}

/**
 * The Prev / "Go to Today" / Next control cluster for paging between weeks.
 *
 * @param onPrevWeek - Called to go back one week.
 * @param onNextWeek - Called to go forward one week.
 * @param onToday - Called to jump back to the current week.
 * @param isCurrentWeek - Whether "Today" should render as active.
 */
export function CalendarNav({
    onPrevWeek,
    onNextWeek,
    onToday,
    isCurrentWeek,
}: {
    onPrevWeek: () => void;
    onNextWeek: () => void;
    onToday: () => void;
    isCurrentWeek: boolean;
}) {
    return (
        <div className="flex items-center gap-2">
            <NavButton onClick={onPrevWeek}>← Prev</NavButton>

            <NavButton active={isCurrentWeek} onClick={onToday}>
                Go to Today
            </NavButton>

            <NavButton onClick={onNextWeek}>Next →</NavButton>
        </div>
    );
}