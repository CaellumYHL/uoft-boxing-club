'use client';

import { SHEET_RANGES } from '@/lib/site';
import { toDirectImageUrl } from '@/lib/images';
import { useSheetData, SheetState } from './useSheetData';

/** One person on the club's exec/coaching team. */
export type TeamMember = {
    name: string;
    role: string;
    bio: string;
    image: string;
};

/** Turns a Team-tab row into a TeamMember, skipping rows with neither name nor role. */
function mapTeamRow(row: Record<string, string>): TeamMember | null {
    const name = row['name'] || '';
    const role = row['role'] || '';
    if (!name && !role) return null;

    return {
        name,
        role,
        bio: row['bio'] || '',
        image: toDirectImageUrl(row['image'] || ''),
    };
}

/** Loads the team roster from the Team tab of the content spreadsheet. */
export function useSheetTeam(): SheetState<TeamMember> {
    return useSheetData(SHEET_RANGES.team, mapTeamRow);
}