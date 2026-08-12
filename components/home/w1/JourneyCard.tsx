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
      padded={false}
    >
      <View style={styles.inner}>
        <SectionLabel>Your Journey</SectionLabel>

        <View style={styles.levelRow}>
          <Text
            style={[styles.level, { color: colors.text }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            {`LEVEL ${summary.level}`}
          </Text>
          <Text style={[styles.percent, { color: colors.goldAccent }]}>
            {`${percent}%`}
          </Text>
        </View>

        <JourneyProgressBar progress={progress} />

        <View style={styles.xpBlock}>
          <Text
            style={[styles.xpLine, { color: colors.secondaryText }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {`${summary.currentXP.toLocaleString()} / ${summary.nextLevelXP.toLocaleString()} XP`}
          </Text>
          <Text
            style={[styles.xpUntil, { color: colors.secondaryText }]}
            numberOfLines={2}
          >
            {`${remaining.toLocaleString()} XP to Level ${summary.level + 1}`}
          </Text>
        </View>

        <View style={[styles.metrics, { borderTopColor: colors.border }]}>
          <MetricItem
            icon="calendar-outline"
            label="Days"
            value={`${summary.weeklyTrainingDays}`}
          />
          <MetricItem
            icon="flag-outline"
            label="Goal"
            value={`${summary.weeklyClassesCompleted}/${summary.weeklyClassGoal}`}
          />
          <MetricItem
            icon="flame-outline"
            label="Streak"
            value={`${summary.currentStreak}`}
          />
        </View>
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 268,
  },
  inner: {
    flex: 1,
    padding: 14,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  level: {
    flex: 1,
    minWidth: 0,
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    letterSpacing: 0.5,
  },
  percent: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    letterSpacing: 0.2,
  },
  xpBlock: {
    marginTop: spacing.sm,
    gap: 3,
  },
  xpLine: {
    fontFamily: fontFamilies.medium,
    fontSize: 11,
    letterSpacing: 0.2,
  },
  xpUntil: {
    fontFamily: fontFamilies.medium,
    fontSize: 10,
    letterSpacing: 0.3,
    lineHeight: 13,
  },
  metrics: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
    marginTop: 'auto',
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
