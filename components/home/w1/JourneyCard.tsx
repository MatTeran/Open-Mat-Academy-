import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { w1Radii } from '../../../lib/theme';
import type { HomeUserSummary } from '../../../types/home';
import { JourneyProgressBar } from './JourneyProgressBar';
import { MetricItem } from './MetricItem';
import { SectionLabel } from './SectionLabel';
import { SurfaceCard } from './SurfaceCard';
import { TILE, tileType } from './tileLayout';

interface JourneyCardProps {
  summary: HomeUserSummary;
  onOpenJourney: () => void;
}

/**
 * Journey tile — locked zones match Next Class for equal height + type.
 * HEADER → TITLE → META → FOOTER
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
      padded={false}
      style={styles.card}
    >
      <View style={styles.inner}>
        <View style={tileType.header}>
          <SectionLabel style={styles.sectionLabel}>Your Journey</SectionLabel>
          <View
            style={[styles.percentChip, { backgroundColor: colors.goldMuted }]}
          >
            <Text style={[tileType.trailing, { color: colors.goldAccent }]}>
              {`${percent}%`}
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.titleSlot}>
            <Text
              style={[tileType.title, { color: colors.text }]}
              numberOfLines={TILE.titleMaxLines}
              adjustsFontSizeToFit
              minimumFontScale={0.82}
            >
              {`Level ${summary.level}`}
            </Text>
          </View>

          <View style={styles.metaBlock}>
            <JourneyProgressBar progress={progress} height={5} />
            <Text
              style={[tileType.metaStrong, { color: colors.secondaryText }]}
              numberOfLines={1}
            >
              {`${summary.currentXP.toLocaleString()} / ${summary.nextLevelXP.toLocaleString()} XP`}
            </Text>
          </View>
        </View>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <MetricItem
            compact
            icon="calendar-outline"
            label="Days"
            value={`${summary.weeklyTrainingDays}`}
            accessibilityLabel={`Training days: ${summary.weeklyTrainingDays}`}
          />
          <MetricItem
            compact
            icon="flag-outline"
            label="Goal"
            value={`${summary.weeklyClassesCompleted}/${summary.weeklyClassGoal}`}
            accessibilityLabel={`Weekly goal: ${summary.weeklyClassesCompleted} of ${summary.weeklyClassGoal}`}
          />
          <MetricItem
            compact
            icon="flame-outline"
            label="Streak"
            value={`${summary.currentStreak}d`}
            accessibilityLabel={`Streak: ${summary.currentStreak} days`}
          />
        </View>
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: TILE.height,
    minHeight: TILE.height,
  },
  inner: {
    flex: 1,
    padding: TILE.pad,
    justifyContent: 'space-between',
  },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 1.2,
  },
  percentChip: {
    borderRadius: w1Radii.chip,
    paddingHorizontal: 8,
    paddingVertical: 3,
    minWidth: 40,
    alignItems: 'center',
  },
  body: {
    flex: 1,
    marginTop: 10,
    gap: TILE.bodyGap,
    justifyContent: 'flex-start',
  },
  titleSlot: {
    minHeight: TILE.titleLineHeight * TILE.titleMaxLines,
    justifyContent: 'center',
  },
  metaBlock: {
    gap: TILE.metaGap + 2,
    justifyContent: 'center',
  },
  footer: {
    height: TILE.footerHeight,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
  },
});
