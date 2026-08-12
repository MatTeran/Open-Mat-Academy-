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
        <View style={styles.header}>
          <SectionLabel style={styles.headerLabel}>Your Journey</SectionLabel>
          <Text style={[styles.percent, { color: colors.goldAccent }]}>
            {`${percent}%`}
          </Text>
        </View>

        <Text
          style={[styles.level, { color: colors.text }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          {`LEVEL ${summary.level}`}
        </Text>

        <View style={styles.barWrap}>
          <JourneyProgressBar progress={progress} height={5} />
        </View>

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
            {`${remaining.toLocaleString()} XP UNTIL LEVEL ${summary.level + 1}`}
          </Text>
        </View>

        <View style={styles.metrics}>
          <MetricItem
            icon="calendar-outline"
            label="Training Days"
            value={`${summary.weeklyTrainingDays}`}
            layout="label-first"
          />
          <MetricItem
            icon="flag-outline"
            label="Weekly Goal"
            value={`${summary.weeklyClassesCompleted} / ${summary.weeklyClassGoal}`}
            layout="label-first"
          />
          <MetricItem
            icon="flame-outline"
            label="Streak"
            value={`${summary.currentStreak} Days`}
            layout="label-first"
          />
        </View>
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 260,
  },
  inner: {
    flex: 1,
    padding: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: spacing.sm,
  },
  headerLabel: {
    flexShrink: 1,
  },
  percent: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    letterSpacing: 0.2,
  },
  level: {
    fontFamily: fontFamilies.bold,
    fontSize: 20,
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
  },
  barWrap: {
    marginBottom: spacing.sm,
  },
  xpBlock: {
    gap: 3,
    marginBottom: spacing.md,
  },
  xpLine: {
    fontFamily: fontFamilies.medium,
    fontSize: 11,
    letterSpacing: 0.2,
  },
  xpUntil: {
    fontFamily: fontFamilies.medium,
    fontSize: 10,
    letterSpacing: 0.5,
    lineHeight: 13,
    textTransform: 'uppercase',
  },
  metrics: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
    marginTop: spacing.md,
  },
});
