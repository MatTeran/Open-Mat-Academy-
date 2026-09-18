import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import {
  Banner,
  ClassCard,
  FadeIn,
  MyClassesStrip,
  ScheduleFilterSheet,
  ScheduleViewToggle,
  ScheduleWeekGrid,
  Screen,
  Spacer,
  Text,
  WeeklyCalendar,
} from '../../components';
import { ACADEMY } from '../../lib/constants';
import {
  CLASS_LEVEL_LABELS,
  SCHEDULE_FILTERS,
  SCHEDULE_GI_FILTERS,
} from '../../lib/data/schedule';
import { useAppTheme, useReservations } from '../../hooks';
import { fontFamilies, spacing } from '../../lib/theme';
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
  getScheduleClassById,
  getThisWeekAnchor,
  getWeekDates,
  getWeekdayFromDate,
  getWeekdayLabel,
} from '../../utils/schedule';

type ListFocus = 'all' | 'mine';

function classStartsAt(
  item: ScheduleClass,
  weekDates: Record<Weekday, Date>,
): Date {
  const dayDate = new Date(weekDates[item.day]);
  const [hours, minutes] = item.startTime.split(':').map(Number);
  dayDate.setHours(hours, minutes, 0, 0);
  return dayDate;
}

function filterSummary(
  program: ScheduleFilter,
  gi: ScheduleGiFilter,
): string | null {
  const parts: string[] = [];
  if (program !== 'all') {
    parts.push(
      SCHEDULE_FILTERS.find((item) => item.key === program)?.label ??
        CLASS_LEVEL_LABELS[program],
    );
  }
  if (gi !== 'all') {
    parts.push(
      SCHEDULE_GI_FILTERS.find((item) => item.key === gi)?.label ?? gi,
    );
  }
  if (parts.length === 0) {
    return null;
  }
  return `Showing · ${parts.join(' · ')}`;
}

export function ScheduleScreen() {
  const { colors } = useAppTheme();
  const {
    isReserved,
    reservingId,
    reserveClass,
    cancelReservation,
    upcomingReserved,
  } = useReservations();

  const [viewMode, setViewMode] = useState<ScheduleViewMode>('day');
  const [selectedDay, setSelectedDay] = useState<Weekday>(
    getWeekdayFromDate(new Date()),
  );
  const [filter, setFilter] = useState<ScheduleFilter>('all');
  const [giFilter, setGiFilter] = useState<ScheduleGiFilter>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [listFocus, setListFocus] = useState<ListFocus>('all');
  const [banner, setBanner] = useState<string | null>(null);

  const weekAnchor = useMemo(() => getThisWeekAnchor(), []);
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

  const summary = filterSummary(filter, giFilter);

  const selectedDateLabel = weekDates[selectedDay].toLocaleDateString(
    undefined,
    {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    },
  );

  const handleReserve = async (item: ScheduleClass) => {
    if (isReserved(item.id)) {
      return;
    }
    setBanner(null);
    await reserveClass(item, classStartsAt(item, weekDates));
    setBanner(`Reserved · ${item.title}`);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const confirmCancel = (classId: string, title: string) => {
    Alert.alert('Cancel reservation?', `Remove your spot in ${title}?`, [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Cancel spot',
        style: 'destructive',
        onPress: () => {
          void cancelReservation(classId);
          setBanner(`Canceled · ${title}`);
          void Haptics.selectionAsync();
        },
      },
    ]);
  };

  const openClassInDayView = (item: ScheduleClass) => {
    setSelectedDay(item.day);
    setViewMode('day');
    setListFocus('all');
  };

  return (
    <Screen scroll contentStyle={styles.content}>
      <FadeIn>
        <Text style={[styles.brand, { color: colors.goldAccent }]}>
          {ACADEMY.brandName.toUpperCase()} ·{' '}
          {ACADEMY.city.replace(', CA', '').toUpperCase()}
        </Text>
        <Text variant="hero" style={styles.hero}>
          Schedule
        </Text>
        <Text variant="bodyMuted">This week · Tracy academy floor</Text>
      </FadeIn>

      <Spacer size="md" />
      <ScheduleViewToggle value={viewMode} onChange={setViewMode} />
      <Spacer size="xs" />
      <Text variant="caption" style={{ color: colors.secondaryText }}>
        {weekRangeLabel}
      </Text>

      {viewMode === 'day' ? (
        <>
          <Spacer size="md" />
          <WeeklyCalendar
            selected={selectedDay}
            onSelect={(day) => {
              setSelectedDay(day);
              setListFocus('all');
            }}
            weekAnchor={weekAnchor}
          />
        </>
      ) : null}

      {listFocus === 'all' && upcomingReserved.length > 0 ? (
        <>
          <Spacer size="lg" />
          <MyClassesStrip
            classes={upcomingReserved}
            onPressClass={(entry) => {
              setSelectedDay(entry.item.day);
              setViewMode('day');
              setListFocus('all');
            }}
            onCancel={(classId) => {
              const item = getScheduleClassById(classId);
              confirmCancel(classId, item?.title ?? 'class');
            }}
            onSeeAll={() => {
              setListFocus('mine');
              setViewMode('day');
              void Haptics.selectionAsync();
            }}
          />
        </>
      ) : null}

      <Spacer size="md" />
      <View style={styles.focusRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: listFocus === 'all' }}
          onPress={() => setListFocus('all')}
          style={[
            styles.focusPill,
            {
              backgroundColor:
                listFocus === 'all' ? colors.goldAccent : colors.cardBackground,
              borderColor:
                listFocus === 'all' ? colors.goldAccent : colors.border,
            },
          ]}
        >
          <Text
            style={{
              fontFamily: fontFamilies.semibold,
              fontSize: 12,
              color:
                listFocus === 'all'
                  ? colors.cardBackground
                  : colors.secondaryText,
            }}
          >
            All classes
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: listFocus === 'mine' }}
          onPress={() => setListFocus('mine')}
          style={[
            styles.focusPill,
            {
              backgroundColor:
                listFocus === 'mine' ? colors.goldAccent : colors.cardBackground,
              borderColor:
                listFocus === 'mine' ? colors.goldAccent : colors.border,
            },
          ]}
        >
          <Text
            style={{
              fontFamily: fontFamilies.semibold,
              fontSize: 12,
              color:
                listFocus === 'mine'
                  ? colors.cardBackground
                  : colors.secondaryText,
            }}
          >
            My classes
            {upcomingReserved.length > 0
              ? ` · ${upcomingReserved.length}`
              : ''}
          </Text>
        </Pressable>
      </View>

      {listFocus === 'all' ? (
        <>
          <Spacer size="md" />
          <View style={styles.tools}>
            <Text style={[styles.dateLabel, { color: colors.text }]}>
              {viewMode === 'day' ? selectedDateLabel : 'Full week'}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open filters"
              onPress={() => setFiltersOpen(true)}
              style={[styles.filterBtn, { backgroundColor: colors.goldMuted }]}
            >
              <Ionicons name="options-outline" size={14} color={colors.goldAccent} />
              <Text
                style={{
                  color: colors.goldAccent,
                  fontFamily: fontFamilies.semibold,
                  fontSize: 12,
                }}
              >
                Filters
              </Text>
            </Pressable>
          </View>
          {summary ? (
            <Text
              variant="caption"
              style={{ color: colors.secondaryText, marginTop: 4 }}
            >
              {summary}
            </Text>
          ) : null}
        </>
      ) : null}

      {banner ? (
        <>
          <Spacer size="md" />
          <Banner tone="success" message={banner} />
        </>
      ) : null}

      <Spacer size="md" />

      {listFocus === 'mine' ? (
        upcomingReserved.length === 0 ? (
          <View style={styles.empty}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No reservations yet
            </Text>
            <Text variant="bodyMuted">
              Reserve a class from the day list and it will show up here.
            </Text>
            <Spacer size="md" />
            <Pressable
              onPress={() => setListFocus('all')}
              style={[styles.filterBtn, { backgroundColor: colors.goldMuted }]}
            >
              <Text
                style={{
                  color: colors.goldAccent,
                  fontFamily: fontFamilies.semibold,
                  fontSize: 12,
                }}
              >
                Browse classes
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.list}>
            {upcomingReserved.map(({ item }) => (
              <ClassCard
                key={item.id}
                item={item}
                reserved
                onReserve={() => undefined}
                onCancel={() => confirmCancel(item.id, item.title)}
              />
            ))}
            <Text
              variant="caption"
              style={{
                color: colors.secondaryText,
                textAlign: 'center',
                marginTop: spacing.sm,
              }}
            >
              That’s everything on your mat this week.
            </Text>
          </View>
        )
      ) : viewMode === 'day' ? (
        dayClasses.length === 0 ? (
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
                reserved={isReserved(item.id)}
                reserving={reservingId === item.id}
                onReserve={() => {
                  void handleReserve(item);
                }}
                onCancel={() => confirmCancel(item.id, item.title)}
              />
            ))}
          </View>
        )
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

      <ScheduleFilterSheet
        visible={filtersOpen}
        program={filter}
        gi={giFilter}
        onChangeProgram={setFilter}
        onChangeGi={setGiFilter}
        onClose={() => setFiltersOpen(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {},
  brand: {
    fontFamily: fontFamilies.semibold,
    fontSize: 11,
    letterSpacing: 1.2,
  },
  hero: {
    marginTop: 2,
    marginBottom: 4,
  },
  focusRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  focusPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  tools: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  dateLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: 14,
    flex: 1,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  list: {
    gap: spacing.sm,
  },
  empty: {
    paddingVertical: spacing.xl,
    alignItems: 'flex-start',
  },
  emptyTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: 15,
    marginBottom: 6,
  },
  bottomSpace: {
    height: spacing.lg,
  },
});
