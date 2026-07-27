import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { spacing } from '../../lib/theme';
import type { LogTabSegment } from '../../types/workoutMetrics';
import { Text } from '../ui/Text';

interface LogSegmentControlProps {
  value: LogTabSegment;
  onChange: (value: LogTabSegment) => void;
}

const SEGMENTS: Array<{ key: LogTabSegment; label: string }> = [
  { key: 'progress', label: 'Progress' },
  { key: 'sessions', label: 'Sessions' },
];

export function LogSegmentControl({ value, onChange }: LogSegmentControlProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[styles.row, { borderBottomColor: colors.border }]}
      accessibilityRole="tablist"
    >
      {SEGMENTS.map((segment) => {
        const active = segment.key === value;
        return (
          <Pressable
            key={segment.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => {
              if (segment.key === value) {
                return;
              }
              void Haptics.selectionAsync();
              onChange(segment.key);
            }}
            style={styles.tab}
          >
            <Text
              variant="subtitle"
              style={{ color: active ? colors.text : colors.secondaryText }}
            >
              {segment.label}
            </Text>
            <View
              style={[
                styles.underline,
                {
                  backgroundColor: active ? colors.goldAccent : 'transparent',
                },
              ]}
            />
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
