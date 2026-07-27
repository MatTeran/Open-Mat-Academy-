export type AttendanceStatus =
  | 'present'
  | 'absent'
  | 'late'
  | 'visitor'
  | 'walk_in'
  | 'reserved'
  | 'waitlist';

export interface AttendanceRecord {
  id: string;
  classId: string;
  memberId: string | null;
  memberName: string;
  memberEmail?: string | null;
  status: AttendanceStatus;
  checkedInAt: string | null;
  notes?: string | null;
  isFirstVisit: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CheckInInput {
  classId: string;
  memberId?: string | null;
  memberName: string;
  memberEmail?: string | null;
  status: Extract<
    AttendanceStatus,
    'present' | 'late' | 'visitor' | 'walk_in'
  >;
  notes?: string;
  isFirstVisit?: boolean;
}

export interface ClassRosterSummary {
  classId: string;
  reserved: AttendanceRecord[];
  waitlist: AttendanceRecord[];
  checkedIn: AttendanceRecord[];
  absent: AttendanceRecord[];
  attendancePercent: number;
}
