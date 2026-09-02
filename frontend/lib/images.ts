/**
 * Rewrites a Google Drive "share" link into a direct-image URL that can be
 * used as an <img src>. Execs naturally paste the share link they get from
 * Drive's "Copy link" button, which renders an HTML page rather than an image.
 *
 * Handles the two common share shapes:
 *   https://drive.google.com/file/d/<id>/view?usp=sharing
 *   https://drive.google.com/open?id=<id>
 *
 * Any other URL (including a plain image host) is returned unchanged.
 *
 * Cells that aren't URLs at all are treated as empty. Execs often leave a note
 * to themselves in an image column ("needs a hosted image..."), which would
 * otherwise render as a broken image rather than the placeholder.
 *
 * @param url - The URL pasted into the spreadsheet.
 * @returns A URL safe to use directly as an image source, or '' if the cell
 *          doesn't hold one.
 */
export function toDirectImageUrl(url: string): string {
    if (!url) return '';

    const trimmed = url.trim();
    if (!/^(https?:\/\/|data:image\/)/i.test(trimmed)) return '';
    url = trimmed;

    const filePath = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
    if (filePath) return `https://drive.google.com/thumbnail?id=${filePath[1]}&sz=w1000`;

    const openQuery = url.match(/drive\.google\.com\/open\?id=([^&]+)/);
    if (openQuery) return `https://drive.google.com/thumbnail?id=${openQuery[1]}&sz=w1000`;

    return url;
}
