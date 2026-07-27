import type {
  AcademyRoleAssignment,
  CompetitionProfile,
  MemberDevelopmentRecord,
  MemberDevelopmentSummary,
  PromotionHistoryEntry,
} from '@openmat/shared';

import { COACH_ACADEMY_ID } from './coachData';

function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function dateAgo(days: number): string {
  return daysAgo(days).slice(0, 10);
}

export const MOCK_MEMBER_DEVELOPMENT: MemberDevelopmentRecord[] = [
  {
    id: 'dev-member-1',
    memberId: 'member-1',
    academyId: COACH_ACADEMY_ID,
    belt: 'blue',
    stripes: 2,
    promotionDate: '2025-03-15',
    promotedById: 'guest-coach-user',
    promotedByName: 'Coach Rivera',
    timeAtBeltStartedAt: '2025-03-15T18:00:00.000Z',
    updatedAt: daysAgo(10),
  },
  {
    id: 'dev-member-2',
    memberId: 'member-2',
    academyId: COACH_ACADEMY_ID,
    belt: 'white',
    stripes: 4,
    promotionDate: '2025-11-02',
    promotedById: 'guest-coach-user',
    promotedByName: 'Coach Rivera',
    timeAtBeltStartedAt: '2025-01-08T12:00:00.000Z',
    updatedAt: daysAgo(5),
  },
  {
    id: 'dev-member-3',
    memberId: 'member-3',
    academyId: COACH_ACADEMY_ID,
    belt: 'purple',
    stripes: 1,
    promotionDate: '2024-06-20',
    promotedById: 'guest-coach-user',
    promotedByName: 'Coach Rivera',
    timeAtBeltStartedAt: '2024-06-20T19:00:00.000Z',
    updatedAt: daysAgo(40),
  },
  {
    id: 'dev-member-6',
    memberId: 'member-6',
    academyId: COACH_ACADEMY_ID,
    belt: 'blue',
    stripes: 0,
    promotionDate: '2025-08-01',
    promotedById: 'guest-coach-user',
    promotedByName: 'Coach Rivera',
    timeAtBeltStartedAt: '2025-08-01T18:00:00.000Z',
    updatedAt: daysAgo(20),
  },
  {
    id: 'dev-member-7',
    memberId: 'member-7',
    academyId: COACH_ACADEMY_ID,
    belt: 'white',
    stripes: 1,
    promotionDate: '2026-01-12',
    promotedById: 'coach-park',
    promotedByName: 'Coach Park',
    timeAtBeltStartedAt: '2025-09-01T12:00:00.000Z',
    updatedAt: daysAgo(8),
  },
];

export const MOCK_PROMOTION_HISTORY: PromotionHistoryEntry[] = [
  {
    id: 'promo-1-a',
    memberId: 'member-1',
    type: 'stripe',
    belt: 'blue',
    stripe: 2,
    date: '2025-09-10',
    coachId: 'guest-coach-user',
    coachName: 'Coach Rivera',
    notes: 'Consistent pressure passing under fatigue.',
    createdAt: '2025-09-10T20:00:00.000Z',
  },
  {
    id: 'promo-1-b',
    memberId: 'member-1',
    type: 'stripe',
    belt: 'blue',
    stripe: 1,
    date: '2025-06-01',
    coachId: 'guest-coach-user',
    coachName: 'Coach Rivera',
    notes: null,
    createdAt: '2025-06-01T19:00:00.000Z',
  },
  {
    id: 'promo-1-c',
    memberId: 'member-1',
    type: 'belt',
    belt: 'blue',
    stripe: 0,
    date: '2025-03-15',
    coachId: 'guest-coach-user',
    coachName: 'Coach Rivera',
    notes: 'Promoted after open mat evaluation.',
    createdAt: '2025-03-15T18:30:00.000Z',
  },
  {
    id: 'promo-1-d',
    memberId: 'member-1',
    type: 'stripe',
    belt: 'white',
    stripe: 4,
    date: '2024-11-02',
    coachId: 'guest-coach-user',
    coachName: 'Coach Rivera',
    notes: null,
    createdAt: '2024-11-02T17:00:00.000Z',
  },
  {
    id: 'promo-1-e',
    memberId: 'member-1',
    type: 'belt',
    belt: 'white',
    stripe: 0,
    date: '2023-04-12',
    coachId: 'guest-coach-user',
    coachName: 'Coach Rivera',
    notes: 'Joined the academy.',
    createdAt: '2023-04-12T12:00:00.000Z',
  },
  {
    id: 'promo-2-a',
    memberId: 'member-2',
    type: 'stripe',
    belt: 'white',
    stripe: 4,
    date: '2025-11-02',
    coachId: 'guest-coach-user',
    coachName: 'Coach Rivera',
    notes: 'Ready for blue belt evaluation.',
    createdAt: '2025-11-02T18:00:00.000Z',
  },
  {
    id: 'promo-2-b',
    memberId: 'member-2',
    type: 'stripe',
    belt: 'white',
    stripe: 3,
    date: '2025-08-14',
    coachId: 'guest-coach-user',
    coachName: 'Coach Rivera',
    notes: null,
    createdAt: '2025-08-14T18:00:00.000Z',
  },
  {
    id: 'promo-2-c',
    memberId: 'member-2',
    type: 'belt',
    belt: 'white',
    stripe: 0,
    date: '2025-01-08',
    coachId: 'guest-coach-user',
    coachName: 'Coach Rivera',
    notes: 'Started fundamentals program.',
    createdAt: '2025-01-08T12:00:00.000Z',
  },
  {
    id: 'promo-3-a',
    memberId: 'member-3',
    type: 'stripe',
    belt: 'purple',
    stripe: 1,
    date: '2025-01-20',
    coachId: 'guest-coach-user',
    coachName: 'Coach Rivera',
    notes: 'Leadership on the mat.',
    createdAt: '2025-01-20T19:00:00.000Z',
  },
  {
    id: 'promo-3-b',
    memberId: 'member-3',
    type: 'belt',
    belt: 'purple',
    stripe: 0,
    date: '2024-06-20',
    coachId: 'guest-coach-user',
    coachName: 'Coach Rivera',
    notes: null,
    createdAt: '2024-06-20T19:00:00.000Z',
  },
];

export const MOCK_COMPETITION_PROFILES: CompetitionProfile[] = [
  {
    id: 'cp-1',
    memberId: 'member-1',
    preferredRuleSet: 'ibjjf',
    division: 'adult',
    weightClass: 'Light',
    preferredWeightKg: 70,
    teamStatus: 'active',
    experience: 'intermediate',
    eligibilityNotes: 'Eligible for local IBJJF opens in 2026.',
    updatedAt: daysAgo(12),
  },
  {
    id: 'cp-3',
    memberId: 'member-3',
    preferredRuleSet: 'naga',
    division: 'masters',
    weightClass: 'Middle',
    preferredWeightKg: 82.5,
    teamStatus: 'active',
    experience: 'advanced',
    eligibilityNotes: 'Prefers no-gi superfights.',
    updatedAt: daysAgo(30),
  },
];

export const MOCK_ACADEMY_ROLES: AcademyRoleAssignment[] = [
  {
    id: 'role-3-assistant',
    memberId: 'member-3',
    role: 'assistant_coach',
    assignedAt: daysAgo(60),
    assignedById: 'guest-coach-user',
    assignedByName: 'Coach Rivera',
  },
  {
    id: 'role-3-comp',
    memberId: 'member-3',
    role: 'competition_team',
    assignedAt: daysAgo(90),
    assignedById: 'guest-coach-user',
    assignedByName: 'Coach Rivera',
  },
  {
    id: 'role-1-comp',
    memberId: 'member-1',
    role: 'competition_team',
    assignedAt: daysAgo(40),
    assignedById: 'guest-coach-user',
    assignedByName: 'Coach Rivera',
  },
  {
    id: 'role-7-kids',
    memberId: 'member-7',
    role: 'volunteer',
    assignedAt: daysAgo(20),
    assignedById: 'coach-park',
    assignedByName: 'Coach Park',
  },
];

type SummarySeed = Omit<
  MemberDevelopmentSummary,
  'belt' | 'stripes' | 'timeAtCurrentBeltLabel'
>;

export const MOCK_DEVELOPMENT_SUMMARIES: Record<string, SummarySeed> = {
  'member-1': {
    classesAttended: 186,
    attendancePercent: 88,
    currentStreakDays: 5,
    weeklyGoal: 3,
    weeklyGoalProgress: 2,
    achievementsCount: 2,
    competitionMedals: 1,
    academyJoinDate: '2023-04-12',
  },
  'member-2': {
    classesAttended: 48,
    attendancePercent: 79,
    currentStreakDays: 2,
    weeklyGoal: 3,
    weeklyGoalProgress: 1,
    achievementsCount: 1,
    competitionMedals: 0,
    academyJoinDate: '2025-01-08',
  },
  'member-3': {
    classesAttended: 410,
    attendancePercent: 91,
    currentStreakDays: 0,
    weeklyGoal: 4,
    weeklyGoalProgress: 3,
    achievementsCount: 0,
    competitionMedals: 3,
    academyJoinDate: '2021-09-01',
  },
  'member-6': {
    classesAttended: 74,
    attendancePercent: 62,
    currentStreakDays: 0,
    weeklyGoal: 3,
    weeklyGoalProgress: 0,
    achievementsCount: 0,
    competitionMedals: 0,
    academyJoinDate: '2024-06-01',
  },
  'member-7': {
    classesAttended: 22,
    attendancePercent: 95,
    currentStreakDays: 3,
    weeklyGoal: 2,
    weeklyGoalProgress: 2,
    achievementsCount: 0,
    competitionMedals: 0,
    academyJoinDate: '2025-09-01',
  },
};

export function formatPromotionLabel(entry: PromotionHistoryEntry): string {
  if (entry.type === 'belt') {
    const label = entry.belt.charAt(0).toUpperCase() + entry.belt.slice(1);
    return `${label} Belt`;
  }
  if (entry.stripe === 1) {
    return '1 Stripe';
  }
  return `${entry.stripe} Stripes`;
}

export { dateAgo };
