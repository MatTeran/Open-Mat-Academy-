/**
 * Open Mat notification domain types.
 * Designed so a future Edge Function can emit the same payload shape.
 */

export type NotificationCategory =
  | 'training'
  | 'journey'
  | 'academy'
  | 'competition'
  | 'recovery';

export type NotificationEventType =
  | 'class_reminder'
  | 'reservation_confirmed'
  | 'class_cancelled'
  | 'class_updated'
  | 'check_in_reminder'
  | 'waitlist_opening'
  | 'xp_earned'
  | 'achievement_unlocked'
  | 'weekly_goal_progress'
  | 'weekly_goal_completed'
  | 'streak_at_risk'
  | 'streak_maintained'
  | 'monthly_challenge_progress'
  | 'coach_announcement'
  | 'seminar_announced'
  | 'schedule_updated'
  | 'academy_photos_added'
  | 'event_reminder'
  | 'competition_countdown'
  | 'registration_deadline'
  | 'weigh_in_reminder'
  | 'match_day_reminder'
  | 'recovery_reminder';

export type ClassReminderOffsetMinutes = 15 | 30 | 60 | 120 | 1440;

export interface OpenMatNotificationData {
  eventType: NotificationEventType;
  category: NotificationCategory;
  screen?: string;
  entityId?: string;
  classId?: string;
  announcementId?: string;
  achievementId?: string;
  competitionId?: string;
  action?: string;
}

export interface OpenMatNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  category: NotificationCategory;
  eventType: NotificationEventType;
  data?: OpenMatNotificationData;
  isRead: boolean;
  createdAt: string;
  /** Expo local notification id when scheduled on-device. */
  expoNotificationId?: string;
}

export interface NotificationPreferences {
  masterEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // HH:mm
  quietHoursEnd: string; // HH:mm
  classReminderOffsetMinutes: ClassReminderOffsetMinutes;

  // Training
  classReminders: boolean;
  reservationUpdates: boolean;
  waitlistOpenings: boolean;
  scheduleChanges: boolean;

  // Journey
  xpAndAchievements: boolean;
  weeklyGoalProgress: boolean;
  streakReminders: boolean;
  monthlyChallenges: boolean;

  // Academy
  coachAnnouncements: boolean;
  eventsAndSeminars: boolean;
  academyMedia: boolean;

  // Competition
  competitionCountdowns: boolean;
  registrationDeadlines: boolean;
  matchDayReminders: boolean;

  // Recovery
  recoverySuggestions: boolean;
  hydrationAndStretching: boolean;
}

export type PermissionPromptStatus =
  | 'unknown'
  | 'deferred'
  | 'accepted'
  | 'denied'
  | 'blocked';

export interface PushTokenRecord {
  userId: string;
  expoPushToken: string;
  platform: 'ios' | 'android' | 'web' | 'unknown';
  deviceName?: string | null;
  isActive: boolean;
}

export interface ScheduleClassReminderInput {
  classId: string;
  classTitle: string;
  startsAt: Date;
  body?: string;
  offsetMinutes?: ClassReminderOffsetMinutes;
}

export interface ScheduleCompetitionReminderInput {
  competitionId: string;
  title: string;
  startsAt: Date;
  eventType?: Extract<
    NotificationEventType,
    | 'competition_countdown'
    | 'registration_deadline'
    | 'weigh_in_reminder'
    | 'match_day_reminder'
  >;
  body?: string;
  offsetMinutes?: number;
}

export type NotificationRouteTarget =
  | { kind: 'notifications' }
  | { kind: 'schedule'; classId?: string }
  | { kind: 'journey'; achievementId?: string }
  | { kind: 'announcement'; announcementId: string }
  | { kind: 'local_events'; eventId?: string }
  | { kind: 'fallback' };

export const NOTIFICATION_CATEGORY_LABELS: Record<NotificationCategory, string> =
  {
    training: 'Training',
    journey: 'Journey',
    academy: 'Academy',
    competition: 'Competition',
    recovery: 'Recovery',
  };

export const CLASS_REMINDER_OPTIONS: Array<{
  value: ClassReminderOffsetMinutes;
  label: string;
}> = [
  { value: 15, label: '15 minutes before' },
  { value: 30, label: '30 minutes before' },
  { value: 60, label: '1 hour before' },
  { value: 120, label: '2 hours before' },
  { value: 1440, label: '1 day before' },
];
