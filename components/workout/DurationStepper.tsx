import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { fontFamilies, spacing, w1Radii, w1Shadow } from '../../lib/theme';

interface DurationStepperProps {
  value: number;
  onChange: (minutes: number) => void;
  step?: number;
  min?: number;
  max?: number;
}

/** Simple − / + duration control in 5-minute increments. */
export function DurationStepper({
  value,
  onChange,
  step = 5,
  min = 5,
  max = 240,
}: DurationStepperProps) {
  const { colors } = useAppTheme();

  const adjust = (delta: number) => {
    const next = Math.min(max, Math.max(min, value + delta));
    onChange(next);
  };

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: colors.goldAccent }]}>Duration</Text>
      <View
        style={[
          styles.field,
          w1Shadow.soft,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Decrease duration"
          onPress={() => adjust(-step)}
          hitSlop={8}
          style={[styles.stepBtn, { backgroundColor: colors.goldMuted }]}
        >
          <Text style={[styles.stepGlyph, { color: colors.goldAccent }]}>−</Text>
        </Pressable>
        <Text style={[styles.value, { color: colors.text }]}>
          {`${value} MIN`}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Increase duration"
          onPress={() => adjust(step)}
          hitSlop={8}
          style={[styles.stepBtn, { backgroundColor: colors.goldMuted }]}
        >
          <Text style={[styles.stepGlyph, { color: colors.goldAccent }]}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs,
  },
  label: {
    fontFamily: fontFamilies.semibold,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  field: {
    minHeight: 56,
    borderRadius: w1Radii.control,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepGlyph: {
    fontFamily: fontFamilies.bold,
    fontSize: 22,
    lineHeight: 24,
  },
  value: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    letterSpacing: 1,
  },
});
