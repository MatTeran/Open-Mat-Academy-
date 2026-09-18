import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { fontFamilies, spacing, w1Radii } from '../../../lib/theme';

interface TodaySchedulePeekProps {
  classCount: number;
  nextLabel?: string | null;
  onPress: () => void;
}

/**
 * Thin “Today · N classes” row between greeting and dashboard tiles.
 */
export function TodaySchedulePeek({
  classCount,
  nextLabel,
  onPress,
}: TodaySchedulePeekProps) {
  const { colors } = useAppTheme();
  const countLabel =
    classCount === 0
      ? 'No classes today'
      : classCount === 1
        ? 'Today · 1 class'
        : `Today · ${classCount} classes`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        nextLabel ? `${countLabel}. Next: ${nextLabel}` : countLabel
      }
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <View style={[styles.icon, { backgroundColor: colors.goldMuted }]}>
        <Ionicons name="calendar-outline" size={14} color={colors.goldAccent} />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.title, { color: colors.text }]}>{countLabel}</Text>
        {nextLabel ? (
          <Text
            style={[styles.sub, { color: colors.secondaryText }]}
            numberOfLines={1}
          >
            {nextLabel}
          </Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.secondaryText} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: w1Radii.control,
    borderWidth: StyleSheet.hairlineWidth,
  },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  title: {
    fontFamily: fontFamilies.semibold,
    fontSize: 13,
    letterSpacing: 0.2,
  },
  sub: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    letterSpacing: 0.2,
  },
});
