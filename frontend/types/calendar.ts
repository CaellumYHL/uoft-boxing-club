/** Whether a session is free to attend (drop-in) or requires a paid membership. */
export type ClassType = 'free' | 'paid';

/** Whether a calendar entry is a recurring class or a one-off club event. */
export type ClassKind = 'class' | 'event';

/** A single calendar event normalised from the Google Calendar API response. */
export type ClassEvent = {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    description: string;
    location: string;
    type: ClassType;
    kind: ClassKind;
};


/** A grid row that renders a specific hour label + events starting at that hour. */
type HourRow = { type: 'hour'; value: number };

/** A gride row that renders a compressed "gap" indicator between non-adjacent hours. */
type GapRow = { type: 'gap' };

/** Union of every possible row rendered in the calendar body grid. */
export type RowDef = HourRow | GapRow;
