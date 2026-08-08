import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { fontFamilies, spacing } from '../../../lib/theme';
import type { HomeUserSummary } from '../../../types/home';
import { JourneyProgressBar } from './JourneyProgressBar';
import { MetricItem } from './MetricItem';
import { SectionLabel } from './SectionLabel';
import { SurfaceCard } from './SurfaceCard';

interface JourneyCardProps {
  summary: HomeUserSummary;
  onOpenJourney: () => void;
}

export function JourneyCard({ summary, onOpenJourney }: JourneyCardProps) {
  const { colors } = useAppTheme();
  const progress =
    summary.nextLevelXP > 0 ? summary.currentXP / summary.nextLevelXP : 0;
  const remaining = Math.max(0, summary.nextLevelXP - summary.currentXP);
  const percent = Math.round(Math.min(100, progress * 100));

  return (
    <SurfaceCard
      onPress={onOpenJourney}
      accessibilityLabel={`Your journey, level ${summary.level}, ${percent} percent to next level`}
      style={styles.card}
    >
      <SectionLabel>Your Journey</SectionLabel>

      <View style={styles.levelRow}>
        <Text style={[styles.level, { color: colors.text }]}>
          {`LEVEL ${summary.level}`}
        </Text>
        <Text style={[styles.percent, { color: colors.goldAccent }]}>
          {`${percent}%`}
        </Text>
      </View>

      <JourneyProgressBar progress={progress} />

      <View style={styles.xpBlock}>
        <Text style={[styles.xpLine, { color: colors.secondaryText }]}>
          {`${summary.currentXP.toLocaleString()} / ${summary.nextLevelXP.toLocaleString()} XP`}
        </Text>
        <Text style={[styles.xpUntil, { color: colors.secondaryText }]}>
          {`${remaining.toLocaleString()} XP UNTIL LEVEL ${summary.level + 1}`}
        </Text>
      </View>

      <View style={[styles.metrics, { borderTopColor: colors.border }]}>
        <MetricItem
          icon="calendar-outline"
          label="Training Days"
          value={`${summary.weeklyTrainingDays}`}
        />
        <MetricItem
          icon="flag-outline"
          label="Weekly Goal"
          value={`${summary.weeklyClassesCompleted} / ${summary.weeklyClassGoal}`}
        />
        <MetricItem
          icon="flame-outline"
          label="Streak"
          value={`${summary.currentStreak} Days`}
        />
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 280,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  level: {
    fontFamily: fontFamilies.bold,
    fontSize: 22,
    letterSpacing: 0.8,
  },
  percent: {
    fontFamily: fontFamilies.bold,
    fontSize: 20,
    letterSpacing: 0.4,
  },
  xpBlock: {
    marginTop: spacing.sm,
    gap: 2,
  },
  xpLine: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    letterSpacing: 0.3,
  },
  xpUntil: {
    fontFamily: fontFamilies.medium,
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  metrics: {
    flexDirection: 'row',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
