/**
 * Open Mat brand color palettes.
 * Premium athletic aesthetic — white accents stay consistent across modes.
 */

export const darkColors = {
  primaryBackground: '#000000',
  secondaryBackground: '#111111',
  cardBackground: '#141414',
  elevatedSurface: '#1C1C1C',
  goldAccent: '#FFFFFF',
  highlightGold: '#F5F5F5',
  goldPressed: '#D4D4D4',
  text: '#FFFFFF',
  secondaryText: '#B8B8B8',
  error: '#FF4D4D',
  success: '#22C55E',
  warning: '#F59E0B',
  info: '#38BDF8',
  border: '#2A2A2A',
  overlay: 'rgba(0, 0, 0, 0.72)',
  goldMuted: 'rgba(255, 255, 255, 0.14)',
  goldTintSurface: '#1A1A1A',
} as const;

export const lightColors = {
  primaryBackground: '#F5F5F3',
  secondaryBackground: '#FFFFFF',
  cardBackground: '#FFFFFF',
  elevatedSurface: '#FFFFFF',
  goldAccent: '#111111',
  highlightGold: '#FFFFFF',
  goldPressed: '#000000',
  text: '#000000',
  secondaryText: '#6B6B6B',
  error: '#DC2626',
  success: '#16A34A',
  warning: '#D97706',
  info: '#0284C7',
  border: '#E4E4E0',
  overlay: 'rgba(245, 245, 243, 0.82)',
  goldMuted: 'rgba(0, 0, 0, 0.08)',
  goldTintSurface: '#F0F0F0',
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
