import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import type {
  WorkoutMetricFilter,
  WorkoutProgressMetrics,
} from '../../types/workoutMetrics';
import { formatMatTime } from '../../utils/workoutMetrics';
import { Card } from '../ui/Card';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';
import { WeeklyProgressChart } from './WeeklyProgressChart';

interface WorkoutProgressCardProps {
  metrics: WorkoutProgressMetrics;
  filter: WorkoutMetricFilter;
  onFilterChange: (filter: WorkoutMetricFilter) => void;
  onSeeMore: () => void;
}

const FILTERS: Array<{
  key: WorkoutMetricFilter;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  { key: 'all', label: 'All', icon: 'grid-outline' },
  { key: 'gi', label: 'Gi', icon: 'shirt-outline' },
  { key: 'no_gi', label: 'No-Gi', icon: 'flash-outline' },
];

export function WorkoutProgressCard({
  metrics,
  filter,
  onFilterChange,
  onSeeMore,
}: WorkoutProgressCardProps) {
  const { colors } = useAppTheme();

  return (
    <Card style={styles.card}>
      <View style={styles.filters}>
        {FILTERS.map((item) => {
          const active = item.key === filter;
          return (
            <Pressable
              key={item.key}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => {
                if (item.key === filter) {
                  return;
                }
                void Haptics.selectionAsync();
                onFilterChange(item.key);
              }}
              style={[
                styles.filterPill,
                {
                  borderColor: active ? colors.goldAccent : colors.border,
                  backgroundColor: active
                    ? colors.goldMuted
                    : colors.primaryBackground,
                },
              ]}
            >
              <Ionicons
                name={item.icon}
                size={16}
                color={active ? colors.goldAccent : colors.secondaryText}
              />
              <Text
                variant="caption"
                style={{
                  color: active ? colors.goldAccent : colors.secondaryText,
                }}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Spacer size="lg" />

      <Text variant="caption" muted>
        This week
      </Text>
      <Spacer size="sm" />
      <View style={styles.statsRow}>
        <WeekStat label="Sessions" value={`${metrics.thisWeek.sessions}`} />
        <WeekStat
          label="Mat Time"
          value={formatMatTime(metrics.thisWeek.matMinutes)}
        />
        <WeekStat label="Rounds" value={`${metrics.thisWeek.rounds}`} />
      </View>

      <Spacer size="lg" />
      <WeeklyProgressChart points={metrics.pastTwelveWeeks} />

      <Spacer size="md" />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="See more of your progress"
        onPress={onSeeMore}
        style={({ pressed }) => [
          styles.seeMore,
          {
            borderColor: colors.border,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <Text variant="body">See more of your progress</Text>
      </Pressable>
    </Card>
  );
}

function WeekStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text variant="caption" muted>
        {label}
      </Text>
      <Text variant="title">{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
  },
  filters: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
  },
  stat: {
    flex: 1,
    gap: 4,
  },
  seeMore: {
    borderWidth: 1,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
});
