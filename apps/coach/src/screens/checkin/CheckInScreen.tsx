import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  Banner,
  Button,
  Card,
  Input,
  Screen,
  Spacer,
  Text,
  radii,
  spacing,
  useAppTheme,
  type AttendanceStatus,
} from '@openmat/shared';

import {
  EmptyState,
  FadeInItem,
  SectionHeader,
  StatusPill,
} from '../../components/ui/Motion';
import { useCoachData } from '../../lib/providers/CoachDataProvider';
import type { DashboardStackParamList } from '../../navigation/types';
import type { ScheduleStackParamList } from '../../navigation/types';

type Props =
  | NativeStackScreenProps<DashboardStackParamList, 'CheckIn'>
  | NativeStackScreenProps<ScheduleStackParamList, 'CheckIn'>;

const STATUS_COLOR: Record<string, string> = {
  present: '#22C55E',
  late: '#F59E0B',
  visitor: '#38BDF8',
  walk_in: '#A78BFA',
  absent: '#FF4D4D',
  reserved: '#B8B8B8',
  waitlist: '#F5F5F5',
};

export function CheckInScreen({ route }: Props) {
  const { colors } = useAppTheme();
  const {
    classes,
    getAttendanceForClass,
    checkIn,
    updateAttendanceStatus,
    members,
  } = useCoachData();

  const today = new Date().toISOString().slice(0, 10);
  const todaysClasses = classes.filter(
    (item) => item.date === today && item.status !== 'cancelled',
  );
  const [classId, setClassId] = useState(
    route.params?.classId ?? todaysClasses[0]?.id ?? classes[0]?.id ?? '',
  );
  const [query, setQuery] = useState('');
  const [walkInName, setWalkInName] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const attendance = getAttendanceForClass(classId);
  const selectedClass = classes.find((item) => item.id === classId);

  const filteredMembers = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return members.slice(0, 8);
    }
    return members.filter(
      (member) =>
        member.fullName.toLowerCase().includes(needle) ||
        member.email.toLowerCase().includes(needle),
    );
  }, [members, query]);

  const groups: { title: string; status: AttendanceStatus[] }[] = [
    { title: 'Present', status: ['present'] },
    { title: 'Late', status: ['late'] },
    { title: 'Visitor', status: ['visitor'] },
    { title: 'Walk-in', status: ['walk_in'] },
    { title: 'Absent', status: ['absent'] },
  ];

  const onCheckInMember = async (
    memberId: string,
    memberName: string,
    status: 'present' | 'late' | 'visitor' | 'walk_in' = 'present',
  ) => {
    if (!classId) {
      setMessage('Select a class first.');
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await checkIn({
        classId,
        memberId,
        memberName,
        status,
      });
      setMessage(`${memberName} checked in.`);
      setQuery('');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Check-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const onWalkIn = async () => {
    if (!walkInName.trim() || !classId) {
      return;
    }
    setLoading(true);
    try {
      await checkIn({
        classId,
        memberName: walkInName.trim(),
        status: 'walk_in',
        isFirstVisit: true,
      });
      setMessage(`${walkInName.trim()} added as walk-in.`);
      setWalkInName('');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Walk-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll keyboard>
      <Text variant="hero">Check-In</Text>
      <Text variant="body" muted>
        Manual search, walk-ins, visitors, and late arrivals.
      </Text>

      <Spacer size="lg" />
      <SectionHeader title="Class" />
      <View style={styles.filters}>
        {(todaysClasses.length ? todaysClasses : classes.slice(0, 4)).map(
          (item) => {
            const active = item.id === classId;
            return (
              <Pressable
                key={item.id}
                onPress={() => setClassId(item.id)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active
                      ? colors.goldMuted
                      : colors.cardBackground,
                    borderColor: active ? colors.goldAccent : colors.border,
                  },
                ]}
              >
                <Text
                  variant="caption"
                  style={{
                    color: active ? colors.goldAccent : colors.secondaryText,
                  }}
                >
                  {item.title}
                </Text>
              </Pressable>
            );
          },
        )}
      </View>

      {selectedClass ? (
        <>
          <Spacer size="sm" />
          <Text variant="caption" muted>
            {selectedClass.startTime}–{selectedClass.endTime} ·{' '}
            {selectedClass.instructorName}
          </Text>
        </>
      ) : null}

      <Spacer size="lg" />
      <Card elevated style={styles.qrCard}>
        <Text variant="subtitle">QR Check-In</Text>
        <Spacer size="xs" />
        <View
          style={[
            styles.qrPlaceholder,
            { borderColor: colors.border, backgroundColor: colors.cardBackground },
          ]}
        >
          <Text variant="caption" muted>
            QR scanner placeholder — Phase 2
          </Text>
        </View>
      </Card>

      <Spacer size="lg" />
      {message ? (
        <>
          <Banner
            tone={message.includes('failed') ? 'error' : 'success'}
            message={message}
          />
          <Spacer size="md" />
        </>
      ) : null}

      <Input
        label="Search members"
        placeholder="Name or email"
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
      />
      <Spacer size="sm" />
      <View style={styles.list}>
        {filteredMembers.map((member, index) => (
          <FadeInItem key={member.id} index={index}>
            <Card>
              <View style={styles.memberRow}>
                <View style={styles.copy}>
                  <Text variant="subtitle">{member.fullName}</Text>
                  <Text variant="caption" muted>
                    {member.belt} · {member.email}
                  </Text>
                </View>
                <View style={styles.memberActions}>
                  <Button
                    label="In"
                    fullWidth={false}
                    loading={loading}
                    onPress={() =>
                      onCheckInMember(member.id, member.fullName, 'present')
                    }
                    style={styles.smallButton}
                  />
                  <Button
                    label="Late"
                    variant="secondary"
                    fullWidth={false}
                    loading={loading}
                    onPress={() =>
                      onCheckInMember(member.id, member.fullName, 'late')
                    }
                    style={styles.smallButton}
                  />
                </View>
              </View>
            </Card>
          </FadeInItem>
        ))}
      </View>

      <Spacer size="lg" />
      <SectionHeader title="Walk-ins & Visitors" />
      <Input
        label="Name"
        placeholder="Walk-in name"
        value={walkInName}
        onChangeText={setWalkInName}
      />
      <Spacer size="sm" />
      <View style={styles.rowButtons}>
        <Button
          label="Add Walk-in"
          variant="secondary"
          loading={loading}
          onPress={onWalkIn}
        />
      </View>
      <Spacer size="sm" />
      <Button
        label="Add Visitor"
        variant="outlineGold"
        loading={loading}
        disabled={!walkInName.trim()}
        onPress={async () => {
          if (!classId || !walkInName.trim()) return;
          setLoading(true);
          try {
            await checkIn({
              classId,
              memberName: walkInName.trim(),
              status: 'visitor',
              isFirstVisit: true,
            });
            setMessage(`${walkInName.trim()} added as visitor.`);
            setWalkInName('');
          } finally {
            setLoading(false);
          }
        }}
      />

      <Spacer size="lg" />
      <SectionHeader title="Live Attendance" />
      {attendance.length === 0 ? (
        <EmptyState
          title="No attendance yet"
          subtitle="Check members in to update the roster immediately."
        />
      ) : (
        groups.map((group) => {
          const rows = attendance.filter((item) =>
            group.status.includes(item.status),
          );
          if (rows.length === 0) {
            return null;
          }
          return (
            <View key={group.title} style={styles.group}>
              <Text variant="label">{group.title}</Text>
              <Spacer size="xs" />
              {rows.map((item) => (
                <Card key={item.id} style={styles.attCard}>
                  <View style={styles.memberRow}>
                    <View style={styles.copy}>
                      <Text variant="subtitle">{item.memberName}</Text>
                      <StatusPill
                        label={item.status}
                        color={STATUS_COLOR[item.status] ?? colors.secondaryText}
                      />
                    </View>
                    {item.status !== 'absent' ? (
                      <Button
                        label="Absent"
                        variant="ghost"
                        fullWidth={false}
                        onPress={() =>
                          updateAttendanceStatus(item.id, 'absent')
                        }
                      />
                    ) : null}
                  </View>
                </Card>
              ))}
            </View>
          );
        })
      )}
      <Spacer size="xl" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  qrCard: {
    gap: spacing.xs,
  },
  qrPlaceholder: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: radii.lg,
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  list: {
    gap: spacing.sm,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  memberActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  smallButton: {
    minWidth: 64,
  },
  rowButtons: {
    gap: spacing.sm,
  },
  group: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  attCard: {
    marginBottom: spacing.xs,
  },
});
