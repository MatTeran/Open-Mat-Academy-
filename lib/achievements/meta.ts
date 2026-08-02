import type { BadgeCategory, BadgeRarity } from '../../types/journey';

export type MedalShape =
  | 'circle'
  | 'hexagon'
  | 'shield'
  | 'medal'
  | 'crest'
  | 'coin';

export const BADGE_CATEGORY_ORDER: BadgeCategory[] = [
  'attendance',
  'streak',
  'challenge',
  'competition',
  'community',
  'special',
];

export function categoryLabel(category: BadgeCategory): string {
  switch (category) {
    case 'attendance':
      return 'Attendance';
    case 'streak':
      return 'Streaks';
    case 'challenge':
      return 'Challenges';
    case 'competition':
      return 'Competition';
    case 'community':
      return 'Community';
    case 'special':
      return 'Special Events';
    default:
      return category;
  }
}

export function categoryShape(category: BadgeCategory): MedalShape {
  switch (category) {
    case 'attendance':
      return 'circle';
    case 'streak':
      return 'hexagon';
    case 'challenge':
      return 'shield';
    case 'competition':
      return 'medal';
    case 'community':
      return 'crest';
    case 'special':
      return 'coin';
    default:
      return 'circle';
  }
}

export function rarityLabel(rarity: BadgeRarity): string {
  switch (rarity) {
    case 'common':
      return 'Common';
    case 'rare':
      return 'Rare';
    case 'epic':
      return 'Epic';
    case 'legendary':
      return 'Legendary';
    default:
      return rarity;
  }
}

/** Motif key for embossed center artwork. */
export type MedalMotif =
  | 'sunrise'
  | 'flame'
  | 'shield'
  | 'trophy'
  | 'people'
  | 'star'
  | 'calendar'
  | 'moon'
  | 'bolt'
  | 'laurel'
  | 'mat'
  | 'crown';

export function motifForBadge(icon: string, category: BadgeCategory): MedalMotif {
  if (icon.includes('sunny') || icon.includes('sunrise')) return 'sunrise';
  if (icon.includes('flame') || icon.includes('fire')) return 'flame';
  if (icon.includes('trophy') || icon.includes('medal')) return 'trophy';
  if (icon.includes('moon')) return 'moon';
  if (icon.includes('people') || icon.includes('community')) return 'people';
  if (icon.includes('shield')) return 'shield';
  if (icon.includes('star') || icon.includes('ribbon') || icon.includes('diamond'))
    return 'star';
  if (icon.includes('fitness') || icon.includes('calendar')) return 'calendar';
  if (icon.includes('bulb') || icon.includes('flash')) return 'bolt';
  if (icon.includes('crown')) return 'crown';
  if (category === 'competition') return 'laurel';
  if (category === 'community') return 'people';
  if (category === 'streak') return 'flame';
  if (category === 'special') return 'star';
  return 'mat';
}
