import { describe, expect, it } from 'vitest';

import {
  createMemberDevelopmentRepository,
  createMemoryMemberDevelopmentRepository,
} from '@openmat/shared/services';
import type { MemberDevelopmentRecord } from '@openmat/shared/types';

const author = {
  id: 'coach-1',
  name: 'Coach Rivera',
  academyId: 'academy-open-mat',
};

describe('promotion business logic (shared repository)', () => {
  it('adds a stripe and appends history', async () => {
    const development: MemberDevelopmentRecord[] = [
      {
        id: 'dev-1',
        memberId: 'member-1',
        academyId: 'academy-open-mat',
        belt: 'blue',
        stripes: 1,
        promotionDate: '2025-01-01',
        promotedById: 'coach-1',
        promotedByName: 'Coach Rivera',
        timeAtBeltStartedAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
      },
    ];
    const repo = createMemoryMemberDevelopmentRepository({ development });
    const bundle = await repo.addStripe(
      {
        memberId: 'member-1',
        fromStripe: 1,
        toStripe: 2,
        date: '2025-06-01',
        notes: 'Solid week',
      },
      author,
    );
    expect(bundle.development.stripes).toBe(2);
    expect(bundle.history[0]?.type).toBe('stripe');
    expect(bundle.history[0]?.stripe).toBe(2);
  });

  it('promotes belt and resets stripes to 0', async () => {
    const development: MemberDevelopmentRecord[] = [
      {
        id: 'dev-2',
        memberId: 'member-2',
        academyId: 'academy-open-mat',
        belt: 'white',
        stripes: 4,
        promotionDate: '2025-01-01',
        promotedById: 'coach-1',
        promotedByName: 'Coach Rivera',
        timeAtBeltStartedAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
      },
    ];
    const repo = createMemberDevelopmentRepository({ development });
    const bundle = await repo.promoteBelt(
      {
        memberId: 'member-2',
        fromBelt: 'white',
        toBelt: 'blue',
        date: '2025-07-01',
        notifyMember: true,
        createAchievement: true,
        postToCommunity: false,
        generateShareCard: false,
      },
      author,
    );
    expect(bundle.development.belt).toBe('blue');
    expect(bundle.development.stripes).toBe(0);
    expect(bundle.history[0]?.type).toBe('belt');
  });
});
