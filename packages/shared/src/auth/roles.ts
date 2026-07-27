import type { AuthUser, UserRole } from '../types';

/** Role helpers prepared for future permission gates. */
export function getUserRole(user: AuthUser | null | undefined): UserRole | null {
  return user?.role ?? null;
}

/**
 * Coach-tier access: coaches, managers, owners, and legacy admin/staff.
 * Members never receive this.
 */
export function hasCoachAccess(user: AuthUser | null | undefined): boolean {
  const role = getUserRole(user);
  return (
    role === 'coach' ||
    role === 'manager' ||
    role === 'owner' ||
    role === 'admin' ||
    role === 'staff'
  );
}

/** Manager or owner (full academy access). Legacy admin maps here. */
export function hasManagerAccess(user: AuthUser | null | undefined): boolean {
  const role = getUserRole(user);
  return role === 'manager' || role === 'owner' || role === 'admin';
}

export function hasOwnerAccess(user: AuthUser | null | undefined): boolean {
  const role = getUserRole(user);
  return role === 'owner' || role === 'admin';
}

export function hasAdminAccess(user: AuthUser | null | undefined): boolean {
  return hasOwnerAccess(user);
}

export function canManageMembers(user: AuthUser | null | undefined): boolean {
  return hasCoachAccess(user);
}

export function canPublishAnnouncements(
  user: AuthUser | null | undefined,
): boolean {
  return hasCoachAccess(user);
}

export function canManageClasses(user: AuthUser | null | undefined): boolean {
  return hasCoachAccess(user);
}

/**
 * Member Development write access (belt / stripes / notes / competition / roles).
 * Coaches may create and update; managers and owners have full access.
 * Members are read-only for their own public development fields.
 */
export function canEditMemberDevelopment(
  user: AuthUser | null | undefined,
): boolean {
  return hasCoachAccess(user);
}

/** Delete / override sensitive development records. */
export function canFullyManageMemberDevelopment(
  user: AuthUser | null | undefined,
): boolean {
  return hasManagerAccess(user);
}
