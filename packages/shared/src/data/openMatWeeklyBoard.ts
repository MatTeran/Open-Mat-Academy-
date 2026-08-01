import type {
  ClassAudience,
  ClassLevel,
  CoachClass,
  GiType,
  Weekday,
} from '../types/classes';

export type OpenMatWeekdayKey = Weekday;

export interface OpenMatClassSeed {
  day: OpenMatWeekdayKey;
  startTime: string;
  endTime: string;
  title: string;
  level: ClassLevel;
  giType: GiType;
  audience: ClassAudience;
  instructorName: string;
  capacity?: number;
  note?: string;
  /** Stable id suffix (defaults from day+time+title). */
  id?: string;
}

const INSTRUCTOR_IDS: Record<string, string> = {
  'Coach Rivera': 'guest-coach-user',
  'Coach Silva': 'coach-silva',
  'Coach Park': 'coach-park',
  'Coach Mendes': 'coach-mendes',
  'Coach Boxing': 'coach-boxing',
  'Coach MT': 'coach-mt',
  'Coach Wrestling': 'coach-wrestling',
  'Coach TKD': 'coach-tkd',
  'Open Mat Staff': 'open-mat-staff',
};

function seed(
  day: OpenMatWeekdayKey,
  startTime: string,
  endTime: string,
  title: string,
  level: ClassLevel,
  giType: GiType,
  audience: ClassAudience,
  instructorName: string,
  extras: Partial<Pick<OpenMatClassSeed, 'capacity' | 'note' | 'id'>> = {},
): OpenMatClassSeed {
  return {
    day,
    startTime,
    endTime,
    title,
    level,
    giType,
    audience,
    instructorName,
    capacity: extras.capacity,
    note: extras.note,
    id: extras.id,
  };
}

/**
 * Official Open Mat Academy weekly class board
 * (3200 Naglee Rd STE #106, Tracy CA).
 */
export const OPEN_MAT_WEEKLY_BOARD: OpenMatClassSeed[] = [
  // —— Monday ——
  seed('mon', '05:30', '06:30', 'Jiu Jitsu GI', 'adult_bjj', 'gi', 'adults', 'Coach Rivera', {
    note: 'Roll Call · Band App',
    capacity: 24,
  }),
  seed('mon', '10:00', '11:00', 'Peak Performance', 'peak_performance', 'none', 'all', 'Open Mat Staff'),
  seed('mon', '11:00', '12:30', 'Jiu Jitsu GI', 'adult_bjj', 'gi', 'adults', 'Coach Silva', {
    id: 'mon-1100-jiu-jitsu-gi',
    capacity: 24,
  }),
  seed('mon', '16:00', '16:30', 'Pee Wee BJJ (Ages 4–7)', 'pee_wee_bjj', 'gi', 'kids', 'Coach Park', {
    capacity: 16,
  }),
  seed('mon', '16:30', '17:30', 'Youth BJJ (Ages 8–12)', 'youth_bjj', 'gi', 'kids', 'Coach Park', {
    capacity: 18,
  }),
  seed('mon', '16:30', '17:30', "Women's BJJ", 'womens_bjj', 'gi', 'adults', 'Coach Mendes', {
    id: 'mon-1630-womens-bjj',
    capacity: 16,
  }),
  seed('mon', '16:30', '17:30', 'Youth Boxing (Ages 8–12)', 'boxing', 'none', 'kids', 'Coach Boxing', {
    id: 'mon-1630-youth-boxing',
    capacity: 16,
  }),
  seed('mon', '16:30', '17:30', 'Peak Performance', 'peak_performance', 'none', 'all', 'Open Mat Staff', {
    id: 'mon-1630-peak',
  }),
  seed('mon', '17:00', '18:30', 'Muay Thai (Teens/Adults)', 'muay_thai', 'none', 'adults', 'Coach MT', {
    capacity: 20,
  }),
  seed('mon', '17:30', '18:30', 'Boxing Class', 'boxing', 'none', 'adults', 'Coach Boxing', {
    id: 'mon-1730-boxing',
    capacity: 18,
  }),
  seed('mon', '17:30', '18:15', 'Tae Kwon Do (Beginner)', 'taekwondo', 'none', 'all', 'Coach TKD', {
    capacity: 18,
  }),
  seed('mon', '17:30', '18:30', 'Peak Performance', 'peak_performance', 'none', 'all', 'Open Mat Staff', {
    id: 'mon-1730-peak',
  }),
  seed('mon', '18:15', '19:00', 'Tae Kwon Do (Inter/Adv)', 'taekwondo', 'none', 'all', 'Coach TKD', {
    id: 'mon-1815-tkd-adv',
    capacity: 16,
  }),
  seed('mon', '19:00', '20:30', 'Adult/Teen BJJ (No GI)', 'adult_bjj', 'no_gi', 'adults', 'Coach Rivera', {
    capacity: 22,
  }),
  seed('mon', '19:30', '20:30', 'Boxing Class', 'boxing', 'none', 'adults', 'Coach Boxing', {
    id: 'mon-1930-boxing',
    capacity: 18,
  }),

  // —— Tuesday ——
  seed('tue', '10:00', '11:00', 'Peak Performance', 'peak_performance', 'none', 'all', 'Open Mat Staff'),
  seed('tue', '16:00', '16:30', 'Pee Wee BJJ (Ages 4–7)', 'pee_wee_bjj', 'gi', 'kids', 'Coach Park', {
    capacity: 16,
  }),
  seed('tue', '16:30', '17:30', 'Youth BJJ (Ages 8–12)', 'youth_bjj', 'gi', 'kids', 'Coach Park', {
    capacity: 18,
  }),
  seed('tue', '16:30', '17:30', 'Peak Performance', 'peak_performance', 'none', 'all', 'Open Mat Staff', {
    id: 'tue-1630-peak',
  }),
  seed('tue', '17:00', '18:30', 'Muay Thai (Youth/Adults)', 'muay_thai', 'none', 'all', 'Coach MT', {
    capacity: 20,
  }),
  seed('tue', '17:30', '18:00', 'Wrestling (Ages 5–11)', 'wrestling', 'none', 'kids', 'Coach Wrestling', {
    capacity: 16,
  }),
  seed('tue', '17:30', '18:30', 'Peak Performance', 'peak_performance', 'none', 'all', 'Open Mat Staff', {
    id: 'tue-1730-peak',
  }),
  seed('tue', '18:00', '19:00', 'Wrestling (Ages 12–17)', 'wrestling', 'none', 'kids', 'Coach Wrestling', {
    id: 'tue-1800-wrestling-teen',
    capacity: 16,
  }),
  seed('tue', '19:00', '20:30', 'Adult/Teen BJJ (GI)', 'adult_bjj', 'gi', 'adults', 'Coach Mendes', {
    capacity: 22,
  }),
  seed('tue', '19:30', '20:30', 'Boxing Class', 'boxing', 'none', 'adults', 'Coach Boxing', {
    capacity: 18,
  }),

  // —— Wednesday ——
  seed('wed', '05:30', '06:30', 'Jiu Jitsu GI', 'adult_bjj', 'gi', 'adults', 'Coach Rivera', {
    note: 'Roll Call · Band App',
    capacity: 24,
  }),
  seed('wed', '10:00', '11:00', 'Peak Performance', 'peak_performance', 'none', 'all', 'Open Mat Staff'),
  seed('wed', '10:00', '11:00', "Women's BJJ", 'womens_bjj', 'gi', 'adults', 'Coach Mendes', {
    id: 'wed-1000-womens-bjj',
    capacity: 16,
  }),
  seed('wed', '11:00', '12:30', 'Jiu Jitsu GI', 'adult_bjj', 'gi', 'adults', 'Coach Silva', {
    id: 'wed-1100-jiu-jitsu-gi',
    capacity: 24,
  }),
  seed('wed', '16:00', '16:30', 'Pee Wee BJJ (Ages 4–7)', 'pee_wee_bjj', 'gi', 'kids', 'Coach Park', {
    capacity: 16,
  }),
  seed('wed', '16:30', '17:30', 'Youth BJJ (Ages 8–12)', 'youth_bjj', 'gi', 'kids', 'Coach Park', {
    capacity: 18,
  }),
  seed('wed', '16:30', '17:30', 'Youth Boxing (Ages 8–12)', 'boxing', 'none', 'kids', 'Coach Boxing', {
    id: 'wed-1630-youth-boxing',
    capacity: 16,
  }),
  seed('wed', '16:30', '17:30', 'Peak Performance', 'peak_performance', 'none', 'all', 'Open Mat Staff', {
    id: 'wed-1630-peak',
  }),
  seed('wed', '17:00', '18:30', 'Muay Thai (Teens/Adults)', 'muay_thai', 'none', 'adults', 'Coach MT', {
    capacity: 20,
  }),
  seed('wed', '17:30', '18:30', 'Boxing Class', 'boxing', 'none', 'adults', 'Coach Boxing', {
    id: 'wed-1730-boxing',
    capacity: 18,
  }),
  seed('wed', '17:30', '18:15', 'Tae Kwon Do (Beginner)', 'taekwondo', 'none', 'all', 'Coach TKD', {
    capacity: 18,
  }),
  seed('wed', '17:30', '18:30', 'Peak Performance', 'peak_performance', 'none', 'all', 'Open Mat Staff', {
    id: 'wed-1730-peak',
  }),
  seed('wed', '18:15', '19:00', 'Tae Kwon Do (Inter/Adv)', 'taekwondo', 'none', 'all', 'Coach TKD', {
    id: 'wed-1815-tkd-adv',
    capacity: 16,
  }),
  seed('wed', '19:00', '20:30', 'Adult/Teen BJJ (No GI)', 'adult_bjj', 'no_gi', 'adults', 'Coach Rivera', {
    capacity: 22,
  }),
  seed('wed', '19:30', '20:30', 'Boxing Class', 'boxing', 'none', 'adults', 'Coach Boxing', {
    id: 'wed-1930-boxing',
    capacity: 18,
  }),

  // —— Thursday ——
  seed('thu', '10:00', '11:00', 'Peak Performance', 'peak_performance', 'none', 'all', 'Open Mat Staff'),
  seed('thu', '16:00', '16:30', 'Pee Wee BJJ (No GI Ages 4–7)', 'pee_wee_bjj', 'no_gi', 'kids', 'Coach Park', {
    capacity: 16,
  }),
  seed('thu', '16:30', '17:30', 'Youth BJJ (No GI Ages 8–12)', 'youth_bjj', 'no_gi', 'kids', 'Coach Park', {
    capacity: 18,
  }),
  seed('thu', '16:30', '17:30', 'Peak Performance', 'peak_performance', 'none', 'all', 'Open Mat Staff', {
    id: 'thu-1630-peak',
  }),
  seed('thu', '17:00', '18:30', 'Muay Thai (Teens/Adults)', 'muay_thai', 'none', 'adults', 'Coach MT', {
    capacity: 20,
  }),
  seed('thu', '17:30', '18:30', 'Boxing Str. & Cond.', 'boxing', 'none', 'adults', 'Coach Boxing', {
    id: 'thu-1730-boxing-sc',
    capacity: 18,
  }),
  seed('thu', '17:30', '18:00', 'Wrestling (Ages 5–11)', 'wrestling', 'none', 'kids', 'Coach Wrestling', {
    capacity: 16,
  }),
  seed('thu', '17:30', '18:30', 'Peak Performance', 'peak_performance', 'none', 'all', 'Open Mat Staff', {
    id: 'thu-1730-peak',
  }),
  seed('thu', '18:00', '19:00', 'Wrestling (Ages 12–17)', 'wrestling', 'none', 'kids', 'Coach Wrestling', {
    id: 'thu-1800-wrestling-teen',
    capacity: 16,
  }),
  seed('thu', '19:00', '20:30', 'Adult/Teen BJJ (GI)', 'adult_bjj', 'gi', 'adults', 'Coach Rivera', {
    capacity: 22,
  }),
  seed('thu', '19:30', '20:30', 'Boxing Class', 'boxing', 'none', 'adults', 'Coach Boxing', {
    capacity: 18,
  }),

  // —— Friday ——
  seed('fri', '05:30', '06:30', 'Jiu Jitsu GI', 'adult_bjj', 'gi', 'adults', 'Coach Mendes', {
    note: 'Roll Call · Band App',
    capacity: 24,
  }),
  seed('fri', '11:00', '12:30', 'Jiu Jitsu GI', 'adult_bjj', 'gi', 'adults', 'Coach Silva', {
    id: 'fri-1100-jiu-jitsu-gi',
    capacity: 24,
  }),
  seed('fri', '16:00', '16:30', 'Pee Wee BJJ (Ages 4–7)', 'pee_wee_bjj', 'gi', 'kids', 'Coach Park', {
    capacity: 16,
  }),
  seed('fri', '16:30', '17:30', 'Youth BJJ (Ages 8–12)', 'youth_bjj', 'gi', 'kids', 'Coach Park', {
    capacity: 18,
  }),
  seed('fri', '16:30', '17:30', 'Youth Boxing (Ages 8–12)', 'boxing', 'none', 'kids', 'Coach Boxing', {
    id: 'fri-1630-youth-boxing',
    capacity: 16,
  }),
  seed('fri', '17:30', '18:30', 'Boxing Class', 'boxing', 'none', 'adults', 'Coach Boxing', {
    id: 'fri-1730-boxing',
    capacity: 18,
  }),
  seed('fri', '17:30', '18:15', 'Tae Kwon Do (Beginner)', 'taekwondo', 'none', 'all', 'Coach TKD', {
    capacity: 18,
  }),
  seed('fri', '18:15', '19:00', 'Tae Kwon Do (Inter/Adv)', 'taekwondo', 'none', 'all', 'Coach TKD', {
    id: 'fri-1815-tkd-adv',
    capacity: 16,
  }),
  seed('fri', '19:00', '20:30', 'Adult/Teen Takedown', 'adult_bjj', 'gi_no_gi', 'adults', 'Coach Rivera', {
    capacity: 22,
  }),
  seed('fri', '19:30', '20:30', 'Boxing Class', 'boxing', 'none', 'adults', 'Coach Boxing', {
    id: 'fri-1930-boxing',
    capacity: 18,
  }),

  // —— Saturday ——
  seed('sat', '09:00', '10:00', 'Wrestling', 'wrestling', 'none', 'all', 'Coach Wrestling', {
    capacity: 20,
  }),
  seed('sat', '10:00', '12:00', 'Open Mat (GI / No GI)', 'open_mat', 'gi_no_gi', 'all', 'Coach Silva', {
    capacity: 40,
  }),
  seed('sat', '10:00', '17:30', 'Open Gym', 'open_mat', 'none', 'all', 'Open Mat Staff', {
    id: 'sat-1000-open-gym',
    capacity: 50,
    note: 'Boxing open during gym hours (except during class)',
  }),

  // —— Sunday ——
  seed('sun', '10:00', '17:30', 'Open Gym', 'open_mat', 'none', 'all', 'Open Mat Staff', {
    capacity: 50,
  }),
];

export const OPEN_MAT_SCHEDULE_META = {
  academy: 'Open Mat Academy',
  address: '3200 Naglee Rd, STE #106, Tracy CA',
  phone: '(209) 752-8013',
  website: 'openmatacademy.com',
  notes: [
    'Roll Call classes register on the Band App',
    'All notifications via Band App',
    'Boxing Open: 10 AM–8:30 PM (except during class)',
    'Sat Open Gym: 10 AM–5:30 PM',
  ],
} as const;

const WEEKDAY_TO_JS: Record<OpenMatWeekdayKey, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

function addDaysISO(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function dateForWeekday(todayISO: string, weekday: OpenMatWeekdayKey): string {
  const now = new Date(`${todayISO}T12:00:00`);
  const current = now.getDay();
  const mondayBasedCurrent = current === 0 ? 6 : current - 1;
  const targetJs = WEEKDAY_TO_JS[weekday];
  const mondayBasedTarget = targetJs === 0 ? 6 : targetJs - 1;
  return addDaysISO(todayISO, mondayBasedTarget - mondayBasedCurrent);
}

function slugId(seedItem: OpenMatClassSeed): string {
  if (seedItem.id) {
    return `class-${seedItem.id}`;
  }
  const slug = seedItem.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 28);
  return `class-${seedItem.day}-${seedItem.startTime.replace(':', '')}-${slug}`;
}

function defaultCapacity(level: ClassLevel): number {
  if (level === 'open_mat') return 40;
  if (level === 'pee_wee_bjj' || level === 'youth_bjj') return 16;
  if (level === 'peak_performance') return 20;
  return 20;
}

export interface BuildWeeklyCoachClassesOptions {
  academyId: string;
  todayISO?: string;
  /** Optional reserved/check-in overrides keyed by class id. */
  occupancy?: Partial<
    Record<
      string,
      Partial<
        Pick<
          CoachClass,
          | 'reservedCount'
          | 'checkedInCount'
          | 'waitlistCount'
          | 'firstTimeVisitorCount'
          | 'status'
        >
      >
    >
  >;
}

/** Materialize the flyer board onto the current Mon–Sun week as CoachClass rows. */
export function buildWeeklyCoachClasses(
  options: BuildWeeklyCoachClassesOptions,
): CoachClass[] {
  const todayISO = options.todayISO ?? new Date().toISOString().slice(0, 10);
  const createdAt = `${todayISO}T01:00:00.000Z`;

  return OPEN_MAT_WEEKLY_BOARD.map((item) => {
    const id = slugId(item);
    const date = dateForWeekday(todayISO, item.day);
    const capacity = item.capacity ?? defaultCapacity(item.level);
    const occupancy = options.occupancy?.[id] ?? {};
    const isOpenMat = item.level === 'open_mat';
    const isSeminar = item.level === 'seminar';

    return {
      id,
      title: item.title,
      description: item.note,
      date,
      startTime: item.startTime,
      endTime: item.endTime,
      instructorId: INSTRUCTOR_IDS[item.instructorName] ?? 'open-mat-staff',
      instructorName: item.instructorName,
      giType: item.giType,
      level: item.level,
      audience: item.audience,
      capacity,
      reservedCount: occupancy.reservedCount ?? Math.min(capacity - 2, Math.round(capacity * 0.55)),
      checkedInCount:
        occupancy.checkedInCount ??
        (date === todayISO && item.startTime <= '12:00'
          ? Math.min(8, Math.round(capacity * 0.35))
          : 0),
      waitlistCount: occupancy.waitlistCount ?? 0,
      firstTimeVisitorCount: occupancy.firstTimeVisitorCount ?? 0,
      status: occupancy.status ?? 'scheduled',
      isOpenMat,
      isSeminar,
      recurrence: 'weekly',
      academyId: options.academyId,
      createdAt,
      updatedAt: createdAt,
      cancelledAt: null,
    };
  });
}
