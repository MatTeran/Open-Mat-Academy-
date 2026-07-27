import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, ViewStyle } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii } from '../../lib/theme';

interface ProgressBarProps {
  progress: number;
  height?: number;
  tone?: 'gold' | 'success';
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export function ProgressBar({
  progress,
  height = 8,
  tone = 'gold',
  style,
  accessibilityLabel,
}: ProgressBarProps) {
  const { colors } = useAppTheme();
  const width = useRef(new Animated.Value(0)).current;
  const clamped = Math.min(100, Math.max(0, progress));

  useEffect(() => {
    Animated.timing(width, {
      toValue: clamped,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [clamped, width]);

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped) }}
      style={[
        styles.track,
        { height, backgroundColor: colors.border },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            height,
            backgroundColor:
              tone === 'success' ? colors.success : colors.goldAccent,
            width: width.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: radii.pill,
  },
});
