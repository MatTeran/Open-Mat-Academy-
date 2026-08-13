import type { AuthUser, PlatformAdmin, PlatformAdminRole } from '@openmat/shared/types';
import {
  canManagePlatformTenants,
  findPlatformAdmin,
  isPlatformAdmin,
} from '@openmat/shared/auth/platform';

import { isSupabasePublicConfigured } from '@/lib/supabase/env';

export interface PlatformSession {
  user: AuthUser;
  platformRole: PlatformAdminRole;
  canMutateTenants: boolean;
}

export const DEMO_PLATFORM_USER: AuthUser = {
  id: 'platform-demo-admin',
  email: 'ops@mygi.demo',
  fullName: 'My Gi Ops',
  role: 'admin',
};

export const DEMO_PLATFORM_ADMINS: PlatformAdmin[] = [
  {
    userId: DEMO_PLATFORM_USER.id,
    role: 'ops',
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  },
];

/**
 * Demo when explicitly forced, or when no Supabase public keys are present.
 * Set NEXT_PUBLIC_PLATFORM_WEB_DEMO=0 to require live auth when keys exist.
 */
export function isDemoMode(): boolean {
  if (process.env.NEXT_PUBLIC_PLATFORM_WEB_DEMO === '1') {
    return true;
  }
  if (process.env.NEXT_PUBLIC_PLATFORM_WEB_DEMO === '0') {
    return false;
  }
  return !isSupabasePublicConfigured();
}

export function getDemoPlatformSession(): PlatformSession {
  return buildPlatformSession(DEMO_PLATFORM_USER, DEMO_PLATFORM_ADMINS)!;
}

export function buildPlatformSession(
  user: AuthUser,
  admins: PlatformAdmin[],
): PlatformSession | null {
  if (!isPlatformAdmin(admins, user.id)) {
    return null;
  }
  const admin = findPlatformAdmin(admins, user.id)!;
  return {
    user,
    platformRole: admin.role,
    canMutateTenants: canManagePlatformTenants(admins, user.id),
  };
}

export function mapPlatformAdminRow(
  row: Record<string, unknown>,
): PlatformAdmin {
  return {
    userId: String(row.user_id),
    role: row.role as PlatformAdminRole,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}
