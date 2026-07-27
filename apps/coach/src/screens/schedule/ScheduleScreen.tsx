import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  Screen,
  Spacer,
  Text,
  radii,
  spacing,
  useAppTheme,
  type Weekday,
} from '@openmat/shared';

import { CoachClassCard } from '../../components/schedule/CoachClassCard';
import { ScheduleFilters } from '../../components/schedule/ScheduleFilters';
import { WeeklyCalendar } from '../../components/schedule/WeeklyCalendar';
import { useCoachData } from '../../lib/providers/CoachDataProvider';
import type { ScheduleStackParamList } from '../../navigation/types';
import {
  getWeekDates,
  getWeekdayFromDate,
  getWeekdayLabel,
  sortByStartTime,
  toISODate,
  type CoachScheduleFilter,
} from '../../utils/schedule';

type Props = NativeStackScreenProps<ScheduleStackParamList, 'ScheduleHome'>;

export function ScheduleScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const { classes } = useCoachData();
  const [selectedDay, setSelectedDay] = useState<Weekday>(() =>
    getWeekdayFromDate(new Date()),
  );
  const [filter, setFilter] = useState<CoachScheduleFilter>('all');

  const weekDates = useMemo(() => getWeekDates(new Date()), []);
  const selectedDate = toISODate(weekDates[selectedDay]);

  const dayClasses = useMemo(() => {
    const matched = classes.filter((item) => {
      if (item.date !== selectedDate) {
        return false;
      }
      if (filter === 'all') {
        return true;
      }
      if (filter === 'open_mat') {
        return item.isOpenMat || item.level === 'open_mat';
      }
      if (filter === 'seminar') {
        return item.isSeminar || item.level === 'seminar';
      }
      if (filter === 'kids') {
        return item.level === 'kids' || item.audience === 'kids';
      }
      return item.level === filter;
    });
    return sortByStartTime(matched);
  }, [classes, filter, selectedDate]);

  return (
    <Screen scroll contentStyle={styles.content}>
      <View style={styles.top}>
        <View style={styles.topCopy}>
          <Text variant="hero">Schedule</Text>
          <Spacer size="sm" />
          <Text variant="body" muted>
            Open Mat · Tracy, California
          </Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate('ClassForm', undefined)}
          style={[styles.addButton, { backgroundColor: colors.goldAccent }]}
        >
          <Text
            variant="caption"
            style={{ color: colors.primaryBackground, fontWeight: '600' }}
          >
            Add
          </Text>
        </Pressable>
      </View>

      <Spacer size="lg" />

      <WeeklyCalendar selected={selectedDay} onSelect={setSelectedDay} />

      <Spacer size="lg" />

      <Text variant="label">Filter</Text>
      <Spacer size="sm" />
      <ScheduleFilters selected={filter} onSelect={setFilter} />

      <Spacer size="lg" />

      <Text variant="subtitle">{getWeekdayLabel(selectedDay)}</Text>
      <Spacer size="xs" />
      <Text variant="caption" muted>
        {dayClasses.length} class{dayClasses.length === 1 ? '' : 'es'}
      </Text>

      <Spacer size="md" />

      {dayClasses.length === 0 ? (
        <View style={styles.empty}>
          <Text variant="body" muted>
            No classes match this filter for {getWeekdayLabel(selectedDay)}.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {dayClasses.map((item) => (
            <CoachClassCard
              key={item.id}
              item={item}
              onManage={() =>
                navigation.navigate('ClassDetail', { classId: item.id })
              }
              onCheckIn={() =>
                navigation.navigate('CheckIn', { classId: item.id })
              }
            />
          ))}
        </View>
      )}

      <View style={styles.bottomSpace} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {},
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  topCopy: {
    flex: 1,
    minWidth: 0,
  },
  addButton: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginTop: spacing.xs,
  },
  list: {
    gap: spacing.md,
  },
  empty: {
    paddingVertical: spacing.xl,
  },
  bottomSpace: {
    height: spacing.lg,
  },
});
