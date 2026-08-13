import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import type { AuthUser, PlatformAdmin } from '@openmat/shared/types';

import { createSupabaseServerClient } from '@/lib/supabase/server';

import {
  buildPlatformSession,
  getDemoPlatformSession,
  isDemoMode,
  mapPlatformAdminRow,
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

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const { data: adminRow, error } = await supabase
    .from('platform_admins')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !adminRow) {
    return null;
  }

  const authUser: AuthUser = {
    id: user.id,
    email: user.email ?? '',
    fullName:
      (user.user_metadata?.full_name as string | undefined) ??
      user.email ??
      'Platform admin',
    role: 'admin',
  };

  const admins: PlatformAdmin[] = [
    mapPlatformAdminRow(adminRow as Record<string, unknown>),
  ];

  return buildPlatformSession(authUser, admins);
}

export async function requirePlatformSession(): Promise<PlatformSession> {
  const session = await getPlatformSession();
  if (!session) {
    redirect('/login');
  }
  return session;
}

export { SESSION_COOKIE };
