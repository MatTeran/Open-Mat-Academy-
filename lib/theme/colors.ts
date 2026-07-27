/**
 * Open Mat brand color palettes.
 * Premium athletic aesthetic — teal accents stay consistent across modes.
 */

export const darkColors = {
  primaryBackground: '#0B1220',
  secondaryBackground: '#132337',
  cardBackground: '#101C2E',
  elevatedSurface: '#1A2A3F',
  goldAccent: '#2DD4BF',
  highlightGold: '#5EEAD4',
  goldPressed: '#14B8A6',
  text: '#FFFFFF',
  secondaryText: '#B8B8B8',
  error: '#FF4D4D',
  success: '#22C55E',
  warning: '#F59E0B',
  info: '#38BDF8',
  border: '#243447',
  overlay: 'rgba(11, 18, 32, 0.72)',
  goldMuted: 'rgba(45, 212, 191, 0.16)',
  goldTintSurface: '#0F2A28',
} as const;

export const lightColors = {
  primaryBackground: '#F5F5F3',
  secondaryBackground: '#FFFFFF',
  cardBackground: '#FFFFFF',
  elevatedSurface: '#FFFFFF',
  goldAccent: '#0D9488',
  highlightGold: '#2DD4BF',
  goldPressed: '#0F766E',
  text: '#0B1220',
  secondaryText: '#6B6B6B',
  error: '#DC2626',
  success: '#16A34A',
  warning: '#D97706',
  info: '#0284C7',
  border: '#E4E4E0',
  overlay: 'rgba(245, 245, 243, 0.82)',
  goldMuted: 'rgba(13, 148, 136, 0.14)',
  goldTintSurface: '#D5F5F0',
} as const;

/** Default export remains the dark palette for static fallbacks. */
export const colors = darkColors;

export type ThemeColors = {
  -readonly [K in keyof typeof darkColors]: string;
};

export type ColorToken = keyof typeof darkColors;

export function getColorsForScheme(scheme: 'light' | 'dark'): ThemeColors {
  return scheme === 'light' ? { ...lightColors } : { ...darkColors };
}
