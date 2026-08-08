import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { w1Radii } from '../../../lib/theme';

interface JourneyProgressBarProps {
  progress: number;
  height?: number;
}

export function JourneyProgressBar({
  progress,
  height = 6,
}: JourneyProgressBarProps) {
  const { colors } = useAppTheme();
  const width = useRef(new Animated.Value(0)).current;
  const clamped = Math.max(0, Math.min(1, progress));

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
      style={[
        styles.track,
        {
          height,
          backgroundColor: colors.border,
          borderRadius: w1Radii.chip,
        },
      ]}
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 0,
        max: 100,
        now: Math.round(clamped * 100),
      }}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            height,
            borderRadius: w1Radii.chip,
            backgroundColor: colors.goldAccent,
            width: width.interpolate({
              inputRange: [0, 1],
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
    overflow: 'hidden',
  },
  fill: {},
});
