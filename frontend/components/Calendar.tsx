'use client';

import React, { useEffect, useMemo, useState } from 'react';

type CalendarEvent = {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
};

export default function Calendar() {
  const calendarId = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID || '';
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

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
    if (!calendarId || !apiKey) return;

    fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        calendarId
      )}/events?key=${apiKey}&singleEvents=true&orderBy=startTime&timeMin=${startOfWeek.toISOString()}&timeMax=${endOfWeek.toISOString()}`
    )
      .then(res => res.json())
      .then(data => {
        setEvents(data.items || []);
      })
      .catch(err => {
        console.error('Calendar fetch error:', err);
      });
  }, [currentDate]);

  // Group events by day + hour
  const structured = useMemo(() => {
    const map: Record<string, Record<number, CalendarEvent[]>> = {};

    events.forEach(event => {
      const startValue = event.start?.dateTime || event.start?.date;
      if (!startValue) return;

      const date = new Date(startValue);
      const dayKey = date.toDateString();
      const hour = date.getHours();

      if (!map[dayKey]) map[dayKey] = {};
      if (!map[dayKey][hour]) map[dayKey][hour] = [];

      map[dayKey][hour].push(event);
    });

    return map;
  }, [events]);

  const daysWithEvents = Object.keys(structured)
    .map(d => new Date(d))
    .sort((a, b) => a.getTime() - b.getTime());

  const hoursWithEvents: number[] = Array.from(
    new Set(
        events
            .map(e => {
                const start = e.start?.dateTime || e.start?.date;
                return start ? new Date(start).getHours() : null;
            })
        .filter((h): h is number => h !== null)
        )
    ).sort((a, b) => a - b);

  const getColor = (summary: string) => {
    if (summary.toLowerCase().includes('drop')) return 'bg-[#C92C2C]';
    return 'bg-[#3B82F6]';
  };

  const formatHour = (hour: number) => {
    const temp = new Date();
    temp.setHours(hour);
    temp.setMinutes(0);
    return temp.toLocaleTimeString([], {
      hour: 'numeric',
      hour12: true
    });
  };

  // ✅ Strip HTML tags from summary/description
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <div className='w-full min-h-[60vh]'>
      {/* Navigation */}
      <div className="flex justify-center gap-[10%]">
        <div className="flex justify-center gap-[10%]">
          <button
            onClick={() => setCurrentDate(d => new Date(d.setDate(d.getDate() - 7)))}
            className="w-40 px-5 py-2 text-white rounded-lg text-center hover:font-bold hover:text-red-700"
          >
            ← Prev
          </button>

          <button
            onClick={() => setCurrentDate(new Date())}
            className="w-40 px-5 py-2 text-white rounded-lg text-center hover:font-bold hover:text-red-700"
          >
            This Week
          </button>

          <button
            onClick={() => setCurrentDate(d => new Date(d.setDate(d.getDate() + 7)))}
            className="w-40 px-5 py-2 text-white rounded-lg text-center hover:font-bold hover:text-red-700"
          >
            Next →
          </button>
        </div>
      </div>
      
      {/* Grid */}
      <div className="w-full text-white p-6 rounded-2xl border border-white/40 flex flex-col min-h-[60vh]">
        {events.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-center">
            <div>
              <p className="text-2xl font-semibold mb-3">
                No Classes This Week
              </p>
              <p className="text-white/70">
                Check back soon or browse upcoming weeks.
              </p>
            </div>
          </div>
        ) : (
          <div
            className="grid flex-1 overflow-hidden"
            style={{
              gridTemplateColumns: `100px repeat(${daysWithEvents.length}, 1fr)`,
              gridTemplateRows: `auto repeat(${hoursWithEvents.length}, 1fr)`
            }}
          >
            {/* Empty top-left cell */}
            <div />

            {/* Day Headers */}
            {daysWithEvents.map((day, i) => (
              <div
                key={i}
                className="text-center font-bold py-4 flex flex-col"
              >
                <span>
                  {day.toLocaleDateString('en-US', {
                    weekday: 'short',
                    day: 'numeric'
                  }).toUpperCase()}
                </span>
              </div>
            ))}

            {/* Time rows */}
            {hoursWithEvents.map((hour, rowIndex) => (
              <React.Fragment key={hour}>
                <div className="py-6 text-right pr-4 text-lg">
                  {formatHour(hour)}
                </div>

                {daysWithEvents.map((day, colIndex) => {
                  const dayKey = day.toDateString();
                  const eventsAtTime: CalendarEvent[] =
                    structured[dayKey]?.[hour] ?? [];

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className="p-2 overflow-hidden flex items-center justify-center"
                    >
                      {eventsAtTime.map(event => (
                        <div
                          key={event.id}
                          className={`${getColor(event.summary)} h-[80%] rounded-xl shadow-lg text-sm p-2 flex flex-col justify-center`}
                        >
                          <p className="font-semibold leading-tight">
                            {stripHtml(event.summary)}
                          </p>

                          {event.description && (
                            <p className="text-xs opacity-90 mt-1 leading-tight line-clamp-2">
                              {stripHtml(event.description)}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
