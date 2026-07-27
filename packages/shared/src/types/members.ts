import type { BeltRank } from './user';
import type { MembershipPlan, MembershipStatus } from './membership';

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface WaiverRecord {
  id: string;
  title: string;
  signedAt: string;
  expiresAt: string | null;
  status: 'valid' | 'expired' | 'missing';
}

export interface CompetitionResult {
  id: string;
  eventName: string;
  date: string;
  division: string;
  result: string;
  notes?: string;
}

export interface TrainingStats {
  classesThisMonth: number;
  classesThisYear: number;
  openMatsThisMonth: number;
  attendanceRate: number;
  currentStreakDays: number;
  favoriteClassType: string;
}

export interface JourneySummary {
  belt: BeltRank;
  stripes: 0 | 1 | 2 | 3 | 4;
  memberSince: string;
  totalClasses: number;
  levelLabel: string;
  nextMilestone: string;
}

export interface MemberAchievement {
  id: string;
  title: string;
  earnedAt: string;
  category: string;
}

export interface CoachNote {
  id: string;
  memberId: string;
  authorId: string;
  authorName: string;
  body: string;
  /** Private to coaches/staff — never shown in Member app. */
  isPrivate: true;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCoachNoteInput {
  memberId: string;
  body: string;
}

export interface CoachMemberProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  belt: BeltRank;
  stripes: 0 | 1 | 2 | 3 | 4;
  membershipPlan: MembershipPlan;
  membershipStatus: MembershipStatus;
  academyName: string;
  journey: JourneySummary;
  achievements: MemberAchievement[];
  emergencyContact: EmergencyContact | null;
  waivers: WaiverRecord[];
  coachNotes: CoachNote[];
  competitionHistory: CompetitionResult[];
  recentClasses: Array<{
    id: string;
    title: string;
    date: string;
    status: string;
  }>;
  trainingStats: TrainingStats;
  isFirstTimer: boolean;
  createdAt: string;
}

export interface CoachMemberListItem {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  belt: BeltRank;
  stripes: 0 | 1 | 2 | 3 | 4;
  membershipStatus: MembershipStatus;
  lastAttendedAt: string | null;
}
