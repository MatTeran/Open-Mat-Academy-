import type { ImageSourcePropType } from 'react-native';

/**
 * Photoreal metallic art-direction faces for every gallery medal.
 * These replace procedural SVG motifs so the Achievement Gallery matches
 * the approved championship-coin renders (knurled rims, embossed motifs,
 * riveted plaques, studio lighting).
 */
export const MEDAL_REFERENCE_FACES: Record<string, ImageSourcePropType> = {
  'badge-first-class': require('../../../assets/achievements/medal-first-class.png'),
  'badge-early-bird': require('../../../assets/achievements/medal-early-bird.png'),
  'badge-night-owl': require('../../../assets/achievements/medal-night-owl.png'),
  'badge-100-classes': require('../../../assets/achievements/medal-century-club.png'),
  'badge-open-mat-warrior': require('../../../assets/achievements/medal-open-mat-warrior.png'),
  'badge-7-day-streak': require('../../../assets/achievements/medal-week-on-fire.png'),
  'badge-30-day-streak': require('../../../assets/achievements/medal-30-day-streak.png'),
  'badge-iron-will': require('../../../assets/achievements/medal-iron-will.png'),
  'badge-competition-ready': require('../../../assets/achievements/medal-competition-ready.png'),
  'badge-technique-scholar': require('../../../assets/achievements/medal-technique-scholar.png'),
  'badge-challenge-champion': require('../../../assets/achievements/medal-challenge-champion.png'),
  'badge-first-match': require('../../../assets/achievements/medal-first-match.png'),
  'badge-gold-medalist': require('../../../assets/achievements/medal-gold-medalist.png'),
  'badge-mat-family': require('../../../assets/achievements/medal-mat-family.png'),
  'badge-training-partner': require('../../../assets/achievements/medal-training-partner.png'),
  'badge-seminar-seeker': require('../../../assets/achievements/medal-seminar-seeker.png'),
  'badge-founders-crest': require('../../../assets/achievements/medal-founders-crest.png'),
};

export const REFERENCE_MEDAL_IDS = Object.keys(MEDAL_REFERENCE_FACES);

export function getMedalReferenceFace(badgeId: string): ImageSourcePropType | null {
  return MEDAL_REFERENCE_FACES[badgeId] ?? null;
}
