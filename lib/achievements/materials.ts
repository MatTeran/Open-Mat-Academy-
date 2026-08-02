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
};

/** Material tokens — rarity changes the whole metal/enamel treatment. */
export const materialPalette = {
  gunmetal: '#2C3036',
  gunmetalLight: '#5A616B',
  brushedSilver: '#C5CBD3',
  paleGold: '#E6D3A3',
  deepGold: '#A8841F',
  primaryGold: '#D4AF37',
  goldHighlight: '#F4D35E',
  amberEnamel: '#C47A1A',
  crimsonEnamel: '#8B1E2D',
  midnightBlue: '#0D1B2A',
  obsidian: '#0A0A0C',
  nickel: '#8E959E',
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
      rimHighlight: '#6A727C',
      enamelTop: '#1A1C20',
      enamelMid: materialPalette.obsidian,
      enamelDeep: '#050506',
      accent: '#7A8088',
      accentSoft: 'rgba(122,128,136,0.35)',
      bevelLight: 'rgba(255,255,255,0.18)',
      bevelDark: 'rgba(0,0,0,0.55)',
      edgeGlow: 'rgba(90,97,107,0.25)',
      lockedOverlay: 'rgba(5,5,6,0.28)',
    };
  }

  switch (rarity) {
    case 'common':
      return {
        rimOuter: materialPalette.brushedSilver,
        rimMid: materialPalette.nickel,
        rimInner: materialPalette.gunmetal,
        rimHighlight: '#F0F2F5',
        enamelTop: '#1A1A1A',
        enamelMid: materialPalette.obsidian,
        enamelDeep: '#050505',
        accent: materialPalette.brushedSilver,
        accentSoft: 'rgba(197,203,211,0.28)',
        bevelLight: 'rgba(255,255,255,0.32)',
        bevelDark: 'rgba(0,0,0,0.5)',
        edgeGlow: 'rgba(197,203,211,0.18)',
        lockedOverlay: 'transparent',
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
        accentSoft: 'rgba(196,122,26,0.4)',
        bevelLight: 'rgba(255,241,194,0.4)',
        bevelDark: 'rgba(0,0,0,0.55)',
        edgeGlow: 'rgba(212,175,55,0.28)',
        lockedOverlay: 'transparent',
      };
    case 'epic':
      return {
        rimOuter: materialPalette.goldHighlight,
        rimMid: materialPalette.primaryGold,
        rimInner: '#6E4E10',
        rimHighlight: '#FFF6D0',
        enamelTop: '#201810',
        enamelMid: '#100C08',
        enamelDeep: '#050403',
        accent: materialPalette.crimsonEnamel,
        accentSoft: 'rgba(139,30,45,0.45)',
        bevelLight: 'rgba(255,246,208,0.45)',
        bevelDark: 'rgba(0,0,0,0.6)',
        edgeGlow: 'rgba(244,211,94,0.32)',
        lockedOverlay: 'transparent',
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
        accent: materialPalette.goldHighlight,
        accentSoft: 'rgba(244,211,94,0.5)',
        bevelLight: 'rgba(255,255,255,0.5)',
        bevelDark: 'rgba(0,0,0,0.62)',
        edgeGlow: 'rgba(244,211,94,0.42)',
        lockedOverlay: 'transparent',
      };
    default:
      return materialForRarity('common', unlocked);
  }
}
