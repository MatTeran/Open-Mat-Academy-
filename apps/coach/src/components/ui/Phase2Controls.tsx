import { Pressable, StyleSheet, View } from 'react-native';

import { Text, radii, spacing, useAppTheme } from '@openmat/shared';

interface ChipRowProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  labelFor?: (value: T) => string;
}

interface FilterChipRowProps<T extends string> {
  options: readonly T[];
  value: T | null;
  onChange: (value: T | null) => void;
  allLabel?: string;
  labelFor?: (value: T) => string;
}

interface ToggleChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

export function ChipRow<T extends string>({
  options,
  value,
  onChange,
  labelFor = formatLabel,
}: ChipRowProps<T>) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.chips}>
      {options.map((option) => {
        const active = option === value;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={[
              styles.chip,
              {
                backgroundColor: active
                  ? colors.goldMuted
                  : colors.cardBackground,
                borderColor: active ? colors.goldAccent : colors.border,
              },
            ]}
          >
            <Text
              variant="caption"
              style={{
                color: active ? colors.goldAccent : colors.secondaryText,
              }}
            >
              {labelFor(option)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function FilterChipRow<T extends string>({
  options,
  value,
  onChange,
  allLabel = 'All',
  labelFor = formatLabel,
}: FilterChipRowProps<T>) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.chips}>
      <Pressable
        onPress={() => onChange(null)}
        style={[
          styles.chip,
          {
            backgroundColor: value === null
              ? colors.goldMuted
              : colors.cardBackground,
            borderColor: value === null ? colors.goldAccent : colors.border,
          },
        ]}
      >
        <Text
          variant="caption"
          style={{
            color: value === null ? colors.goldAccent : colors.secondaryText,
          }}
        >
          {allLabel}
        </Text>
      </Pressable>
      {options.map((option) => {
        const active = option === value;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={[
              styles.chip,
              {
                backgroundColor: active
                  ? colors.goldMuted
                  : colors.cardBackground,
                borderColor: active ? colors.goldAccent : colors.border,
              },
            ]}
          >
            <Text
              variant="caption"
              style={{
                color: active ? colors.goldAccent : colors.secondaryText,
              }}
            >
              {labelFor(option)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function ToggleChip({ label, active, onPress }: ToggleChipProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          alignSelf: 'flex-start',
          backgroundColor: active ? colors.goldMuted : colors.cardBackground,
          borderColor: active ? colors.goldAccent : colors.border,
        },
      ]}
    >
      <Text
        variant="caption"
        style={{ color: active ? colors.goldAccent : colors.secondaryText }}
      >
        {active ? `${label}: On` : `${label}: Off`}
      </Text>
    </Pressable>
  );
}

export function formatLabel(value: string) {
  return value.replace(/_/g, ' ');
}

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
});
