import { describe, expect, it } from 'vitest';

import {
  canAccessCoachWeb,
  permissions,
} from '../lib/auth/permissions';
import type { AuthUser } from '@openmat/shared/types';

describe('Coach Web authorization', () => {
  it('blocks members', () => {
    const member: AuthUser = {
      id: '1',
      email: 'm@example.com',
      fullName: 'Member',
      role: 'member',
    };
    expect(canAccessCoachWeb(member)).toBe(false);
  });

  it('allows coaches managers and owners', () => {
    expect(
      canAccessCoachWeb({
        id: '2',
        email: 'c@example.com',
        fullName: 'Coach',
        role: 'coach',
      }),
    ).toBe(true);
    expect(
      canAccessCoachWeb({
        id: '3',
        email: 'm@example.com',
        fullName: 'Manager',
        role: 'manager',
      }),
    ).toBe(true);
    expect(
      canAccessCoachWeb({
        id: '4',
        email: 'o@example.com',
        fullName: 'Owner',
        role: 'owner',
      }),
    ).toBe(true);
  });

  it('grants development edit to coaches', () => {
    expect(
      permissions.canEditMemberDevelopment({
        id: '2',
        email: 'c@example.com',
        fullName: 'Coach',
        role: 'coach',
      }),
    ).toBe(true);
  });
});
