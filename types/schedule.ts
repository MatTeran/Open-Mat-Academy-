export type Weekday =
  | 'mon'
  | 'tue'
  | 'wed'
  | 'thu'
  | 'fri'
  | 'sat'
  | 'sun';

export type GiType = 'gi' | 'no_gi' | 'both' | 'none';

/**
 * Filterable class tracks matching the Open Mat Academy board.
 */
export type ClassLevel =
  | 'adult_bjj'
  | 'youth_bjj'
  | 'pee_wee'
  | 'womens_bjj'
  | 'boxing'
  | 'muay_thai'
  | 'wrestling'
  | 'peak_performance'
  | 'taekwondo'
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
  /** Optional flyer note (e.g. Band App roll call). */
  note?: string;
}
