import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AuthSession, AuthUser } from '../../types';

export const GUEST_STORAGE_KEY = '@open-mat/guest-demo-session';

/** Guest explores as Alex Chen — same athlete shown in the Coach roster. */
export const GUEST_USER: AuthUser = {
  id: 'member-1',
  email: 'alex@openmat.demo',
  fullName: 'Alex Chen',
};

export function createGuestSession(): AuthSession {
  return {
    accessToken: 'guest-demo-access-token',
    refreshToken: 'guest-demo-refresh-token',
    userId: GUEST_USER.id,
    expiresAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
  };
}

export async function readGuestFlag(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(GUEST_STORAGE_KEY);
    return value === '1';
  } catch {
    return false;
  }
}

export async function writeGuestFlag(enabled: boolean): Promise<void> {
  try {
    if (enabled) {
      await AsyncStorage.setItem(GUEST_STORAGE_KEY, '1');
    } else {
      await AsyncStorage.removeItem(GUEST_STORAGE_KEY);
    }
  } catch {
    // Keep in-memory guest mode even if persistence fails.
  }
}
