import { Pressable, StyleSheet, View } from 'react-native';

import { radii, spacing } from '../../lib/theme';
import { useThemedStyles } from '../../lib/theme/useThemedStyles';
import { Text } from '../ui/Text';

interface DropdownOption<T extends string> {
  value: T;
  label: string;
}

interface DropdownFieldProps<T extends string> {
  label: string;
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
}

/**
 * Inline expandable selector — keeps the form native and dependency-light.
 */
export function DropdownField<T extends string>({
  label,
  value,
  options,
  onChange,
}: DropdownFieldProps<T>) {
  const styles = useThemedStyles((colors) => ({
    list: {
      marginTop: spacing.sm,
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden' as const,
      backgroundColor: colors.secondaryBackground,
    },
    option: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    optionActive: {
      backgroundColor: colors.goldMuted,
    },
    optionText: {
      color: colors.text,
    },
    optionTextActive: {
      color: colors.goldAccent,
    },
    helper: {
      marginTop: spacing.xs,
    },
  }));

  const selected = options.find((item) => item.value === value);

  return (
    <View>
      <Text variant="label">{label}</Text>
      <View style={styles.list}>
        {options.map((option) => {
          const active = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              style={[styles.option, active && styles.optionActive]}
            >
              <Text
                variant="body"
                style={[styles.optionText, active && styles.optionTextActive]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {selected ? (
        <Text variant="caption" style={styles.helper}>
          Selected · {selected.label}
        </Text>
      ) : null}
    </View>
  );
}
