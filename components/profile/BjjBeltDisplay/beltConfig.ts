import type { BeltRank } from '../../../types/user';
import type { ImageSourcePropType } from 'react-native';

export type BeltStripeCount = 0 | 1 | 2 | 3 | 4;

export interface BeltAppearance {
  beltColor: string;
  beltShade: string;
  beltHighlight: string;
  beltMid: string;
  beltDeep: string;
  rankBarColor: string;
  rankBarHighlight: string;
  stripeColor: string;
  outlineColor: string;
}

/**
 * Photorealistic tied-belt product photos.
 * Default ranks (2 stripes) use clean AI studio photos; other counts use
 * tip-clipped tape on the same clean bases — no rembg / shadow killing.
 */
const BELT_IMAGES: Record<BeltRank, ImageSourcePropType[]> = {
  white: [
    require('../../../assets/belts/white-0.png'),
    require('../../../assets/belts/white-1.png'),
    require('../../../assets/belts/white-2.png'),
    require('../../../assets/belts/white-3.png'),
    require('../../../assets/belts/white-4.png'),
  ],
  blue: [
    require('../../../assets/belts/blue-0.png'),
    require('../../../assets/belts/blue-1.png'),
    require('../../../assets/belts/blue-2.png'),
    require('../../../assets/belts/blue-3.png'),
    require('../../../assets/belts/blue-4.png'),
  ],
  purple: [
    require('../../../assets/belts/purple-0.png'),
    require('../../../assets/belts/purple-1.png'),
    require('../../../assets/belts/purple-2.png'),
    require('../../../assets/belts/purple-3.png'),
    require('../../../assets/belts/purple-4.png'),
  ],
  brown: [
    require('../../../assets/belts/brown-0.png'),
    require('../../../assets/belts/brown-1.png'),
    require('../../../assets/belts/brown-2.png'),
    require('../../../assets/belts/brown-3.png'),
    require('../../../assets/belts/brown-4.png'),
  ],
  black: [
    require('../../../assets/belts/black-0.png'),
    require('../../../assets/belts/black-1.png'),
    require('../../../assets/belts/black-2.png'),
    require('../../../assets/belts/black-3.png'),
    require('../../../assets/belts/black-4.png'),
  ],
};

export const BELT_APPEARANCE: Record<BeltRank, BeltAppearance> = {
  white: {
    beltColor: '#EDEAE2',
    beltShade: '#C4C0B6',
    beltHighlight: '#FFFFFF',
    beltMid: '#F7F5F0',
    beltDeep: '#A8A49A',
    rankBarColor: '#141414',
    rankBarHighlight: '#2A2A2A',
    stripeColor: '#F8F7F4',
    outlineColor: 'rgba(40,36,30,0.16)',
  },
  blue: {
    beltColor: '#1A5CB0',
    beltShade: '#0E3A74',
    beltHighlight: '#4A8AD9',
    beltMid: '#2469C2',
    beltDeep: '#08264F',
    rankBarColor: '#121212',
    rankBarHighlight: '#2A2A2A',
    stripeColor: '#F8F7F4',
    outlineColor: 'rgba(0,0,0,0.22)',
  },
  purple: {
    beltColor: '#663A92',
    beltShade: '#3F245C',
    beltHighlight: '#8A5BB8',
    beltMid: '#7447A3',
    beltDeep: '#2A1740',
    rankBarColor: '#121212',
    rankBarHighlight: '#2A2A2A',
    stripeColor: '#F8F7F4',
    outlineColor: 'rgba(0,0,0,0.22)',
  },
  brown: {
    beltColor: '#7A4725',
    beltShade: '#4A2A14',
    beltHighlight: '#A0663A',
    beltMid: '#8A5530',
    beltDeep: '#301C0C',
    rankBarColor: '#121212',
    rankBarHighlight: '#2A2A2A',
    stripeColor: '#F8F7F4',
    outlineColor: 'rgba(0,0,0,0.24)',
  },
  black: {
    beltColor: '#1A1A1A',
    beltShade: '#050505',
    beltHighlight: '#3F3F3F',
    beltMid: '#262626',
    beltDeep: '#000000',
    rankBarColor: '#B01E1E',
    rankBarHighlight: '#D64545',
    stripeColor: '#F8F7F4',
    outlineColor: 'rgba(255,255,255,0.18)',
  },
};

export function getBeltAppearance(belt: BeltRank): BeltAppearance {
  return BELT_APPEARANCE[belt];
}

export function getBeltImage(
  belt: BeltRank,
  stripes: BeltStripeCount,
): ImageSourcePropType {
  const safe = Math.max(0, Math.min(4, stripes)) as BeltStripeCount;
  return BELT_IMAGES[belt][safe];
}

/** Profile rank title, e.g. "BLUE BELT · 2 STRIPES". */
export function formatBeltRankTitle(
  belt: BeltRank,
  stripes: BeltStripeCount,
): string {
  const name = `${belt.toUpperCase()} BELT`;
  if (stripes <= 0) {
    return name;
  }
  const stripeWord = stripes === 1 ? 'STRIPE' : 'STRIPES';
  return `${name} · ${stripes} ${stripeWord}`;
}
