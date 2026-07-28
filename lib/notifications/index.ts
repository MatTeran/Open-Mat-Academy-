export type {
  ClassReminderOffsetMinutes,
  OpenMatNotification,
  OpenMatNotificationData,
  NotificationCategory,
  NotificationEventType,
  NotificationPreferences,
  NotificationRouteTarget,
  PermissionPromptStatus,
  PushTokenRecord,
  ScheduleClassReminderInput,
  ScheduleCompetitionReminderInput,
} from './notificationTypes';

export {
  CLASS_REMINDER_OPTIONS,
  NOTIFICATION_CATEGORY_LABELS,
} from './notificationTypes';

export {
  DEFAULT_NOTIFICATION_PREFERENCES,
  formatReminderOffsetLabel,
  isEventAllowedByPreferences,
  isWithinQuietHours,
} from './notificationPreferences';

export {
  getClassReminderId,
  loadClassReminderMap,
  loadNotificationHistory,
  loadNotificationPreferences,
  loadPermissionPromptStatus,
  prependNotificationHistory,
  removeClassReminderId,
  saveClassReminderId,
  saveNotificationHistory,
  saveNotificationPreferences,
  savePermissionPromptStatus,
} from './notificationStorage';

export { resolveNotificationRoute } from './notificationRoutes';

export {
  buildHistoryItem,
  cancelClassReminder,
  cancelNotification,
  configureNotificationHandler,
  enablePushNotifications,
  getNotificationPermissionStatus,
  openSystemNotificationSettings,
  parseNotificationData,
  presentLocalNotification,
  rescheduleClassReminder,
  scheduleClassReminder,
  scheduleCompetitionReminder,
  showAchievementNotification,
  showStreakAtRiskNotification,
  showStreakMaintainedNotification,
  showWaitlistOpeningNotification,
  showWeeklyGoalCompletedNotification,
  showWeeklyGoalProgressNotification,
} from './notificationService';

export {
  isNavigationReady,
  navigateFromNotificationTarget,
  navigationRef,
  setNavigationReady,
} from './navigation';

export { savePushTokenToSupabase } from './pushTokenApi';

export { useNotifications } from '../providers/NotificationProvider';
export type { DevTestKind } from '../providers/NotificationProvider';
