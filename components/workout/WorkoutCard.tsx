import { StyleSheet, View } from 'react-native';

import {
  getClassTypeLabel,
  getTechniqueLabel,
} from '../../lib/data/workoutOptions';
import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import type { Workout } from '../../types/workout';
import { formatShortDate } from '../../utils';
import { Card } from '../ui/Card';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';

interface WorkoutCardProps {
  workout: Workout;
  onPress: () => void;
}

export function WorkoutCard({ workout, onPress }: WorkoutCardProps) {
  const { colors } = useAppTheme();

  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <Text variant="caption" gold>
          {formatShortDate(workout.date)}
        </Text>
        <View
          style={[
            styles.badge,
            workout.giType === 'gi'
              ? { backgroundColor: colors.goldMuted }
              : styles.badgeNoGi,
          ]}
        >
          <Text variant="caption" style={{ color: colors.text }}>
            {workout.giType === 'gi' ? 'Gi' : 'No-Gi'}
          </Text>
        </View>
      </View>

      <Spacer size="xs" />
      <Text variant="subtitle">
        {workout.className || getClassTypeLabel(workout.classType)}
      </Text>
      <Spacer size="xxs" />
      <Text variant="bodyMuted">{workout.instructor}</Text>

      <Spacer size="md" />

      <View style={styles.stats}>
        <Stat
          label="Duration"
          value={`${workout.durationMinutes}m`}
          backgroundColor={colors.primaryBackground}
          borderColor={colors.border}
        />
        <Stat
          label="Rounds"
          value={`${workout.rounds}`}
          backgroundColor={colors.primaryBackground}
          borderColor={colors.border}
        />
        <Stat
          label="Favorite"
          value={
            workout.favoriteTechnique
              ? getTechniqueLabel(workout.favoriteTechnique)
              : '—'
          }
          backgroundColor={colors.primaryBackground}
          borderColor={colors.border}
        />
      </View>
    </Card>
  );
}

function Stat({
  label,
  value,
  backgroundColor,
  borderColor,
}: {
  label: string;
  value: string;
  backgroundColor: string;
  borderColor: string;
}) {
  return (
    <View style={[styles.stat, { backgroundColor, borderColor }]}>
      <Text variant="caption">{label}</Text>
      <Text variant="body" numberOfLines={1} style={styles.statValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  badgeNoGi: {
    backgroundColor: 'rgba(91, 140, 255, 0.18)',
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  stat: {
    flex: 1,
    minWidth: 0,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.sm,
    gap: 2,
  },
  statValue: {
    fontSize: 14,
  },
});
