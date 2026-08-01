import {
  CLASS_LEVEL_COLORS,
  type ClassLevel,
  type GiType,
} from '@openmat/shared';

/** Week-calendar helpers for Coach Web schedule. */

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function parseISODate(iso: string): Date {
  return new Date(`${iso}T12:00:00`);
}

/** Monday of the week containing `anchor` (local-ish via noon ISO). */
export function startOfWeek(anchor: Date): Date {
  const date = new Date(anchor);
  const day = date.getDay(); // 0 Sun .. 6 Sat
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date;
}

export function addDays(isoDate: string, days: number): string {
  const date = parseISODate(isoDate);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export function weekDays(weekStartISO: string): string[] {
  return Array.from({ length: 7 }, (_, index) => addDays(weekStartISO, index));
}

export function formatWeekRange(weekStartISO: string): string {
  const start = parseISODate(weekStartISO);
  const end = parseISODate(addDays(weekStartISO, 6));
  const opts: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  return `${start.toLocaleDateString(undefined, opts)} – ${end.toLocaleDateString(undefined, opts)}`;
}

export function formatDayHeader(isoDate: string): {
  weekday: string;
  day: string;
} {
  const date = parseISODate(isoDate);
  return {
    weekday: date.toLocaleDateString(undefined, { weekday: 'short' }),
    day: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
  };
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + (m || 0);
}

export function formatHourLabel(hour: number): string {
  if (hour === 0) return '12 am';
  if (hour < 12) return `${hour} am`;
  if (hour === 12) return '12 pm';
  return `${hour - 12} pm`;
}

export const DAY_START_HOUR = 5;
export const DAY_END_HOUR = 22;
export const HOUR_HEIGHT_PX = 64;

export function eventGeometry(startTime: string, endTime: string) {
  const startMin = timeToMinutes(startTime);
  const endMin = Math.max(startMin + 30, timeToMinutes(endTime));
  const top = ((startMin - DAY_START_HOUR * 60) / 60) * HOUR_HEIGHT_PX;
  const height = ((endMin - startMin) / 60) * HOUR_HEIGHT_PX;
  return {
    top: Math.max(0, top),
    height: Math.max(28, height),
  };
}

export type ScheduleFilterKey =
  | 'gi'
  | 'no_gi'
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

export const SCHEDULE_FILTERS: Array<{
  key: ScheduleFilterKey;
  label: string;
  color: string;
}> = [
  { key: 'adult_bjj', label: 'Adult BJJ', color: CLASS_LEVEL_COLORS.adult_bjj },
  { key: 'youth_bjj', label: 'Youth BJJ', color: CLASS_LEVEL_COLORS.youth_bjj },
  {
    key: 'pee_wee_bjj',
    label: 'Pee Wee',
    color: CLASS_LEVEL_COLORS.pee_wee_bjj,
  },
  {
    key: 'womens_bjj',
    label: "Women's BJJ",
    color: CLASS_LEVEL_COLORS.womens_bjj,
  },
  { key: 'boxing', label: 'Boxing', color: CLASS_LEVEL_COLORS.boxing },
  { key: 'muay_thai', label: 'Muay Thai', color: CLASS_LEVEL_COLORS.muay_thai },
  { key: 'wrestling', label: 'Wrestling', color: CLASS_LEVEL_COLORS.wrestling },
  {
    key: 'peak_performance',
    label: 'Peak Perf.',
    color: CLASS_LEVEL_COLORS.peak_performance,
  },
  {
    key: 'taekwondo',
    label: 'Tae Kwon Do',
    color: CLASS_LEVEL_COLORS.taekwondo,
  },
  { key: 'open_mat', label: 'Open Mat', color: '#EAB308' },
  { key: 'gi', label: 'Gi', color: '#FFFFFF' },
  { key: 'no_gi', label: 'No-Gi', color: '#A78BFA' },
  { key: 'kids', label: 'Kids', color: '#FB7185' },
  { key: 'seminar', label: 'Seminar', color: CLASS_LEVEL_COLORS.seminar },
];

export function classAccent(input: {
  level: string;
  giType: string;
  isOpenMat?: boolean;
  isSeminar?: boolean;
}): string {
  if (input.isSeminar || input.level === 'seminar') {
    return CLASS_LEVEL_COLORS.seminar;
  }
  if (input.isOpenMat || input.level === 'open_mat') {
    return '#EAB308';
  }
  if (input.level in CLASS_LEVEL_COLORS) {
    return CLASS_LEVEL_COLORS[input.level as ClassLevel];
  }
  if (input.giType === 'no_gi') return '#A78BFA';
  return '#FFFFFF';
}

export function classMatchesFilters(
  item: {
    level: string;
    giType: string;
    audience?: string;
    isOpenMat?: boolean;
    isSeminar?: boolean;
  },
  active: Set<ScheduleFilterKey>,
): boolean {
  if (active.size === 0) return true;
  const tags: ScheduleFilterKey[] = [];
  if (item.giType === 'gi' || item.giType === 'gi_no_gi') tags.push('gi');
  if (item.giType === 'no_gi' || item.giType === 'gi_no_gi') tags.push('no_gi');
  if (
    item.audience === 'kids' ||
    item.level === 'youth_bjj' ||
    item.level === 'pee_wee_bjj'
  ) {
    tags.push('kids');
  }
  const levels: ClassLevel[] = [
    'adult_bjj',
    'youth_bjj',
    'pee_wee_bjj',
    'womens_bjj',
    'boxing',
    'muay_thai',
    'wrestling',
    'peak_performance',
    'taekwondo',
    'open_mat',
    'seminar',
  ];
  if (levels.includes(item.level as ClassLevel)) {
    tags.push(item.level as ScheduleFilterKey);
  }
  if (item.isOpenMat || item.level === 'open_mat') tags.push('open_mat');
  if (item.isSeminar || item.level === 'seminar') tags.push('seminar');
  return tags.some((tag) => active.has(tag));
}

export function formatGiType(giType: GiType | string): string {
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
      return String(giType);
  }
}
