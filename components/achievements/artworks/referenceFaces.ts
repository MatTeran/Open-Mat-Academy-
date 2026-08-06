import type { ImageSourcePropType } from 'react-native';

/**
 * Photoreal art-direction reference faces for hero prototype medals.
 * These replace procedural SVG motifs so gallery / unlock UI matches
 * the approved championship-coin renders.
 */
export const MEDAL_REFERENCE_FACES: Record<string, ImageSourcePropType> = {
  'badge-first-class': require('../../../assets/achievements/medal-first-class.png'),
  'badge-100-classes': require('../../../assets/achievements/medal-century-club.png'),
  'badge-30-day-streak': require('../../../assets/achievements/medal-30-day-streak.png'),
  'badge-gold-medalist': require('../../../assets/achievements/medal-gold-medalist.png'),
};

export const REFERENCE_MEDAL_IDS = Object.keys(MEDAL_REFERENCE_FACES);

export function getMedalReferenceFace(badgeId: string): ImageSourcePropType | null {
  return MEDAL_REFERENCE_FACES[badgeId] ?? null;
}
