import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { fontFamilies, spacing } from '../../../lib/theme';
import type { TrainingDayStatus } from '../../../types/journey';
import { DayIndicator } from './DayIndicator';
import { SectionLabel } from './SectionLabel';
import { SurfaceCard } from './SurfaceCard';

interface TrainingStreakCardProps {
  currentStreak: number;
  weekDays: TrainingDayStatus[];
  onPress?: () => void;
}

export function TrainingStreakCard({
  currentStreak,
  weekDays,
  onPress,
}: TrainingStreakCardProps) {
  const { colors } = useAppTheme();

  return (
    <SurfaceCard
      onPress={onPress}
      accessibilityLabel={`${currentStreak} day streak`}
    >
      <SectionLabel>{`${currentStreak} Day Streak`}</SectionLabel>

      <View style={styles.body}>
        <View style={styles.days}>
          {(weekDays ?? []).map((day, index) => (
            <DayIndicator
              key={day.key}
              label={day.label}
              completed={day.completed}
              isToday={day.isToday}
              delay={80 + index * 60}
            />
          ))}
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.strong}>
          <Text style={[styles.strongValue, { color: colors.goldAccent }]}>
            {currentStreak}
          </Text>
          <Text style={[styles.strongLabel, { color: colors.goldAccent }]}>
            Days
          </Text>
          <Text style={[styles.strongLabel, { color: colors.goldAccent }]}>
            Strong
          </Text>
        </View>
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  body: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  days: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    marginHorizontal: spacing.md,
  },
  strong: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  strongValue: {
    fontFamily: fontFamilies.bold,
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  strongLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
