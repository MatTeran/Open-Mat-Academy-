import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';

import { Button, Card, Screen, Spacer, Text } from '../../components';
import { useAppTheme } from '../../hooks';
import { useProfile } from '../../lib/providers/ProfileProvider';
import { radii, spacing } from '../../lib/theme';
import type { ProfileStackParamList } from '../../types/navigation';
import { formatShortDate } from '../../utils';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Attendance'>;

export function AttendanceScreen({ navigation }: Props) {
  const { hub } = useProfile();
  const { attendanceSummary, recentAttendance } = hub;
  const { colors } = useAppTheme();
  const progress = Math.min(
    attendanceSummary.classesAttended / attendanceSummary.goal,
    1,
  );

  return (
    <Screen scroll contentStyle={styles.content}>
      <Button label="Back" variant="ghost" onPress={() => navigation.goBack()} />
      <Spacer size="md" />
      <Text variant="hero">Attendance</Text>
      <Spacer size="sm" />
      <Text variant="bodyMuted">
        {attendanceSummary.monthLabel} mat time at a glance.
      </Text>

      <Spacer size="xl" />

      <Card>
        <View style={styles.statsRow}>
          <Stat
            label="Classes"
            value={`${attendanceSummary.classesAttended}`}
          />
          <Stat label="Open mats" value={`${attendanceSummary.openMats}`} />
          <Stat label="Streak" value={`${attendanceSummary.streakDays}d`} />
        </View>
        <Spacer size="lg" />
        <Text variant="caption">
          Monthly goal · {attendanceSummary.goal} classes
        </Text>
        <Spacer size="xs" />
        <View
          style={[styles.track, { backgroundColor: colors.border }]}
        >
          <View
            style={[
              styles.fill,
              {
                width: `${progress * 100}%`,
                backgroundColor: colors.goldAccent,
              },
            ]}
          />
        </View>
      </Card>

      <Spacer size="xl" />
      <Text variant="subtitle">Recent check-ins</Text>
      <Spacer size="md" />
      <View style={styles.list}>
        {recentAttendance.map((entry) => (
          <Card key={entry.id}>
            <Text variant="caption" gold>
              {formatShortDate(entry.date)}
            </Text>
            <Spacer size="xs" />
            <Text variant="body">{entry.classTitle}</Text>
            <Text variant="caption">{entry.instructor}</Text>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text variant="title">{value}</Text>
      <Text variant="caption">{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {},
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stat: {
    flex: 1,
    gap: 4,
  },
  track: {
    height: 8,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
  list: {
    gap: spacing.sm,
  },
});
