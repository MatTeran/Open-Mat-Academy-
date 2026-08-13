import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import {
  getDemoPlatformSession,
  isDemoMode,
  type PlatformSession,
} from './permissions';

const SESSION_COOKIE = 'mygi-platform-web-session';

export async function getPlatformSession(): Promise<PlatformSession | null> {
  if (isDemoMode()) {
    const jar = await cookies();
    if (jar.get(SESSION_COOKIE)?.value !== '1') {
      return null;
    }
    return getDemoPlatformSession();
  }

  // Live Supabase SSR + platform_admins lookup lands with env keys.
  return null;
}

export async function requirePlatformSession(): Promise<PlatformSession> {
  const session = await getPlatformSession();
  if (!session) {
    redirect('/login');
  }
  return session;
}

export { SESSION_COOKIE };
