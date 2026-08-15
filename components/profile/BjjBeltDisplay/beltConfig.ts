import type { BeltRank } from '../../../types/user';

export type BeltStripeCount = 0 | 1 | 2 | 3 | 4;

export interface BeltAppearance {
  /** Mid cloth fill. */
  beltColor: string;
  /** Deep fold / underside shade. */
  beltShade: string;
  /** Raised-edge highlight. */
  beltHighlight: string;
  /** Soft mid-tone for cylindrical roll. */
  beltMid: string;
  /** Contact / crease shadow. */
  beltDeep: string;
  /** Rank / degree bar fill. */
  rankBarColor: string;
  /** Rank bar rim highlight. */
  rankBarHighlight: string;
  /** Promotion / degree tape color on the rank bar. */
  stripeColor: string;
  /** Soft outline when cloth is very light or very dark. */
  outlineColor: string;
}

/**
 * Traditional adult BJJ belt appearance — tuned for 3D fabric shading.
 * Black belt uses a red rank bar; others use a black rank bar + white stripes.
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
