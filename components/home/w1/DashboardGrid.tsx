import { ReactNode } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { w1Spacing } from '../../../lib/theme';

interface DashboardGridProps {
  left: ReactNode;
  right: ReactNode;
}

/**
 * Side-by-side dashboard cards — equal height stretch.
 * Stacks on compact phones (<390).
 */
export function DashboardGrid({ left, right }: DashboardGridProps) {
  const { width } = useWindowDimensions();
  const stacked = width < 390;

  return (
    <View style={[styles.row, stacked && styles.stack]}>
      <View style={[styles.col, stacked && styles.colStacked]}>{left}</View>
      <View style={[styles.col, stacked && styles.colStacked]}>{right}</View>
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
    flex: 1,
    minWidth: 0,
  },
  colStacked: {
    width: '100%',
    flexGrow: 0,
  },
});
