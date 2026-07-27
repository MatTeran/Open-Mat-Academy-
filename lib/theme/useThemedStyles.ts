import { DependencyList, useMemo } from 'react';
import { StyleSheet } from 'react-native';

import type { ThemeColors } from '../theme/colors';
import { useAppTheme } from '../providers/ThemeProvider';

/**
 * Build StyleSheets from the active theme palette so light/dark updates apply.
 */
export function useThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (colors: ThemeColors) => T,
  deps: DependencyList = [],
): T {
  const { colors } = useAppTheme();
  return useMemo(
    () => StyleSheet.create(factory(colors)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [colors, ...deps],
  );
}
