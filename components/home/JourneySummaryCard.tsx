import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import type { HomeUserSummary } from '../../types/home';
import {
  formatXp,
  getXpProgressPercentage,
} from '../../utils/journey';
import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ProgressBar } from '../journey/ProgressBar';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';

interface JourneySummaryCardProps {
  summary: HomeUserSummary;
  onOpenJourney: () => void;
}

export function JourneySummaryCard({
  summary,
  onOpenJourney,
}: JourneySummaryCardProps) {
  const { colors } = useAppTheme();
  const remaining = Math.max(0, summary.nextLevelXP - summary.currentXP);
  const percent = getXpProgressPercentage(
    summary.currentXP,
    summary.nextLevelXP,
  );

  return (
    <Card style={{ backgroundColor: colors.elevatedSurface }}>
      <Text variant="label" gold>
        Your Journey
      </Text>
      <Spacer size="sm" />

      <View style={styles.levelRow}>
        <Text
          variant="subtitle"
          accessibilityLabel={`Level ${summary.level}`}
        >
          Level {summary.level}
        </Text>
        <Text
          variant="caption"
          gold
          accessibilityLabel={`${Math.round(percent)} percent to next level`}
        >
          {Math.round(percent)}%
        </Text>
      </View>

      <Spacer size="sm" />
      <ProgressBar
        progress={percent}
        height={8}
        accessibilityLabel={`Experience progress ${formatXp(summary.currentXP)} of ${formatXp(summary.nextLevelXP)} XP`}
      />
      <Spacer size="xs" />
      <Text variant="caption">
        {formatXp(summary.currentXP)} / {formatXp(summary.nextLevelXP)} XP
      </Text>
      <Text variant="caption" style={styles.remaining}>
        {formatXp(remaining)} XP until Level {summary.level + 1}
      </Text>

      <Spacer size="md" />
      <View style={styles.statsRow}>
        <View
          style={[
            styles.stat,
            {
              backgroundColor: colors.secondaryBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <Text variant="caption">Training Days</Text>
          <Text variant="body">{summary.weeklyTrainingDays}</Text>
        </View>
        <View
          style={[
            styles.stat,
            {
              backgroundColor: colors.secondaryBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <Text variant="caption">Weekly Goal</Text>
          <Text variant="body">
            {summary.weeklyClassesCompleted} / {summary.weeklyClassGoal}
          </Text>
        </View>
        <View
          style={[
            styles.stat,
            {
              backgroundColor: colors.secondaryBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.streakLabel}>
            <Ionicons name="flame" size={12} color={colors.goldAccent} />
            <Text variant="caption">Streak</Text>
          </View>
          <Text variant="body">{summary.currentStreak} Days</Text>
        </View>
      </View>

      <Spacer size="md" />
      <Button
        label="Open Journey"
        variant="secondary"
        onPress={onOpenJourney}
        accessibilityHint="Opens your Journey progress hub"
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remaining: {
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  stat: {
    flex: 1,
    gap: 4,
    minWidth: 0,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  streakLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
