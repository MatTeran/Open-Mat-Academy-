import type { PlatformAdmin, PlatformAdminRole } from '../types/platform';

const PLATFORM_ROLES: PlatformAdminRole[] = ['superadmin', 'ops', 'support'];

export function isPlatformAdminRole(value: string | null | undefined): value is PlatformAdminRole {
  return !!value && (PLATFORM_ROLES as string[]).includes(value);
}

export function findPlatformAdmin(
  admins: PlatformAdmin[],
  userId: string | null | undefined,
): PlatformAdmin | null {
  if (!userId) return null;
  return admins.find((admin) => admin.userId === userId) ?? null;
}

export function isPlatformAdmin(
  admins: PlatformAdmin[],
  userId: string | null | undefined,
): boolean {
  return findPlatformAdmin(admins, userId) != null;
}

/** Ops + superadmin may mutate tenant directory; support is read-mostly. */
export function canManagePlatformTenants(
  admins: PlatformAdmin[],
  userId: string | null | undefined,
): boolean {
  const admin = findPlatformAdmin(admins, userId);
  return admin?.role === 'superadmin' || admin?.role === 'ops';
}

export function canAssignPlatformAdmins(
  admins: PlatformAdmin[],
  userId: string | null | undefined,
): boolean {
  return findPlatformAdmin(admins, userId)?.role === 'superadmin';
}
