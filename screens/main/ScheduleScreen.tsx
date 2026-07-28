import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Banner,
  ClassCard,
  ScheduleFilters,
  ScheduleGiFilters,
  ScheduleViewToggle,
  ScheduleWeekGrid,
  Screen,
  Spacer,
  Text,
  WeeklyCalendar,
} from '../../components';
import { APP_NAME } from '../../lib/constants';
import { useAppTheme } from '../../hooks';
import {
  scheduleClassReminder,
} from '../../lib/notifications';
import { spacing } from '../../lib/theme';
import type {
  ScheduleClass,
  ScheduleFilter,
  ScheduleGiFilter,
  ScheduleViewMode,
  Weekday,
} from '../../types/schedule';
import {
  getClassesForDay,
  getClassesForWeek,
  getNextWeekAnchor,
  getWeekDates,
  getWeekdayLabel,
} from '../../utils/schedule';

function classStartsAt(
  item: ScheduleClass,
  weekDates: Record<Weekday, Date>,
): Date {
  const dayDate = new Date(weekDates[item.day]);
  const [hours, minutes] = item.startTime.split(':').map(Number);
  dayDate.setHours(hours, minutes, 0, 0);
  return dayDate;
}

export function ScheduleScreen() {
  const { colors } = useAppTheme();
  const [viewMode, setViewMode] = useState<ScheduleViewMode>('day');
  const [selectedDay, setSelectedDay] = useState<Weekday>('mon');
  const [filter, setFilter] = useState<ScheduleFilter>('all');
  const [giFilter, setGiFilter] = useState<ScheduleGiFilter>('all');
  const [reservedIds, setReservedIds] = useState<string[]>([]);
  const [reservingId, setReservingId] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const weekAnchor = useMemo(() => getNextWeekAnchor(), []);
  const weekDates = useMemo(() => getWeekDates(weekAnchor), [weekAnchor]);
  const weekRangeLabel = useMemo(() => {
    const start = weekDates.mon;
    const end = weekDates.sun;
    const startText = start.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
    const endText = end.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
    return `${startText} – ${endText}`;
  }, [weekDates]);

  const dayClasses = useMemo(
    () => getClassesForDay(selectedDay, filter, giFilter),
    [filter, giFilter, selectedDay],
  );

  const weekClasses = useMemo(
    () => getClassesForWeek(filter, giFilter),
    [filter, giFilter],
  );

  const handleReserve = (classId: string, title: string) => {
    if (reservedIds.includes(classId)) {
      return;
    }

    setReservingId(classId);
    setBanner(null);

    const reservedClass =
      dayClasses.find((item) => item.id === classId) ??
      weekClasses.find((item) => item.id === classId);

    setTimeout(() => {
      setReservedIds((current) => [...current, classId]);
      setReservingId(null);
      setBanner(`Reserved · ${title}`);

      if (reservedClass) {
        void scheduleClassReminder({
          classId: reservedClass.id,
          classTitle: reservedClass.title,
          startsAt: classStartsAt(reservedClass, weekDates),
        });
      }
    }, 450);
  };

  const openClassInDayView = (item: ScheduleClass) => {
    setSelectedDay(item.day);
    setViewMode('day');
  };

  const selectedDateLabel = weekDates[selectedDay].toLocaleDateString(
    undefined,
    {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    },
  );

  return (
    <Screen scroll contentStyle={styles.content}>
      <Text variant="hero">Schedule</Text>
      <Spacer size="sm" />
      <Text variant="bodyMuted">
        {APP_NAME} · Tracy, California · Next week
      </Text>
      <Spacer size="xxs" />
      <Text variant="caption" style={{ color: colors.secondaryText }}>
        {weekRangeLabel}
      </Text>

      <Spacer size="lg" />
      <ScheduleViewToggle value={viewMode} onChange={setViewMode} />

      <Spacer size="lg" />

      {viewMode === 'day' ? (
        <WeeklyCalendar
          selected={selectedDay}
          onSelect={setSelectedDay}
          weekAnchor={weekAnchor}
          headerLabel="Next Week"
        />
      ) : null}

      <Spacer size={viewMode === 'day' ? 'lg' : 'none'} />

      <Text variant="label">Program</Text>
      <Spacer size="sm" />
      <ScheduleFilters selected={filter} onSelect={setFilter} />

      <Spacer size="md" />
      <Text variant="label">BJJ format</Text>
      <Spacer size="sm" />
      <ScheduleGiFilters selected={giFilter} onSelect={setGiFilter} />

      {banner ? (
        <>
          <Spacer size="md" />
          <Banner tone="success" message={banner} />
        </>
      ) : null}

      <Spacer size="lg" />

      {viewMode === 'day' ? (
        <>
          <Text variant="subtitle">{getWeekdayLabel(selectedDay)}</Text>
          <Spacer size="xxs" />
          <Text variant="caption" style={{ color: colors.secondaryText }}>
            {selectedDateLabel} · {dayClasses.length} class
            {dayClasses.length === 1 ? '' : 'es'}
          </Text>

          <Spacer size="md" />

          {dayClasses.length === 0 ? (
            <View style={styles.empty}>
              <Text variant="bodyMuted">
                No classes match this filter for {getWeekdayLabel(selectedDay)}.
              </Text>
            </View>
          ) : (
            <View style={styles.list}>
              {dayClasses.map((item) => (
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
        </>
      ) : (
        <>
          <Text variant="caption" style={{ color: colors.secondaryText }}>
            {weekClasses.length} class{weekClasses.length === 1 ? '' : 'es'} ·
            swipe for more days · tap a block for details
          </Text>
          <Spacer size="sm" />
          <ScheduleWeekGrid
            classes={weekClasses}
            weekDates={weekDates}
            selectedDay={selectedDay}
            onSelectDay={(day) => {
              setSelectedDay(day);
              setViewMode('day');
            }}
            onPressClass={openClassInDayView}
          />
        </>
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
