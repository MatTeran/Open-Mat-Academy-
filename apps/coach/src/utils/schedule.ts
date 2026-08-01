import type { ClassLevel, GiType, Weekday } from '@openmat/shared';
import { CLASS_LEVEL_LABELS as SHARED_LEVEL_LABELS } from '@openmat/shared';

export const WEEKDAYS: { key: Weekday; label: string; short: string }[] = [
  { key: 'mon', label: 'Monday', short: 'Mon' },
  { key: 'tue', label: 'Tuesday', short: 'Tue' },
  { key: 'wed', label: 'Wednesday', short: 'Wed' },
  { key: 'thu', label: 'Thursday', short: 'Thu' },
  { key: 'fri', label: 'Friday', short: 'Fri' },
  { key: 'sat', label: 'Saturday', short: 'Sat' },
  { key: 'sun', label: 'Sunday', short: 'Sun' },
];

export type CoachScheduleFilter =
  | 'all'
  | 'adult_bjj'
  | 'youth_bjj'
  | 'pee_wee_bjj'
  | 'womens_bjj'
  | 'boxing'
  | 'muay_thai'
  | 'wrestling'
  | 'peak_performance'
  | 'taekwondo'
  | 'open_mat'
  | 'seminar'
  | 'kids';

export const SCHEDULE_FILTERS: { key: CoachScheduleFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'adult_bjj', label: 'Adult BJJ' },
  { key: 'youth_bjj', label: 'Youth BJJ' },
  { key: 'pee_wee_bjj', label: 'Pee Wee' },
  { key: 'womens_bjj', label: "Women's" },
  { key: 'boxing', label: 'Boxing' },
  { key: 'muay_thai', label: 'Muay Thai' },
  { key: 'wrestling', label: 'Wrestling' },
  { key: 'peak_performance', label: 'Peak Perf.' },
  { key: 'taekwondo', label: 'TKD' },
  { key: 'open_mat', label: 'Open Mat' },
  { key: 'kids', label: 'Kids' },
  { key: 'seminar', label: 'Seminar' },
];

export const CLASS_LEVEL_LABELS: Record<ClassLevel, string> = SHARED_LEVEL_LABELS;

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

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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

function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function formatClock(time: string): string {
  const [hourRaw, minuteRaw] = time.split(':').map(Number);
  const period = hourRaw >= 12 ? 'PM' : 'AM';
  const hour12 = hourRaw % 12 || 12;
  return `${hour12}:${String(minuteRaw).padStart(2, '0')} ${period}`;
}

export function formatTimeRange(startTime: string, endTime: string): string {
  return `${formatClock(startTime)} – ${formatClock(endTime)}`;
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
      return 'Open format';
    default:
      return giType;
  }
}

export function sortByStartTime<T extends { startTime: string }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime),
  );
}
