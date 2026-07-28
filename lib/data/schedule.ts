import type {
  ClassLevel,
  ScheduleClass,
  ScheduleFilter,
  Weekday,
} from '../../types/schedule';

export const WEEKDAYS: { key: Weekday; label: string; short: string }[] = [
  { key: 'mon', label: 'Monday', short: 'Mon' },
  { key: 'tue', label: 'Tuesday', short: 'Tue' },
  { key: 'wed', label: 'Wednesday', short: 'Wed' },
  { key: 'thu', label: 'Thursday', short: 'Thu' },
  { key: 'fri', label: 'Friday', short: 'Fri' },
  { key: 'sat', label: 'Saturday', short: 'Sat' },
  { key: 'sun', label: 'Sunday', short: 'Sun' },
];

export const SCHEDULE_FILTERS: { key: ScheduleFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'adult_bjj', label: 'Adult BJJ' },
  { key: 'youth_bjj', label: 'Youth BJJ' },
  { key: 'pee_wee', label: 'Pee Wee' },
  { key: 'womens_bjj', label: "Women's BJJ" },
  { key: 'boxing', label: 'Boxing' },
  { key: 'muay_thai', label: 'Muay Thai' },
  { key: 'wrestling', label: 'Wrestling' },
  { key: 'peak_performance', label: 'Peak Perf.' },
  { key: 'taekwondo', label: 'TKD' },
  { key: 'open_mat', label: 'Open Mat' },
];

export const CLASS_LEVEL_LABELS: Record<ClassLevel, string> = {
  adult_bjj: 'Adult BJJ',
  youth_bjj: 'Youth BJJ',
  pee_wee: 'Pee Wee BJJ',
  womens_bjj: "Women's BJJ",
  boxing: 'Boxing',
  muay_thai: 'Muay Thai',
  wrestling: 'Wrestling',
  peak_performance: 'Peak Performance',
  taekwondo: 'Tae Kwon Do',
  open_mat: 'Open Mat / Gym',
};

function cls(
  day: Weekday,
  startTime: string,
  endTime: string,
  title: string,
  level: ClassLevel,
  giType: ScheduleClass['giType'],
  instructor: string,
  extras: Partial<Pick<ScheduleClass, 'spotsLeft' | 'note' | 'id'>> = {},
): ScheduleClass {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 28);
  return {
    id: extras.id ?? `${day}-${startTime.replace(':', '')}-${slug}`,
    day,
    title,
    startTime,
    endTime,
    instructor,
    giType,
    level,
    spotsLeft: extras.spotsLeft ?? 12,
    note: extras.note,
  };
}

/**
 * Official Open Mat Academy weekly class board
 * (3200 Naglee Rd STE #106, Tracy CA).
 */
export const WEEKLY_SCHEDULE: ScheduleClass[] = [
  // —— Monday ——
  cls('mon', '05:30', '06:30', 'Jiu Jitsu GI', 'adult_bjj', 'gi', 'Coach Rivera', {
    note: 'Roll Call · Band App',
    spotsLeft: 10,
  }),
  cls('mon', '10:00', '11:00', 'Peak Performance', 'peak_performance', 'none', 'Open Mat Staff'),
  cls('mon', '11:00', '12:30', 'Jiu Jitsu GI', 'adult_bjj', 'gi', 'Coach Silva', {
    id: 'mon-1100-jiu-jitsu-gi',
    spotsLeft: 14,
  }),
  cls('mon', '16:00', '16:30', 'Pee Wee BJJ (Ages 4–7)', 'pee_wee', 'gi', 'Coach Park', {
    spotsLeft: 8,
  }),
  cls('mon', '16:30', '17:30', 'Youth BJJ (Ages 8–12)', 'youth_bjj', 'gi', 'Coach Park', {
    spotsLeft: 10,
  }),
  cls('mon', '16:30', '17:30', "Women's BJJ", 'womens_bjj', 'gi', 'Coach Mendes', {
    id: 'mon-1630-womens-bjj',
    spotsLeft: 10,
  }),
  cls('mon', '16:30', '17:30', 'Youth Boxing (Ages 8–12)', 'boxing', 'none', 'Coach Boxing', {
    id: 'mon-1630-youth-boxing',
    spotsLeft: 12,
  }),
  cls('mon', '16:30', '17:30', 'Peak Performance', 'peak_performance', 'none', 'Open Mat Staff', {
    id: 'mon-1630-peak',
  }),
  cls('mon', '17:00', '18:30', 'Muay Thai (Teens/Adults)', 'muay_thai', 'none', 'Coach MT', {
    spotsLeft: 14,
  }),
  cls('mon', '17:30', '18:30', 'Boxing Class', 'boxing', 'none', 'Coach Boxing', {
    id: 'mon-1730-boxing',
    spotsLeft: 12,
  }),
  cls('mon', '17:30', '18:15', 'Tae Kwon Do (Beginner)', 'taekwondo', 'none', 'Coach TKD', {
    spotsLeft: 12,
  }),
  cls('mon', '17:30', '18:30', 'Peak Performance', 'peak_performance', 'none', 'Open Mat Staff', {
    id: 'mon-1730-peak',
  }),
  cls('mon', '18:15', '19:00', 'Tae Kwon Do (Inter/Adv)', 'taekwondo', 'none', 'Coach TKD', {
    id: 'mon-1815-tkd-adv',
    spotsLeft: 10,
  }),
  cls('mon', '19:00', '20:30', 'Adult/Teen BJJ (No GI)', 'adult_bjj', 'no_gi', 'Coach Rivera', {
    spotsLeft: 12,
  }),
  cls('mon', '19:30', '20:30', 'Boxing Class', 'boxing', 'none', 'Coach Boxing', {
    id: 'mon-1930-boxing',
    spotsLeft: 12,
  }),

  // —— Tuesday ——
  cls('tue', '10:00', '11:00', 'Peak Performance', 'peak_performance', 'none', 'Open Mat Staff'),
  cls('tue', '16:00', '16:30', 'Pee Wee BJJ (Ages 4–7)', 'pee_wee', 'gi', 'Coach Park', {
    spotsLeft: 8,
  }),
  cls('tue', '16:30', '17:30', 'Youth BJJ (Ages 8–12)', 'youth_bjj', 'gi', 'Coach Park', {
    spotsLeft: 10,
  }),
  cls('tue', '16:30', '17:30', 'Peak Performance', 'peak_performance', 'none', 'Open Mat Staff', {
    id: 'tue-1630-peak',
  }),
  cls('tue', '17:00', '18:30', 'Muay Thai (Youth/Adults)', 'muay_thai', 'none', 'Coach MT', {
    spotsLeft: 14,
  }),
  cls('tue', '17:30', '18:30', 'Wrestling (Ages 5–11)', 'wrestling', 'none', 'Coach Wrestling', {
    spotsLeft: 12,
  }),
  cls('tue', '17:30', '18:30', 'Peak Performance', 'peak_performance', 'none', 'Open Mat Staff', {
    id: 'tue-1730-peak',
  }),
  cls('tue', '18:00', '19:00', 'Wrestling (Ages 12–17)', 'wrestling', 'none', 'Coach Wrestling', {
    id: 'tue-1800-wrestling-teen',
    spotsLeft: 12,
  }),
  cls('tue', '19:00', '20:30', 'Adult/Teen BJJ (GI)', 'adult_bjj', 'gi', 'Coach Mendes', {
    spotsLeft: 14,
  }),
  cls('tue', '19:30', '20:30', 'Boxing Class', 'boxing', 'none', 'Coach Boxing', {
    spotsLeft: 12,
  }),

  // —— Wednesday ——
  cls('wed', '05:30', '06:30', 'Jiu Jitsu GI', 'adult_bjj', 'gi', 'Coach Rivera', {
    note: 'Roll Call · Band App',
    spotsLeft: 10,
  }),
  cls('wed', '10:00', '11:00', 'Peak Performance', 'peak_performance', 'none', 'Open Mat Staff'),
  cls('wed', '10:00', '11:00', "Women's BJJ", 'womens_bjj', 'gi', 'Coach Mendes', {
    id: 'wed-1000-womens-bjj',
    spotsLeft: 10,
  }),
  cls('wed', '11:00', '12:30', 'Jiu Jitsu GI', 'adult_bjj', 'gi', 'Coach Silva', {
    id: 'wed-1100-jiu-jitsu-gi',
    spotsLeft: 14,
  }),
  cls('wed', '16:00', '16:30', 'Pee Wee BJJ (Ages 4–7)', 'pee_wee', 'gi', 'Coach Park', {
    spotsLeft: 8,
  }),
  cls('wed', '16:30', '17:30', 'Youth BJJ (Ages 8–12)', 'youth_bjj', 'gi', 'Coach Park', {
    spotsLeft: 10,
  }),
  cls('wed', '16:30', '17:30', 'Youth Boxing (Ages 8–12)', 'boxing', 'none', 'Coach Boxing', {
    id: 'wed-1630-youth-boxing',
    spotsLeft: 12,
  }),
  cls('wed', '16:30', '17:30', 'Peak Performance', 'peak_performance', 'none', 'Open Mat Staff', {
    id: 'wed-1630-peak',
  }),
  cls('wed', '17:00', '18:30', 'Muay Thai (Teens/Adults)', 'muay_thai', 'none', 'Coach MT', {
    spotsLeft: 14,
  }),
  cls('wed', '17:30', '18:30', 'Boxing Class', 'boxing', 'none', 'Coach Boxing', {
    id: 'wed-1730-boxing',
    spotsLeft: 12,
  }),
  cls('wed', '17:30', '18:15', 'Tae Kwon Do (Beginner)', 'taekwondo', 'none', 'Coach TKD', {
    spotsLeft: 12,
  }),
  cls('wed', '17:30', '18:30', 'Peak Performance', 'peak_performance', 'none', 'Open Mat Staff', {
    id: 'wed-1730-peak',
  }),
  cls('wed', '18:15', '19:00', 'Tae Kwon Do (Inter/Adv)', 'taekwondo', 'none', 'Coach TKD', {
    id: 'wed-1815-tkd-adv',
    spotsLeft: 10,
  }),
  cls('wed', '19:00', '20:30', 'Adult/Teen BJJ (No GI)', 'adult_bjj', 'no_gi', 'Coach Rivera', {
    spotsLeft: 12,
  }),
  cls('wed', '19:30', '20:30', 'Boxing Class', 'boxing', 'none', 'Coach Boxing', {
    id: 'wed-1930-boxing',
    spotsLeft: 12,
  }),

  // —— Thursday ——
  cls('thu', '10:00', '11:00', 'Peak Performance', 'peak_performance', 'none', 'Open Mat Staff'),
  cls('thu', '16:00', '16:30', 'Pee Wee BJJ (No GI Ages 4–7)', 'pee_wee', 'no_gi', 'Coach Park', {
    spotsLeft: 8,
  }),
  cls('thu', '16:30', '17:30', 'Youth BJJ (No GI Ages 8–12)', 'youth_bjj', 'no_gi', 'Coach Park', {
    spotsLeft: 10,
  }),
  cls('thu', '16:30', '17:30', 'Peak Performance', 'peak_performance', 'none', 'Open Mat Staff', {
    id: 'thu-1630-peak',
  }),
  cls('thu', '17:00', '18:30', 'Muay Thai (Teens/Adults)', 'muay_thai', 'none', 'Coach MT', {
    spotsLeft: 14,
  }),
  cls('thu', '17:30', '18:30', 'Boxing Str. & Cond.', 'boxing', 'none', 'Coach Boxing', {
    id: 'thu-1730-boxing-sc',
    spotsLeft: 12,
  }),
  cls('thu', '17:30', '18:00', 'Wrestling (Ages 5–11)', 'wrestling', 'none', 'Coach Wrestling', {
    spotsLeft: 12,
  }),
  cls('thu', '17:30', '18:30', 'Peak Performance', 'peak_performance', 'none', 'Open Mat Staff', {
    id: 'thu-1730-peak',
  }),
  cls('thu', '18:00', '19:00', 'Wrestling (Ages 12–17)', 'wrestling', 'none', 'Coach Wrestling', {
    id: 'thu-1800-wrestling-teen',
    spotsLeft: 12,
  }),
  cls('thu', '19:00', '20:30', 'Adult/Teen BJJ (GI)', 'adult_bjj', 'gi', 'Coach Rivera', {
    spotsLeft: 14,
  }),
  cls('thu', '19:30', '20:30', 'Boxing Class', 'boxing', 'none', 'Coach Boxing', {
    spotsLeft: 12,
  }),

  // —— Friday ——
  cls('fri', '05:30', '06:30', 'Jiu Jitsu GI', 'adult_bjj', 'gi', 'Coach Mendes', {
    note: 'Roll Call · Band App',
    spotsLeft: 10,
  }),
  cls('fri', '11:00', '12:30', 'Jiu Jitsu GI', 'adult_bjj', 'gi', 'Coach Silva', {
    id: 'fri-1100-jiu-jitsu-gi',
    spotsLeft: 14,
  }),
  cls('fri', '16:00', '16:30', 'Pee Wee BJJ (Ages 4–7)', 'pee_wee', 'gi', 'Coach Park', {
    spotsLeft: 8,
  }),
  cls('fri', '16:30', '17:30', 'Youth BJJ (Ages 8–12)', 'youth_bjj', 'gi', 'Coach Park', {
    spotsLeft: 10,
  }),
  cls('fri', '16:30', '17:30', 'Youth Boxing (Ages 8–12)', 'boxing', 'none', 'Coach Boxing', {
    id: 'fri-1630-youth-boxing',
    spotsLeft: 12,
  }),
  cls('fri', '17:30', '18:30', 'Boxing Class', 'boxing', 'none', 'Coach Boxing', {
    id: 'fri-1730-boxing',
    spotsLeft: 12,
  }),
  cls('fri', '17:30', '18:15', 'Tae Kwon Do (Beginner)', 'taekwondo', 'none', 'Coach TKD', {
    spotsLeft: 12,
  }),
  cls('fri', '18:15', '19:00', 'Tae Kwon Do (Inter/Adv)', 'taekwondo', 'none', 'Coach TKD', {
    id: 'fri-1815-tkd-adv',
    spotsLeft: 10,
  }),
  cls('fri', '19:00', '20:30', 'Adult/Teen Takedown', 'adult_bjj', 'both', 'Coach Rivera', {
    spotsLeft: 12,
  }),
  cls('fri', '19:30', '20:30', 'Boxing Class', 'boxing', 'none', 'Coach Boxing', {
    id: 'fri-1930-boxing',
    spotsLeft: 12,
  }),

  // —— Saturday ——
  cls('sat', '09:00', '10:00', 'Wrestling', 'wrestling', 'none', 'Coach Wrestling', {
    spotsLeft: 16,
  }),
  cls('sat', '10:00', '12:00', 'Open Mat (GI / No GI)', 'open_mat', 'both', 'Coach Silva', {
    spotsLeft: 30,
  }),
  cls('sat', '10:00', '17:30', 'Open Gym', 'open_mat', 'none', 'Open Mat Staff', {
    id: 'sat-1000-open-gym',
    spotsLeft: 40,
    note: 'Boxing open during gym hours (except during class)',
  }),

  // —— Sunday ——
  cls('sun', '10:00', '17:30', 'Open Gym', 'open_mat', 'none', 'Open Mat Staff', {
    spotsLeft: 40,
  }),
];

export const SCHEDULE_META = {
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
