import { Pressable, ScrollView } from 'react-native';

import { SCHEDULE_FILTERS } from '../../lib/data/schedule';
import { radii, spacing } from '../../lib/theme';
import { useThemedStyles } from '../../lib/theme/useThemedStyles';
import type { ScheduleFilter } from '../../types/schedule';
import { Text } from '../ui/Text';

interface ScheduleFiltersProps {
  selected: ScheduleFilter;
  onSelect: (filter: ScheduleFilter) => void;
}

export function ScheduleFilters({ selected, onSelect }: ScheduleFiltersProps) {
  const styles = useThemedStyles((colors) => ({
    row: {
      gap: spacing.xs,
      paddingRight: spacing.md,
      alignItems: 'center' as const,
    },
    chip: {
      height: 36,
      borderRadius: radii.pill,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.secondaryBackground,
      borderWidth: 1,
      borderColor: colors.border,
    },
    chipActive: {
      backgroundColor: colors.goldMuted,
      borderColor: colors.goldAccent,
    },
    label: {
      color: colors.secondaryText,
      letterSpacing: 0.3,
    },
    labelActive: {
      color: colors.goldAccent,
    },
  }));

  return (
    <ScrollView
      horizontal
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {SCHEDULE_FILTERS.map((filter) => {
        const active = filter.key === selected;
        return (
          <Pressable
            key={filter.key}
            onPress={() => onSelect(filter.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text
              variant="caption"
              style={[styles.label, active && styles.labelActive]}
            >
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
