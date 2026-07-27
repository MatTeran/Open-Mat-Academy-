export interface DashboardOverview {
  greeting: string;
  dateLabel: string;
  todaysClasses: number;
  reservations: number;
  checkedIn: number;
  waitlist: number;
  firstTimeVisitors: number;
}

export type CoachQuickCardId =
  | 'todaysClasses'
  | 'attendance'
  | 'announcements'
  | 'academyActivity';

export interface CoachQuickCard {
  id: CoachQuickCardId;
  title: string;
  subtitle: string;
  value: string;
  icon: string;
  tint: string;
}

export type CoachQuickActionId =
  | 'openCommandCenter'
  | 'manageCheckIn'
  | 'createAnnouncement'
  | 'addClass'
  | 'manageMembers'
  | 'uploadTechnique';

export interface CoachQuickAction {
  id: CoachQuickActionId;
  label: string;
  icon: string;
  tint: string;
}

export type CreateSheetActionId =
  | 'newClass'
  | 'announcement'
  | 'event'
  | 'challenge'
  | 'technique';

export interface CreateSheetAction {
  id: CreateSheetActionId;
  title: string;
  subtitle: string;
  icon: string;
  tint: string;
  available: boolean;
}

export interface AcademyActivityItem {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  kind:
    | 'check_in'
    | 'announcement'
    | 'reservation'
    | 'member'
    | 'class'
    | 'technique'
    | 'challenge'
    | 'event'
    | 'achievement';
}
