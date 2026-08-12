import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { fontFamilies } from '../../../lib/theme';

interface DayIndicatorProps {
  label: string;
  completed: boolean;
  isToday?: boolean;
  delay?: number;
}

export function DayIndicator({
  label,
  completed,
  isToday = false,
  delay = 0,
}: DayIndicatorProps) {
  const { colors } = useAppTheme();
  const scale = useRef(new Animated.Value(completed ? 0.86 : 1)).current;

  useEffect(() => {
    if (!completed) {
      return;
    }
    Animated.sequence([
      Animated.delay(delay),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [completed, delay, scale]);

  const borderColor = completed || isToday ? colors.goldAccent : colors.border;
  const backgroundColor = completed
    ? 'rgba(124, 93, 73, 0.12)'
    : 'transparent';

  return (
    <View style={styles.wrap}>
      <Animated.View
        style={[
          styles.circle,
          {
            borderColor,
            backgroundColor,
            borderWidth: isToday ? 2.5 : 1.5,
            transform: [{ scale }],
          },
        ]}
      >
        {completed ? (
          <Ionicons name="checkmark" size={14} color={colors.goldAccent} />
        ) : null}
      </Animated.View>
      <Text style={[styles.label, { color: colors.secondaryText }]}>
        {label.charAt(0)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fontFamilies.medium,
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
