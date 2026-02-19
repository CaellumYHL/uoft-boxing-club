import { NextResponse } from 'next/server';

export async function GET() {
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const apiKey = process.env.GOOGLE_API_KEY;

    const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&singleEvents=true&orderBy=startTime`);

    const data = await res.json();

    return NextResponse.json(data.items);
}