'use client';

import { useRef, useState } from 'react';
import { useWeekRange } from '@/hooks/useWeekRange';
import { useGoogleCalendarEvents } from '@/hooks/useGoogleCalendarEvents';
import { useAvailableBodyHeight, useCalendarLayout } from '@/hooks/useCalendarRowLayout';
import { CalendarNav } from '@/components/calendar/CalendarNav';
import { CalendarLegend } from '@/components/calendar/CalendarLegend';
import { DayHeaderRow } from './DayHeaderRow';
import { CalendarGrid } from './CalendarGrid';


export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const boxRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    const { startOfWeek, endOfWeek, isCurrentWeek } = useWeekRange(currentDate);
    const { classes, loading } = useGoogleCalendarEvents(startOfWeek, endOfWeek);
    const availableBodyPx = useAvailableBodyHeight(boxRef, headerRef, classes)

    const {
        daysWithEvents,
        classesByDay,
        rowDefs,
        hourToRow,
        hourRowPx
    } = useCalendarLayout(classes, availableBodyPx);

    const colCount = daysWithEvents.length;

    const weekLabel =
        `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ` +
        `${new Date(endOfWeek.getTime() - 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

    return (
        <div className="w-full h-full flex flex-col gap-4">

            {/* Navigation & Legend */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2 flex-shrink-0">

                <CalendarLegend />

                <div className="text-center">
                    <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">Week of</p>
                    <p className="text-white font-bold">{weekLabel}</p>
                </div>

                <CalendarNav
                    onPrevWeek={() => setCurrentDate(d => new Date(new Date(d).setDate(d.getDate() - 7)))}
                    onNextWeek={() => setCurrentDate(d => new Date(new Date(d).setDate(d.getDate() + 7)))}
                    onToday={() => setCurrentDate(new Date())}
                    isCurrentWeek={isCurrentWeek}
                />
            </div>

            {/* ── Dynamic-height calendar box ── */}
            <div
                ref={boxRef}
                className="w-full text-white rounded-2xl border border-white/20 overflow-hidden flex flex-col flex-1 min-h-0"
            >
                {loading ? (
                    <div className="flex flex-1 items-center justify-center text-white/50 text-lg">Loading…</div>
                ) : classes.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center text-center">
                        <div>
                            <p className="text-2xl font-semibold mb-3">No Classes This Week</p>
                            <p className="text-white/60">Check back soon or browse upcoming weeks.</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col flex-1 overflow-hidden">

                        <DayHeaderRow days={daysWithEvents} colCount={colCount} headerRef={headerRef} />

                        {/* Scrollable body */}
                        <div
                            className="overflow-y-auto flex-1 border-r border-white/10"
                            style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: 'rgba(255,255,255,0.25) rgba(255,255,255,0.05)',
                            }}
                        >
                            <CalendarGrid
                                rowDefs={rowDefs}
                                hourToRow={hourToRow}
                                daysWithEvents={daysWithEvents}
                                classesByDay={classesByDay}
                                hourRowPx={hourRowPx}
                                colCount={colCount}
                            />
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
