import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import type { TrainingStreak } from '../../types/journey';
import { getStreakStatus } from '../../utils/journey';
import { Card } from '../ui/Card';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';

interface WeeklyStreakCardProps {
  streak: TrainingStreak;
}

export function WeeklyStreakCard({ streak }: WeeklyStreakCardProps) {
  const { colors } = useAppTheme();
  const status = getStreakStatus(streak);

  return (
    <Card>
      <View style={styles.header}>
        <View>
          <Text variant="caption" gold>
            Consistency
          </Text>
          <Spacer size="xs" />
          <Text variant="subtitle">Weekly Streak</Text>
        </View>
        <View
          style={[styles.flameWrap, { backgroundColor: colors.goldMuted }]}
        >
          <Ionicons name="flame" size={18} color={colors.goldAccent} />
        </View>
      </View>

      <Spacer size="lg" />

      <View
        style={styles.weekRow}
        accessibilityRole="summary"
        accessibilityLabel={`${status.completedThisWeek} training days this week`}
      >
        {streak.weekDays.map((day) => (
          <View key={day.key} style={styles.dayCol}>
            <Text
              variant="caption"
              muted={!day.isToday}
              style={day.isToday ? { color: colors.goldAccent } : undefined}
            >
              {day.label}
            </Text>
            <View
              style={[
                styles.dayDot,
                {
                  backgroundColor: day.completed
                    ? colors.goldMuted
                    : colors.primaryBackground,
                  borderColor: day.isToday
                    ? colors.goldAccent
                    : day.completed
                      ? colors.goldAccent
                      : colors.border,
                },
              ]}
              accessibilityLabel={`${day.label} ${day.completed ? 'completed' : 'missed'}`}
            >
              <Text
                variant="caption"
                style={{
                  color: day.completed
                    ? colors.goldAccent
                    : colors.secondaryText,
                }}
              >
                {day.completed ? '✓' : '○'}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <Spacer size="md" />
      <Text variant="body">
        {status.weeklyTrainingDays} Training Days This Week
      </Text>

      <Spacer size="lg" />
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text variant="caption" muted>
            Current Streak
          </Text>
          <Text variant="title">{status.currentStreak} Days</Text>
        </View>
        <View
          style={[styles.divider, { backgroundColor: colors.border }]}
        />
        <View style={styles.stat}>
          <Text variant="caption" muted>
            Best Streak
          </Text>
          <Text variant="title">{status.bestStreak} Days</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  flameWrap: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  dayCol: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  dayDot: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    gap: 4,
  },
  divider: {
    width: 1,
    height: 40,
    marginHorizontal: spacing.md,
  },
});
