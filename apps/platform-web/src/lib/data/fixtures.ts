import type {
  Academy,
  AcademyMembership,
  Location,
  Organization,
} from '@openmat/shared/types';
import {
  OPEN_MAT_ACADEMY_ID,
  OPEN_MAT_LOCATION_ID,
  OPEN_MAT_ORG_ID,
  TEST_ACADEMY_A_ID,
  TEST_ACADEMY_B_ID,
} from '@openmat/shared/types';

const now = '2026-08-13T00:00:00.000Z';

export const FIXTURE_ORGS: Organization[] = [
  {
    id: OPEN_MAT_ORG_ID,
    name: 'Open Mat Academy',
    slug: 'open-mat-academy',
    status: 'active',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'org-test-a',
    name: 'Tenant Test Org A',
    slug: 'tenant-test-org-a',
    status: 'active',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'org-test-b',
    name: 'Tenant Test Org B',
    slug: 'tenant-test-org-b',
    status: 'active',
    createdAt: now,
    updatedAt: now,
  },
];

export const FIXTURE_ACADEMIES: Academy[] = [
  {
    id: OPEN_MAT_ACADEMY_ID,
    name: 'Open Mat Academy',
    organizationId: OPEN_MAT_ORG_ID,
    slug: 'open-mat',
    status: 'active',
    primaryLocationId: OPEN_MAT_LOCATION_ID,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: TEST_ACADEMY_A_ID,
    name: 'Tenant Test Academy A',
    organizationId: 'org-test-a',
    slug: 'tenant-test-academy-a',
    status: 'active',
    primaryLocationId: 'location-test-a',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: TEST_ACADEMY_B_ID,
    name: 'Tenant Test Academy B',
    organizationId: 'org-test-b',
    slug: 'tenant-test-academy-b',
    status: 'active',
    primaryLocationId: 'location-test-b',
    createdAt: now,
    updatedAt: now,
  },
];

export const FIXTURE_LOCATIONS: Location[] = [
  {
    id: OPEN_MAT_LOCATION_ID,
    academyId: OPEN_MAT_ACADEMY_ID,
    name: 'Tracy — Naglee',
    addressLine1: 'Naglee Rd',
    addressLine2: null,
    city: 'Tracy',
    state: 'CA',
    postalCode: '95304',
    country: 'United States',
    timezone: 'America/Los_Angeles',
    latitude: null,
    longitude: null,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'location-test-a',
    academyId: TEST_ACADEMY_A_ID,
    name: 'Test Academy A Main',
    addressLine1: '100 Test A St',
    addressLine2: null,
    city: 'Testville',
    state: 'CA',
    postalCode: '90001',
    country: 'United States',
    timezone: 'America/Los_Angeles',
    latitude: null,
    longitude: null,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'location-test-b',
    academyId: TEST_ACADEMY_B_ID,
    name: 'Test Academy B Main',
    addressLine1: '200 Test B St',
    addressLine2: null,
    city: 'Trialtown',
    state: 'CA',
    postalCode: '90002',
    country: 'United States',
    timezone: 'America/Los_Angeles',
    latitude: null,
    longitude: null,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
];

export const FIXTURE_MEMBERSHIPS: AcademyMembership[] = [
  {
    id: 'mem-open-mat-demo-owner',
    academyId: OPEN_MAT_ACADEMY_ID,
    userId: 'demo-open-mat-owner',
    role: 'owner',
    createdAt: now,
  },
  {
    id: 'mem-test-a-owner',
    academyId: TEST_ACADEMY_A_ID,
    userId: 'f561b89b-5a28-4662-912d-032045bd9b85',
    role: 'owner',
    createdAt: now,
  },
  {
    id: 'mem-test-b-coach',
    academyId: TEST_ACADEMY_B_ID,
    userId: '618c790a-64ba-47af-b7c1-e4424fcb2e7e',
    role: 'coach',
    createdAt: now,
  },
];
