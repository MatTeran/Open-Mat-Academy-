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

/**
 * Compact journey summary for Home — progress at a glance, detail on Journey.
 */
export function JourneyCard({ summary, onOpenJourney }: JourneyCardProps) {
  const { colors } = useAppTheme();
  const progress =
    summary.nextLevelXP > 0 ? summary.currentXP / summary.nextLevelXP : 0;
  const percent = Math.round(Math.min(100, progress * 100));

  return (
    <SurfaceCard
      onPress={onOpenJourney}
      accessibilityLabel={`Your journey, level ${summary.level}, ${percent} percent to next level`}
      style={styles.card}
    >
      <View style={styles.header}>
        <SectionLabel tone="accent">Your Journey</SectionLabel>
        <Text style={[styles.percent, { color: colors.goldAccent }]}>
          {`${percent}%`}
        </Text>
      </View>

      <View style={styles.primaryZone}>
        <Text style={[styles.level, { color: colors.text }]}>
          {`LEVEL ${summary.level}`}
        </Text>

        <JourneyProgressBar progress={progress} />

        <Text style={[styles.xpLine, { color: colors.secondaryText }]}>
          {`${summary.currentXP.toLocaleString()} / ${summary.nextLevelXP.toLocaleString()} XP`}
        </Text>
      </View>

      <View style={[styles.metrics, { borderTopColor: colors.border }]}>
        <MetricItem
          label="Training"
          value={`${summary.weeklyTrainingDays}`}
        />
        <MetricItem
          label="Weekly Goal"
          value={`${summary.weeklyClassesCompleted} / ${summary.weeklyClassGoal}`}
        />
        <MetricItem
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
    minHeight: 268,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 24,
  },
  percent: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    letterSpacing: 0.4,
  },
  primaryZone: {
    marginTop: spacing.sm,
    gap: spacing.sm,
    flexGrow: 1,
  },
  level: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    letterSpacing: 0.8,
  },
  xpLine: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    letterSpacing: 0.2,
  },
  metrics: {
    flexDirection: 'row',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
