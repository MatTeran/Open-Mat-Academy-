import { useMemo, useState } from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {
  CLASS_LEVEL_COLORS,
  CLASS_LEVEL_LABELS,
  WEEKDAYS,
} from '../../lib/data/schedule';
import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import type { ClassLevel, GiType, ScheduleClass, Weekday } from '../../types/schedule';
import { formatClock } from '../../utils/schedule';
import {
  durationToHeight,
  layoutDayClasses,
  minutesToY,
  visibleHourRange,
} from '../../utils/scheduleLayout';
import { Text } from '../ui/Text';

const HOUR_HEIGHT = 48;
const TIME_GUTTER = 40;
/** Wide enough for a short program name; week scrolls horizontally. */
const MIN_DAY_WIDTH = 118;
/** Cascade inset for overlapping classes (keeps each block nearly full-width). */
const CASCADE_INSET = 14;

const SHORT_LEVEL: Record<ClassLevel, string> = {
  adult_bjj: 'Adult',
  youth_bjj: 'Youth',
  pee_wee_bjj: 'Pee Wee',
  womens_bjj: 'Women',
  boxing: 'Boxing',
  muay_thai: 'Muay Thai',
  wrestling: 'Wrestling',
  peak_performance: 'Peak',
  taekwondo: 'TKD',
  open_mat: 'Open Mat',
};

interface ScheduleWeekGridProps {
  classes: ScheduleClass[];
  weekDates: Record<Weekday, Date>;
  selectedDay: Weekday;
  onSelectDay: (day: Weekday) => void;
  onPressClass: (item: ScheduleClass) => void;
}

function needsDarkText(color: string): boolean {
  return (
    color === '#38BDF8' ||
    color === '#2DD4BF' ||
    color === '#86EFAC' ||
    color === '#FDE68A' ||
    color === '#E7E5E4' ||
    color === '#F472B6' ||
    color === '#D6A35C'
  );
}

function formatHourLabel(hour: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}${period}`;
}

function giSuffix(giType: GiType): string | null {
  if (giType === 'gi') {
    return 'Gi';
  }
  if (giType === 'no_gi') {
    return 'No-Gi';
  }
  return null;
}

/** Compact label that fits a phone week column. */
function weekBlockLabel(item: ScheduleClass, width: number): string {
  const base = SHORT_LEVEL[item.level] ?? CLASS_LEVEL_LABELS[item.level];
  const gi = giSuffix(item.giType);

  if (width >= 96 && gi) {
    return `${base} · ${gi}`;
  }
  if (width >= 72) {
    return base;
  }
  return base.split(' ')[0] ?? base;
}

/**
 * Timed week calendar grid.
 * Absolute layout lives on Views — never on Pressable (NativeWind-safe).
 */
export function ScheduleWeekGrid({
  classes,
  weekDates,
  selectedDay,
  onSelectDay,
  onPressClass,
}: ScheduleWeekGridProps) {
  const { colors } = useAppTheme();
  const [gridWidth, setGridWidth] = useState(0);

  const { startHour, endHour } = useMemo(
    () => visibleHourRange(classes),
    [classes],
  );

  const hours = useMemo(
    () =>
      Array.from({ length: endHour - startHour }, (_, index) => startHour + index),
    [startHour, endHour],
  );

  const gridHeight = (endHour - startHour) * HOUR_HEIGHT;

  const dayWidth = useMemo(() => {
    if (gridWidth <= 0) {
      return MIN_DAY_WIDTH;
    }
    const fitted = (gridWidth - TIME_GUTTER) / 7;
    return Math.max(fitted, MIN_DAY_WIDTH);
  }, [gridWidth]);

  const contentWidth = TIME_GUTTER + dayWidth * 7;
  const scrollsHorizontally = contentWidth > gridWidth + 1;

  const byDay = useMemo(() => {
    const map = {} as Record<Weekday, ReturnType<typeof layoutDayClasses>>;
    for (const day of WEEKDAYS) {
      map[day.key] = layoutDayClasses(
        classes.filter((item) => item.day === day.key),
      );
    }
    return map;
  }, [classes]);

  const onGridLayout = (event: LayoutChangeEvent) => {
    setGridWidth(event.nativeEvent.layout.width);
  };

  return (
    <View
      style={[
        styles.shell,
        {
          backgroundColor: colors.secondaryBackground,
          borderColor: colors.border,
        },
      ]}
      onLayout={onGridLayout}
    >
      <ScrollView
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={scrollsHorizontally}
        nestedScrollEnabled
      >
        <View style={{ width: contentWidth }}>
          <View
            style={[styles.dayHeaderRow, { borderBottomColor: colors.border }]}
          >
            <View style={{ width: TIME_GUTTER }} />
            {WEEKDAYS.map((day) => {
              const active = day.key === selectedDay;
              const dateNumber = weekDates[day.key].getDate();
              return (
                <View key={day.key} style={{ width: dayWidth }}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${day.label} ${dateNumber}`}
                    onPress={() => onSelectDay(day.key)}
                    style={({ pressed }) => [pressed && styles.pressed]}
                  >
                    <View
                      style={[
                        styles.dayHeader,
                        active && { backgroundColor: colors.goldMuted },
                      ]}
                    >
                      <Text
                        variant="caption"
                        style={{
                          color: active
                            ? colors.goldAccent
                            : colors.secondaryText,
                        }}
                      >
                        {day.short}
                      </Text>
                      <Text
                        variant="subtitle"
                        style={{
                          fontSize: 16,
                          color: active ? colors.goldAccent : colors.text,
                        }}
                      >
                        {dateNumber}
                      </Text>
                      <View
                        style={[
                          styles.activeDot,
                          {
                            backgroundColor: active
                              ? colors.goldAccent
                              : 'transparent',
                          },
                        ]}
                      />
                    </View>
                  </Pressable>
                </View>
              );
            })}
          </View>

          <ScrollView
            style={styles.verticalScroll}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
            <View style={[styles.grid, { height: gridHeight }]}>
              {hours.map((hour) => {
                const top = (hour - startHour) * HOUR_HEIGHT;
                return (
                  <View
                    key={`line-${hour}`}
                    pointerEvents="none"
                    style={[styles.hourLineWrap, { top }]}
                  >
                    <Text
                      variant="caption"
                      style={[
                        styles.hourLabel,
                        { color: colors.secondaryText },
                      ]}
                    >
                      {formatHourLabel(hour)}
                    </Text>
                    <View
                      style={[
                        styles.hourLine,
                        { backgroundColor: colors.border },
                      ]}
                    />
                  </View>
                );
              })}

              <View
                style={[
                  styles.columnsRow,
                  {
                    marginLeft: TIME_GUTTER,
                    width: dayWidth * 7,
                  },
                ]}
              >
                {WEEKDAYS.map((day) => {
                  const laidOut = byDay[day.key];
                  return (
                    <View
                      key={day.key}
                      style={[
                        styles.dayColumn,
                        {
                          width: dayWidth,
                          height: gridHeight,
                          borderLeftColor: colors.border,
                        },
                      ]}
                    >
                      {laidOut.map((entry) => {
                        const color = CLASS_LEVEL_COLORS[entry.item.level];
                        const textColor = needsDarkText(color)
                          ? '#0D0D0D'
                          : '#FFFFFF';
                        const top = minutesToY(
                          entry.startMinutes,
                          startHour,
                          HOUR_HEIGHT,
                        );
                        const height = durationToHeight(
                          entry.startMinutes,
                          entry.endMinutes,
                          HOUR_HEIGHT,
                        );
                        const cascadeCount = Math.max(entry.columns, 1);
                        const left = 3 + entry.column * CASCADE_INSET;
                        const idealWidth =
                          dayWidth - 6 - (cascadeCount - 1) * CASCADE_INSET;
                        const slotWidth = Math.max(
                          Math.min(idealWidth, dayWidth - left - 2),
                          64,
                        );
                        const slotHeight = Math.max(height - 2, 24);
                        const label = weekBlockLabel(entry.item, slotWidth);
                        const showTime = slotHeight >= 40 && slotWidth >= 88;

                        return (
                          <View
                            key={entry.item.id}
                            style={[
                              styles.eventSlot,
                              {
                                top,
                                left,
                                width: slotWidth,
                                height: slotHeight,
                                zIndex: entry.column + 1,
                              },
                            ]}
                          >
                            <Pressable
                              accessibilityRole="button"
                              accessibilityLabel={`${entry.item.title} ${formatClock(entry.item.startTime)}`}
                              onPress={() => onPressClass(entry.item)}
                              style={({ pressed }) => [
                                pressed && styles.pressed,
                              ]}
                            >
                              <View
                                style={[
                                  styles.eventBlock,
                                  {
                                    backgroundColor: color,
                                    width: slotWidth,
                                    height: slotHeight,
                                    borderColor: colors.secondaryBackground,
                                  },
                                ]}
                              >
                                <Text
                                  numberOfLines={1}
                                  ellipsizeMode="tail"
                                  style={[
                                    styles.eventTitle,
                                    { color: textColor },
                                  ]}
                                >
                                  {label}
                                </Text>
                                {showTime ? (
                                  <Text
                                    numberOfLines={1}
                                    style={[
                                      styles.eventTime,
                                      { color: textColor },
                                    ]}
                                  >
                                    {formatClock(entry.item.startTime)}
                                  </Text>
                                ) : null}
                              </View>
                            </Pressable>
                          </View>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: '100%',
    borderRadius: radii.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  dayHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dayHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    gap: 2,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  verticalScroll: {
    maxHeight: 460,
  },
  grid: {
    position: 'relative',
  },
  hourLineWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: HOUR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  hourLabel: {
    width: TIME_GUTTER - 4,
    textAlign: 'right',
    fontSize: 10,
    marginTop: -5,
    paddingRight: 4,
  },
  hourLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  columnsRow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  dayColumn: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    position: 'relative',
  },
  eventSlot: {
    position: 'absolute',
    overflow: 'hidden',
  },
  eventBlock: {
    borderRadius: radii.sm,
    paddingHorizontal: 6,
    paddingVertical: 3,
    overflow: 'hidden',
    justifyContent: 'flex-start',
    borderWidth: StyleSheet.hairlineWidth,
  },
  eventTitle: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 15,
    letterSpacing: -0.2,
  },
  eventTime: {
    fontSize: 10,
    marginTop: 1,
    opacity: 0.92,
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.88,
  },
});
