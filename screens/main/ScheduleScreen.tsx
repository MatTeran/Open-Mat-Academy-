import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Banner,
  ClassCard,
  ScheduleFilters,
  Spacer,
  Text,
  WeeklyCalendar,
} from '../../components';
import { APP_NAME } from '../../lib/constants';
import { WEEKDAYS } from '../../lib/data/schedule';
import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { spacing } from '../../lib/theme';
import type { ScheduleFilter, Weekday } from '../../types/schedule';
import {
  getClassesForDay,
  getWeekdayFromDate,
  getWeekdayLabel,
} from '../../utils/schedule';

export function ScheduleScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const [selectedDay, setSelectedDay] = useState<Weekday>(() =>
    getWeekdayFromDate(new Date()),
  );
  const [filter, setFilter] = useState<ScheduleFilter>('all');
  const [reservedIds, setReservedIds] = useState<string[]>([]);
  const [reservingId, setReservingId] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const classCounts = useMemo(() => {
    return WEEKDAYS.reduce(
      (acc, day) => {
        acc[day.key] = getClassesForDay(day.key, filter).length;
        return acc;
      },
      {} as Record<Weekday, number>,
    );
  }, [filter]);

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

    setTimeout(() => {
      setReservedIds((current) => [...current, classId]);
      setReservingId(null);
      setBanner(`Reserved · ${title}`);
    }, 450);
  };

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.primaryBackground,
          paddingTop: insets.top + spacing.md,
        },
      ]}
    >
      <View style={styles.header}>
        <Text variant="hero">Schedule</Text>
        <Spacer size="sm" />
        <Text variant="bodyMuted">
          {APP_NAME} · Tracy, California
        </Text>

        <Spacer size="lg" />

        <WeeklyCalendar
          selected={selectedDay}
          onSelect={setSelectedDay}
          classCounts={classCounts}
        />

        <Spacer size="lg" />

        <Text variant="label">Filter</Text>
        <Spacer size="sm" />
        <ScheduleFilters selected={filter} onSelect={setFilter} />

        <Spacer size="lg" />

        <Text variant="subtitle">{getWeekdayLabel(selectedDay)}</Text>
        <Spacer size="xs" />
        <Text variant="caption">
          {classes.length} class{classes.length === 1 ? '' : 'es'}
          {filter !== 'all' ? ' · filtered' : ''}
        </Text>

        {banner ? (
          <>
            <Spacer size="md" />
            <Banner tone="success" message={banner} />
          </>
        ) : null}
      </View>

      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + spacing.xxl },
          classes.length === 0 && styles.emptyList,
        ]}
        style={styles.listFlex}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text variant="bodyMuted">
              No classes match this filter for {getWeekdayLabel(selectedDay)}.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ClassCard
            item={item}
            reserved={reservedIds.includes(item.id)}
            reserving={reservingId === item.id}
            onReserve={() => handleReserve(item.id, item.title)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
  },
  listFlex: {
    flex: 1,
    marginTop: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  emptyList: {
    flexGrow: 1,
  },
  empty: {
    paddingVertical: spacing.xl,
  },
});
