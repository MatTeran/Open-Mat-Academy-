export type Weekday =
  | 'mon'
  | 'tue'
  | 'wed'
  | 'thu'
  | 'fri'
  | 'sat'
  | 'sun';

export type GiType = 'gi' | 'no_gi';

/** Filterable class tracks on the Schedule screen */
export type ClassLevel =
  | 'kids'
  | 'fundamentals'
  | 'advanced'
  | 'competition'
  | 'open_mat';

export type ScheduleFilter = ClassLevel | 'all';

export interface ScheduleClass {
  id: string;
  day: Weekday;
  title: string;
  startTime: string; // HH:mm 24h
  endTime: string; // HH:mm 24h
  instructor: string;
  giType: GiType;
  level: ClassLevel;
  spotsLeft?: number;
}
