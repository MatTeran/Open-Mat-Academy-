import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import type { AuthUser } from '@openmat/shared/types';

import {
  canAccessCoachWeb,
  getDemoSession,
  isDemoMode,
  type CoachSession,
} from './permissions';

const SESSION_COOKIE = 'openmat-coach-web-session';

/**
 * Server-side session resolver.
 * Demo mode uses a signed-in coach cookie; live mode will use Supabase SSR.
 */
export async function getCoachSession(): Promise<CoachSession | null> {
  if (isDemoMode()) {
    const jar = await cookies();
    const flag = jar.get(SESSION_COOKIE)?.value;
    if (flag !== '1') {
      return null;
    }
    return getDemoSession();
  }

  // Live Supabase SSR wiring lands when env keys are configured.
  return null;
}

export async function requireCoachSession(): Promise<CoachSession> {
  const session = await getCoachSession();
  if (!session || !canAccessCoachWeb(session.user)) {
    redirect('/login');
  }
  return session;
}

export function memberBlockedMessage(user: AuthUser | null): string {
  if (!user) {
    return 'Sign in with a coach, manager, or owner account.';
  }
  if (user.role === 'member') {
    return 'Member accounts cannot access the Coach Web Dashboard.';
  }
  return 'Your role is not authorized for Coach Web.';
}

export { SESSION_COOKIE };
