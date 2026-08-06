/** A single calendar event normalised from the Google Calendar API response. */
export type ClassEvent = {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    description: string;
    type: 'free' | 'paid';
    signupLink: string;
};


/** A grid row that renders a specific hour label + events starting at that hour. */
type HourRow = { type: 'hour'; value: number };

/** A gride row that renders a compressed "gap" indicator between non-adjacent hours. */
type GapRow = { type: 'gap' };

/** Union of every possible row rendered in the calendar body grid. */
export type RowDef = HourRow | GapRow;