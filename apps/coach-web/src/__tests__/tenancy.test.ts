import { describe, expect, it } from 'vitest';

import {
  canAccessAcademy,
  canCoachAtAcademy,
  canManageAcademy,
  filterByAcademyId,
  resolveAcademySessionContext,
  sharesCoachableAcademyWith,
} from '@openmat/shared/auth/membership';
import {
  createClassesRepository,
  createCoachNotesRepository,
  createMemoryClassesRepository,
  createMemoryCoachNotesRepository,
} from '@openmat/shared/services';
import type {
  AcademyMembership,
  CoachClass,
  CoachNote,
} from '@openmat/shared/types';
import {
  OPEN_MAT_ACADEMY_ID,
  TEST_ACADEMY_A_ID,
  TEST_ACADEMY_B_ID,
} from '@openmat/shared/types';

import { buildCoachSession, getDemoSession } from '../lib/auth/permissions';

function membership(
  userId: string,
  academyId: string,
  role: AcademyMembership['role'],
  id: string,
): AcademyMembership {
  return {
    id,
    userId,
    academyId,
    role,
    createdAt: '2026-01-01T00:00:00.000Z',
  };
}

function sampleClass(id: string, academyId: string): CoachClass {
  return {
    id,
    title: `${academyId} class`,
    date: '2026-08-09',
    startTime: '10:00',
    endTime: '11:00',
    instructorId: 'coach-a',
    instructorName: 'Coach A',
    giType: 'gi',
    level: 'adult_bjj',
    audience: 'adults',
    capacity: 20,
    reservedCount: 0,
    checkedInCount: 0,
    waitlistCount: 0,
    firstTimeVisitorCount: 0,
    status: 'scheduled',
    isOpenMat: false,
    isSeminar: false,
    recurrence: 'none',
    academyId,
    locationId: null,
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
    cancelledAt: null,
  };
}

function sampleNote(id: string, academyId: string, memberId: string): CoachNote {
  return {
    id,
    memberId,
    authorId: 'coach-a',
    authorName: 'Coach A',
    body: `Private note for ${academyId}`,
    isPrivate: true,
    academyId,
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  };
}

describe('membership-scoped authorization helpers', () => {
  const coachA = [
    membership('user-a', TEST_ACADEMY_A_ID, 'coach', 'm-a'),
  ];
  const ownerA = [
    membership('user-owner-a', TEST_ACADEMY_A_ID, 'owner', 'm-owner-a'),
  ];
  const dual = [
    membership('user-dual', TEST_ACADEMY_A_ID, 'owner', 'm-dual-a'),
    membership('user-dual', TEST_ACADEMY_B_ID, 'coach', 'm-dual-b'),
  ];

  it('1. coach at Academy A cannot access Academy B', () => {
    expect(canAccessAcademy(coachA, TEST_ACADEMY_A_ID)).toBe(true);
    expect(canAccessAcademy(coachA, TEST_ACADEMY_B_ID)).toBe(false);
    expect(canCoachAtAcademy(coachA, TEST_ACADEMY_B_ID)).toBe(false);
  });

  it('2. coach at Academy A cannot manage Academy B', () => {
    expect(canCoachAtAcademy(coachA, TEST_ACADEMY_A_ID)).toBe(true);
    expect(canManageAcademy(coachA, TEST_ACADEMY_B_ID)).toBe(false);
    expect(canCoachAtAcademy(coachA, TEST_ACADEMY_B_ID)).toBe(false);
  });

  it('4. owner at Academy A cannot access unrelated Academy B', () => {
    expect(canManageAcademy(ownerA, TEST_ACADEMY_A_ID)).toBe(true);
    expect(canAccessAcademy(ownerA, TEST_ACADEMY_B_ID)).toBe(false);
    expect(canManageAcademy(ownerA, TEST_ACADEMY_B_ID)).toBe(false);
  });

  it('6. dual-membership user only gets permitted roles per academy', () => {
    expect(canManageAcademy(dual, TEST_ACADEMY_A_ID)).toBe(true);
    expect(canManageAcademy(dual, TEST_ACADEMY_B_ID)).toBe(false);
    expect(canCoachAtAcademy(dual, TEST_ACADEMY_B_ID)).toBe(true);

    const contextA = resolveAcademySessionContext({
      memberships: dual,
      preferredAcademyId: TEST_ACADEMY_A_ID,
    });
    expect(contextA.academyId).toBe(TEST_ACADEMY_A_ID);
    expect(contextA.membershipRole).toBe('owner');

    const contextB = resolveAcademySessionContext({
      memberships: dual,
      preferredAcademyId: TEST_ACADEMY_B_ID,
    });
    expect(contextB.academyId).toBe(TEST_ACADEMY_B_ID);
    expect(contextB.membershipRole).toBe('coach');
  });
});

describe('repository academy isolation (memory)', () => {
  it('1+2. coach A context only lists/modifies Academy A classes', async () => {
    const repo = createMemoryClassesRepository([
      sampleClass('class-a', TEST_ACADEMY_A_ID),
      sampleClass('class-b', TEST_ACADEMY_B_ID),
    ]);

    const listedA = await repo.list({ academyId: TEST_ACADEMY_A_ID });
    expect(listedA.map((item) => item.id)).toEqual(['class-a']);

    const listedB = await repo.list({ academyId: TEST_ACADEMY_B_ID });
    expect(listedB.map((item) => item.id)).toEqual(['class-b']);

    const created = await repo.create(
      {
        title: 'New A class',
        date: '2026-08-10',
        startTime: '12:00',
        endTime: '13:00',
        instructorName: 'Coach A',
        giType: 'gi',
        level: 'adult_bjj',
        audience: 'adults',
        capacity: 18,
      },
      { instructorId: 'coach-a', academyId: TEST_ACADEMY_A_ID },
    );
    expect(created.academyId).toBe(TEST_ACADEMY_A_ID);

    const after = await repo.list({ academyId: TEST_ACADEMY_B_ID });
    expect(after.every((item) => item.academyId === TEST_ACADEMY_B_ID)).toBe(
      true,
    );
    expect(after.find((item) => item.id === created.id)).toBeUndefined();
  });

  it('3. coach A cannot read Academy B coach notes via academy filter', async () => {
    const repo = createMemoryCoachNotesRepository([
      sampleNote('note-a', TEST_ACADEMY_A_ID, 'member-1'),
      sampleNote('note-b', TEST_ACADEMY_B_ID, 'member-1'),
    ]);

    const notesA = await repo.listByMember(
      'member-1',
      undefined,
      TEST_ACADEMY_A_ID,
    );
    expect(notesA.map((note) => note.id)).toEqual(['note-a']);

    const notesB = await repo.listByMember(
      'member-1',
      undefined,
      TEST_ACADEMY_B_ID,
    );
    expect(notesB.map((note) => note.id)).toEqual(['note-b']);
  });

  it('5. member private notes stay coach-only and academy-scoped', async () => {
    const notes = [
      sampleNote('note-private-a', TEST_ACADEMY_A_ID, 'member-secret'),
      sampleNote('note-private-b', TEST_ACADEMY_B_ID, 'member-other'),
    ];
    expect(notes.every((note) => note.isPrivate)).toBe(true);

    const visibleToCoachA = filterByAcademyId(notes, TEST_ACADEMY_A_ID);
    expect(visibleToCoachA).toHaveLength(1);
    expect(visibleToCoachA[0].memberId).toBe('member-secret');
    expect(
      visibleToCoachA.find((note) => note.memberId === 'member-other'),
    ).toBeUndefined();
  });

  it('7. Open Mat academy workflows still resolve demo session + fixtures', async () => {
    const session = getDemoSession();
    expect(session.academyId).toBe(OPEN_MAT_ACADEMY_ID);
    expect(canCoachAtAcademy(session.memberships, OPEN_MAT_ACADEMY_ID)).toBe(
      true,
    );

    const openMatSession = buildCoachSession(session.user, session.memberships);
    expect(openMatSession?.academyId).toBe(OPEN_MAT_ACADEMY_ID);

    // Factory still returns a usable repo for the live academy id.
    const classesRepo = createClassesRepository([
      sampleClass('open-mat-class', OPEN_MAT_ACADEMY_ID),
    ]);
    const listed = await classesRepo.list({ academyId: OPEN_MAT_ACADEMY_ID });
    expect(listed).toHaveLength(1);
    expect(listed[0].academyId).toBe(OPEN_MAT_ACADEMY_ID);

    const notesRepo = createCoachNotesRepository([
      sampleNote('open-mat-note', OPEN_MAT_ACADEMY_ID, 'member-1'),
    ]);
    const notes = await notesRepo.listByMember(
      'member-1',
      undefined,
      OPEN_MAT_ACADEMY_ID,
    );
    expect(notes).toHaveLength(1);
  });
});

describe('shared-academy coach visibility', () => {
  it('coach sharing an academy with a member can access that member context', () => {
    const coach = [membership('coach', TEST_ACADEMY_A_ID, 'coach', 'c1')];
    const memberSame = [
      membership('member', TEST_ACADEMY_A_ID, 'member', 'm1'),
    ];
    const memberOther = [
      membership('member-b', TEST_ACADEMY_B_ID, 'member', 'm2'),
    ];

    expect(sharesCoachableAcademyWith(coach, memberSame)).toBe(true);
    expect(sharesCoachableAcademyWith(coach, memberOther)).toBe(false);
  });
});
