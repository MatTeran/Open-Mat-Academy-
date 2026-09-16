import type { BadgeRarity } from '../../types/journey';

export type MedalMaterial = {
  rimOuter: string;
  rimMid: string;
  rimInner: string;
  rimHighlight: string;
  enamelTop: string;
  enamelMid: string;
  enamelDeep: string;
  accent: string;
  accentSoft: string;
  bevelLight: string;
  bevelDark: string;
  edgeGlow: string;
  lockedOverlay: string;
  /** Secondary metal used for mixed silver+gold rare treatments. */
  secondaryMetal: string;
  engraving: string;
};

/** My Gi material palette — physical medal language. */
export const materialPalette = {
  gunmetal: '#2C3036',
  gunmetalLight: '#5A616B',
  brushedSilver: '#C5CBD3',
  polishedSilver: '#E8ECF1',
  paleGold: '#E6D3A3',
  deepGold: '#A8841F',
  primaryGold: '#D4AF37',
  goldHighlight: '#F4D35E',
  polishedGold: '#FFE9A0',
  amberEnamel: '#C47A1A',
  crimsonEnamel: '#8B1E2D',
  ruby: '#9B1B2E',
  midnightBlue: '#0D1B2A',
  deepNavy: '#0A1628',
  obsidian: '#0A0A0C',
  nickel: '#8E959E',
  bronze: '#B08D57',
  bronzeDeep: '#7A5A2E',
  carbon: '#1A1C1F',
} as const;

export function materialForRarity(
  rarity: BadgeRarity,
  unlocked: boolean,
): MedalMaterial {
  if (!unlocked) {
    return {
      rimOuter: '#3A3F46',
      rimMid: materialPalette.gunmetal,
      rimInner: '#1C1F24',
      rimHighlight: '#7A828C',
      enamelTop: '#1A1C20',
      enamelMid: materialPalette.obsidian,
      enamelDeep: '#050506',
      accent: '#8A9199',
      accentSoft: 'rgba(138,145,153,0.35)',
      bevelLight: 'rgba(255,255,255,0.2)',
      bevelDark: 'rgba(0,0,0,0.55)',
      edgeGlow: 'rgba(90,97,107,0.28)',
      lockedOverlay: 'rgba(5,5,6,0.22)',
      secondaryMetal: '#6A727C',
      engraving: '#6E767F',
    };
  }

  switch (rarity) {
    case 'common':
      return {
        rimOuter: materialPalette.polishedSilver,
        rimMid: materialPalette.brushedSilver,
        rimInner: materialPalette.gunmetal,
        rimHighlight: '#FFFFFF',
        enamelTop: '#181818',
        enamelMid: materialPalette.obsidian,
        enamelDeep: '#050505',
        accent: materialPalette.brushedSilver,
        accentSoft: 'rgba(197,203,211,0.3)',
        bevelLight: 'rgba(255,255,255,0.38)',
        bevelDark: 'rgba(0,0,0,0.52)',
        edgeGlow: 'rgba(197,203,211,0.22)',
        lockedOverlay: 'transparent',
        secondaryMetal: materialPalette.nickel,
        engraving: materialPalette.nickel,
      };
    case 'rare':
      return {
        rimOuter: materialPalette.paleGold,
        rimMid: materialPalette.primaryGold,
        rimInner: materialPalette.deepGold,
        rimHighlight: '#FFF1C2',
        enamelTop: '#1C1410',
        enamelMid: '#120E0B',
        enamelDeep: '#070605',
        accent: materialPalette.amberEnamel,
        accentSoft: 'rgba(196,122,26,0.42)',
        bevelLight: 'rgba(255,241,194,0.42)',
        bevelDark: 'rgba(0,0,0,0.55)',
        edgeGlow: 'rgba(212,175,55,0.3)',
        lockedOverlay: 'transparent',
        secondaryMetal: materialPalette.brushedSilver,
        engraving: materialPalette.paleGold,
      };
    case 'epic':
      return {
        rimOuter: materialPalette.polishedGold,
        rimMid: materialPalette.primaryGold,
        rimInner: '#6E4E10',
        rimHighlight: '#FFF6D0',
        enamelTop: '#201810',
        enamelMid: '#100C08',
        enamelDeep: '#050403',
        accent: materialPalette.crimsonEnamel,
        accentSoft: 'rgba(139,30,45,0.48)',
        bevelLight: 'rgba(255,246,208,0.48)',
        bevelDark: 'rgba(0,0,0,0.6)',
        edgeGlow: 'rgba(244,211,94,0.36)',
        lockedOverlay: 'transparent',
        secondaryMetal: materialPalette.deepGold,
        engraving: materialPalette.goldHighlight,
      };
    case 'legendary':
      return {
        rimOuter: '#FFF3B0',
        rimMid: materialPalette.goldHighlight,
        rimInner: materialPalette.deepGold,
        rimHighlight: '#FFFFFF',
        enamelTop: '#2A2010',
        enamelMid: '#120E08',
        enamelDeep: '#050403',
        accent: materialPalette.ruby,
        accentSoft: 'rgba(155,27,46,0.45)',
        bevelLight: 'rgba(255,255,255,0.55)',
        bevelDark: 'rgba(0,0,0,0.62)',
        edgeGlow: 'rgba(244,211,94,0.48)',
        lockedOverlay: 'transparent',
        secondaryMetal: materialPalette.polishedGold,
        engraving: '#FFF6D0',
      };
    default:
      return materialForRarity('common', unlocked);
  }
}
