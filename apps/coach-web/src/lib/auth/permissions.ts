import type { AuthUser, UserRole } from '@openmat/shared/types';
import {
  canEditMemberDevelopment,
  canFullyManageMemberDevelopment,
  canManageClasses,
  canPublishAnnouncements,
  hasCoachAccess,
  hasManagerAccess,
  hasOwnerAccess,
} from '@openmat/shared/auth/roles';

export type CoachWebRole = Extract<
  UserRole,
  'coach' | 'manager' | 'owner' | 'admin' | 'staff'
>;

export interface CoachSession {
  user: AuthUser;
  academyId: string;
  academyName: string;
}

const DEMO_USER: AuthUser = {
  id: 'guest-coach-user',
  email: 'coach@openmat.demo',
  fullName: 'Coach Rivera',
  role: 'coach',
};

export function isDemoMode(): boolean {
  return (
    process.env.NEXT_PUBLIC_COACH_WEB_DEMO === '1' ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

export function getDemoSession(): CoachSession {
  return {
    user: DEMO_USER,
    academyId: 'academy-open-mat',
    academyName: 'Open Mat Academy',
  };
}

/** Members and unknown roles cannot enter Coach Web. */
export function canAccessCoachWeb(user: AuthUser | null | undefined): boolean {
  return hasCoachAccess(user);
}

export function assertCoachWebAccess(user: AuthUser | null | undefined): void {
  if (!canAccessCoachWeb(user)) {
    throw new Error('Coach Web access denied for this role.');
  }
}

export const permissions = {
  canAccessCoachWeb,
  canEditMemberDevelopment,
  canFullyManageMemberDevelopment,
  canManageClasses,
  canPublishAnnouncements,
  hasManagerAccess,
  hasOwnerAccess,
  hasCoachAccess,
};
