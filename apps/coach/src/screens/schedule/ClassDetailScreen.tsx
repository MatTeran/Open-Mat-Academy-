import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, StyleSheet, View } from 'react-native';

import {
  Button,
  Card,
  Screen,
  Spacer,
  Text,
  spacing,
  useAppTheme,
} from '@openmat/shared';

import { SectionHeader, StatusPill } from '../../components/ui/Motion';
import { useCoachData } from '../../lib/providers/CoachDataProvider';
import type { ScheduleStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ScheduleStackParamList, 'ClassDetail'>;

export function ClassDetailScreen({ navigation, route }: Props) {
  const { colors } = useAppTheme();
  const {
    getClass,
    getAttendanceForClass,
    cancelClass,
    duplicateClass,
  } = useCoachData();

  const classItem = getClass(route.params.classId);
  const roster = getAttendanceForClass(route.params.classId);

  if (!classItem) {
    return (
      <Screen>
        <Text variant="title">Class not found</Text>
      </Screen>
    );
  }

  const reserved = roster.filter((item) => item.status === 'reserved');
  const waitlist = roster.filter((item) => item.status === 'waitlist');
  const checkedIn = roster.filter(
    (item) =>
      item.status === 'present' ||
      item.status === 'late' ||
      item.status === 'visitor' ||
      item.status === 'walk_in',
  );
  const attendancePercent =
    roster.length === 0
      ? 0
      : Math.round((checkedIn.length / Math.max(roster.length, 1)) * 100);

  return (
    <Screen scroll>
      <Text variant="hero">{classItem.title}</Text>
      <Spacer size="xs" />
      <Text variant="body" muted>
        {classItem.date} · {classItem.startTime}–{classItem.endTime}
      </Text>
      <Spacer size="sm" />
      <View style={styles.pills}>
        <StatusPill
          label={classItem.status}
          color={
            classItem.status === 'cancelled' ? colors.error : colors.success
          }
        />
        <StatusPill
          label={
            classItem.giType === 'gi'
              ? 'Gi'
              : classItem.giType === 'no_gi'
                ? 'No-Gi'
                : classItem.giType === 'gi_no_gi'
                  ? 'Gi / No-Gi'
                  : 'Open format'
          }
          color={colors.info}
        />
        <StatusPill label={classItem.audience} color={colors.highlightGold} />
        {classItem.isOpenMat ? (
          <StatusPill label="Open Mat" color={colors.warning} />
        ) : null}
        {classItem.isSeminar ? (
          <StatusPill label="Seminar" color="#A78BFA" />
        ) : null}
      </View>

      <Spacer size="lg" />
      <Card elevated>
        <View style={styles.stats}>
          <Stat label="Capacity" value={String(classItem.capacity)} />
          <Stat label="Reserved" value={String(classItem.reservedCount)} />
          <Stat label="Checked In" value={String(checkedIn.length)} />
          <Stat label="Waitlist" value={String(waitlist.length)} />
          <Stat label="Attendance" value={`${attendancePercent}%`} />
          <Stat label="Instructor" value={classItem.instructorName} />
        </View>
      </Card>

      <Spacer size="lg" />
      <SectionHeader title="Roster" />
      <Card>
        <Text variant="subtitle">Reservations ({reserved.length})</Text>
        <Spacer size="xs" />
        {reserved.length === 0 ? (
          <Text variant="caption" muted>
            No reservations yet.
          </Text>
        ) : (
          reserved.map((item) => (
            <Text key={item.id} variant="body">
              {item.memberName}
            </Text>
          ))
        )}
        <Spacer size="md" />
        <Text variant="subtitle">Waitlist ({waitlist.length})</Text>
        <Spacer size="xs" />
        {waitlist.length === 0 ? (
          <Text variant="caption" muted>
            Waitlist empty.
          </Text>
        ) : (
          waitlist.map((item) => (
            <Text key={item.id} variant="body">
              {item.memberName}
            </Text>
          ))
        )}
        <Spacer size="md" />
        <Text variant="subtitle">Checked In ({checkedIn.length})</Text>
        <Spacer size="xs" />
        {checkedIn.length === 0 ? (
          <Text variant="caption" muted>
            No check-ins yet.
          </Text>
        ) : (
          checkedIn.map((item) => (
            <Text key={item.id} variant="body">
              {item.memberName} · {item.status}
            </Text>
          ))
        )}
      </Card>

      <Spacer size="lg" />
      <Button
        label="Start Check-In"
        onPress={() =>
          navigation.navigate('CheckIn', { classId: classItem.id })
        }
      />
      <Spacer size="sm" />
      <Button
        label="Edit Class"
        variant="secondary"
        onPress={() =>
          navigation.navigate('ClassForm', { classId: classItem.id })
        }
      />
      <Spacer size="sm" />
      <Button
        label="Duplicate Class"
        variant="outlineGold"
        onPress={async () => {
          const copy = await duplicateClass(classItem.id);
          if (copy) {
            navigation.replace('ClassDetail', { classId: copy.id });
          }
        }}
      />
      <Spacer size="sm" />
      <Button
        label="Cancel Class"
        variant="ghost"
        disabled={classItem.status === 'cancelled'}
        onPress={() => {
          Alert.alert('Cancel class?', 'Members will see this class as cancelled.', [
            { text: 'Keep', style: 'cancel' },
            {
              text: 'Cancel Class',
              style: 'destructive',
              onPress: async () => {
                await cancelClass(classItem.id);
              },
            },
          ]);
        }}
      />
      <Spacer size="xl" />
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text variant="caption" muted>
        {label}
      </Text>
      <Text variant="subtitle">{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  stat: {
    width: '45%',
    gap: 4,
  },
});
