import { colors, type ThemeColors } from './colors';

/** Platform-agnostic text style shape (RN TextStyle-compatible, web-safe). */
export type TextStyleLike = {
  fontFamily?: string;
  fontSize?: number;
  letterSpacing?: number;
  lineHeight?: number;
  color?: string;
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  fontWeight?: string | number;
};

/**
 * Type scale for My Gi — expressive display + clean UI body.
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
    } satisfies TextStyleLike,

    hero: {
      fontFamily: fontFamilies.display,
      fontSize: 32,
      letterSpacing: 0.5,
      color: palette.text,
    } satisfies TextStyleLike,

    title: {
      fontFamily: fontFamilies.bold,
      fontSize: 24,
      letterSpacing: 0.2,
      color: palette.text,
    } satisfies TextStyleLike,

    subtitle: {
      fontFamily: fontFamilies.semibold,
      fontSize: 18,
      color: palette.text,
    } satisfies TextStyleLike,

    body: {
      fontFamily: fontFamilies.regular,
      fontSize: 16,
      lineHeight: 24,
      color: palette.text,
    } satisfies TextStyleLike,

    bodyMuted: {
      fontFamily: fontFamilies.regular,
      fontSize: 16,
      lineHeight: 24,
      color: palette.secondaryText,
    } satisfies TextStyleLike,

    caption: {
      fontFamily: fontFamilies.medium,
      fontSize: 13,
      letterSpacing: 0.4,
      color: palette.secondaryText,
    } satisfies TextStyleLike,

    label: {
      fontFamily: fontFamilies.semibold,
      fontSize: 14,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      color: palette.secondaryText,
    } satisfies TextStyleLike,

    button: {
      fontFamily: fontFamilies.semibold,
      fontSize: 16,
      letterSpacing: 0.3,
      color: palette.primaryBackground,
    } satisfies TextStyleLike,
  } as const;
}

export const typography = buildTypography(colors);

export function getTypography(palette: ThemeColors) {
  return buildTypography(palette);
}

export type TypographyVariant = keyof typeof typography;
