import { describe, expect, it } from 'vitest';

import {
  canAssignPlatformAdmins,
  canManagePlatformTenants,
  isPlatformAdmin,
} from '@openmat/shared/auth/platform';
import type { PlatformAdmin } from '@openmat/shared/types';
import { OPEN_MAT_ORG_ID, TEST_ACADEMY_A_ID } from '@openmat/shared/types';

import { buildPlatformSession } from '../lib/auth/permissions';
import { createMemoryTenantDirectory } from '../lib/data/tenantDirectory';

const admins: PlatformAdmin[] = [
  {
    userId: 'super-1',
    role: 'superadmin',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    userId: 'ops-1',
    role: 'ops',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    userId: 'support-1',
    role: 'support',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

describe('platform admin helpers', () => {
  it('recognizes platform admins without treating academy roles as platform', () => {
    expect(isPlatformAdmin(admins, 'ops-1')).toBe(true);
    expect(isPlatformAdmin(admins, 'random-coach')).toBe(false);
    expect(canManagePlatformTenants(admins, 'ops-1')).toBe(true);
    expect(canManagePlatformTenants(admins, 'support-1')).toBe(false);
    expect(canAssignPlatformAdmins(admins, 'super-1')).toBe(true);
    expect(canAssignPlatformAdmins(admins, 'ops-1')).toBe(false);
  });

  it('builds platform sessions only for allowlisted users', () => {
    const ok = buildPlatformSession(
      {
        id: 'ops-1',
        email: 'ops@example.com',
        fullName: 'Ops',
        role: 'admin',
      },
      admins,
    );
    const denied = buildPlatformSession(
      {
        id: 'coach-only',
        email: 'coach@example.com',
        fullName: 'Coach',
        role: 'coach',
      },
      admins,
    );
    expect(ok?.platformRole).toBe('ops');
    expect(ok?.canMutateTenants).toBe(true);
    expect(denied).toBeNull();
  });
});

describe('tenant directory memory repo', () => {
  it('lists orgs and nests academies under the correct organization', async () => {
    const directory = createMemoryTenantDirectory();
    const orgs = await directory.listOrganizations();
    expect(orgs.some((org) => org.id === OPEN_MAT_ORG_ID)).toBe(true);

    const openMatAcademies = await directory.listAcademiesByOrg(OPEN_MAT_ORG_ID);
    expect(openMatAcademies.every((a) => a.organizationId === OPEN_MAT_ORG_ID)).toBe(
      true,
    );

    const testA = await directory.getAcademy(TEST_ACADEMY_A_ID);
    expect(testA?.organizationId).toBe('org-test-a');
  });

  it('creates org/academy and assigns owner membership', async () => {
    const directory = createMemoryTenantDirectory({
      orgs: [],
      academies: [],
      locations: [],
      memberships: [],
    });

    const org = await directory.createOrganization({
      id: 'org-new',
      name: 'New Org',
      slug: 'new-org',
    });
    const academy = await directory.createAcademy({
      id: 'academy-new',
      name: 'New Academy',
      organizationId: org.id,
      slug: 'new-academy',
    });
    const membership = await directory.assignAcademyOwner({
      academyId: academy.id,
      userId: '11111111-1111-1111-1111-111111111111',
    });

    expect(academy.organizationId).toBe(org.id);
    expect(membership.role).toBe('owner');
    const roster = await directory.listMembershipsByAcademy(academy.id);
    expect(roster).toHaveLength(1);
  });
});
