export type Weekday =
  | 'mon'
  | 'tue'
  | 'wed'
  | 'thu'
  | 'fri'
  | 'sat'
  | 'sun';

export type GiType = 'gi' | 'no_gi';

export type ClassLevel =
  | 'kids'
  | 'fundamentals'
  | 'advanced'
  | 'competition'
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
