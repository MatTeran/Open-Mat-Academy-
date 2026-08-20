import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { fontFamilies, spacing, w1Radii, w1Shadow } from '../../lib/theme';

interface SelectorFieldProps {
  label: string;
  valueLabel: string;
  placeholder?: string;
  onPress: () => void;
  accessibilityHint?: string;
}

/** Compact tappable selector row (~56–64px). */
export function SelectorField({
  label,
  valueLabel,
  placeholder = 'Select',
  onPress,
  accessibilityHint,
}: SelectorFieldProps) {
  const { colors } = useAppTheme();
  const empty = !valueLabel.trim();

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: colors.goldAccent }]}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${empty ? placeholder : valueLabel}`}
        accessibilityHint={accessibilityHint}
        onPress={onPress}
        style={({ pressed }) => [
          styles.field,
          w1Shadow.soft,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            opacity: pressed ? 0.92 : 1,
          },
        ]}
      >
        <Text
          style={[
            styles.value,
            { color: empty ? colors.secondaryText : colors.text },
          ]}
          numberOfLines={1}
        >
          {empty ? placeholder : valueLabel}
        </Text>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.secondaryText}
        />
      </Pressable>
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
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  value: {
    flex: 1,
    fontFamily: fontFamilies.medium,
    fontSize: 16,
  },
});
