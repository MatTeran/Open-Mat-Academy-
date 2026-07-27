import { StyleSheet, View } from 'react-native';

import { spacing, useAppTheme } from '@openmat/shared';

interface SparklineProps {
  points: number[];
  tint: string;
  height?: number;
}

/** Compact Apple Health-inspired bar sparkline. */
export function Sparkline({ points, tint, height = 36 }: SparklineProps) {
  const { colors } = useAppTheme();
  const max = Math.max(...points, 1);

  return (
    <View style={[styles.row, { height }]}>
      {points.map((point, index) => {
        const ratio = point / max;
        return (
          <View
            key={`${index}-${point}`}
            style={[
              styles.barTrack,
              { backgroundColor: colors.border },
            ]}
          >
            <View
              style={[
                styles.barFill,
                {
                  backgroundColor: tint,
                  height: `${Math.max(ratio * 100, 8)}%`,
                },
              ]}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  barTrack: {
    flex: 1,
    height: '100%',
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 4,
  },
});
