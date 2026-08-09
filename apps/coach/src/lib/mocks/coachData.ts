import type {
  AcademyActivityItem,
  AttendanceRecord,
  CoachAnnouncement,
  CoachClass,
  CoachMemberProfile,
  CoachQuickAction,
  CoachQuickCard,
  CreateSheetAction,
  DashboardOverview,
} from '@openmat/shared';
import { buildWeeklyCoachClasses } from '@openmat/shared';

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(isoDate: string, days: number) {
  const date = new Date(`${isoDate}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

const TODAY = todayISO();

export const COACH_ACADEMY_ID = 'academy-open-mat';
export const COACH_LOCATION_ID = 'location-tracy-naglee';

/** Full Open Mat Academy Tracy flyer board for the current week. */
export const MOCK_CLASSES: CoachClass[] = buildWeeklyCoachClasses({
  academyId: COACH_ACADEMY_ID,
  locationId: COACH_LOCATION_ID,
  todayISO: TODAY,
});

function findTodayClassId(
  matcher: (item: CoachClass) => boolean,
  fallback: string,
): string {
  return MOCK_CLASSES.find((item) => item.date === TODAY && matcher(item))?.id ?? fallback;
}

const TODAY_AM_ID = findTodayClassId(
  (item) => item.startTime === '05:30' && item.level === 'adult_bjj',
  MOCK_CLASSES[0]?.id ?? 'class-mon-0530-jiu-jitsu-gi',
);
const TODAY_KIDS_ID = findTodayClassId(
  (item) =>
    item.audience === 'kids' &&
    (item.level === 'pee_wee_bjj' || item.level === 'youth_bjj'),
  MOCK_CLASSES.find((item) => item.audience === 'kids')?.id ??
    'class-mon-1600-pee-wee-bjj-ages-4-7',
);
const TODAY_ADV_ID = findTodayClassId(
  (item) => item.giType === 'no_gi' && item.level === 'adult_bjj',
  MOCK_CLASSES.find((item) => item.giType === 'no_gi')?.id ??
    'class-mon-1900-adult-teen-bjj-no-gi',
);

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    classId: TODAY_AM_ID,
    memberId: 'member-1',
    memberName: 'Alex Chen',
    memberEmail: 'alex@openmat.demo',
    status: 'present',
    checkedInAt: `${TODAY}T05:28:00.000Z`,
    isFirstVisit: false,
    createdAt: `${TODAY}T04:00:00.000Z`,
    updatedAt: `${TODAY}T05:28:00.000Z`,
  },
  {
    id: 'att-2',
    classId: TODAY_AM_ID,
    memberId: 'member-2',
    memberName: 'Jordan Lee',
    memberEmail: 'jordan@openmat.demo',
    status: 'late',
    checkedInAt: `${TODAY}T05:41:00.000Z`,
    isFirstVisit: false,
    createdAt: `${TODAY}T04:00:00.000Z`,
    updatedAt: `${TODAY}T05:41:00.000Z`,
  },
  {
    id: 'att-3',
    classId: TODAY_AM_ID,
    memberId: 'member-3',
    memberName: 'Sam Ortiz',
    memberEmail: 'sam@openmat.demo',
    status: 'reserved',
    checkedInAt: null,
    isFirstVisit: false,
    createdAt: `${TODAY}T04:00:00.000Z`,
    updatedAt: `${TODAY}T04:00:00.000Z`,
  },
  {
    id: 'att-4',
    classId: TODAY_AM_ID,
    memberId: null,
    memberName: 'Taylor Kim',
    memberEmail: null,
    status: 'visitor',
    checkedInAt: `${TODAY}T05:32:00.000Z`,
    isFirstVisit: true,
    createdAt: `${TODAY}T05:32:00.000Z`,
    updatedAt: `${TODAY}T05:32:00.000Z`,
  },
  {
    id: 'att-5',
    classId: TODAY_AM_ID,
    memberId: 'member-4',
    memberName: 'Riley Brooks',
    memberEmail: 'riley@openmat.demo',
    status: 'waitlist',
    checkedInAt: null,
    isFirstVisit: false,
    createdAt: `${TODAY}T04:10:00.000Z`,
    updatedAt: `${TODAY}T04:10:00.000Z`,
  },
  {
    id: 'att-6',
    classId: TODAY_AM_ID,
    memberId: 'member-5',
    memberName: 'Casey Nguyen',
    memberEmail: 'casey@openmat.demo',
    status: 'absent',
    checkedInAt: null,
    isFirstVisit: false,
    createdAt: `${TODAY}T04:00:00.000Z`,
    updatedAt: `${TODAY}T06:00:00.000Z`,
  },
  {
    id: 'att-7',
    classId: TODAY_ADV_ID,
    memberId: 'member-1',
    memberName: 'Alex Chen',
    memberEmail: 'alex@openmat.demo',
    status: 'reserved',
    checkedInAt: null,
    isFirstVisit: false,
    createdAt: `${TODAY}T04:00:00.000Z`,
    updatedAt: `${TODAY}T04:00:00.000Z`,
  },
  {
    id: 'att-8',
    classId: TODAY_ADV_ID,
    memberId: 'member-6',
    memberName: 'Morgan Diaz',
    memberEmail: 'morgan@openmat.demo',
    status: 'reserved',
    checkedInAt: null,
    isFirstVisit: false,
    createdAt: `${TODAY}T04:00:00.000Z`,
    updatedAt: `${TODAY}T04:00:00.000Z`,
  },
  {
    id: 'att-9',
    classId: TODAY_KIDS_ID,
    memberId: 'member-7',
    memberName: 'Ava Park',
    memberEmail: 'parent@openmat.demo',
    status: 'reserved',
    checkedInAt: null,
    isFirstVisit: false,
    createdAt: `${TODAY}T04:00:00.000Z`,
    updatedAt: `${TODAY}T04:00:00.000Z`,
  },
];

export const MOCK_ANNOUNCEMENTS: CoachAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'Saturday Open Mat Extended',
    body: 'Open mat runs until 1pm this Saturday. Bring a training partner and focus on your weak side passes.',
    category: 'schedule',
    audience: 'all',
    status: 'published',
    authorId: 'guest-coach-user',
    authorName: 'Coach Rivera',
    academyId: COACH_ACADEMY_ID,
    scheduledAt: null,
    publishedAt: `${TODAY}T08:00:00.000Z`,
    createdAt: `${TODAY}T07:50:00.000Z`,
    updatedAt: `${TODAY}T08:00:00.000Z`,
    pushEnabled: false,
  },
  {
    id: 'ann-2',
    title: 'Competition Team Meeting',
    body: 'Competitors meet Thursday after advanced class for weight cuts and match video review.',
    category: 'competition',
    audience: 'competitors',
    status: 'published',
    authorId: 'guest-coach-user',
    authorName: 'Coach Rivera',
    academyId: COACH_ACADEMY_ID,
    scheduledAt: null,
    publishedAt: addDays(TODAY, -1) + 'T18:00:00.000Z',
    createdAt: addDays(TODAY, -1) + 'T17:00:00.000Z',
    updatedAt: addDays(TODAY, -1) + 'T18:00:00.000Z',
    pushEnabled: false,
  },
];

export const MOCK_MEMBERS: CoachMemberProfile[] = [
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
    academyName: 'Open Mat Academy',
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
      {
        id: 'ach-2',
        title: 'Competition Debut',
        earnedAt: '2025-03-18',
        category: 'competition',
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
      {
        id: 'w-2',
        title: 'Photo Release',
        signedAt: '2023-04-12',
        expiresAt: '2026-04-12',
        status: 'valid',
      },
    ],
    coachNotes: [
      {
        id: 'note-1',
        memberId: 'member-1',
        authorId: 'guest-coach-user',
        authorName: 'Coach Rivera',
        body: 'Strong pressure passer. Work left-side knee cut consistency under fatigue.',
        isPrivate: true,
        academyId: 'academy-open-mat',
        createdAt: addDays(TODAY, -3) + 'T15:00:00.000Z',
        updatedAt: addDays(TODAY, -3) + 'T15:00:00.000Z',
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
        id: TODAY_AM_ID,
        title: 'Morning GI Fundamentals',
        date: TODAY,
        status: 'present',
      },
      {
        id: 'prev-1',
        title: 'Adult Advanced No-Gi',
        date: addDays(TODAY, -2),
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
    academyName: 'Open Mat Academy',
    journey: {
      belt: 'white',
      stripes: 4,
      memberSince: '2025-01-08',
      totalClasses: 48,
      levelLabel: 'Level 3',
      nextMilestone: 'Blue belt evaluation',
    },
    achievements: [
      {
        id: 'ach-3',
        title: 'First Month Complete',
        earnedAt: '2025-02-08',
        category: 'consistency',
      },
    ],
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
        id: TODAY_AM_ID,
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
    academyName: 'Open Mat Academy',
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
        body: 'Helping newer students during open mat. Consider assistant coaching path.',
        isPrivate: true,
        academyId: 'academy-open-mat',
        createdAt: addDays(TODAY, -10) + 'T12:00:00.000Z',
        updatedAt: addDays(TODAY, -10) + 'T12:00:00.000Z',
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
    academyName: 'Open Mat Academy',
    journey: {
      belt: 'blue',
      stripes: 0,
      memberSince: '2024-06-01',
      totalClasses: 74,
      levelLabel: 'Level 5',
      nextMilestone: '1st stripe',
    },
    achievements: [],
    emergencyContact: {
      name: 'Pat Diaz',
      phone: '+1 (555) 010-6099',
      relationship: 'Parent',
    },
    waivers: [
      {
        id: 'w-5',
        title: 'Liability Waiver',
        signedAt: '2024-06-01',
        expiresAt: null,
        status: 'valid',
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
  {
    id: 'member-7',
    fullName: 'Ava Park',
    email: 'parent@openmat.demo',
    phone: '+1 (555) 010-1007',
    avatarUrl: null,
    belt: 'white',
    stripes: 1,
    membershipPlan: 'kids',
    membershipStatus: 'active',
    academyName: 'Open Mat Academy',
    journey: {
      belt: 'white',
      stripes: 1,
      memberSince: '2025-09-01',
      totalClasses: 22,
      levelLabel: 'Kids Level 2',
      nextMilestone: '2nd stripe',
    },
    achievements: [],
    emergencyContact: {
      name: 'Coach Park',
      phone: '+1 (555) 010-7000',
      relationship: 'Parent',
    },
    waivers: [
      {
        id: 'w-6',
        title: 'Kids Liability Waiver',
        signedAt: '2025-09-01',
        expiresAt: null,
        status: 'valid',
      },
    ],
    coachNotes: [],
    competitionHistory: [],
    recentClasses: [],
    trainingStats: {
      classesThisMonth: 6,
      classesThisYear: 22,
      openMatsThisMonth: 0,
      attendanceRate: 95,
      currentStreakDays: 3,
      favoriteClassType: 'Kids BJJ',
    },
    isFirstTimer: false,
    createdAt: '2025-09-01T12:00:00.000Z',
  },
];

export function buildGreeting(fullName: string | null | undefined): string {
  const hour = new Date().getHours();
  const part =
    hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const name = fullName?.split(' ')[0] || 'Coach';
  return `${part}, ${name}`;
}

export function buildDashboardOverview(
  classes: CoachClass[],
  attendance: AttendanceRecord[],
  fullName?: string | null,
): DashboardOverview {
  const todays = classes.filter(
    (item) => item.date === TODAY && item.status !== 'cancelled',
  );
  const todaysIds = new Set(todays.map((item) => item.id));
  const todayAttendance = attendance.filter((item) => todaysIds.has(item.classId));

  return {
    greeting: buildGreeting(fullName),
    dateLabel: new Date().toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }),
    todaysClasses: todays.length,
    reservations: todays.reduce((sum, item) => sum + item.reservedCount, 0),
    checkedIn: todayAttendance.filter(
      (item) =>
        item.status === 'present' ||
        item.status === 'late' ||
        item.status === 'visitor' ||
        item.status === 'walk_in',
    ).length,
    waitlist: todays.reduce((sum, item) => sum + item.waitlistCount, 0),
    firstTimeVisitors: todays.reduce(
      (sum, item) => sum + item.firstTimeVisitorCount,
      0,
    ),
  };
}

export const QUICK_CARDS: CoachQuickCard[] = [
  {
    id: 'todaysClasses',
    title: "Today's Classes",
    subtitle: 'On the mat today',
    value: '3',
    icon: 'calendar',
    tint: '#38BDF8',
  },
  {
    id: 'attendance',
    title: 'Attendance',
    subtitle: 'Checked in so far',
    value: '11',
    icon: 'checkmark-circle',
    tint: '#22C55E',
  },
  {
    id: 'announcements',
    title: 'Announcements',
    subtitle: 'Live in community',
    value: '2',
    icon: 'megaphone',
    tint: '#F5F5F5',
  },
  {
    id: 'academyActivity',
    title: 'Academy Activity',
    subtitle: 'Last 24 hours',
    value: '18',
    icon: 'pulse',
    tint: '#A78BFA',
  },
];

export const QUICK_ACTIONS: CoachQuickAction[] = [
  {
    id: 'openCommandCenter',
    label: 'Command Center',
    icon: 'pulse',
    tint: '#F5F5F5',
  },
  {
    id: 'manageCheckIn',
    label: 'Manage Check-In',
    icon: 'qr-code',
    tint: '#38BDF8',
  },
  {
    id: 'createAnnouncement',
    label: 'Create Announcement',
    icon: 'megaphone-outline',
    tint: '#F5F5F5',
  },
  {
    id: 'addClass',
    label: 'Add Class',
    icon: 'add-circle-outline',
    tint: '#FFFFFF',
  },
  {
    id: 'manageMembers',
    label: 'Member Management',
    icon: 'people-outline',
    tint: '#22C55E',
  },
  {
    id: 'uploadTechnique',
    label: 'Upload Technique',
    icon: 'videocam-outline',
    tint: '#FB7185',
  },
];

export const CREATE_SHEET_ACTIONS: CreateSheetAction[] = [
  {
    id: 'newClass',
    title: 'New Class',
    subtitle: 'Schedule a class or open mat',
    icon: 'calendar-outline',
    tint: '#FFFFFF',
    available: true,
  },
  {
    id: 'announcement',
    title: 'Announcement',
    subtitle: 'Post to the community feed',
    icon: 'megaphone-outline',
    tint: '#F5F5F5',
    available: true,
  },
  {
    id: 'event',
    title: 'Event',
    subtitle: 'Seminar, competition, or academy gathering',
    icon: 'ticket-outline',
    tint: '#38BDF8',
    available: true,
  },
  {
    id: 'challenge',
    title: 'Challenge',
    subtitle: 'Weekly or monthly member challenge',
    icon: 'trophy-outline',
    tint: '#A78BFA',
    available: true,
  },
  {
    id: 'technique',
    title: 'Technique',
    subtitle: 'Upload to the technique library',
    icon: 'videocam-outline',
    tint: '#FB7185',
    available: true,
  },
];

export const MOCK_ACTIVITY: AcademyActivityItem[] = [
  {
    id: 'act-1',
    title: 'Alex Chen checked in',
    subtitle: 'Morning GI Fundamentals',
    timestamp: `${TODAY}T05:28:00.000Z`,
    kind: 'check_in',
  },
  {
    id: 'act-2',
    title: 'Announcement published',
    subtitle: 'Saturday Open Mat Extended',
    timestamp: `${TODAY}T08:00:00.000Z`,
    kind: 'announcement',
  },
  {
    id: 'act-3',
    title: 'Waitlist joined',
    subtitle: 'Riley Brooks · Morning GI',
    timestamp: `${TODAY}T04:10:00.000Z`,
    kind: 'reservation',
  },
];

export { TODAY };
