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

/**
 * Weekday letter above a checked / empty circle.
 */
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
  const backgroundColor = completed ? colors.goldAccent : 'transparent';
  const checkColor = completed ? colors.cardBackground : colors.goldAccent;

  return (
    <View style={styles.wrap}>
      <Text
        style={[
          styles.label,
          {
            color: isToday ? colors.goldAccent : colors.secondaryText,
            fontFamily: isToday ? fontFamilies.semibold : fontFamilies.medium,
          },
        ]}
      >
        {label.charAt(0)}
      </Text>
      <Animated.View
        style={[
          styles.circle,
          {
            borderColor,
            backgroundColor,
            borderWidth: isToday && !completed ? 2.5 : 1.5,
            transform: [{ scale }],
          },
        ]}
      >
        {completed ? (
          <Ionicons name="checkmark" size={14} color={checkColor} />
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
