import { Pressable, StyleSheet, View } from 'react-native';

import type { AppearancePreference } from '../../hooks/useTheme';
import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import { Text } from '../ui/Text';

const OPTIONS: Array<{
  id: AppearancePreference;
  label: string;
  description: string;
}> = [
  {
    id: 'system',
    label: 'System',
    description: 'Match your device',
  },
  {
    id: 'dark',
    label: 'Dark',
    description: 'Matte black surfaces',
  },
  {
    id: 'light',
    label: 'Light',
    description: 'Bright charcoal & white',
  },
];

interface AppearanceSelectorProps {
  value: AppearancePreference;
  onChange: (value: AppearancePreference) => void;
}

export function AppearanceSelector({
  value,
  onChange,
}: AppearanceSelectorProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.stack}>
      {OPTIONS.map((option) => {
        const selected = value === option.id;
        return (
          <Pressable
            key={option.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`${option.label}. ${option.description}`}
            onPress={() => onChange(option.id)}
            style={({ pressed }) => [pressed && styles.pressed]}
          >
            <View
              style={[
                styles.row,
                {
                  backgroundColor: colors.secondaryBackground,
                  borderColor: selected ? colors.goldAccent : colors.border,
                },
              ]}
            >
              <View style={styles.copy}>
                <Text variant="body" style={{ color: colors.text }}>
                  {option.label}
                </Text>
                <Text
                  variant="caption"
                  style={{ color: colors.secondaryText, marginTop: 2 }}
                >
                  {option.description}
                </Text>
              </View>
              <View
                style={[
                  styles.radio,
                  {
                    borderColor: selected ? colors.goldAccent : colors.border,
                  },
                ]}
              >
                {selected ? (
                  <View
                    style={[
                      styles.radioDot,
                      { backgroundColor: colors.goldAccent },
                    ]}
                  />
                ) : null}
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export function appearanceLabel(preference: AppearancePreference): string {
  if (preference === 'system') {
    return 'System';
  }
  if (preference === 'light') {
    return 'Light';
  }
  return 'Dark';
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.92,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 64,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    paddingRight: spacing.sm,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: radii.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: radii.pill,
  },
});
