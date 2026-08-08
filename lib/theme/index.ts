import { colors, getColorsForScheme, type ThemeColors } from './colors';
import { radii, spacing } from './spacing';
import { fontFamilies, getTypography, typography } from './typography';

export {
  colors,
  darkColors,
  getColorsForScheme,
  lightColors,
} from './colors';
export type { ColorToken, ThemeColors } from './colors';
export { radii, spacing } from './spacing';
export type { RadiusToken, SpacingToken } from './spacing';
export { fontFamilies, getTypography, typography } from './typography';
export type { TypographyVariant } from './typography';
export { w1Colors, w1Radii, w1Shadow, w1Spacing } from './w1';

export const theme = {
  colors,
  typography,
  fontFamilies,
  spacing,
  radii,
} as const;

export type Theme = typeof theme;

export function createTheme(scheme: 'light' | 'dark') {
  const palette: ThemeColors = getColorsForScheme(scheme);
  return {
    colorScheme: scheme,
    colors: palette,
    typography: getTypography(palette),
    fontFamilies,
    spacing,
    radii,
  } as const;
}
