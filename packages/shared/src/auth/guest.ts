import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AuthSession, AuthUser } from '../types';

export const GUEST_STORAGE_KEY = '@open-mat/guest-demo-session';
export const COACH_GUEST_STORAGE_KEY = '@open-mat/coach-guest-demo-session';

export const GUEST_USER: AuthUser = {
  id: 'member-1',
  email: 'alex@openmat.demo',
  fullName: 'Alex Chen',
  role: 'member',
};

export const COACH_GUEST_USER: AuthUser = {
  id: 'guest-coach-user',
  email: 'coach@openmat.demo',
  fullName: 'Coach Rivera',
  role: 'coach',
};

export function createGuestSession(userId = GUEST_USER.id): AuthSession {
  return {
    accessToken: 'guest-demo-access-token',
    refreshToken: 'guest-demo-refresh-token',
    userId,
    expiresAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
  };
}

export async function readGuestFlag(
  key: string = GUEST_STORAGE_KEY,
): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value === '1';
  } catch {
    return false;
  }
}

export async function writeGuestFlag(
  enabled: boolean,
  key: string = GUEST_STORAGE_KEY,
): Promise<void> {
  try {
    if (enabled) {
      await AsyncStorage.setItem(key, '1');
    } else {
      await AsyncStorage.removeItem(key);
    }
  } catch {
    // Keep in-memory guest mode even if persistence fails.
  }
}

export * from './roles';
