/**
 * Open Mat / My Gi brand color palettes.
 * Light = Version W.1 warm ivory + bronze. Dark remains athletic charcoal.
 */

export const darkColors = {
  primaryBackground: '#0C0B0A',
  secondaryBackground: '#161412',
  cardBackground: '#1A1816',
  elevatedSurface: '#221F1C',
  goldAccent: '#C4A06A',
  highlightGold: '#E2C48A',
  goldPressed: '#9A6735',
  text: '#F5F3EE',
  secondaryText: '#A39E96',
  error: '#FF4D4D',
  success: '#22C55E',
  warning: '#F59E0B',
  info: '#38BDF8',
  border: 'rgba(245, 243, 238, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.72)',
  goldMuted: 'rgba(196, 160, 106, 0.18)',
  goldTintSurface: '#241E16',
} as const;

/** Version W.1 — warm refined neutrals */
export const lightColors = {
  primaryBackground: '#F5F3EE',
  secondaryBackground: '#FAF9F6',
  cardBackground: '#FAF9F6',
  elevatedSurface: '#FFFFFF',
  goldAccent: '#9A6735',
  highlightGold: '#B8844A',
  goldPressed: '#7D5329',
  text: '#20201E',
  secondaryText: '#6F6C66',
  error: '#DC2626',
  success: '#16A34A',
  warning: '#D97706',
  info: '#0284C7',
  border: 'rgba(0, 0, 0, 0.06)',
  overlay: 'rgba(20, 18, 14, 0.4)',
  goldMuted: 'rgba(154, 103, 53, 0.12)',
  goldTintSurface: '#F0E8DC',
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
