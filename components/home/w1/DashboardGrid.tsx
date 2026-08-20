import { ReactNode } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { w1Spacing } from '../../../lib/theme';

interface DashboardGridProps {
  left: ReactNode;
  right: ReactNode;
}

/**
 * Primary dashboard row: ~55% Next Class / ~45% Journey.
 * Stacks on compact phones (<390) so CTAs stay readable.
 */
export function DashboardGrid({ left, right }: DashboardGridProps) {
  const { width } = useWindowDimensions();
  const stacked = width < 390;

  return (
    <View style={[styles.row, stacked && styles.stack]}>
      <View
        style={[
          styles.col,
          stacked ? styles.colStacked : styles.colPrimary,
        ]}
      >
        {left}
      </View>
      <View
        style={[
          styles.col,
          stacked ? styles.colStacked : styles.colSecondary,
        ]}
      >
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: w1Spacing.cardGap,
    paddingHorizontal: w1Spacing.screenX,
  },
  stack: {
    flexDirection: 'column',
  },
  col: {
    minWidth: 0,
  },
  colPrimary: {
    flex: 55,
  },
  colSecondary: {
    flex: 45,
  },
  colStacked: {
    width: '100%',
    flex: undefined,
  },
});
