import { StyleSheet, View } from 'react-native';

import { spacing } from '../../../lib/theme';
import type { TrainingDayStatus } from '../../../types/journey';
import { DayIndicator } from './DayIndicator';
import { SectionLabel } from './SectionLabel';
import { SurfaceCard } from './SurfaceCard';

interface TrainingStreakCardProps {
  currentStreak: number;
  weekDays: TrainingDayStatus[];
  onPress?: () => void;
}

/**
 * Weekly streak — evenly spaced 7-day indicators, no oversized numeral.
 */
export function TrainingStreakCard({
  currentStreak,
  weekDays,
  onPress,
}: TrainingStreakCardProps) {
  return (
    <SurfaceCard
      onPress={onPress}
      accessibilityLabel={`${currentStreak} day streak`}
    >
      <SectionLabel tone="accent">{`${currentStreak} Day Streak`}</SectionLabel>

      <View style={styles.days}>
        {weekDays.map((day, index) => (
          <DayIndicator
            key={day.key}
            label={day.label}
            completed={day.completed}
            isToday={day.isToday}
            delay={80 + index * 60}
          />
        ))}
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  days: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
});
