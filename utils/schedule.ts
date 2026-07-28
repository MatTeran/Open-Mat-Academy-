import {
  CLASS_LEVEL_LABELS,
  WEEKDAYS,
  WEEKLY_SCHEDULE,
} from '../lib/data/schedule';
import type { NextClass } from '../types/home';
import type {
  ClassLevel,
  GiType,
  ScheduleClass,
  ScheduleFilter,
  ScheduleGiFilter,
  Weekday,
} from '../types/schedule';

const WEEKDAY_BY_JS_DAY: Weekday[] = [
  'sun',
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
];

export function getWeekdayFromDate(date: Date): Weekday {
  return WEEKDAY_BY_JS_DAY[date.getDay()] ?? 'mon';
}

export function getWeekdayLabel(day: Weekday): string {
  return WEEKDAYS.find((item) => item.key === day)?.label ?? day;
}

function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function durationMinutes(startTime: string, endTime: string): number {
  return Math.max(parseTimeToMinutes(endTime) - parseTimeToMinutes(startTime), 0);
}

export function formatTimeRange(startTime: string, endTime: string): string {
  return `${formatClock(startTime)} – ${formatClock(endTime)}`;
}

export function formatClock(time: string): string {
  const [hourRaw, minuteRaw] = time.split(':').map(Number);
  const period = hourRaw >= 12 ? 'PM' : 'AM';
  const hour12 = hourRaw % 12 || 12;
  return `${hour12}:${String(minuteRaw).padStart(2, '0')} ${period}`;
}

export function formatGiType(giType: GiType): string {
  switch (giType) {
    case 'gi':
      return 'Gi';
    case 'no_gi':
      return 'No-Gi';
    case 'gi_no_gi':
      return 'Gi / No-Gi';
    case 'none':
      return 'No gi required';
    default:
      return giType;
  }
}

/** Monday of the upcoming week (if today is Monday, returns next Monday). */
export function getNextWeekAnchor(from = new Date()): Date {
  const date = new Date(from);
  date.setHours(12, 0, 0, 0);
  const jsDay = date.getDay();
  const daysUntilNextMonday = jsDay === 0 ? 1 : 8 - jsDay;
  date.setDate(date.getDate() + daysUntilNextMonday);
  return date;
}

function matchesGiFilter(
  giType: GiType,
  giFilter: ScheduleGiFilter,
): boolean {
  if (giFilter === 'all') {
    return true;
  }
  if (giFilter === 'gi') {
    return giType === 'gi' || giType === 'gi_no_gi';
  }
  return giType === 'no_gi' || giType === 'gi_no_gi';
}

function matchesProgramFilter(
  level: ClassLevel,
  filter: ScheduleFilter,
): boolean {
  if (filter === 'all') {
    return true;
  }
  return level === filter;
}

export function getClassesForDay(
  day: Weekday,
  filter: ScheduleFilter = 'all',
  giFilter: ScheduleGiFilter = 'all',
): ScheduleClass[] {
  return WEEKLY_SCHEDULE.filter((item) => {
    if (item.day !== day) {
      return false;
    }
    if (!matchesProgramFilter(item.level, filter)) {
      return false;
    }
    return matchesGiFilter(item.giType, giFilter);
  }).sort(
    (a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime),
  );
}

export function getClassesForWeek(
  filter: ScheduleFilter = 'all',
  giFilter: ScheduleGiFilter = 'all',
): ScheduleClass[] {
  return WEEKLY_SCHEDULE.filter((item) => {
    if (!matchesProgramFilter(item.level, filter)) {
      return false;
    }
    return matchesGiFilter(item.giType, giFilter);
  }).sort((a, b) => {
    const dayDiff =
      WEEKDAYS.findIndex((day) => day.key === a.day) -
      WEEKDAYS.findIndex((day) => day.key === b.day);
    if (dayDiff !== 0) {
      return dayDiff;
    }
    return parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime);
  });
}

export function groupClassesByDay(
  classes: ScheduleClass[],
): Array<{ day: Weekday; classes: ScheduleClass[] }> {
  return WEEKDAYS.map((day) => ({
    day: day.key,
    classes: classes
      .filter((item) => item.day === day.key)
      .sort(
        (a, b) =>
          parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime),
      ),
  }));
}

/** Dates for the week containing `anchor` (Mon–Sun). */
export function getWeekDates(anchor = new Date()): Record<Weekday, Date> {
  const date = new Date(anchor);
  date.setHours(12, 0, 0, 0);
  const jsDay = date.getDay();
  const mondayOffset = jsDay === 0 ? -6 : 1 - jsDay;

  const monday = new Date(date);
  monday.setDate(date.getDate() + mondayOffset);

  return WEEKDAYS.reduce(
    (acc, day, index) => {
      const value = new Date(monday);
      value.setDate(monday.getDate() + index);
      acc[day.key] = value;
      return acc;
    },
    {} as Record<Weekday, Date>,
  );
}

function buildOccurrenceDate(from: Date, dayOffset: number, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date(from);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export function getNextScheduledClass(now = new Date()): {
  classItem: ScheduleClass;
  startsAt: Date;
} | null {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const todayIndex = now.getDay();

  for (let offset = 0; offset < 7; offset += 1) {
    const jsDay = (todayIndex + offset) % 7;
    const weekday = WEEKDAY_BY_JS_DAY[jsDay];
    const classes = getClassesForDay(weekday, 'all');

    for (const classItem of classes) {
      const startMinutes = parseTimeToMinutes(classItem.startTime);
      if (offset === 0 && startMinutes <= currentMinutes) {
        continue;
      }

      return {
        classItem,
        startsAt: buildOccurrenceDate(now, offset, classItem.startTime),
      };
    }
  }

  return null;
}

export function toNextClassCardModel(now = new Date()): NextClass | null {
  const next = getNextScheduledClass(now);
  if (!next) {
    return null;
  }

  const giLabel =
    next.classItem.giType === 'none'
      ? CLASS_LEVEL_LABELS[next.classItem.level]
      : formatGiType(next.classItem.giType);

  return {
    id: next.classItem.id,
    title: next.classItem.title,
    coach: next.classItem.instructor,
    startsAt: next.startsAt.toISOString(),
    room: `${giLabel} · Tracy`,
    durationMinutes: durationMinutes(
      next.classItem.startTime,
      next.classItem.endTime,
    ),
  };
}

export function isClassLevel(value: string): value is ClassLevel {
  return (
    value === 'adult_bjj' ||
    value === 'youth_bjj' ||
    value === 'pee_wee_bjj' ||
    value === 'womens_bjj' ||
    value === 'boxing' ||
    value === 'muay_thai' ||
    value === 'wrestling' ||
    value === 'peak_performance' ||
    value === 'taekwondo' ||
    value === 'open_mat'
  );
}
