import type {
  OpenMatNotificationData,
  NotificationEventType,
  NotificationRouteTarget,
} from './notificationTypes';

/**
 * Resolve a notification payload into an in-app navigation target.
 * Missing destinations fall back to the notification center.
 */
export function resolveNotificationRoute(
  data?: OpenMatNotificationData | null,
  eventType?: NotificationEventType,
): NotificationRouteTarget {
  const type = data?.eventType ?? eventType;
  if (!type) {
    return { kind: 'fallback' };
  }

  switch (type) {
    case 'class_reminder':
    case 'reservation_confirmed':
    case 'class_cancelled':
    case 'class_updated':
    case 'check_in_reminder':
    case 'waitlist_opening':
    case 'schedule_updated':
      // ClassDetailsScreen is not shipped yet — land on Schedule.
      return { kind: 'schedule', classId: data?.classId };

    case 'xp_earned':
    case 'achievement_unlocked':
    case 'weekly_goal_progress':
    case 'weekly_goal_completed':
    case 'streak_at_risk':
    case 'streak_maintained':
    case 'monthly_challenge_progress':
      return { kind: 'journey', achievementId: data?.achievementId };

    case 'coach_announcement':
      if (data?.announcementId) {
        return {
          kind: 'announcement',
          announcementId: data.announcementId,
        };
      }
      return { kind: 'fallback' };

    case 'seminar_announced':
    case 'event_reminder':
    case 'academy_photos_added':
    case 'competition_countdown':
    case 'registration_deadline':
    case 'weigh_in_reminder':
    case 'match_day_reminder':
      return {
        kind: 'local_events',
        eventId: data?.competitionId ?? data?.entityId,
      };

    case 'recovery_reminder':
      return { kind: 'notifications' };

    default:
      return { kind: 'fallback' };
  }
}
