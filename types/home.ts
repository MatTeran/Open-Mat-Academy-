export interface NextClass {
  id: string;
  title: string;
  coach: string;
  startsAt: string;
  room: string;
  durationMinutes: number;
  format?: 'Gi' | 'No-Gi' | 'Gi / No-Gi';
  location?: string;
  status?: 'soon' | 'upcoming' | 'live';
  reservationStatus?: NextClassReservationStatus;
}

export type NextClassReservationStatus =
  | 'available'
  | 'reserved'
  | 'check_in'
  | 'checked_in'
  | 'class_full';

export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  occurredAt: string;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  dateLabel: string;
  meta: string;
}

export type QuickActionId =
  | 'reserveClass'
  | 'logTraining'
  | 'logTechnique'
  | 'viewSchedule';

export interface QuickAction {
  id: QuickActionId;
  label: string;
  subtitle: string;
  icon:
    | 'ticket-outline'
    | 'barbell-outline'
    | 'bulb-outline'
    | 'calendar-outline';
}

export interface HomeUserSummary {
  firstName: string;
  level: number;
  currentXP: number;
  nextLevelXP: number;
  weeklyClassesCompleted: number;
  weeklyClassGoal: number;
  weeklyTrainingDays: number;
  currentStreak: number;
  bestStreak: number;
}

export interface NextClassSummary extends NextClass {
  format: 'Gi' | 'No-Gi' | 'Gi / No-Gi';
  location: string;
  status: 'soon' | 'upcoming' | 'live';
  reservationStatus: NextClassReservationStatus;
}

export interface AnnouncementSummary {
  id: string;
  title: string;
  authorName: string;
  createdAt: string;
  preview: string;
  status: 'latest';
}
