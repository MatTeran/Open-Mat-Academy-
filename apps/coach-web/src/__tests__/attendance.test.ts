import { describe, expect, it } from 'vitest';

import { createAttendanceRepository } from '@openmat/shared/services';
import type { AttendanceRecord } from '@openmat/shared/types';

describe('attendance repository', () => {
  it('checks in a member', async () => {
    const seed: AttendanceRecord[] = [];
    const repo = createAttendanceRepository(seed);
    const record = await repo.checkIn({
      classId: 'class-1',
      memberId: 'member-1',
      memberName: 'Alex Chen',
      status: 'present',
    });
    expect(record.status).toBe('present');
    const roster = await repo.getRoster('class-1');
    expect(roster.checkedIn.length).toBe(1);
  });
});
