import { theme } from '../lib/theme';
import { useAppTheme } from '../lib/providers/ThemeProvider';

/**
 * Access Open Mat design tokens from ThemeProvider.
 */
export function useTheme() {
  return useAppTheme().theme;
}

export { useAppTheme } from '../lib/providers/ThemeProvider';
export type { AppearancePreference } from '../lib/providers/ThemeProvider';
