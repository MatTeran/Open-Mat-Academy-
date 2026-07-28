import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Linking, Platform } from 'react-native';

import {
  formatReminderOffsetLabel,
  isEventAllowedByPreferences,
  isWithinQuietHours,
} from './notificationPreferences';
import { loadNotificationPreferences } from './notificationStorage';
import {
  getClassReminderId,
  removeClassReminderId,
  saveClassReminderId,
} from './notificationStorage';
import { savePushTokenToSupabase } from './pushTokenApi';
import type {
  ClassReminderOffsetMinutes,
  OpenMatNotification,
  OpenMatNotificationData,
  NotificationCategory,
  NotificationEventType,
  ScheduleClassReminderInput,
  ScheduleCompetitionReminderInput,
} from './notificationTypes';

const ANDROID_CHANNEL_ID = 'open-mat-default';

let handlerConfigured = false;
let androidChannelReady = false;

export function configureNotificationHandler(): void {
  if (handlerConfigured) {
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => {
      const prefs = await loadNotificationPreferences();
      const allowBanner = prefs.masterEnabled && !isWithinQuietHours(prefs);

      return {
        shouldShowAlert: allowBanner,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: allowBanner,
        shouldShowList: true,
      };
    },
  });

  handlerConfigured = true;
}

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android' || androidChannelReady) {
    return;
  }

  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: 'Open Mat',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 180],
    lightColor: '#FFFFFF',
  });
  androidChannelReady = true;
}

function getEasProjectId(): string | undefined {
  return (
    Constants.easConfig?.projectId ??
    Constants.expoConfig?.extra?.eas?.projectId
  );
}

export type PermissionEnableResult =
  | {
      status: 'granted';
      expoPushToken: string | null;
      tokenSaved: boolean;
      message: string;
    }
  | {
      status: 'denied' | 'blocked' | 'unavailable';
      message: string;
      canOpenSettings: boolean;
    };

export async function getNotificationPermissionStatus(): Promise<
  Notifications.PermissionStatus
> {
  const current = await Notifications.getPermissionsAsync();
  return current.status;
}

/**
 * Thoughtful enable flow — call only from an explicit user action.
 * Does not re-prompt when already blocked; offers Settings instead.
 */
export async function enablePushNotifications(input: {
  userId: string | null | undefined;
  isGuest?: boolean;
}): Promise<PermissionEnableResult> {
  if (!Device.isDevice) {
    return {
      status: 'unavailable',
      message:
        'Push tokens require a physical device. Local test notifications still work in development.',
      canOpenSettings: false,
    };
  }

  await ensureAndroidChannel();

  const existing = await Notifications.getPermissionsAsync();
  let finalStatus = existing.status;

  if (existing.status !== 'granted') {
    if (existing.canAskAgain === false) {
      return {
        status: 'blocked',
        message:
          'Notifications are turned off for Open Mat. Enable them in device Settings.',
        canOpenSettings: true,
      };
    }

    const requested = await Notifications.requestPermissionsAsync();
    finalStatus = requested.status;
  }

  if (finalStatus !== 'granted') {
    return {
      status: 'denied',
      message: 'Notifications were not enabled. You can turn them on later in Settings.',
      canOpenSettings: finalStatus === 'denied',
    };
  }

  let expoPushToken: string | null = null;
  let tokenSaved = false;

  try {
    const projectId = getEasProjectId();
    const tokenResponse = projectId
      ? await Notifications.getExpoPushTokenAsync({ projectId })
      : await Notifications.getExpoPushTokenAsync();
    expoPushToken = tokenResponse.data;

    if (expoPushToken && input.userId && !input.isGuest) {
      const saveResult = await savePushTokenToSupabase({
        userId: input.userId,
        expoPushToken,
        platform:
          Platform.OS === 'ios' || Platform.OS === 'android'
            ? Platform.OS
            : 'unknown',
        deviceName: Device.deviceName,
        isActive: true,
      });
      tokenSaved = saveResult.ok && !saveResult.skipped;
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('[notifications] Expo push token failed', error);
    }
    return {
      status: 'granted',
      expoPushToken: null,
      tokenSaved: false,
      message:
        'Permission granted, but the Expo push token could not be retrieved. Check that an EAS projectId is configured.',
    };
  }

  return {
    status: 'granted',
    expoPushToken,
    tokenSaved,
    message: tokenSaved
      ? 'Notifications enabled. You are connected to academy updates.'
      : 'Notifications enabled on this device.',
  };
}

export async function openSystemNotificationSettings(): Promise<void> {
  await Linking.openSettings();
}

function createLocalId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function buildHistoryItem(input: {
  userId: string;
  title: string;
  body: string;
  category: NotificationCategory;
  eventType: NotificationEventType;
  data?: OpenMatNotificationData;
  expoNotificationId?: string;
}): OpenMatNotification {
  return {
    id: createLocalId('notif'),
    userId: input.userId,
    title: input.title,
    body: input.body,
    category: input.category,
    eventType: input.eventType,
    data: input.data ?? {
      eventType: input.eventType,
      category: input.category,
    },
    isRead: false,
    createdAt: new Date().toISOString(),
    expoNotificationId: input.expoNotificationId,
  };
}

/**
 * Present an immediate local notification (also used for mock remote tests).
 */
export async function presentLocalNotification(input: {
  title: string;
  body: string;
  data: OpenMatNotificationData;
  categoryIdentifier?: string;
}): Promise<string | null> {
  const prefs = await loadNotificationPreferences();
  if (!isEventAllowedByPreferences(input.data.eventType, prefs)) {
    return null;
  }
  if (isWithinQuietHours(prefs)) {
    // Quiet hours: skip OS banner; caller may still add to in-app history.
    return null;
  }

  await ensureAndroidChannel();

  try {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: input.title,
        body: input.body,
        data: input.data as unknown as Record<string, unknown>,
        sound: false,
        ...(Platform.OS === 'android'
          ? { channelId: ANDROID_CHANNEL_ID }
          : null),
      },
      trigger: null,
    });
  } catch (error) {
    if (__DEV__) {
      console.warn('[notifications] presentLocalNotification failed', error);
    }
    return null;
  }
}

export async function cancelNotification(
  expoNotificationId: string,
): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(expoNotificationId);
  } catch (error) {
    if (__DEV__) {
      console.warn('[notifications] cancelNotification failed', error);
    }
  }
}

export async function scheduleClassReminder(
  input: ScheduleClassReminderInput,
): Promise<string | null> {
  const prefs = await loadNotificationPreferences();
  if (!prefs.masterEnabled || !prefs.classReminders) {
    return null;
  }

  const offset =
    input.offsetMinutes ?? prefs.classReminderOffsetMinutes;
  const fireAt = new Date(input.startsAt.getTime() - offset * 60_000);

  if (fireAt.getTime() <= Date.now() + 5_000) {
    if (__DEV__) {
      console.warn(
        '[notifications] class reminder skipped — fire time is in the past',
      );
    }
    return null;
  }

  await ensureAndroidChannel();
  await cancelClassReminder(input.classId);

  const data: OpenMatNotificationData = {
    eventType: 'class_reminder',
    category: 'training',
    screen: 'ClassDetails',
    classId: input.classId,
  };

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `${input.classTitle} starts in ${formatReminderOffsetLabel(offset)}`,
        body:
          input.body ??
          'You’re one class away from your weekly goal.',
        data: data as unknown as Record<string, unknown>,
        sound: false,
        ...(Platform.OS === 'android'
          ? { channelId: ANDROID_CHANNEL_ID }
          : null),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: fireAt,
      },
    });

    await saveClassReminderId(input.classId, id);
    return id;
  } catch (error) {
    if (__DEV__) {
      console.warn('[notifications] scheduleClassReminder failed', error);
    }
    return null;
  }
}

export async function cancelClassReminder(classId: string): Promise<void> {
  const existing = await getClassReminderId(classId);
  if (existing) {
    await cancelNotification(existing);
    await removeClassReminderId(classId);
  }
}

export async function rescheduleClassReminder(
  input: ScheduleClassReminderInput,
): Promise<string | null> {
  await cancelClassReminder(input.classId);
  return scheduleClassReminder(input);
}

export async function scheduleCompetitionReminder(
  input: ScheduleCompetitionReminderInput,
): Promise<string | null> {
  const prefs = await loadNotificationPreferences();
  const eventType = input.eventType ?? 'competition_countdown';
  if (!isEventAllowedByPreferences(eventType, prefs)) {
    return null;
  }

  const offsetMinutes = input.offsetMinutes ?? 60 * 24;
  const fireAt = new Date(input.startsAt.getTime() - offsetMinutes * 60_000);
  if (fireAt.getTime() <= Date.now() + 5_000) {
    return null;
  }

  await ensureAndroidChannel();

  const data: OpenMatNotificationData = {
    eventType,
    category: 'competition',
    screen: 'CompetitionDetails',
    competitionId: input.competitionId,
  };

  try {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: input.title,
        body: input.body ?? 'Your competition is coming up. Stay sharp.',
        data: data as unknown as Record<string, unknown>,
        sound: false,
        ...(Platform.OS === 'android'
          ? { channelId: ANDROID_CHANNEL_ID }
          : null),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: fireAt,
      },
    });
  } catch (error) {
    if (__DEV__) {
      console.warn(
        '[notifications] scheduleCompetitionReminder failed',
        error,
      );
    }
    return null;
  }
}

export async function showAchievementNotification(input: {
  userId: string;
  achievementId: string;
  title?: string;
  body: string;
}): Promise<OpenMatNotification> {
  const data: OpenMatNotificationData = {
    eventType: 'achievement_unlocked',
    category: 'journey',
    screen: 'Journey',
    achievementId: input.achievementId,
  };

  const expoId = await presentLocalNotification({
    title: input.title ?? 'Achievement Unlocked',
    body: input.body,
    data,
  });

  return buildHistoryItem({
    userId: input.userId,
    title: input.title ?? 'Achievement Unlocked',
    body: input.body,
    category: 'journey',
    eventType: 'achievement_unlocked',
    data,
    expoNotificationId: expoId ?? undefined,
  });
}

/** Helpers ready for journey/streak engines — do not auto-schedule guilt spam. */
export async function showWeeklyGoalProgressNotification(input: {
  userId: string;
  remaining: number;
}): Promise<OpenMatNotification> {
  const title =
    input.remaining === 1
      ? 'One class left this week'
      : `${input.remaining} classes left this week`;
  const body =
    input.remaining === 1
      ? 'Train once more to complete your weekly goal.'
      : 'A few more sessions will lock in your weekly goal.';

  const data: OpenMatNotificationData = {
    eventType: 'weekly_goal_progress',
    category: 'journey',
    screen: 'Journey',
  };

  await presentLocalNotification({ title, body, data });
  return buildHistoryItem({
    userId: input.userId,
    title,
    body,
    category: 'journey',
    eventType: 'weekly_goal_progress',
    data,
  });
}

export async function showWeeklyGoalCompletedNotification(input: {
  userId: string;
}): Promise<OpenMatNotification> {
  const title = 'Weekly goal complete';
  const body = 'Nice work — you hit your training goal for the week.';
  const data: OpenMatNotificationData = {
    eventType: 'weekly_goal_completed',
    category: 'journey',
    screen: 'Journey',
  };
  await presentLocalNotification({ title, body, data });
  return buildHistoryItem({
    userId: input.userId,
    title,
    body,
    category: 'journey',
    eventType: 'weekly_goal_completed',
    data,
  });
}

export async function showStreakAtRiskNotification(input: {
  userId: string;
}): Promise<OpenMatNotification | null> {
  const prefs = await loadNotificationPreferences();
  if (!prefs.streakReminders) {
    return null;
  }

  const title = 'Your streak is at risk';
  const body = 'You still have time to train today.';
  const data: OpenMatNotificationData = {
    eventType: 'streak_at_risk',
    category: 'journey',
    screen: 'Journey',
  };
  await presentLocalNotification({ title, body, data });
  return buildHistoryItem({
    userId: input.userId,
    title,
    body,
    category: 'journey',
    eventType: 'streak_at_risk',
    data,
  });
}

export async function showStreakMaintainedNotification(input: {
  userId: string;
  streakDays: number;
}): Promise<OpenMatNotification | null> {
  const prefs = await loadNotificationPreferences();
  if (!prefs.streakReminders) {
    return null;
  }

  const title = 'Streak maintained';
  const body = `${input.streakDays}-day streak — keep showing up.`;
  const data: OpenMatNotificationData = {
    eventType: 'streak_maintained',
    category: 'journey',
    screen: 'Journey',
  };
  await presentLocalNotification({ title, body, data });
  return buildHistoryItem({
    userId: input.userId,
    title,
    body,
    category: 'journey',
    eventType: 'streak_maintained',
    data,
  });
}

/**
 * Mock waitlist opening — UI + routing ready.
 * TODO(backend): Supabase Edge Function should detect a freed spot and push
 * via Expo Push API to waitlisted users' tokens in `push_tokens`.
 */
export async function showWaitlistOpeningNotification(input: {
  userId: string;
  classId: string;
  classTitle: string;
}): Promise<OpenMatNotification> {
  const title = 'A spot just opened';
  const body = `${input.classTitle} has availability. Reserve now before it fills.`;
  const data: OpenMatNotificationData = {
    eventType: 'waitlist_opening',
    category: 'training',
    screen: 'ClassDetails',
    classId: input.classId,
    action: 'reserve',
  };
  await presentLocalNotification({ title, body, data });
  return buildHistoryItem({
    userId: input.userId,
    title,
    body,
    category: 'training',
    eventType: 'waitlist_opening',
    data,
  });
}

export function parseNotificationData(
  raw: unknown,
): OpenMatNotificationData | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const data = raw as Partial<OpenMatNotificationData>;
  if (!data.eventType || !data.category) {
    return null;
  }
  return {
    eventType: data.eventType,
    category: data.category,
    screen: data.screen,
    entityId: data.entityId,
    classId: data.classId,
    announcementId: data.announcementId,
    achievementId: data.achievementId,
    competitionId: data.competitionId,
    action: data.action,
  };
}

export type { ClassReminderOffsetMinutes };
