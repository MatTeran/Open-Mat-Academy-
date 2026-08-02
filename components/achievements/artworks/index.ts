import type { ComponentType } from 'react';

import { CenturyClubArt } from './CenturyClubArt';
import { FirstClassArt } from './FirstClassArt';
import { GoldMedalistArt } from './GoldMedalistArt';
import { Streak30Art } from './Streak30Art';
import type { MedalArtProps } from './types';

export type { MedalArtProps } from './types';

/**
 * Production prototypes awaiting approval.
 * Remaining badges keep the dimensional shell + interim embossed seal
 * until this set is signed off.
 */
export const PRODUCTION_PROTOTYPE_IDS = [
  'badge-first-class',
  'badge-100-classes',
  'badge-30-day-streak',
  'badge-gold-medalist',
] as const;

export type ProductionPrototypeId = (typeof PRODUCTION_PROTOTYPE_IDS)[number];

/** Unique collectible artwork — prototypes only until approved. */
export const MEDAL_ARTWORK: Record<string, ComponentType<MedalArtProps>> = {
  'badge-first-class': FirstClassArt,
  'badge-100-classes': CenturyClubArt,
  'badge-30-day-streak': Streak30Art,
  'badge-gold-medalist': GoldMedalistArt,
};

export function getMedalArtwork(badgeId: string): ComponentType<MedalArtProps> | null {
  return MEDAL_ARTWORK[badgeId] ?? null;
}

export function isProductionPrototype(badgeId: string): boolean {
  return badgeId in MEDAL_ARTWORK;
}
