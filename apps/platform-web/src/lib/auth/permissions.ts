import type { AuthUser, PlatformAdmin, PlatformAdminRole } from '@openmat/shared/types';
import {
  canManagePlatformTenants,
  findPlatformAdmin,
  isPlatformAdmin,
} from '@openmat/shared/auth/platform';

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

export function isDemoMode(): boolean {
  return (
    process.env.NEXT_PUBLIC_PLATFORM_WEB_DEMO === '1' ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
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
