import type { AuthUser, UserRole } from '../types';
import type {
  AcademyMembership,
  AcademyMembershipRole,
  AcademySessionContext,
} from '../types/tenancy';
import {
  OPEN_MAT_ACADEMY_ID,
  OPEN_MAT_LOCATION_ID,
  OPEN_MAT_ORG_ID,
} from '../types/tenancy';

const COACH_TIER: AcademyMembershipRole[] = [
  'owner',
  'manager',
  'coach',
  'staff',
  'admin',
];

const MANAGER_TIER: AcademyMembershipRole[] = ['owner', 'manager', 'admin'];

export function isAcademyMembershipRole(
  role: string | null | undefined,
): role is AcademyMembershipRole {
  return (
    role === 'owner' ||
    role === 'manager' ||
    role === 'coach' ||
    role === 'staff' ||
    role === 'member' ||
    role === 'admin'
  );
}

export function isAcademyMember(
  memberships: AcademyMembership[] | null | undefined,
  academyId: string,
): boolean {
  return Boolean(memberships?.some((item) => item.academyId === academyId));
}

export function getAcademyMembership(
  memberships: AcademyMembership[] | null | undefined,
  academyId: string,
): AcademyMembership | null {
  return memberships?.find((item) => item.academyId === academyId) ?? null;
}

export function hasAcademyRole(
  memberships: AcademyMembership[] | null | undefined,
  academyId: string,
  roles: AcademyMembershipRole[],
): boolean {
  const membership = getAcademyMembership(memberships, academyId);
  if (!membership) {
    return false;
  }
  return roles.includes(membership.role);
}

export function canAccessAcademy(
  memberships: AcademyMembership[] | null | undefined,
  academyId: string,
): boolean {
  return isAcademyMember(memberships, academyId);
}

export function canCoachAtAcademy(
  memberships: AcademyMembership[] | null | undefined,
  academyId: string,
): boolean {
  return hasAcademyRole(memberships, academyId, COACH_TIER);
}

export function canManageAcademy(
  memberships: AcademyMembership[] | null | undefined,
  academyId: string,
): boolean {
  return hasAcademyRole(memberships, academyId, MANAGER_TIER);
}

/** True when the actor coaches at any academy shared with the subject. */
export function sharesCoachableAcademyWith(
  actorMemberships: AcademyMembership[] | null | undefined,
  subjectMemberships: AcademyMembership[] | null | undefined,
): boolean {
  if (!actorMemberships?.length || !subjectMemberships?.length) {
    return false;
  }
  const subjectAcademyIds = new Set(
    subjectMemberships.map((item) => item.academyId),
  );
  return actorMemberships.some(
    (item) =>
      subjectAcademyIds.has(item.academyId) && COACH_TIER.includes(item.role),
  );
}

/**
 * Resolve active academy context from memberships.
 * Prefers first coach-tier membership; falls back to Open Mat for demo continuity.
 */
export function resolveAcademySessionContext(options: {
  memberships: AcademyMembership[];
  academyNames?: Record<string, string>;
  preferredAcademyId?: string | null;
  /** JWT/demo role used only when memberships are empty (demo fallback). */
  fallbackUser?: AuthUser | null;
}): AcademySessionContext {
  const { memberships, academyNames = {}, preferredAcademyId, fallbackUser } =
    options;

  const preferred =
    (preferredAcademyId &&
      memberships.find((item) => item.academyId === preferredAcademyId)) ||
    memberships.find((item) => COACH_TIER.includes(item.role)) ||
    memberships[0];

  if (preferred) {
    return {
      organizationId: OPEN_MAT_ORG_ID,
      academyId: preferred.academyId,
      academyName:
        academyNames[preferred.academyId] ??
        (preferred.academyId === OPEN_MAT_ACADEMY_ID
          ? 'Open Mat Academy'
          : preferred.academyId),
      locationId:
        preferred.academyId === OPEN_MAT_ACADEMY_ID
          ? OPEN_MAT_LOCATION_ID
          : null,
      membershipRole: preferred.role,
      memberships,
    };
  }

  // Demo / guest fallback — preserves current single-academy UX.
  const fallbackRole = mapJwtRoleToMembership(fallbackUser?.role) ?? 'coach';
  return {
    organizationId: OPEN_MAT_ORG_ID,
    academyId: OPEN_MAT_ACADEMY_ID,
    academyName: 'Open Mat Academy',
    locationId: OPEN_MAT_LOCATION_ID,
    membershipRole: fallbackRole,
    memberships: [
      {
        id: 'demo-membership-open-mat',
        academyId: OPEN_MAT_ACADEMY_ID,
        userId: fallbackUser?.id ?? 'guest-coach-user',
        role: fallbackRole,
        createdAt: new Date(0).toISOString(),
      },
    ],
  };
}

function mapJwtRoleToMembership(
  role: UserRole | undefined,
): AcademyMembershipRole | null {
  if (!role) {
    return null;
  }
  return isAcademyMembershipRole(role) ? role : null;
}

/** Filter helper for memory repositories / tests. */
export function filterByAcademyId<T extends { academyId: string }>(
  items: T[],
  academyId: string,
): T[] {
  return items.filter((item) => item.academyId === academyId);
}
