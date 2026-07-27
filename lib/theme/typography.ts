import { TextStyle } from 'react-native';

import { colors, type ThemeColors } from './colors';

/**
 * Type scale for Open Mat — expressive display + clean UI body.
 * Fonts: Syne (brand/display), Outfit (UI).
 */
export const fontFamilies = {
  display: 'Syne_700Bold',
  regular: 'Outfit_400Regular',
  medium: 'Outfit_500Medium',
  semibold: 'Outfit_600SemiBold',
  bold: 'Outfit_700Bold',
} as const;

function buildTypography(palette: ThemeColors) {
  return {
    brand: {
      fontFamily: fontFamilies.display,
      fontSize: 40,
      letterSpacing: 2,
      color: palette.text,
    } satisfies TextStyle,

    hero: {
      fontFamily: fontFamilies.display,
      fontSize: 32,
      letterSpacing: 0.5,
      color: palette.text,
    } satisfies TextStyle,

    title: {
      fontFamily: fontFamilies.bold,
      fontSize: 24,
      letterSpacing: 0.2,
      color: palette.text,
    } satisfies TextStyle,

    subtitle: {
      fontFamily: fontFamilies.semibold,
      fontSize: 18,
      color: palette.text,
    } satisfies TextStyle,

    body: {
      fontFamily: fontFamilies.regular,
      fontSize: 16,
      lineHeight: 24,
      color: palette.text,
    } satisfies TextStyle,

    bodyMuted: {
      fontFamily: fontFamilies.regular,
      fontSize: 16,
      lineHeight: 24,
      color: palette.secondaryText,
    } satisfies TextStyle,

    caption: {
      fontFamily: fontFamilies.medium,
      fontSize: 13,
      letterSpacing: 0.4,
      color: palette.secondaryText,
    } satisfies TextStyle,

    label: {
      fontFamily: fontFamilies.semibold,
      fontSize: 14,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      color: palette.secondaryText,
    } satisfies TextStyle,

    button: {
      fontFamily: fontFamilies.semibold,
      fontSize: 16,
      letterSpacing: 0.3,
      color: palette.primaryBackground,
    } satisfies TextStyle,
  } as const;
}

export const typography = buildTypography(colors);

export function getTypography(palette: ThemeColors) {
  return buildTypography(palette);
}

export type TypographyVariant = keyof typeof typography;
