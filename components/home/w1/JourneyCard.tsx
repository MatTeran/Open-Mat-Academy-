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
 * Journey tile — mirrors Next Class vertical zones for equal-height symmetry.
 * HEADER → TITLE → META → METRICS FOOTER
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
        <SectionLabel>Your Journey</SectionLabel>
        <Text style={[styles.percent, { color: colors.goldAccent }]}>
          {`${percent}%`}
        </Text>
      </View>

      <View style={styles.body}>
        <Text style={[styles.level, { color: colors.text }]}>
          {`LEVEL ${summary.level}`}
        </Text>

        <JourneyProgressBar progress={progress} />

        <Text style={[styles.xpLine, { color: colors.secondaryText }]}>
          {`${summary.currentXP.toLocaleString()} / ${summary.nextLevelXP.toLocaleString()} XP`}
        </Text>
      </View>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
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
    letterSpacing: 0.3,
  },
  body: {
    flexGrow: 1,
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  level: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    letterSpacing: 0.6,
    lineHeight: 22,
  },
  xpLine: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    letterSpacing: 0.2,
  },
  footer: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    minHeight: 76,
    alignItems: 'center',
  },
});
