import {
  colors,
  getColorsForScheme,
  type ThemeColors,
  type ThemeVariant,
} from './colors';
import { radii, spacing } from './spacing';
import { fontFamilies, getTypography, typography } from './typography';

export {
  colors,
  coachDarkColors,
  darkColors,
  getColorsForScheme,
  lightColors,
} from './colors';
export type { ColorToken, ThemeColors, ThemeVariant } from './colors';
export { radii, spacing } from './spacing';
export type { RadiusToken, SpacingToken } from './spacing';
export { fontFamilies, getTypography, typography } from './typography';
export type { TypographyVariant } from './typography';

export const theme = {
  colors,
  typography,
  fontFamilies,
  spacing,
  radii,
} as const;

export type Theme = typeof theme;

export function createTheme(
  scheme: 'light' | 'dark',
  variant: ThemeVariant = 'member',
) {
  const palette: ThemeColors = getColorsForScheme(scheme, variant);
  return {
    colorScheme: scheme,
    variant,
    colors: palette,
    typography: getTypography(palette),
    fontFamilies,
    spacing,
    radii,
  } as const;
}
