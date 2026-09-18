export type Weekday =
  | 'mon'
  | 'tue'
  | 'wed'
  | 'thu'
  | 'fri'
  | 'sat'
  | 'sun';

export type GiType = 'gi' | 'no_gi' | 'gi_no_gi' | 'none';

/**
 * Color-coded programs from the My Gi weekly flyer.
 * Kept as ClassLevel for existing ScheduleFilter naming.
 */
export type ClassLevel =
  | 'adult_bjj'
  | 'youth_bjj'
  | 'pee_wee_bjj'
  | 'womens_bjj'
  | 'boxing'
  | 'muay_thai'
  | 'wrestling'
  | 'peak_performance'
  | 'taekwondo'
  | 'open_mat';

export type ScheduleFilter = ClassLevel | 'all';

/** Gi / No-Gi format filter for BJJ classes. */
export type ScheduleGiFilter = 'all' | 'gi' | 'no_gi';

/** Schedule list presentation: single day or full week agenda. */
export type ScheduleViewMode = 'day' | 'week';

export interface ScheduleClass {
  id: string;
  day: Weekday;
  title: string;
  /** Age group / format detail shown under the title. */
  subtitle?: string;
  /** Extra flyer note (e.g. Roll Call). */
  note?: string;
  startTime: string; // HH:mm 24h
  endTime: string; // HH:mm 24h
  instructor: string;
  giType: GiType;
  level: ClassLevel;
  spotsLeft?: number;
}
