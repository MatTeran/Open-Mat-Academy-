import type { BeltRank } from '../../../types/user';

export type BeltStripeCount = 0 | 1 | 2 | 3 | 4;

export interface BeltAppearance {
  /** Primary cloth fill. */
  beltColor: string;
  /** Secondary cloth shade for folds / weave depth. */
  beltShade: string;
  /** Highlight along the top edge of the cloth. */
  beltHighlight: string;
  /** Rank / degree bar fill. */
  rankBarColor: string;
  /** Promotion / degree tape color on the rank bar. */
  stripeColor: string;
  /** Soft outline when cloth is very light or very dark. */
  outlineColor: string;
}

/**
 * Traditional adult BJJ belt appearance.
 * Black belt uses a red rank bar; degrees can expand later without API changes.
 */
export const BELT_APPEARANCE: Record<BeltRank, BeltAppearance> = {
  white: {
    beltColor: '#F4F2EC',
    beltShade: '#D8D4CB',
    beltHighlight: 'rgba(255,255,255,0.85)',
    rankBarColor: '#161616',
    stripeColor: '#F7F7F5',
    outlineColor: 'rgba(0,0,0,0.12)',
  },
  blue: {
    beltColor: '#1B4F9C',
    beltShade: '#123A75',
    beltHighlight: 'rgba(255,255,255,0.28)',
    rankBarColor: '#121212',
    stripeColor: '#F7F7F5',
    outlineColor: 'rgba(0,0,0,0.18)',
  },
  purple: {
    beltColor: '#5C2D82',
    beltShade: '#421F5F',
    beltHighlight: 'rgba(255,255,255,0.26)',
    rankBarColor: '#121212',
    stripeColor: '#F7F7F5',
    outlineColor: 'rgba(0,0,0,0.18)',
  },
  brown: {
    beltColor: '#6E4023',
    beltShade: '#4E2C16',
    beltHighlight: 'rgba(255,255,255,0.22)',
    rankBarColor: '#121212',
    stripeColor: '#F7F7F5',
    outlineColor: 'rgba(0,0,0,0.2)',
  },
  black: {
    beltColor: '#141414',
    beltShade: '#050505',
    beltHighlight: 'rgba(255,255,255,0.16)',
    rankBarColor: '#B42318',
    stripeColor: '#F7F7F5',
    outlineColor: 'rgba(255,255,255,0.22)',
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
