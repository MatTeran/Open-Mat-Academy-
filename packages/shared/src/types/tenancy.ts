import type { UserRole } from './auth';

/** Organization status for top-level tenant grouping. */
export type OrganizationStatus = 'active' | 'suspended' | 'archived';

export type AcademyStatus = 'active' | 'suspended' | 'archived';

/** Academy-scoped membership roles (source of truth for academy permissions). */
export type AcademyMembershipRole = Extract<
  UserRole,
  'owner' | 'manager' | 'coach' | 'staff' | 'member' | 'admin'
>;

export interface Organization {
  id: string;
  name: string;
  slug: string;
  status: OrganizationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Academy {
  id: string;
  name: string;
  organizationId: string;
  slug: string | null;
  status: AcademyStatus;
  primaryLocationId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  academyId: string;
  name: string;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string;
  timezone: string;
  latitude: number | null;
  longitude: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AcademyMembership {
  id: string;
  academyId: string;
  userId: string;
  role: AcademyMembershipRole;
  createdAt: string;
}

/** Active academy context for coach/member sessions. */
export interface AcademySessionContext {
  organizationId: string;
  academyId: string;
  academyName: string;
  locationId: string | null;
  membershipRole: AcademyMembershipRole;
  memberships: AcademyMembership[];
}

/** Stable production Open Mat ids (do not invent duplicates). */
export const OPEN_MAT_ORG_ID = 'org-open-mat';
export const OPEN_MAT_ACADEMY_ID = 'academy-open-mat';
export const OPEN_MAT_LOCATION_ID = 'location-tracy-naglee';

/** Synthetic academies for isolation tests only — not production onboarding. */
export const TEST_ACADEMY_A_ID = 'academy-test-a';
export const TEST_ACADEMY_B_ID = 'academy-test-b';
