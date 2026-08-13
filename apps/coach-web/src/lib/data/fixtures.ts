import type {
  AcademyRoleAssignment,
  AttendanceRecord,
  CoachAnnouncement,
  CoachClass,
  CoachMemberProfile,
  CommandCenterData,
  CompetitionProfile,
  MemberDevelopmentRecord,
  MemberDevelopmentSummary,
  PromotionHistoryEntry,
} from '@openmat/shared/types';
import { buildWeeklyCoachClasses } from '@openmat/shared/data';

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(isoDate: string, days: number) {
  const date = new Date(`${isoDate}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

const TODAY = todayISO();
const ACADEMY_ID = 'academy-open-mat';
const NOW = `${TODAY}T12:00:00.000Z`;

const members: CoachMemberProfile[] = [
  {
    id: 'member-1',
    fullName: 'Alex Chen',
    email: 'alex@openmat.demo',
    phone: '+1 (555) 010-1001',
    avatarUrl: null,
    belt: 'blue',
    stripes: 2,
    membershipPlan: 'unlimited',
    membershipStatus: 'active',
    academyName: 'My Gi',
    journey: {
      belt: 'blue',
      stripes: 2,
      memberSince: '2023-04-12',
      totalClasses: 186,
      levelLabel: 'Level 8',
      nextMilestone: '3rd stripe evaluation',
    },
    achievements: [
      {
        id: 'ach-1',
        title: '100 Classes',
        earnedAt: '2024-11-02',
        category: 'consistency',
      },
    ],
    emergencyContact: {
      name: 'Jamie Chen',
      phone: '+1 (555) 010-1099',
      relationship: 'Spouse',
    },
    waivers: [
      {
        id: 'w-1',
        title: 'Liability Waiver',
        signedAt: '2023-04-12',
        expiresAt: null,
        status: 'valid',
      },
    ],
    coachNotes: [
      {
        id: 'note-1',
        memberId: 'member-1',
        authorId: 'guest-coach-user',
        authorName: 'Coach Rivera',
        body: 'Strong pressure passer. Work left-side knee cut consistency.',
        isPrivate: true,
        createdAt: `${addDays(TODAY, -3)}T15:00:00.000Z`,
        updatedAt: `${addDays(TODAY, -3)}T15:00:00.000Z`,
      },
    ],
    competitionHistory: [
      {
        id: 'comp-1',
        eventName: 'IBJJF Open',
        date: '2025-03-18',
        division: 'Blue Adult Light',
        result: 'Silver',
      },
    ],
    recentClasses: [
      {
        id: 'class-today-am',
        title: 'Morning GI Fundamentals',
        date: TODAY,
        status: 'present',
      },
    ],
    trainingStats: {
      classesThisMonth: 14,
      classesThisYear: 92,
      openMatsThisMonth: 3,
      attendanceRate: 88,
      currentStreakDays: 5,
      favoriteClassType: 'No-Gi Advanced',
    },
    isFirstTimer: false,
    createdAt: '2023-04-12T12:00:00.000Z',
  },
  {
    id: 'member-2',
    fullName: 'Jordan Lee',
    email: 'jordan@openmat.demo',
    phone: '+1 (555) 010-1002',
    avatarUrl: null,
    belt: 'white',
    stripes: 4,
    membershipPlan: 'fundamentals',
    membershipStatus: 'active',
    academyName: 'My Gi',
    journey: {
      belt: 'white',
      stripes: 4,
      memberSince: '2025-01-08',
      totalClasses: 48,
      levelLabel: 'Level 3',
      nextMilestone: 'Blue belt evaluation',
    },
    achievements: [],
    emergencyContact: {
      name: 'Chris Lee',
      phone: '+1 (555) 010-2099',
      relationship: 'Sibling',
    },
    waivers: [
      {
        id: 'w-3',
        title: 'Liability Waiver',
        signedAt: '2025-01-08',
        expiresAt: null,
        status: 'valid',
      },
    ],
    coachNotes: [],
    competitionHistory: [],
    recentClasses: [
      {
        id: 'class-today-am',
        title: 'Morning GI Fundamentals',
        date: TODAY,
        status: 'late',
      },
    ],
    trainingStats: {
      classesThisMonth: 9,
      classesThisYear: 48,
      openMatsThisMonth: 1,
      attendanceRate: 79,
      currentStreakDays: 2,
      favoriteClassType: 'Fundamentals',
    },
    isFirstTimer: false,
    createdAt: '2025-01-08T12:00:00.000Z',
  },
  {
    id: 'member-3',
    fullName: 'Sam Ortiz',
    email: 'sam@openmat.demo',
    phone: null,
    avatarUrl: null,
    belt: 'purple',
    stripes: 1,
    membershipPlan: 'unlimited',
    membershipStatus: 'active',
    academyName: 'My Gi',
    journey: {
      belt: 'purple',
      stripes: 1,
      memberSince: '2021-09-01',
      totalClasses: 410,
      levelLabel: 'Level 14',
      nextMilestone: '2nd stripe',
    },
    achievements: [],
    emergencyContact: null,
    waivers: [
      {
        id: 'w-4',
        title: 'Liability Waiver',
        signedAt: '2021-09-01',
        expiresAt: null,
        status: 'valid',
      },
    ],
    coachNotes: [
      {
        id: 'note-2',
        memberId: 'member-3',
        authorId: 'guest-coach-user',
        authorName: 'Coach Rivera',
        body: 'Consider assistant coaching path.',
        isPrivate: true,
        createdAt: `${addDays(TODAY, -10)}T12:00:00.000Z`,
        updatedAt: `${addDays(TODAY, -10)}T12:00:00.000Z`,
      },
    ],
    competitionHistory: [
      {
        id: 'comp-2',
        eventName: 'Local Superfight',
        date: '2024-08-22',
        division: 'Purple Middle',
        result: 'Win',
      },
    ],
    recentClasses: [],
    trainingStats: {
      classesThisMonth: 11,
      classesThisYear: 70,
      openMatsThisMonth: 4,
      attendanceRate: 91,
      currentStreakDays: 0,
      favoriteClassType: 'Open Mat',
    },
    isFirstTimer: false,
    createdAt: '2021-09-01T12:00:00.000Z',
  },
  {
    id: 'member-6',
    fullName: 'Morgan Diaz',
    email: 'morgan@openmat.demo',
    phone: '+1 (555) 010-1006',
    avatarUrl: null,
    belt: 'blue',
    stripes: 0,
    membershipPlan: 'unlimited',
    membershipStatus: 'past_due',
    academyName: 'My Gi',
    journey: {
      belt: 'blue',
      stripes: 0,
      memberSince: '2024-06-01',
      totalClasses: 74,
      levelLabel: 'Level 5',
      nextMilestone: '1st stripe',
    },
    achievements: [],
    emergencyContact: null,
    waivers: [
      {
        id: 'w-5',
        title: 'Liability Waiver',
        signedAt: '2024-06-01',
        expiresAt: null,
        status: 'expired',
      },
    ],
    coachNotes: [],
    competitionHistory: [],
    recentClasses: [],
    trainingStats: {
      classesThisMonth: 4,
      classesThisYear: 31,
      openMatsThisMonth: 0,
      attendanceRate: 62,
      currentStreakDays: 0,
      favoriteClassType: 'Advanced',
    },
    isFirstTimer: false,
    createdAt: '2024-06-01T12:00:00.000Z',
  },
];

/** Full My Gi Tracy flyer board for the current week. */
const classes: CoachClass[] = buildWeeklyCoachClasses({
  academyId: ACADEMY_ID,
  todayISO: TODAY,
});

function findTodayClassId(
  matcher: (item: CoachClass) => boolean,
  fallback: string,
): string {
  return classes.find((item) => item.date === TODAY && matcher(item))?.id ?? fallback;
}

const TODAY_AM_ID = findTodayClassId(
  (item) => item.startTime === '05:30' && item.level === 'adult_bjj',
  classes[0]?.id ?? 'class-mon-0530-jiu-jitsu-gi',
);
const TODAY_ADV_ID = findTodayClassId(
  (item) => item.giType === 'no_gi' && item.level === 'adult_bjj',
  classes.find((item) => item.giType === 'no_gi')?.id ??
    'class-mon-1900-adult-teen-bjj-no-gi',
);
const TODAY_KIDS_ID = findTodayClassId(
  (item) => item.audience === 'kids',
  classes.find((item) => item.audience === 'kids')?.id ??
    'class-mon-1600-pee-wee-bjj-ages-4-7',
);

const attendance: AttendanceRecord[] = [
  {
    id: 'att-1',
    classId: TODAY_AM_ID,
    memberId: 'member-1',
    memberName: 'Alex Chen',
    status: 'present',
    checkedInAt: `${TODAY}T05:28:00.000Z`,
    isFirstVisit: false,
    notes: null,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'att-2',
    classId: TODAY_AM_ID,
    memberId: 'member-2',
    memberName: 'Jordan Lee',
    status: 'late',
    checkedInAt: `${TODAY}T05:42:00.000Z`,
    isFirstVisit: false,
    notes: null,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'att-3',
    classId: TODAY_AM_ID,
    memberId: 'member-3',
    memberName: 'Sam Ortiz',
    status: 'reserved',
    checkedInAt: null,
    isFirstVisit: false,
    notes: null,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'att-4',
    classId: TODAY_AM_ID,
    memberId: null,
    memberName: 'Visitor Kim',
    status: 'waitlist',
    checkedInAt: null,
    isFirstVisit: true,
    notes: 'Waitlist #1',
    createdAt: NOW,
    updatedAt: NOW,
  },
];

const announcements: CoachAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'Academy BBQ details',
    body: 'Join us Saturday after open mat for food and community.',
    category: 'general',
    audience: 'all',
    status: 'draft',
    authorId: 'guest-coach-user',
    authorName: 'Coach Rivera',
    academyId: ACADEMY_ID,
    scheduledAt: null,
    publishedAt: null,
    pushEnabled: false,
    createdAt: `${addDays(TODAY, -1)}T12:00:00.000Z`,
    updatedAt: `${addDays(TODAY, -1)}T12:00:00.000Z`,
  },
  {
    id: 'ann-2',
    title: 'Saturday Open Mat Extended',
    body: 'Open mat runs until 1pm this Saturday.',
    category: 'schedule',
    audience: 'all',
    status: 'published',
    authorId: 'guest-coach-user',
    authorName: 'Coach Rivera',
    academyId: ACADEMY_ID,
    scheduledAt: null,
    publishedAt: `${addDays(TODAY, -2)}T09:00:00.000Z`,
    pushEnabled: true,
    createdAt: `${addDays(TODAY, -2)}T08:00:00.000Z`,
    updatedAt: `${addDays(TODAY, -2)}T09:00:00.000Z`,
  },
];

const development: MemberDevelopmentRecord[] = [
  {
    id: 'dev-1',
    memberId: 'member-1',
    academyId: ACADEMY_ID,
    belt: 'blue',
    stripes: 2,
    promotionDate: '2025-03-15',
    promotedById: 'guest-coach-user',
    promotedByName: 'Coach Rivera',
    timeAtBeltStartedAt: '2025-03-15T18:00:00.000Z',
    updatedAt: `${addDays(TODAY, -10)}T00:00:00.000Z`,
  },
  {
    id: 'dev-2',
    memberId: 'member-2',
    academyId: ACADEMY_ID,
    belt: 'white',
    stripes: 4,
    promotionDate: '2025-11-02',
    promotedById: 'guest-coach-user',
    promotedByName: 'Coach Rivera',
    timeAtBeltStartedAt: '2025-01-08T12:00:00.000Z',
    updatedAt: `${addDays(TODAY, -5)}T00:00:00.000Z`,
  },
  {
    id: 'dev-3',
    memberId: 'member-3',
    academyId: ACADEMY_ID,
    belt: 'purple',
    stripes: 1,
    promotionDate: '2024-06-20',
    promotedById: 'guest-coach-user',
    promotedByName: 'Coach Rivera',
    timeAtBeltStartedAt: '2024-06-20T19:00:00.000Z',
    updatedAt: `${addDays(TODAY, -40)}T00:00:00.000Z`,
  },
  {
    id: 'dev-6',
    memberId: 'member-6',
    academyId: ACADEMY_ID,
    belt: 'blue',
    stripes: 0,
    promotionDate: '2025-08-01',
    promotedById: 'guest-coach-user',
    promotedByName: 'Coach Rivera',
    timeAtBeltStartedAt: '2025-08-01T18:00:00.000Z',
    updatedAt: `${addDays(TODAY, -20)}T00:00:00.000Z`,
  },
];

const promotionHistory: PromotionHistoryEntry[] = [
  {
    id: 'promo-1-a',
    memberId: 'member-1',
    type: 'stripe',
    belt: 'blue',
    stripe: 2,
    date: '2025-09-10',
    coachId: 'guest-coach-user',
    coachName: 'Coach Rivera',
    notes: 'Consistent pressure passing.',
    createdAt: '2025-09-10T20:00:00.000Z',
  },
  {
    id: 'promo-1-b',
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
];

const competitionProfiles: CompetitionProfile[] = [
  {
    id: 'cp-1',
    memberId: 'member-1',
    preferredRuleSet: 'ibjjf',
    division: 'adult',
    weightClass: 'Light',
    preferredWeightKg: 70,
    teamStatus: 'active',
    experience: 'intermediate',
    eligibilityNotes: 'Eligible for local IBJJF opens.',
    updatedAt: `${addDays(TODAY, -12)}T00:00:00.000Z`,
  },
];

const academyRoles: AcademyRoleAssignment[] = [
  {
    id: 'role-1',
    memberId: 'member-1',
    role: 'competition_team',
    assignedAt: `${addDays(TODAY, -40)}T00:00:00.000Z`,
    assignedById: 'guest-coach-user',
    assignedByName: 'Coach Rivera',
  },
  {
    id: 'role-3',
    memberId: 'member-3',
    role: 'assistant_coach',
    assignedAt: `${addDays(TODAY, -60)}T00:00:00.000Z`,
    assignedById: 'guest-coach-user',
    assignedByName: 'Coach Rivera',
  },
];

type SummarySeed = Omit<
  MemberDevelopmentSummary,
  'belt' | 'stripes' | 'timeAtCurrentBeltLabel'
>;

const developmentSummaries: Record<string, SummarySeed> = {
  'member-1': {
    classesAttended: 186,
    attendancePercent: 88,
    currentStreakDays: 5,
    weeklyGoal: 3,
    weeklyGoalProgress: 2,
    achievementsCount: 1,
    competitionMedals: 1,
    academyJoinDate: '2023-04-12',
  },
  'member-2': {
    classesAttended: 48,
    attendancePercent: 79,
    currentStreakDays: 2,
    weeklyGoal: 3,
    weeklyGoalProgress: 1,
    achievementsCount: 0,
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
};

const commandCenter: CommandCenterData = {
  pulse: [
    {
      id: 'pulse-attendance',
      label: 'Attendance Today',
      value: '27',
      icon: 'school',
      tint: '#38BDF8',
      trendLabel: '+8% vs last week',
    },
    {
      id: 'pulse-training',
      label: 'Currently Training',
      value: '14',
      icon: 'flame',
      tint: '#F59E0B',
    },
    {
      id: 'pulse-goals',
      label: 'Weekly Goals',
      value: '63%',
      icon: 'locate',
      tint: '#FFFFFF',
    },
    {
      id: 'pulse-waitlist',
      label: 'Waitlisted',
      value: '9',
      icon: 'hourglass',
      tint: '#FB7185',
    },
    {
      id: 'pulse-new',
      label: 'New Members',
      value: '7',
      icon: 'person-add',
      tint: '#22C55E',
      trendLabel: 'This month',
    },
    {
      id: 'pulse-classes',
      label: "Today's Classes",
      value: '3',
      icon: 'calendar',
      tint: '#FFFFFF',
    },
  ],
  attention: [
    {
      id: 'att-1',
      title: '3 members inactive 14+ days',
      subtitle: 'Morgan Diaz leads the list',
      priority: 'high',
      actionId: 'viewMember',
      actionLabel: 'View Member',
      entityId: 'member-6',
      icon: 'alert-circle',
      tint: '#FF4D4D',
    },
    {
      id: 'att-2',
      title: 'Advanced No-Gi nearing capacity',
      subtitle: '16 / 20 reserved · 3 waitlisted',
      priority: 'high',
      actionId: 'manageClass',
      actionLabel: 'Manage Class',
      entityId: 'class-today-adv',
      icon: 'people',
      tint: '#F59E0B',
    },
    {
      id: 'att-4',
      title: 'Draft announcement ready',
      subtitle: 'Academy BBQ details awaiting publish',
      priority: 'medium',
      actionId: 'publishAnnouncement',
      actionLabel: 'Publish Announcement',
      entityId: 'ann-1',
      icon: 'megaphone',
      tint: '#38BDF8',
    },
  ],
  momentum: [
    {
      id: 'mom-1',
      memberId: 'member-1',
      memberName: 'Alex Chen',
      headline: '96 / 100 Classes',
      detail: 'Four classes from the century badge.',
      progressLabel: '96%',
      progressPercent: 96,
      icon: 'ribbon',
      tint: '#FFFFFF',
    },
    {
      id: 'mom-2',
      memberId: 'member-2',
      memberName: 'Jordan Lee',
      headline: 'One class from weekly goal',
      detail: '2 of 3 classes complete this week.',
      progressLabel: '67%',
      progressPercent: 67,
      icon: 'flag',
      tint: '#22C55E',
    },
  ],
  liveFeed: [
    {
      id: 'feed-1',
      title: 'Alex Chen checked into Morning GI',
      subtitle: 'Fundamentals',
      timestamp: `${TODAY}T05:28:00.000Z`,
      category: 'check_in',
      icon: 'checkmark-circle',
      tint: '#22C55E',
    },
    {
      id: 'feed-2',
      title: 'Announcement published',
      subtitle: 'Saturday Open Mat Extended',
      timestamp: `${addDays(TODAY, -2)}T09:00:00.000Z`,
      category: 'announcement',
      icon: 'megaphone',
      tint: '#38BDF8',
    },
  ],
  upcoming: [
    {
      id: 'up-1',
      title: 'Morning GI Fundamentals',
      whenLabel: 'Today · 05:30',
      typeLabel: 'Class',
      entityKind: 'class',
      entityId: 'class-today-am',
    },
  ],
  quickCommands: [
    {
      id: 'createAnnouncement',
      label: 'Create Announcement',
      icon: 'megaphone',
      tint: '#38BDF8',
    },
    {
      id: 'startCheckIn',
      label: 'Start Check-In',
      icon: 'checkmark-done',
      tint: '#22C55E',
    },
    {
      id: 'createClass',
      label: 'Add Class',
      icon: 'calendar',
      tint: '#FFFFFF',
    },
    {
      id: 'manageMembers',
      label: 'Members',
      icon: 'people',
      tint: '#F5F5F5',
    },
  ],
  aiInsights: [
    {
      id: 'ai-1',
      suggestion: 'Attendance has dropped 12% on Friday evenings.',
      confidenceLabel: 'Mock insight',
    },
  ],
  snapshots: [
    {
      id: 'snap-1',
      label: 'Weekly Attendance',
      value: '148',
      helper: '+6% vs prior week',
      points: [12, 18, 15, 22, 19, 24, 20],
      tint: '#FFFFFF',
    },
    {
      id: 'snap-2',
      label: 'Retention',
      value: '91%',
      helper: 'Stable',
      points: [90, 91, 89, 92, 91, 91, 91],
      tint: '#22C55E',
    },
  ],
  pulseInsights: [],
};

export const webFixtures = {
  academyId: ACADEMY_ID,
  today: TODAY,
  members,
  classes,
  attendance,
  announcements,
  development,
  promotionHistory,
  competitionProfiles,
  academyRoles,
  developmentSummaries,
  commandCenter,
};
