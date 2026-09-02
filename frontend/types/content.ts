/** A store item, whether loaded from the spreadsheet or the bundled fallback. */
export type StoreProduct = {
    id: string;
    name: string;
    price: number;
    description: string;
    image?: string;
    /** Comma-separated sizes from the sheet, already split. Empty = no size picker. */
    sizes: string[];
    /** 'membership' items are grouped separately from 'merch' on the store page. */
    category: 'membership' | 'merch';
};

/** A club event shown on the Events section of the home page. */
export type ClubEvent = {
    id: string;
    title: string;
    /** Free-text date/time as typed by the execs, e.g. "Sept 20 (6 PM to 8 PM)". */
    when: string;
    location: string;
    description: string;
    image?: string;
    /** Emoji shown when no image is supplied. */
    emoji: string;
    /** Per-event override; falls back to the site-wide event signup URL. */
    signupUrl: string;
};
