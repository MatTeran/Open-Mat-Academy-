import { Platform } from 'react-native';

import { getSupabaseClient } from '../../services/supabase/client';
import type { PushTokenRecord } from './notificationTypes';

export interface SavePushTokenResult {
  ok: boolean;
  skipped?: boolean;
  reason?: string;
  error?: string;
}

/**
 * Upsert the device Expo push token for the authenticated user.
 * Guests and missing Supabase config are skipped (not treated as hard failures).
 *
 * Requires `push_tokens` table + RLS (see supabase/migrations).
 */
export async function savePushTokenToSupabase(
  record: PushTokenRecord,
): Promise<SavePushTokenResult> {
  if (!record.userId || record.userId === 'guest-demo-user') {
    return {
      ok: true,
      skipped: true,
      reason: 'No authenticated Supabase user — token not stored.',
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      ok: true,
      skipped: true,
      reason: 'Supabase is not configured in this environment.',
    };
  }

  const payload = {
    user_id: record.userId,
    expo_push_token: record.expoPushToken,
    platform: record.platform || Platform.OS,
    device_name: record.deviceName ?? null,
    is_active: true,
    updated_at: new Date().toISOString(),
  };

  const { error } = await client.from('push_tokens').upsert(payload, {
    onConflict: 'user_id,expo_push_token',
  });

  if (error) {
    if (__DEV__) {
      console.warn('[notifications] push_tokens upsert failed', error.message);
    }
    return {
      ok: false,
      error:
        'Could not save your device token. Notifications may still work locally.',
    };
  }

  return { ok: true };
}

/**
 * Optional sync for notification_preferences when the table exists.
 * Failures are soft — local preferences remain source of truth for now.
 */
export async function syncNotificationPreferencesToSupabase(
  userId: string,
  preferences: Record<string, unknown>,
): Promise<SavePushTokenResult> {
  if (!userId || userId === 'guest-demo-user') {
    return { ok: true, skipped: true, reason: 'Guest user' };
  }

  const client = getSupabaseClient();
  if (!client) {
    return { ok: true, skipped: true, reason: 'Supabase not configured' };
  }

  const { error } = await client.from('notification_preferences').upsert(
    {
      user_id: userId,
      preferences,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );

  if (error) {
    if (__DEV__) {
      console.warn(
        '[notifications] notification_preferences upsert failed (table may not exist yet)',
        error.message,
      );
    }
    return {
      ok: true,
      skipped: true,
      reason: 'Remote preferences table unavailable — local prefs kept.',
    };
  }

  return { ok: true };
}
