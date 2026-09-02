import { ORDERS_WEBHOOK_URL } from './site';
import { CartItem } from '@/context/CartContext';

/** Customer-supplied details collected at checkout. */
export type CustomerDetails = {
    name: string;
    email: string;
    studentNumber: string;
    notes: string;
};

/** The payload appended as one row per line item on the Orders tab. */
export type OrderSubmission = {
    orderId: string;
    placedAt: string;
    customer: CustomerDetails;
    items: CartItem[];
    total: number;
};

/** True once the club has deployed their Apps Script and set the env var. */
export function isCheckoutConfigured(): boolean {
    return Boolean(ORDERS_WEBHOOK_URL);
}

/**
 * Builds a short human-friendly order reference, e.g. "UTB-7F3K2Q".
 * Random rather than sequential because a static site has no counter to read.
 */
export function generateOrderId(): string {
    const random = Math.random().toString(36).toUpperCase().slice(2, 8);
    return `UTB-${random}`;
}

/**
 * Sends a completed order to the club's Google Apps Script web app, which
 * appends it to the Orders tab of the content spreadsheet and emails the
 * execs.
 *
 * The request uses `no-cors` with a form-encoded body: Apps Script web apps
 * don't return CORS headers for cross-origin JSON, so the browser would block
 * a normal fetch. The trade-off is that the response is opaque - we can tell
 * the request was sent, but not what the script replied - so the script is
 * responsible for emailing a confirmation.
 *
 * @param order - The order to record.
 * @throws When the request itself fails (offline, bad URL).
 */
export async function submitOrder(order: OrderSubmission): Promise<void> {
    if (!isCheckoutConfigured()) {
        throw new Error('Checkout is not configured.');
    }

    const body = new URLSearchParams({ payload: JSON.stringify(order) });

    await fetch(ORDERS_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
    });
}
