import type {
  ClassReminderOffsetMinutes,
  NotificationEventType,
  NotificationPreferences,
} from './notificationTypes';

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  masterEnabled: true,
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  classReminderOffsetMinutes: 60,

  classReminders: true,
  reservationUpdates: true,
  waitlistOpenings: true,
  scheduleChanges: true,

  xpAndAchievements: true,
  weeklyGoalProgress: true,
  streakReminders: false,
  monthlyChallenges: true,

  coachAnnouncements: true,
  eventsAndSeminars: true,
  academyMedia: true,

  competitionCountdowns: true,
  registrationDeadlines: true,
  matchDayReminders: true,

  recoverySuggestions: false,
  hydrationAndStretching: false,
};

/** Map event types to preference keys for local gating. */
export function isEventAllowedByPreferences(
  eventType: NotificationEventType,
  prefs: NotificationPreferences,
): boolean {
  if (!prefs.masterEnabled) {
    return false;
  }

  switch (eventType) {
    case 'class_reminder':
    case 'check_in_reminder':
      return prefs.classReminders;
    case 'reservation_confirmed':
    case 'class_cancelled':
      return prefs.reservationUpdates;
    case 'class_updated':
    case 'schedule_updated':
      return prefs.scheduleChanges;
    case 'waitlist_opening':
      return prefs.waitlistOpenings;
    case 'xp_earned':
    case 'achievement_unlocked':
      return prefs.xpAndAchievements;
    case 'weekly_goal_progress':
    case 'weekly_goal_completed':
      return prefs.weeklyGoalProgress;
    case 'streak_at_risk':
    case 'streak_maintained':
      return prefs.streakReminders;
    case 'monthly_challenge_progress':
      return prefs.monthlyChallenges;
    case 'coach_announcement':
      return prefs.coachAnnouncements;
    case 'seminar_announced':
    case 'event_reminder':
      return prefs.eventsAndSeminars;
    case 'academy_photos_added':
      return prefs.academyMedia;
    case 'competition_countdown':
      return prefs.competitionCountdowns;
    case 'registration_deadline':
      return prefs.registrationDeadlines;
    case 'weigh_in_reminder':
    case 'match_day_reminder':
      return prefs.matchDayReminders;
    case 'recovery_reminder':
      return prefs.recoverySuggestions || prefs.hydrationAndStretching;
    default:
      return true;
  }
}

function parseClockToMinutes(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) {
    return null;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }
  return hours * 60 + minutes;
}

/** True when `now` falls inside configured quiet hours (supports overnight windows). */
export function isWithinQuietHours(
  prefs: NotificationPreferences,
  now: Date = new Date(),
): boolean {
  if (!prefs.quietHoursEnabled) {
    return false;
  }

  const start = parseClockToMinutes(prefs.quietHoursStart);
  const end = parseClockToMinutes(prefs.quietHoursEnd);
  if (start === null || end === null) {
    return false;
  }

  const current = now.getHours() * 60 + now.getMinutes();
  if (start === end) {
    return true;
  }
  if (start < end) {
    return current >= start && current < end;
  }
  // Overnight: e.g. 22:00 → 07:00
  return current >= start || current < end;
}

export function formatReminderOffsetLabel(
  offset: ClassReminderOffsetMinutes,
): string {
  switch (offset) {
    case 15:
      return '15 minutes';
    case 30:
      return '30 minutes';
    case 60:
      return '1 hour';
    case 120:
      return '2 hours';
    case 1440:
      return '1 day';
    default:
      return `${offset} minutes`;
  }
}
