import type { AthleteHub } from '../../types/profile';

export const DEFAULT_ATHLETE_HUB: AthleteHub = {
  avatarUri: null,
  beltProgress: {
    belt: 'blue',
    stripes: 2,
    promotedAt: '2025-11-14T00:00:00.000Z',
    nextStripeHint: 'Keep consistent mat time — next stripe review in ~8 weeks.',
  },
  membership: {
    plan: 'unlimited',
    status: 'active',
    academyName: 'Open Mat · Tracy',
    memberSince: '2024-03-01T00:00:00.000Z',
    renewsOn: '2026-08-01T00:00:00.000Z',
    priceLabel: '$179 / month',
  },
  paymentMethod: {
    id: 'pm-1',
    brand: 'Visa',
    last4: '4242',
    expMonth: 9,
    expYear: 2028,
    isDefault: true,
  },
  attendanceSummary: {
    monthLabel: 'July 2026',
    classesAttended: 14,
    openMats: 3,
    goal: 16,
    streakDays: 5,
  },
  recentAttendance: [
    {
      id: 'att-1',
      date: '2026-07-24T18:30:00.000Z',
      classTitle: 'Advanced Gi',
      instructor: 'Coach Mat',
    },
    {
      id: 'att-2',
      date: '2026-07-22T19:00:00.000Z',
      classTitle: 'Fundamentals',
      instructor: 'Coach Ana',
    },
    {
      id: 'att-3',
      date: '2026-07-21T17:00:00.000Z',
      classTitle: 'Open Mat',
      instructor: 'Self-directed',
    },
    {
      id: 'att-4',
      date: '2026-07-19T10:00:00.000Z',
      classTitle: 'Competition Class',
      instructor: 'Coach Mat',
    },
    {
      id: 'att-5',
      date: '2026-07-17T18:30:00.000Z',
      classTitle: 'No-Gi Intermediate',
      instructor: 'Coach Luis',
    },
  ],
  notifications: {
    classReminders: true,
    academyAnnouncements: true,
    birthdayAlerts: true,
    paymentReminders: true,
    teamChat: false,
  },
  settings: {
    checkInReminders: true,
    shareActivity: false,
    units: 'imperial',
  },
  familyMembers: [
    {
      id: 'fam-1',
      fullName: 'Mia Teran',
      relationship: 'Daughter',
      belt: 'white',
      stripes: 3,
      membershipPlan: 'Kids Program',
    },
    {
      id: 'fam-2',
      fullName: 'Sofia Teran',
      relationship: 'Spouse',
      belt: 'white',
      stripes: 1,
      membershipPlan: 'Fundamentals',
    },
  ],
};

export function formatMembershipPlan(plan: AthleteHub['membership']['plan']): string {
  switch (plan) {
    case 'unlimited':
      return 'Unlimited';
    case 'fundamentals':
      return 'Fundamentals';
    case 'kids':
      return 'Kids';
    case 'drop_in':
      return 'Drop-in';
    default:
      return plan;
  }
}

export function formatMembershipStatus(
  status: AthleteHub['membership']['status'],
): string {
  switch (status) {
    case 'active':
      return 'Active';
    case 'past_due':
      return 'Past due';
    case 'paused':
      return 'Paused';
    case 'canceled':
      return 'Canceled';
    default:
      return status;
  }
}

export function formatBeltRank(belt: AthleteHub['beltProgress']['belt']): string {
  return `${belt.charAt(0).toUpperCase()}${belt.slice(1)}`;
}

export function formatStripeCount(stripes: number): string {
  if (stripes === 0) {
    return 'No stripes';
  }
  return `${stripes} stripe${stripes === 1 ? '' : 's'}`;
}
