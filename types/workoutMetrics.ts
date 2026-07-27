export type WorkoutMetricFilter = 'all' | 'gi' | 'no_gi';

export type LogTabSegment = 'progress' | 'sessions';

export interface WeeklyMetricPoint {
  /** ISO date for the Monday that starts this week. */
  weekStartIso: string;
  /** Short month label for the chart axis (e.g. JUN). */
  monthLabel: string;
  sessions: number;
  matMinutes: number;
  rounds: number;
  giSessions: number;
  noGiSessions: number;
}

export interface WeekDayDot {
  key: string;
  label: string;
  trained: boolean;
  isToday: boolean;
}

export interface WorkoutWeekSummary {
  sessions: number;
  matMinutes: number;
  rounds: number;
}

export interface WorkoutProgressMetrics {
  filter: WorkoutMetricFilter;
  thisWeek: WorkoutWeekSummary;
  pastTwelveWeeks: WeeklyMetricPoint[];
  chartValues: number[];
  chartUnitLabel: string;
  weeklyStreak: number;
  bestWeeklyStreak: number;
  thisWeekDays: WeekDayDot[];
  lastWeekDays: WeekDayDot[];
  sessionsToInsight: number;
}
