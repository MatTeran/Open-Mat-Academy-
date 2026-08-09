import { useEffect, useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import { Text } from '../ui/Text';

export interface RankedBarItem {
  id: string;
  label: string;
  value: number;
  valueLabel: string;
}

interface RankedBarListProps {
  items: RankedBarItem[];
  onItemPress?: (id: string) => void;
}

function RankedBarRow({
  item,
  maxValue,
  onPress,
  index,
}: {
  item: RankedBarItem;
  maxValue: number;
  onPress?: () => void;
  index: number;
}) {
  const { colors } = useAppTheme();
  const widthAnim = useRef(new Animated.Value(0)).current;
  const ratio = maxValue > 0 ? item.value / maxValue : 0;

  useEffect(() => {
    let mounted = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (!mounted) {
        return;
      }
      if (reduce) {
        widthAnim.setValue(ratio);
        return;
      }
      widthAnim.setValue(0);
      Animated.timing(widthAnim, {
        toValue: ratio,
        duration: 480,
        delay: index * 40,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    });
    return () => {
      mounted = false;
    };
  }, [index, ratio, widthAnim]);

  const content = (
    <View style={styles.row}>
      <View style={styles.meta}>
        <Text variant="body" style={styles.label} numberOfLines={1}>
          {item.label}
        </Text>
        <Text variant="caption" muted>
          {item.valueLabel}
        </Text>
      </View>
      <View
        style={[styles.track, { backgroundColor: colors.goldMuted }]}
      >
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: colors.goldAccent,
              width: widthAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.label}, ${item.valueLabel}`}
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
    >
      {content}
    </Pressable>
  );
}

export function RankedBarList({ items, onItemPress }: RankedBarListProps) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <View style={styles.list}>
      {items.map((item, index) => (
        <RankedBarRow
          key={item.id}
          item={item}
          maxValue={maxValue}
          index={index}
          onPress={
            onItemPress ? () => onItemPress(item.id) : undefined
          }
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
  row: {
    gap: 6,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  label: {
    flex: 1,
    fontSize: 15,
  },
  track: {
    height: 8,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radii.pill,
  },
});
