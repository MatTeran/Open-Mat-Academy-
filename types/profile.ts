import type { BeltRank } from './user';

export type MembershipPlan =
  | 'unlimited'
  | 'fundamentals'
  | 'kids'
  | 'drop_in';

export type MembershipStatus = 'active' | 'past_due' | 'paused' | 'canceled';

export interface Membership {
  plan: MembershipPlan;
  status: MembershipStatus;
  academyName: string;
  memberSince: string;
  renewsOn: string;
  priceLabel: string;
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface AttendanceSummary {
  monthLabel: string;
  classesAttended: number;
  openMats: number;
  goal: number;
  streakDays: number;
}

export interface AttendanceEntry {
  id: string;
  date: string;
  classTitle: string;
  instructor: string;
}

export interface NotificationSettings {
  classReminders: boolean;
  academyAnnouncements: boolean;
  birthdayAlerts: boolean;
  paymentReminders: boolean;
  teamChat: boolean;
}

export type MeasurementUnits = 'imperial' | 'metric';

export interface AppSettings {
  checkInReminders: boolean;
  shareActivity: boolean;
  units: MeasurementUnits;
}

export interface FamilyMember {
  id: string;
  fullName: string;
  relationship: string;
  belt: BeltRank;
  stripes: 0 | 1 | 2 | 3 | 4;
  membershipPlan: string;
}

export interface BeltProgress {
  belt: BeltRank;
  stripes: 0 | 1 | 2 | 3 | 4;
  promotedAt: string;
  nextStripeHint: string;
}

export interface AthleteHub {
  avatarUri: string | null;
  beltProgress: BeltProgress;
  membership: Membership;
  paymentMethod: PaymentMethod | null;
  attendanceSummary: AttendanceSummary;
  recentAttendance: AttendanceEntry[];
  notifications: NotificationSettings;
  settings: AppSettings;
  familyMembers: FamilyMember[];
}
