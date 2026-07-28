import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import type { LocalEventFilter } from '../../types/localEvents';
import { Text } from '../ui/Text';

const FILTERS: Array<{ id: LocalEventFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'tournament', label: 'Tournaments' },
  { id: 'seminar', label: 'Seminars' },
];

interface LocalEventFilterRowProps {
  value: LocalEventFilter;
  onChange: (value: LocalEventFilter) => void;
}

export function LocalEventFilterRow({
  value,
  onChange,
}: LocalEventFilterRowProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.row} accessibilityRole="tablist">
      {FILTERS.map((filter) => {
        const selected = filter.id === value;
        return (
          <Pressable
            key={filter.id}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(filter.id)}
            style={({ pressed }) => [
              { flex: 1 },
              pressed && styles.pressed,
            ]}
          >
            <View
              style={[
                styles.chip,
                {
                  borderColor: selected ? colors.goldAccent : colors.border,
                  backgroundColor: selected
                    ? colors.goldMuted
                    : colors.secondaryBackground,
                },
              ]}
            >
              <Text
                variant="caption"
                style={{
                  color: selected ? colors.goldAccent : colors.secondaryText,
                  textAlign: 'center',
                }}
              >
                {filter.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.9,
  },
  chip: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
});
