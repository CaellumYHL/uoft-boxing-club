'use client';

import { useEffect, useState } from 'react';

type CalendarEvent = {
    id: string;
    summary: string;
    start: { dateTime?: string; date?: string };
    end: { dateTime?: string; date?: string };
};

export default function Calendar() {
    const calendarId = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID || '';
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';

    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [status, setStatus] = useState('Connecting...');
    const [error, setError] = useState<string | null>(null);

    const getStartOfWeek = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    };

    const startOfWeek = getStartOfWeek(currentDate);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch(
                    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
                        calendarId
                    )}/events?key=${apiKey}&singleEvents=true&orderBy=startTime&timeMin=${startOfWeek.toISOString()}&timeMax=${endOfWeek.toISOString()}`
                );

                const data = await res.json();

                if (data.error) {
                    setError(JSON.stringify(data.error));
                    setStatus('Failed');
                    return;
                }

                setEvents(data.items || []);
                setStatus(`Connected ✓ (${data.items?.length || 0} events this week)`);
            } catch (err: any) {
                setError(err.message);
                setStatus('Failed');
            }
        };

        fetchEvents();
    }, [currentDate]);

    const days = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        return day;
    });

    const hours = Array.from({ length: 24 }, (_, i) => i); // 0-23 hours

    const eventsByDayAndHour = days.map(day => {
        return hours.map(hour => {
            return events.filter(event => {
                const startValue = event.start?.dateTime || event.start?.date;
                if (!startValue) return false;
                const eventDate = new Date(startValue);
                return (
                    eventDate.getFullYear() === day.getFullYear() &&
                    eventDate.getMonth() === day.getMonth() &&
                    eventDate.getDate() === day.getDate() &&
                    eventDate.getHours() === hour
                );
            });
        });
    });

    const nextWeek = () => {
        const next = new Date(currentDate);
        next.setDate(currentDate.getDate() + 7);
        setCurrentDate(next);
    };

    const prevWeek = () => {
        const prev = new Date(currentDate);
        prev.setDate(currentDate.getDate() - 7);
        setCurrentDate(prev);
    };

    const goToCurrentWeek = () => {
        setCurrentDate(new Date());
    };

    const getEventColor = (summary: string) => {
        // Use red for "Drop-in Class" and blue for "Membership Class"
        if (summary.toLowerCase().includes('drop-in')) return '#C92C2C';
        return '#3B82F6';
    };

    return (
        <div className="w-full p-6 bg-blue-900 rounded-lg text-white">
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 border border-white rounded-lg overflow-hidden">
                {days.map((day, dayIndex) => {
                    // Check if this day has any events
                    const hasEvents = eventsByDayAndHour[dayIndex].some(hourEvents => hourEvents.length > 0);
                    if (!hasEvents) return null;

                    return (
                        <div key={dayIndex} className="border-l border-white last:border-r p-2 flex flex-col">
                            <h3 className="text-center font-bold mb-2">
                                {day.toLocaleDateString('en-US', { weekday: 'short' })}
                            </h3>

                            {hours.map((hour, hourIndex) => {
                                const hourEvents = eventsByDayAndHour[dayIndex][hourIndex];
                                if (hourEvents.length === 0) return null;

                                return hourEvents.map(event => {
                                    const startValue = event.start?.dateTime || event.start?.date;
                                    return (
                                        <div
                                            key={event.id}
                                            className="p-2 mb-2 rounded-lg"
                                            style={{ backgroundColor: getEventColor(event.summary) }}
                                        >
                                            <p className="font-semibold">{event.summary}</p>
                                            {startValue && (
                                                <p className="text-sm">
                                                    {new Date(startValue).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            )}
                                        </div>
                                    );
                                });
                            })}
                        </div>
                    );
                })}
            </div>

            {/* Navigation */}
            <div className="flex justify-center gap-6 my-4">
                <button onClick={prevWeek} className="px-4 py-2 bg-white text-blue-900 rounded">← Prev</button>
                <button onClick={goToCurrentWeek} className="px-4 py-2 bg-white text-blue-900 rounded">This Week</button>
                <button onClick={nextWeek} className="px-4 py-2 bg-white text-blue-900 rounded">Next →</button>
            </div>

            {/* Follow Calendar */}
            <div className="flex justify-center">
                <a
                    href={`https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(calendarId)}`}
                    target="_blank"
                    className="bg-[#C92C2C] text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition"
                >
                    Follow Full Class Calendar
                </a>
            </div>
        </div>
    );
}
