import { NextResponse } from 'next/server';

interface SheetRow {
    name: string;
    role: string;
    bio: string;
    image: string;
}

export async function GET() {
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
    const sheetId = process.env.GOOGLE_SHEETS_ID;
    const range = process.env.GOOGLE_SHEETS_RANGE || 'Sheet1!A:D';

    if (!apiKey || !sheetId) {
        return NextResponse.json(
            { error: 'Google Sheets configuration missing. Set GOOGLE_SHEETS_API_KEY and GOOGLE_SHEETS_ID in .env.local' },
            { status: 500 }
        );
    }

    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
        const response = await fetch(url, { next: { revalidate: 300 } }); // Cache for 5 minutes

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Google Sheets API error:', response.status, errorBody);
            return NextResponse.json(
                { error: 'Failed to fetch data from Google Sheets' },
                { status: 502 }
            );
        }

        const data = await response.json();
        const rows: string[][] = data.values || [];

        if (rows.length < 2) {
            // No data rows (only header or empty)
            return NextResponse.json([]);
        }

        // First row is the header — normalize to lowercase
        const headers = rows[0].map((h: string) => h.trim().toLowerCase());

        const members: SheetRow[] = rows.slice(1).map((row: string[]) => {
            const entry: Record<string, string> = {};
            headers.forEach((header: string, i: number) => {
                entry[header] = row[i]?.trim() || '';
            });
            return {
                name: entry['name'] || '',
                role: entry['role'] || '',
                bio: entry['bio'] || '',
                image: entry['image'] || '',
            };
        }).filter((m: SheetRow) => m.name || m.role); // Skip completely empty rows

        return NextResponse.json(members, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            },
        });
    } catch (error) {
        console.error('Error fetching team data:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
