import type { AuthUser, UserRole } from '@openmat/shared/types';
import {
  OPEN_MAT_ACADEMY_ID,
  OPEN_MAT_LOCATION_ID,
  OPEN_MAT_ORG_ID,
  type AcademyMembership,
  type AcademySessionContext,
} from '@openmat/shared/types';
import {
  canEditMemberDevelopment,
  canFullyManageMemberDevelopment,
  canManageClasses,
  canPublishAnnouncements,
  hasCoachAccess,
  hasManagerAccess,
  hasOwnerAccess,
} from '@openmat/shared/auth/roles';
import {
  canAccessAcademy,
  canCoachAtAcademy,
  canManageAcademy,
  resolveAcademySessionContext,
} from '@openmat/shared/auth/membership';

export type CoachWebRole = Extract<
  UserRole,
  'coach' | 'manager' | 'owner' | 'admin' | 'staff'
>;

export interface CoachSession {
  user: AuthUser;
  academyId: string;
  academyName: string;
  organizationId: string;
  locationId: string | null;
  memberships: AcademyMembership[];
  membershipRole: AcademyMembership['role'];
  context: AcademySessionContext;
}

const DEMO_USER: AuthUser = {
  id: 'guest-coach-user',
  email: 'coach@openmat.demo',
  fullName: 'Coach Rivera',
  role: 'coach',
};

const DEMO_MEMBERSHIP: AcademyMembership = {
  id: 'demo-membership-open-mat',
  academyId: OPEN_MAT_ACADEMY_ID,
  userId: DEMO_USER.id,
  role: 'coach',
  createdAt: new Date(0).toISOString(),
};

export function isDemoMode(): boolean {
  return (
    process.env.NEXT_PUBLIC_COACH_WEB_DEMO === '1' ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

export function getDemoSession(): CoachSession {
  const context = resolveAcademySessionContext({
    memberships: [DEMO_MEMBERSHIP],
    academyNames: { [OPEN_MAT_ACADEMY_ID]: 'Open Mat Academy' },
    preferredAcademyId: OPEN_MAT_ACADEMY_ID,
    fallbackUser: DEMO_USER,
  });

  return {
    user: DEMO_USER,
    academyId: context.academyId,
    academyName: context.academyName,
    organizationId: context.organizationId || OPEN_MAT_ORG_ID,
    locationId: context.locationId ?? OPEN_MAT_LOCATION_ID,
    memberships: context.memberships,
    membershipRole: context.membershipRole,
    context,
  };
}

/**
 * Build a coach session from auth user + memberships.
 * Memberships are the academy permission source of truth.
 */
export function buildCoachSession(
  user: AuthUser,
  memberships: AcademyMembership[],
  academyNames: Record<string, string> = {
    [OPEN_MAT_ACADEMY_ID]: 'Open Mat Academy',
  },
): CoachSession | null {
  const context = resolveAcademySessionContext({
    memberships,
    academyNames,
    preferredAcademyId: OPEN_MAT_ACADEMY_ID,
    fallbackUser: user,
  });

  if (!canCoachAtAcademy(context.memberships, context.academyId)) {
    return null;
  }

  return {
    user,
    academyId: context.academyId,
    academyName: context.academyName,
    organizationId: context.organizationId,
    locationId: context.locationId,
    memberships: context.memberships,
    membershipRole: context.membershipRole,
    context,
  };
}

/** Members and unknown roles cannot enter Coach Web. */
export function canAccessCoachWeb(user: AuthUser | null | undefined): boolean {
  return hasCoachAccess(user);
}

/** Prefer membership-scoped check when memberships are available. */
export function canAccessCoachWebForAcademy(
  memberships: AcademyMembership[] | null | undefined,
  academyId: string,
): boolean {
  return canCoachAtAcademy(memberships, academyId);
}

export function assertCoachWebAccess(user: AuthUser | null | undefined): void {
  if (!canAccessCoachWeb(user)) {
    throw new Error('Coach Web access denied for this role.');
  }
}

export const permissions = {
  canAccessCoachWeb,
  canAccessCoachWebForAcademy,
  canAccessAcademy,
  canCoachAtAcademy,
  canManageAcademy,
  canEditMemberDevelopment,
  canFullyManageMemberDevelopment,
  canManageClasses,
  canPublishAnnouncements,
  hasManagerAccess,
  hasOwnerAccess,
  hasCoachAccess,
};
