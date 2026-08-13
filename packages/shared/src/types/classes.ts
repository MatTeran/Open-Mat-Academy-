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
 * My Gi flyer programs (+ seminar for one-off events).
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
  | 'open_mat'
  | 'seminar';

export type ClassAudience = 'kids' | 'adults' | 'all';

export type ClassStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export type RecurrenceRule = 'none' | 'daily' | 'weekly' | 'biweekly';

export interface CoachClass {
  id: string;
  title: string;
  description?: string;
  /** ISO date YYYY-MM-DD */
  date: string;
  startTime: string;
  endTime: string;
  instructorId: string;
  instructorName: string;
  giType: GiType;
  level: ClassLevel;
  audience: ClassAudience;
  capacity: number;
  reservedCount: number;
  checkedInCount: number;
  waitlistCount: number;
  firstTimeVisitorCount: number;
  status: ClassStatus;
  isOpenMat: boolean;
  isSeminar: boolean;
  recurrence: RecurrenceRule;
  academyId: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string | null;
}

export interface CreateClassInput {
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  instructorName: string;
  giType: GiType;
  level: ClassLevel;
  audience: ClassAudience;
  capacity: number;
  isOpenMat?: boolean;
  isSeminar?: boolean;
  recurrence?: RecurrenceRule;
}

export type UpdateClassInput = Partial<CreateClassInput> & {
  status?: ClassStatus;
};

export const CLASS_LEVEL_LABELS: Record<ClassLevel, string> = {
  adult_bjj: 'Adult BJJ',
  youth_bjj: 'Youth BJJ',
  pee_wee_bjj: 'Pee Wee BJJ',
  womens_bjj: "Women's BJJ",
  boxing: 'Boxing',
  muay_thai: 'Muay Thai',
  wrestling: 'Wrestling',
  peak_performance: 'Peak Performance',
  taekwondo: 'Tae Kwon Do',
  open_mat: 'Open Mat / Gym',
  seminar: 'Seminar',
};

/** Flyer legend colors. */
export const CLASS_LEVEL_COLORS: Record<ClassLevel, string> = {
  adult_bjj: '#1E3A8A',
  youth_bjj: '#14B8A6',
  pee_wee_bjj: '#86EFAC',
  womens_bjj: '#EC4899',
  boxing: '#EF4444',
  muay_thai: '#FB923C',
  wrestling: '#8B5CF6',
  peak_performance: '#166534',
  taekwondo: '#FDE047',
  open_mat: '#FEF3C7',
  seminar: '#94A3B8',
};
