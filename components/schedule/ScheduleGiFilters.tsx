import { Pressable, StyleSheet, View } from 'react-native';

import { SCHEDULE_GI_FILTERS } from '../../lib/data/schedule';
import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import type { ScheduleGiFilter } from '../../types/schedule';
import { Text } from '../ui/Text';

interface ScheduleGiFiltersProps {
  selected: ScheduleGiFilter;
  onSelect: (filter: ScheduleGiFilter) => void;
}

/**
 * BJJ format filter: All formats · Gi · No-Gi.
 * Layout styles live on inner Views for NativeWind Pressable safety.
 */
export function ScheduleGiFilters({
  selected,
  onSelect,
}: ScheduleGiFiltersProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.row} accessibilityRole="tablist">
      {SCHEDULE_GI_FILTERS.map((filter) => {
        const active = filter.key === selected;
        return (
          <Pressable
            key={filter.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onSelect(filter.key)}
            style={({ pressed }) => [{ flex: 1 }, pressed && styles.pressed]}
          >
            <View
              style={[
                styles.chip,
                {
                  borderColor: active ? colors.goldAccent : colors.border,
                  backgroundColor: active
                    ? colors.goldMuted
                    : colors.secondaryBackground,
                },
              ]}
            >
              <Text
                variant="caption"
                style={{
                  color: active ? colors.goldAccent : colors.secondaryText,
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
    minHeight: 40,
    borderRadius: radii.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
});
