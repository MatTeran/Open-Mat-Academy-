import type { BeltRank } from '../../../types/user';
import type { ImageSourcePropType } from 'react-native';

export type BeltStripeCount = 0 | 1 | 2 | 3 | 4;

export interface BeltAppearance {
  /** Mid cloth fill (legacy / fallback). */
  beltColor: string;
  beltShade: string;
  beltHighlight: string;
  beltMid: string;
  beltDeep: string;
  rankBarColor: string;
  rankBarHighlight: string;
  stripeColor: string;
  outlineColor: string;
  /** Photorealistic tied-belt product image. */
  image: ImageSourcePropType;
  /**
   * Stripe overlay placement on the rank tip (percent of display box).
   * Tuned per asset so stripes sit on the black/red tip.
   */
  stripeOverlay: {
    /** Distance from right edge as % of width. */
    rightPct: number;
    /** Distance from top as % of height. */
    topPct: number;
    /** Overlay box width as % of width. */
    widthPct: number;
    /** Overlay box height as % of height. */
    heightPct: number;
    /** Rotation in degrees (matches tip angle). */
    rotateDeg: number;
  };
}

/**
 * Adult BJJ belt appearance — photorealistic image + stripe overlay geometry.
 * Black belt uses a red rank tip; others use a black tip + white stripes.
 */
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
    image: require('../../../assets/belts/white.png'),
    stripeOverlay: {
      rightPct: 7,
      topPct: 38,
      widthPct: 9.5,
      heightPct: 30,
      rotateDeg: 18,
    },
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
    image: require('../../../assets/belts/blue.png'),
    stripeOverlay: {
      rightPct: 6.5,
      topPct: 36,
      widthPct: 10,
      heightPct: 32,
      rotateDeg: 16,
    },
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
    image: require('../../../assets/belts/purple.png'),
    stripeOverlay: {
      rightPct: 8,
      topPct: 34,
      widthPct: 9.5,
      heightPct: 34,
      rotateDeg: 20,
    },
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
    image: require('../../../assets/belts/brown.png'),
    stripeOverlay: {
      rightPct: 7.5,
      topPct: 36,
      widthPct: 10,
      heightPct: 32,
      rotateDeg: 14,
    },
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
    image: require('../../../assets/belts/black.png'),
    stripeOverlay: {
      rightPct: 7,
      topPct: 38,
      widthPct: 10,
      heightPct: 30,
      rotateDeg: 12,
    },
  },
};

export function getBeltAppearance(belt: BeltRank): BeltAppearance {
  return BELT_APPEARANCE[belt];
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
