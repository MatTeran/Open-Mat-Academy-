import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { spacing } from '../../lib/theme';
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
 * Day / Week presentation toggle for the Schedule tab.
 * Layout styles live on inner Views for NativeWind Pressable safety.
 */
export function ScheduleViewToggle({
  value,
  onChange,
}: ScheduleViewToggleProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[styles.row, { borderBottomColor: colors.border }]}
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
            style={styles.tab}
          >
            <View style={styles.tabInner}>
              <Text
                variant="subtitle"
                style={{ color: active ? colors.text : colors.secondaryText }}
              >
                {view.label}
              </Text>
              <View
                style={[
                  styles.underline,
                  {
                    backgroundColor: active
                      ? colors.goldAccent
                      : 'transparent',
                  },
                ]}
              />
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  tab: {
    flex: 1,
  },
  tabInner: {
    alignItems: 'center',
    paddingTop: spacing.xs,
    gap: spacing.sm,
  },
  underline: {
    height: 2,
    width: '100%',
    borderRadius: 2,
  },
});
