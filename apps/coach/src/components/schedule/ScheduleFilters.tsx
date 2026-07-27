import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { Text, radii, spacing, useAppTheme } from '@openmat/shared';

import {
  SCHEDULE_FILTERS,
  type CoachScheduleFilter,
} from '../../utils/schedule';

interface ScheduleFiltersProps {
  selected: CoachScheduleFilter;
  onSelect: (filter: CoachScheduleFilter) => void;
}

export function ScheduleFilters({ selected, onSelect }: ScheduleFiltersProps) {
  const { colors } = useAppTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {SCHEDULE_FILTERS.map((filter) => {
        const active = filter.key === selected;
        return (
          <Pressable
            key={filter.key}
            onPress={() => onSelect(filter.key)}
            style={[
              styles.chip,
              {
                backgroundColor: active
                  ? colors.goldMuted
                  : colors.secondaryBackground,
                borderColor: active ? colors.goldAccent : colors.border,
              },
            ]}
          >
            <Text
              variant="caption"
              style={{
                color: active ? colors.goldAccent : colors.secondaryText,
                letterSpacing: 0.3,
              }}
            >
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.xs,
    paddingRight: spacing.md,
  },
  chip: {
    height: 36,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderWidth: 1,
  },
});
