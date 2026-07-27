import type {
  ActivityItem,
  HomeUserSummary,
  NextClassSummary,
  QuickAction,
  UpcomingEvent,
} from '../../types/home';
import { toNextClassCardModel } from '../../utils/schedule';

export const HOME_USER_SUMMARY: HomeUserSummary = {
  firstName: 'Mat',
  level: 14,
  currentXP: 4820,
  nextLevelXP: 5000,
  weeklyClassesCompleted: 3,
  weeklyClassGoal: 4,
  weeklyTrainingDays: 4,
  currentStreak: 7,
  bestStreak: 30,
};

const scheduleNext = toNextClassCardModel();

/**
 * Prefer live schedule next class; enrich with Home interaction fields.
 * Location is Tracy — schedule `room` historically encoded "Gi · Tracy",
 * so we do not reuse the first segment as location (that duplicated Gi).
 */
export const NEXT_CLASS_SUMMARY: NextClassSummary = {
  id: scheduleNext?.id ?? 'next-competition-positional',
  title: scheduleNext?.title ?? 'Competition Positional',
  coach: scheduleNext?.coach ?? 'Coach Mendes',
  startsAt: scheduleNext?.startsAt ?? new Date().toISOString(),
  room: 'Tracy',
  durationMinutes: scheduleNext?.durationMinutes ?? 60,
  format: 'Gi',
  location: 'Tracy',
  status: 'soon',
  reservationStatus: 'available',
};

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'reserveClass',
    label: 'Reserve Class',
    subtitle: 'Find and reserve your next session.',
    icon: 'ticket-outline',
  },
  {
    id: 'logTraining',
    label: 'Log Training',
    subtitle: 'Record today’s rounds and notes.',
    icon: 'barbell-outline',
  },
  {
    id: 'logTechnique',
    label: 'Log Technique',
    subtitle: 'Save something you learned.',
    icon: 'bulb-outline',
  },
  {
    id: 'viewSchedule',
    label: 'View Schedule',
    subtitle: 'See all upcoming classes.',
    icon: 'calendar-outline',
  },
];

export const RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'Logged open mat',
    detail: 'GI / No GI · 90 min',
    occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: 'act-2',
    title: 'Checked in',
    detail: 'Adult/Teen BJJ (No GI)',
    occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
  },
  {
    id: 'act-3',
    title: 'Morning GI',
    detail: 'Roll Call · Band App',
    occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString(),
  },
];

export const UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    id: 'evt-1',
    title: 'Saturday Open Mat',
    dateLabel: 'Sat · Weekly',
    meta: 'GI / No GI · 10:00 AM – 12:00 PM',
  },
  {
    id: 'evt-2',
    title: 'Open Gym Weekend',
    dateLabel: 'Sat–Sun',
    meta: '10:00 AM – 5:30 PM · Tracy',
  },
];
