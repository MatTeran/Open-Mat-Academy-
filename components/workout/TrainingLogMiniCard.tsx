import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import type { WeekDayDot } from '../../types/workoutMetrics';
import { Card } from '../ui/Card';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';

interface TrainingLogMiniCardProps {
  thisWeekDays: WeekDayDot[];
  lastWeekDays: WeekDayDot[];
  onPress: () => void;
}

export function TrainingLogMiniCard({
  thisWeekDays,
  lastWeekDays,
  onPress,
}: TrainingLogMiniCardProps) {
  const { colors } = useAppTheme();

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text variant="subtitle">Training Log</Text>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={colors.secondaryText}
        />
      </View>

      <Spacer size="md" />

      <WeekDotsRow
        label="This week"
        days={thisWeekDays}
        activeColor={colors.goldAccent}
        idleColor={colors.border}
        todayRing={colors.goldAccent}
      />
      <Spacer size="sm" />
      <WeekDotsRow
        label="Last week"
        days={lastWeekDays}
        activeColor={colors.goldAccent}
        idleColor={colors.border}
        todayRing={colors.goldAccent}
      />
    </Card>
  );
}

function WeekDotsRow({
  label,
  days,
  activeColor,
  idleColor,
  todayRing,
}: {
  label: string;
  days: WeekDayDot[];
  activeColor: string;
  idleColor: string;
  todayRing: string;
}) {
  return (
    <View>
      <Text variant="caption" muted>
        {label}
      </Text>
      <Spacer size="xs" />
      <View style={styles.dots}>
        {days.map((day) => (
          <View
            key={day.key}
            style={[
              styles.dot,
              {
                backgroundColor: day.trained ? activeColor : 'transparent',
                borderColor: day.isToday
                  ? todayRing
                  : day.trained
                    ? activeColor
                    : idleColor,
              },
            ]}
            accessibilityLabel={`${day.label} ${day.trained ? 'trained' : 'rest'}`}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    minHeight: 168,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: radii.pill,
    borderWidth: 1.5,
  },
});
