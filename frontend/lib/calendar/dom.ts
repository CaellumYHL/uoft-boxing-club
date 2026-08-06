/** 
 * Strips HTML tags from a string (e.g. Google Calendar descriptions that
 * contain <br>, <a>, etc.), returning plain text safe to render directly.
 * No-ops during SSR (returns input unchanged) since it relies on `document`.
 * 
 * @param html - Raw HTML string from the calendar API.
 * @returns Plain-text content with tags removed.
 */
export function stripHtml(html: string): string {
    if (typeof document === 'undefined') return html;
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}