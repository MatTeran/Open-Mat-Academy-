import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Banner,
  ClassCard,
  ScheduleFilters,
  Screen,
  Spacer,
  Text,
  WeeklyCalendar,
} from '../../components';
import { spacing } from '../../lib/theme';
import type { ScheduleFilter, Weekday } from '../../types/schedule';
import {
  getClassesForDay,
  getWeekdayFromDate,
  getWeekdayLabel,
} from '../../utils/schedule';

export function ScheduleScreen() {
  const [selectedDay, setSelectedDay] = useState<Weekday>(() =>
    getWeekdayFromDate(new Date()),
  );
  const [filter, setFilter] = useState<ScheduleFilter>('all');
  const [reservedIds, setReservedIds] = useState<string[]>([]);
  const [reservingId, setReservingId] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const classes = useMemo(
    () => getClassesForDay(selectedDay, filter),
    [filter, selectedDay],
  );

  const handleReserve = (classId: string, title: string) => {
    if (reservedIds.includes(classId)) {
      return;
    }

    setReservingId(classId);
    setBanner(null);

    // Mock reservation latency
    setTimeout(() => {
      setReservedIds((current) => [...current, classId]);
      setReservingId(null);
      setBanner(`Reserved · ${title}`);
    }, 450);
  };

  return (
    <Screen scroll contentStyle={styles.content}>
      <Text variant="hero">Schedule</Text>
      <Spacer size="sm" />
      <Text variant="bodyMuted">
        Open Mat Academy · Tracy, California
      </Text>
      <Spacer size="xxs" />
      <Text variant="caption">
        3200 Naglee Rd, STE #106 · (209) 752-8013
      </Text>

      <Spacer size="lg" />

      <WeeklyCalendar selected={selectedDay} onSelect={setSelectedDay} />

      <Spacer size="lg" />

      <Text variant="label">Filter</Text>
      <Spacer size="sm" />
      <ScheduleFilters selected={filter} onSelect={setFilter} />

      <Spacer size="lg" />

      <Text variant="subtitle">{getWeekdayLabel(selectedDay)}</Text>
      <Spacer size="xs" />
      <Text variant="caption">
        {classes.length} class{classes.length === 1 ? '' : 'es'}
      </Text>

      {banner ? (
        <>
          <Spacer size="md" />
          <Banner tone="success" message={banner} />
        </>
      ) : null}

      <Spacer size="md" />

      {classes.length === 0 ? (
        <View style={styles.empty}>
          <Text variant="bodyMuted">
            No classes match this filter for {getWeekdayLabel(selectedDay)}.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {classes.map((item) => (
            <ClassCard
              key={item.id}
              item={item}
              reserved={reservedIds.includes(item.id)}
              reserving={reservingId === item.id}
              onReserve={() => handleReserve(item.id, item.title)}
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
