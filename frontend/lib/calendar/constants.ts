import { ClassKind, ClassType } from "@/types/calendar";

/** 
 * Minimum pixel height for a single hour row before the grid starts scrolling
 *  instead of shrinking further.
 */
export const MIN_HOUR_PX = 48;

/** 
 * Maximum pixel height for a single hour row before extra vertical sapce is
 * spent padding in additional (empty) hours, rather than growing existing rows.
 */
export const MAX_HOUR_PX = 64;

/** IANA timezone all class times are displayed and bucketed in, regardless of viewer's local timezone. */
export const SCHEDULE_TIMEZONE = 'America/Toronto';

/**
 * The app's primary accent color, used for highlighted/active UI states
 * (e.g. the active nav button). Not tied to event semantics — it just
 * happens to currently match EVENT_COLORS.free.
 */
export const ACCENT_COLOR = '#C92C2C';

/**
 * Background colours for event cards and legend swatches, keyed by 
 * ClassEvent type. Also reused for the active-nav-button highlight.
 */
export const EVENT_COLORS: Readonly<Record<ClassType, string>> = {
    free: ACCENT_COLOR,
    paid: '#3B82F6',
};

/**
 * Background colours distinguishing a recurring class from a one-off club
 * event. Used by the home-page "Upcoming" strip and its key, which colour-code
 * by kind rather than by free/paid.
 */
export const KIND_COLORS: Readonly<Record<ClassKind, string>> = {
    class: ACCENT_COLOR,
    // A third hue, distinct from both the red classes and the blue paid
    // sessions, so events are unmistakable at a glance.
    event: '#7C5CD6',
};