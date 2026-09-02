/**
 * Central place for every externally-configurable value the site depends on.
 *
 * Everything here is read from `NEXT_PUBLIC_*` build-time env vars (set as
 * GitHub Actions *repository variables* - see docs/EXEC_GUIDE.md). Each value
 * has a safe fallback so the site always renders, even before the club has
 * finished wiring up their Google account.
 */

/** basePath for raw browser APIs / <img> tags that don't auto-prepend like <Link> does. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** Google Sheets API key + spreadsheet holding all editable site content. */
export const SHEETS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY || '';
export const SHEETS_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || '';

/**
 * A1 ranges for each tab of the content spreadsheet. The team range keeps its
 * historical env var name for backwards compatibility with the existing
 * repository variable.
 */
export const SHEET_RANGES = {
    team: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_RANGE || 'Team!A:D',
    events: process.env.NEXT_PUBLIC_SHEETS_RANGE_EVENTS || 'Events!A:G',
    products: process.env.NEXT_PUBLIC_SHEETS_RANGE_PRODUCTS || 'Products!A:G',
    config: process.env.NEXT_PUBLIC_SHEETS_RANGE_CONFIG || 'Config!A:B',
} as const;

/**
 * Google Apps Script web-app URL that receives checkout submissions and
 * appends them to the Orders tab. Empty until the club deploys the script.
 */
export const ORDERS_WEBHOOK_URL = process.env.NEXT_PUBLIC_ORDERS_WEBHOOK_URL || '';

/**
 * Fallback values for everything the execs can override from the Config tab
 * of the spreadsheet. Keys here are exactly the keys they type in column A.
 */
export const CONFIG_DEFAULTS = {
    logoUrl: '',
    clubName: 'UofT Boxing Club',
    contactEmail: 'uoftboxingclub@gmail.com',
    instagramUrl: 'https://www.instagram.com/uoftboxingclub/',
    locationName: 'St. Michaels College Wellness Studio',
    locationAddress: '81 Mary Street',
    classSignupUrl: '',
    freeClassLabel: 'Free Classes',
    paidClassLabel: 'Paid Classes',
    waiverUrl: '',
    eventSignupUrl: '',
} as const;

/** The set of values the site reads from the Config tab. */
export type SiteConfig = Record<keyof typeof CONFIG_DEFAULTS, string>;
