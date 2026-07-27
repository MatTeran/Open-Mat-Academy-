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

export function formatDayHeader(isoDate: string): { weekday: string; day: string } {
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
  const top =
    ((startMin - DAY_START_HOUR * 60) / 60) * HOUR_HEIGHT_PX;
  const height = ((endMin - startMin) / 60) * HOUR_HEIGHT_PX;
  return {
    top: Math.max(0, top),
    height: Math.max(28, height),
  };
}

export type ScheduleFilterKey =
  | 'gi'
  | 'no_gi'
  | 'kids'
  | 'fundamentals'
  | 'advanced'
  | 'open_mat'
  | 'competition'
  | 'seminar';

export const SCHEDULE_FILTERS: Array<{
  key: ScheduleFilterKey;
  label: string;
  color: string;
}> = [
  { key: 'fundamentals', label: 'Fundamentals', color: '#38BDF8' },
  { key: 'advanced', label: 'Advanced', color: '#F59E0B' },
  { key: 'gi', label: 'Gi', color: '#FFFFFF' },
  { key: 'no_gi', label: 'No-Gi', color: '#A78BFA' },
  { key: 'kids', label: 'Kids', color: '#FB7185' },
  { key: 'open_mat', label: 'Open Mat', color: '#22C55E' },
  { key: 'competition', label: 'Competition', color: '#EF4444' },
  { key: 'seminar', label: 'Seminar', color: '#94A3B8' },
];

export function classAccent(input: {
  level: string;
  giType: string;
  isOpenMat?: boolean;
  isSeminar?: boolean;
}): string {
  if (input.isSeminar || input.level === 'seminar') return '#94A3B8';
  if (input.isOpenMat || input.level === 'open_mat') return '#22C55E';
  if (input.level === 'kids') return '#FB7185';
  if (input.level === 'competition') return '#EF4444';
  if (input.level === 'advanced') return '#F59E0B';
  if (input.giType === 'no_gi') return '#A78BFA';
  if (input.level === 'fundamentals') return '#38BDF8';
  return '#FFFFFF';
}

export function classMatchesFilters(
  item: {
    level: string;
    giType: string;
    isOpenMat?: boolean;
    isSeminar?: boolean;
  },
  active: Set<ScheduleFilterKey>,
): boolean {
  if (active.size === 0) return true;
  const tags: ScheduleFilterKey[] = [];
  if (item.giType === 'gi') tags.push('gi');
  if (item.giType === 'no_gi') tags.push('no_gi');
  if (item.level === 'kids') tags.push('kids');
  if (item.level === 'fundamentals') tags.push('fundamentals');
  if (item.level === 'advanced') tags.push('advanced');
  if (item.level === 'competition') tags.push('competition');
  if (item.isOpenMat || item.level === 'open_mat') tags.push('open_mat');
  if (item.isSeminar || item.level === 'seminar') tags.push('seminar');
  return tags.some((tag) => active.has(tag));
}
