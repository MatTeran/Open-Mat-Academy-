import type {
  Academy,
  AcademyMembership,
  AcademyMembershipRole,
  Location,
  Organization,
  OrganizationStatus,
} from '@openmat/shared/types';

import { isDemoMode } from '@/lib/auth/permissions';
import { createSupabaseServerClient } from '@/lib/supabase/server';

import {
  FIXTURE_ACADEMIES,
  FIXTURE_LOCATIONS,
  FIXTURE_MEMBERSHIPS,
  FIXTURE_ORGS,
} from './fixtures';
import { createSupabaseTenantDirectory } from './supabaseTenantDirectory';

export interface TenantDirectory {
  listOrganizations(): Promise<Organization[]>;
  getOrganization(id: string): Promise<Organization | null>;
  listAcademiesByOrg(orgId: string): Promise<Academy[]>;
  getAcademy(id: string): Promise<Academy | null>;
  listLocationsByAcademy(academyId: string): Promise<Location[]>;
  listMembershipsByAcademy(academyId: string): Promise<AcademyMembership[]>;
  createOrganization(input: {
    id: string;
    name: string;
    slug: string;
    status?: OrganizationStatus;
  }): Promise<Organization>;
  createAcademy(input: {
    id: string;
    name: string;
    organizationId: string;
    slug: string;
  }): Promise<Academy>;
  assignAcademyOwner(input: {
    academyId: string;
    userId: string;
  }): Promise<AcademyMembership>;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function createMemoryTenantDirectory(
  seed: {
    orgs?: Organization[];
    academies?: Academy[];
    locations?: Location[];
    memberships?: AcademyMembership[];
  } = {},
): TenantDirectory {
  const orgs = [...(seed.orgs ?? FIXTURE_ORGS)];
  const academies = [...(seed.academies ?? FIXTURE_ACADEMIES)];
  const locations = [...(seed.locations ?? FIXTURE_LOCATIONS)];
  const memberships = [...(seed.memberships ?? FIXTURE_MEMBERSHIPS)];

  return {
    async listOrganizations() {
      return [...orgs].sort((a, b) => a.name.localeCompare(b.name));
    },
    async getOrganization(id) {
      return orgs.find((org) => org.id === id) ?? null;
    },
    async listAcademiesByOrg(orgId) {
      return academies
        .filter((academy) => academy.organizationId === orgId)
        .sort((a, b) => a.name.localeCompare(b.name));
    },
    async getAcademy(id) {
      return academies.find((academy) => academy.id === id) ?? null;
    },
    async listLocationsByAcademy(academyId) {
      return locations.filter((location) => location.academyId === academyId);
    },
    async listMembershipsByAcademy(academyId) {
      return memberships.filter((row) => row.academyId === academyId);
    },
    async createOrganization(input) {
      const now = new Date().toISOString();
      const org: Organization = {
        id: input.id,
        name: input.name,
        slug: input.slug || slugify(input.name),
        status: input.status ?? 'active',
        createdAt: now,
        updatedAt: now,
      };
      orgs.push(org);
      return org;
    },
    async createAcademy(input) {
      const now = new Date().toISOString();
      const academy: Academy = {
        id: input.id,
        name: input.name,
        organizationId: input.organizationId,
        slug: input.slug || slugify(input.name),
        status: 'active',
        primaryLocationId: null,
        createdAt: now,
        updatedAt: now,
      };
      academies.push(academy);
      return academy;
    },
    async assignAcademyOwner(input) {
      const now = new Date().toISOString();
      const existing = memberships.find(
        (row) =>
          row.academyId === input.academyId && row.userId === input.userId,
      );
      if (existing) {
        existing.role = 'owner' satisfies AcademyMembershipRole;
        return existing;
      }
      const row: AcademyMembership = {
        id: `mem-${input.academyId}-${input.userId}`,
        academyId: input.academyId,
        userId: input.userId,
        role: 'owner',
        createdAt: now,
      };
      memberships.push(row);
      return row;
    },
  };
}

let memorySingleton: TenantDirectory | null = null;

export async function getTenantDirectory(): Promise<TenantDirectory> {
  if (isDemoMode()) {
    if (!memorySingleton) {
      memorySingleton = createMemoryTenantDirectory();
    }
    return memorySingleton;
  }

  const client = await createSupabaseServerClient();
  return createSupabaseTenantDirectory(client);
}
