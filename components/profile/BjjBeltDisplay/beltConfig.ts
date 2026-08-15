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
 * Black belt uses a red rank bar; others use a black rank bar + white stripes.
 */
export const BELT_APPEARANCE: Record<BeltRank, BeltAppearance> = {
  white: {
    beltColor: '#F1EFE8',
    beltShade: '#CCC9C0',
    beltHighlight: '#FFFFFF',
    rankBarColor: '#111111',
    stripeColor: '#F7F7F5',
    outlineColor: 'rgba(0,0,0,0.14)',
  },
  blue: {
    beltColor: '#1857A4',
    beltShade: '#103C73',
    beltHighlight: '#2E73C7',
    rankBarColor: '#111111',
    stripeColor: '#F7F7F5',
    outlineColor: 'rgba(0,0,0,0.2)',
  },
  purple: {
    beltColor: '#60378C',
    beltShade: '#42245F',
    beltHighlight: '#7751A3',
    rankBarColor: '#111111',
    stripeColor: '#F7F7F5',
    outlineColor: 'rgba(0,0,0,0.2)',
  },
  brown: {
    beltColor: '#704021',
    beltShade: '#4D2B17',
    beltHighlight: '#8B5834',
    rankBarColor: '#111111',
    stripeColor: '#F7F7F5',
    outlineColor: 'rgba(0,0,0,0.22)',
  },
  black: {
    beltColor: '#151515',
    beltShade: '#050505',
    beltHighlight: '#333333',
    rankBarColor: '#A82020',
    stripeColor: '#F7F7F5',
    outlineColor: 'rgba(255,255,255,0.2)',
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
