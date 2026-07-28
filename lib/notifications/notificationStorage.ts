import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_NOTIFICATION_PREFERENCES } from './notificationPreferences';
import type {
  OpenMatNotification,
  NotificationPreferences,
  PermissionPromptStatus,
} from './notificationTypes';

const PREFS_KEY = '@open-mat/notification-preferences';
const HISTORY_KEY = '@open-mat/notification-history';
const PROMPT_KEY = '@open-mat/notification-permission-prompt';
const REMINDER_MAP_KEY = '@open-mat/class-reminder-ids';

const MAX_HISTORY = 100;

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) {
    return fallback;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function loadNotificationPreferences(): Promise<NotificationPreferences> {
  const raw = await AsyncStorage.getItem(PREFS_KEY);
  const parsed = safeParse<Partial<NotificationPreferences>>(raw, {});
  return { ...DEFAULT_NOTIFICATION_PREFERENCES, ...parsed };
}

export async function saveNotificationPreferences(
  prefs: NotificationPreferences,
): Promise<void> {
  await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export async function loadNotificationHistory(): Promise<OpenMatNotification[]> {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  const list = safeParse<OpenMatNotification[]>(raw, []);
  return Array.isArray(list) ? list : [];
}

export async function saveNotificationHistory(
  items: OpenMatNotification[],
): Promise<void> {
  const trimmed = items.slice(0, MAX_HISTORY);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
}

export async function prependNotificationHistory(
  item: OpenMatNotification,
): Promise<OpenMatNotification[]> {
  const current = await loadNotificationHistory();
  const next = [item, ...current.filter((entry) => entry.id !== item.id)].slice(
    0,
    MAX_HISTORY,
  );
  await saveNotificationHistory(next);
  return next;
}

export async function loadPermissionPromptStatus(): Promise<PermissionPromptStatus> {
  const raw = await AsyncStorage.getItem(PROMPT_KEY);
  if (
    raw === 'deferred' ||
    raw === 'accepted' ||
    raw === 'denied' ||
    raw === 'blocked'
  ) {
    return raw;
  }
  return 'unknown';
}

export async function savePermissionPromptStatus(
  status: PermissionPromptStatus,
): Promise<void> {
  await AsyncStorage.setItem(PROMPT_KEY, status);
}

export async function loadClassReminderMap(): Promise<Record<string, string>> {
  const raw = await AsyncStorage.getItem(REMINDER_MAP_KEY);
  const map = safeParse<Record<string, string>>(raw, {});
  return map && typeof map === 'object' ? map : {};
}

export async function saveClassReminderId(
  classId: string,
  expoNotificationId: string,
): Promise<void> {
  const map = await loadClassReminderMap();
  map[classId] = expoNotificationId;
  await AsyncStorage.setItem(REMINDER_MAP_KEY, JSON.stringify(map));
}

export async function removeClassReminderId(classId: string): Promise<void> {
  const map = await loadClassReminderMap();
  delete map[classId];
  await AsyncStorage.setItem(REMINDER_MAP_KEY, JSON.stringify(map));
}

export async function getClassReminderId(
  classId: string,
): Promise<string | null> {
  const map = await loadClassReminderMap();
  return map[classId] ?? null;
}
