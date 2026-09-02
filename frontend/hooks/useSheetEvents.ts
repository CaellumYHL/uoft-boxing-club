'use client';

import { SHEET_RANGES } from '@/lib/site';
import { ClubEvent } from '@/types/content';
import { toDirectImageUrl } from '@/lib/images';
import { useSheetData, SheetState } from './useSheetData';

/** Shown when an event row has no image, cycling by row order for variety. */
const DEFAULT_EMOJI = ['🥊', '🏋️', '🤝', '🏆'];

/**
 * Turns an Events-tab row into a ClubEvent. A title is the only required
 * column; everything else degrades to a sensible blank.
 */
function mapEventRow(row: Record<string, string>, index: number): ClubEvent | null {
    const title = row['title'] || row['name'];
    if (!title) return null;

    return {
        id: row['id'] || `${title}-${index}`,
        title,
        when: row['when'] || row['date'] || '',
        location: row['location'] || '',
        description: row['description'] || '',
        image: toDirectImageUrl(row['image'] || ''),
        emoji: row['emoji'] || DEFAULT_EMOJI[index % DEFAULT_EMOJI.length],
        signupUrl: row['signupurl'] || row['signup'] || '',
    };
}

/**
 * Loads club events from the Events tab. There is deliberately no hardcoded
 * fallback: an empty Events tab should render the "no events" state rather
 * than resurrect last term's events.
 */
export function useSheetEvents(): SheetState<ClubEvent> {
    return useSheetData(SHEET_RANGES.events, mapEventRow);
}