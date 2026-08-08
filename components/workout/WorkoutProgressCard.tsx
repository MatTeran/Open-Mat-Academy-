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
    <Card style={styles.card} padded={false}>
      <View style={styles.inner}>
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
                  size={14}
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

        <Spacer size="sm" />

        <Text variant="caption" muted>
          This week
        </Text>
        <Spacer size="xxs" />
        <View style={styles.statsRow}>
          <WeekStat label="Sessions" value={`${metrics.thisWeek.sessions}`} />
          <WeekStat
            label="Mat Time"
            value={formatMatTime(metrics.thisWeek.matMinutes)}
          />
          <WeekStat label="Rounds" value={`${metrics.thisWeek.rounds}`} />
        </View>

        <Spacer size="sm" />
        <WeeklyProgressChart points={metrics.pastTwelveWeeks} />

        <Spacer size="xs" />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="See more of your progress"
          onPress={onSeeMore}
          style={({ pressed }) => [
            styles.seeMore,
            { opacity: pressed ? 0.75 : 1 },
          ]}
        >
          <Text variant="caption" style={{ color: colors.secondaryText }}>
            See more of your progress
          </Text>
          <Ionicons
            name="chevron-forward"
            size={14}
            color={colors.secondaryText}
          />
        </Pressable>
      </View>
    </Card>
  );
}

function WeekStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text variant="caption" muted>
        {label}
      </Text>
      <Text variant="subtitle" style={styles.statValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
  },
  inner: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  filters: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  statsRow: {
    flexDirection: 'row',
  },
  stat: {
    flex: 1,
    gap: 2,
  },
  statValue: {
    fontSize: 20,
    lineHeight: 24,
  },
  seeMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 2,
    paddingVertical: 2,
  },
});
