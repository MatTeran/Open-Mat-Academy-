import { MOCK_WEEKLY_METRIC_BASELINE } from '../lib/mocks/workoutMetrics';
import type { Workout } from '../types/workout';
import type {
  WeekDayDot,
  WeeklyMetricPoint,
  WorkoutMetricFilter,
  WorkoutProgressMetrics,
  WorkoutWeekSummary,
} from '../types/workoutMetrics';

const DAY_META = [
  { key: 'mon', label: 'M', offset: 0 },
  { key: 'tue', label: 'T', offset: 1 },
  { key: 'wed', label: 'W', offset: 2 },
  { key: 'thu', label: 'T', offset: 3 },
  { key: 'fri', label: 'F', offset: 4 },
  { key: 'sat', label: 'S', offset: 5 },
  { key: 'sun', label: 'S', offset: 6 },
] as const;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Monday 00:00 local for the week containing `date`. */
export function getWeekStart(date: Date): Date {
  const day = startOfDay(date);
  const weekday = day.getDay(); // 0 Sun … 6 Sat
  const mondayOffset = weekday === 0 ? -6 : 1 - weekday;
  day.setDate(day.getDate() + mondayOffset);
  return day;
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function matchesFilter(workout: Workout, filter: WorkoutMetricFilter): boolean {
  if (filter === 'all') {
    return true;
  }
  return workout.giType === filter;
}

function emptySummary(): WorkoutWeekSummary {
  return { sessions: 0, matMinutes: 0, rounds: 0 };
}

function summarizeWorkouts(workouts: Workout[]): WorkoutWeekSummary {
  return workouts.reduce<WorkoutWeekSummary>(
    (acc, workout) => ({
      sessions: acc.sessions + 1,
      matMinutes: acc.matMinutes + workout.durationMinutes,
      rounds: acc.rounds + workout.rounds,
    }),
    emptySummary(),
  );
}

function countGiSplit(workouts: Workout[]): {
  giSessions: number;
  noGiSessions: number;
} {
  return workouts.reduce(
    (acc, workout) => {
      if (workout.giType === 'gi') {
        acc.giSessions += 1;
      } else {
        acc.noGiSessions += 1;
      }
      return acc;
    },
    { giSessions: 0, noGiSessions: 0 },
  );
}

function workoutsInRange(
  workouts: Workout[],
  start: Date,
  endExclusive: Date,
  filter: WorkoutMetricFilter,
): Workout[] {
  const startMs = start.getTime();
  const endMs = endExclusive.getTime();
  return workouts.filter((workout) => {
    if (!matchesFilter(workout, filter)) {
      return false;
    }
    const ms = new Date(workout.date).getTime();
    return ms >= startMs && ms < endMs;
  });
}

function monthLabel(date: Date): string {
  return date
    .toLocaleDateString('en-US', { month: 'short' })
    .toUpperCase();
}

function buildWeekDots(
  weekStart: Date,
  workouts: Workout[],
  filter: WorkoutMetricFilter,
  now: Date,
): WeekDayDot[] {
  const today = startOfDay(now);
  return DAY_META.map((day) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + day.offset);
    const next = new Date(date);
    next.setDate(date.getDate() + 1);
    const trained =
      workoutsInRange(workouts, date, next, filter).length > 0;
    return {
      key: `${toIsoDate(date)}-${day.key}`,
      label: day.label,
      trained,
      isToday: date.getTime() === today.getTime(),
    };
  });
}

function buildPastTwelveWeeks(
  workouts: Workout[],
  filter: WorkoutMetricFilter,
  now: Date,
): WeeklyMetricPoint[] {
  const currentWeekStart = getWeekStart(now);
  const points: WeeklyMetricPoint[] = [];

  for (let i = 11; i >= 0; i -= 1) {
    const weekStart = new Date(currentWeekStart);
    weekStart.setDate(currentWeekStart.getDate() - i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    const weekIso = toIsoDate(weekStart);

    const weekWorkouts = workoutsInRange(
      workouts,
      weekStart,
      weekEnd,
      filter,
    );
    const fromLogs = summarizeWorkouts(weekWorkouts);
    const split = countGiSplit(weekWorkouts);
    const baseline = MOCK_WEEKLY_METRIC_BASELINE[11 - i];
    const isCurrentWeek = i === 0;

    // Prefer live logs for the current week; blend mock history for older weeks
    // when there are no logged sessions so the chart still has presence.
    const useLive = isCurrentWeek || fromLogs.sessions > 0;
    const sessions = useLive
      ? fromLogs.sessions
      : filter === 'gi'
        ? baseline.giSessions
        : filter === 'no_gi'
          ? baseline.noGiSessions
          : baseline.sessions;
    const matMinutes = useLive
      ? fromLogs.matMinutes
      : filter === 'gi'
        ? Math.round(baseline.matMinutes * 0.55)
        : filter === 'no_gi'
          ? Math.round(baseline.matMinutes * 0.45)
          : baseline.matMinutes;
    const rounds = useLive
      ? fromLogs.rounds
      : filter === 'gi'
        ? Math.round(baseline.rounds * 0.55)
        : filter === 'no_gi'
          ? Math.round(baseline.rounds * 0.45)
          : baseline.rounds;

    points.push({
      weekStartIso: weekIso,
      monthLabel: monthLabel(weekStart),
      sessions,
      matMinutes,
      rounds,
      giSessions: useLive ? split.giSessions : baseline.giSessions,
      noGiSessions: useLive ? split.noGiSessions : baseline.noGiSessions,
    });
  }

  return points;
}

function computeWeeklyStreak(points: WeeklyMetricPoint[]): {
  weeklyStreak: number;
  bestWeeklyStreak: number;
} {
  let best = 0;
  let run = 0;
  for (const point of points) {
    if (point.sessions > 0) {
      run += 1;
      best = Math.max(best, run);
    } else {
      run = 0;
    }
  }

  let current = 0;
  for (let i = points.length - 1; i >= 0; i -= 1) {
    if (points[i].sessions > 0) {
      current += 1;
    } else if (i === points.length - 1) {
      // Current week can be empty without breaking prior streak display as 0.
      break;
    } else {
      break;
    }
  }

  return { weeklyStreak: current, bestWeeklyStreak: best };
}

export function formatMatTime(minutes: number): string {
  if (minutes <= 0) {
    return '0m';
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) {
    return `${mins}m`;
  }
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}

export function formatChartHours(minutes: number): string {
  const hours = minutes / 60;
  if (hours === 0) {
    return '0h';
  }
  if (hours < 10) {
    return `${hours.toFixed(1).replace(/\.0$/, '')}h`;
  }
  return `${Math.round(hours)}h`;
}

export function buildWorkoutProgressMetrics(
  workouts: Workout[],
  filter: WorkoutMetricFilter,
  now = new Date(),
): WorkoutProgressMetrics {
  const pastTwelveWeeks = buildPastTwelveWeeks(workouts, filter, now);
  const thisWeekPoint = pastTwelveWeeks[pastTwelveWeeks.length - 1];
  const thisWeek: WorkoutWeekSummary = {
    sessions: thisWeekPoint.sessions,
    matMinutes: thisWeekPoint.matMinutes,
    rounds: thisWeekPoint.rounds,
  };

  const currentWeekStart = getWeekStart(now);
  const lastWeekStart = new Date(currentWeekStart);
  lastWeekStart.setDate(currentWeekStart.getDate() - 7);

  const { weeklyStreak, bestWeeklyStreak } =
    computeWeeklyStreak(pastTwelveWeeks);

  const chartValues = pastTwelveWeeks.map((point) => point.matMinutes / 60);
  const sessionsToInsight = Math.max(0, 5 - thisWeek.sessions);

  return {
    filter,
    thisWeek,
    pastTwelveWeeks,
    chartValues,
    chartUnitLabel: 'h',
    weeklyStreak,
    bestWeeklyStreak,
    thisWeekDays: buildWeekDots(currentWeekStart, workouts, filter, now),
    lastWeekDays: buildWeekDots(lastWeekStart, workouts, filter, now),
    sessionsToInsight,
  };
}

export function filterLabel(filter: WorkoutMetricFilter): string {
  if (filter === 'gi') {
    return 'Gi';
  }
  if (filter === 'no_gi') {
    return 'No-Gi';
  }
  return 'All';
}
