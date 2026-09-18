import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { fontFamilies, spacing } from '../../lib/theme';
import type { ScheduleViewMode } from '../../types/schedule';
import { Text } from '../ui/Text';

interface ScheduleViewToggleProps {
  value: ScheduleViewMode;
  onChange: (value: ScheduleViewMode) => void;
}

const VIEWS: Array<{ key: ScheduleViewMode; label: string }> = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
];

/**
 * Compact Day / Week segment for Schedule.
 */
export function ScheduleViewToggle({
  value,
  onChange,
}: ScheduleViewToggleProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[styles.row, { backgroundColor: 'rgba(0,0,0,0.04)' }]}
      accessibilityRole="tablist"
    >
      {VIEWS.map((view) => {
        const active = view.key === value;
        return (
          <Pressable
            key={view.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => {
              if (view.key === value) {
                return;
              }
              void Haptics.selectionAsync();
              onChange(view.key);
            }}
            style={[
              styles.tab,
              active && {
                backgroundColor: colors.elevatedSurface,
                shadowColor: '#000',
                shadowOpacity: 0.06,
                shadowRadius: 3,
                shadowOffset: { width: 0, height: 1 },
                elevation: 1,
              },
            ]}
          >
            <Text
              style={{
                fontFamily: fontFamilies.semibold,
                fontSize: 12,
                color: active ? colors.text : colors.secondaryText,
              }}
            >
              {view.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
    gap: 2,
  },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: 8,
  },
});
