import type {
  AchievementBadge,
  Challenge,
  ChallengeProgress,
  LevelProgress,
  TrainingDayStatus,
  TrainingStreak,
  XPActivityType,
  XPRewardConfig,
} from '../types/journey';

/** Flat XP band per level — Level 14 at 4,820 / 5,000 XP. */
export const XP_PER_LEVEL = 5000;

export const XP_REWARDS: XPRewardConfig = {
  completeClass: 100,
  logWorkoutNotes: 25,
  logTechnique: 30,
  completeOpenMat: 150,
  completeWeeklyChallenge: 300,
  completeMonthlyChallenge: 750,
  attendSeminar: 250,
  recordCompetitionMatch: 300,
  recordCompetitionWin: 500,
};

const ACTIVITY_XP: Record<XPActivityType, number | 'badge'> = {
  complete_class: XP_REWARDS.completeClass,
  log_workout_notes: XP_REWARDS.logWorkoutNotes,
  log_technique: XP_REWARDS.logTechnique,
  complete_open_mat: XP_REWARDS.completeOpenMat,
  complete_weekly_challenge: XP_REWARDS.completeWeeklyChallenge,
  complete_monthly_challenge: XP_REWARDS.completeMonthlyChallenge,
  attend_seminar: XP_REWARDS.attendSeminar,
  record_competition_match: XP_REWARDS.recordCompetitionMatch,
  record_competition_win: XP_REWARDS.recordCompetitionWin,
  earn_badge: 'badge',
};

export function getXpForActivity(
  activityType: XPActivityType,
  badgeXp?: number,
): number {
  const value = ACTIVITY_XP[activityType];
  if (value === 'badge') {
    return badgeXp ?? 0;
  }
  return value;
}

export function getLevelFromTotalXP(totalXP: number): number {
  return Math.floor(Math.max(0, totalXP) / XP_PER_LEVEL) + 1;
}

export function getXpRequiredForNextLevel(_level: number): number {
  return XP_PER_LEVEL;
}

export function getLevelProgress(totalXP: number): LevelProgress {
  const safeTotal = Math.max(0, totalXP);
  const level = getLevelFromTotalXP(safeTotal);
  const currentLevelXP = safeTotal % XP_PER_LEVEL;
  const nextLevelXP = getXpRequiredForNextLevel(level);
  const remainingXpToLevelUp = nextLevelXP - currentLevelXP;
  const progressPercentage =
    nextLevelXP === 0 ? 0 : (currentLevelXP / nextLevelXP) * 100;

  return {
    level,
    totalXP: safeTotal,
    currentLevelXP,
    nextLevelXP,
    remainingXpToLevelUp,
    progressPercentage,
  };
}

export function getXpProgressPercentage(
  currentLevelXP: number,
  nextLevelXP: number,
): number {
  if (nextLevelXP <= 0) {
    return 0;
  }
  return Math.min(100, Math.max(0, (currentLevelXP / nextLevelXP) * 100));
}

export function getChallengeProgress(challenge: Challenge): ChallengeProgress {
  const current = Math.max(0, challenge.currentProgress);
  const target = Math.max(1, challenge.target);
  const clamped = Math.min(current, target);
  const percent = (clamped / target) * 100;
  const remaining = Math.max(0, target - current);
  const isComplete =
    challenge.status === 'completed' || current >= target;

  return {
    challengeId: challenge.id,
    current: clamped,
    target,
    percent,
    remaining,
    isComplete,
  };
}

export function getWeeklyChallengeProgress(
  challenges: Challenge[],
): ChallengeProgress[] {
  return challenges
    .filter((item) => item.period === 'weekly')
    .map(getChallengeProgress);
}

export function getMonthlyChallengeProgress(
  challenges: Challenge[],
): ChallengeProgress[] {
  return challenges
    .filter((item) => item.period === 'monthly')
    .map(getChallengeProgress);
}

export function getBadgeProgress(badge: AchievementBadge): {
  current: number;
  target: number;
  percent: number;
  remaining: number;
  isUnlocked: boolean;
} {
  const current = Math.max(0, badge.currentProgress);
  const target = Math.max(1, badge.requirementTarget);
  const clamped = Math.min(current, target);
  return {
    current: clamped,
    target,
    percent: (clamped / target) * 100,
    remaining: Math.max(0, target - current),
    isUnlocked: badge.isUnlocked || current >= target,
  };
}

export function getStreakStatus(streak: TrainingStreak): {
  currentStreak: number;
  bestStreak: number;
  weeklyTrainingDays: number;
  completedThisWeek: number;
  missedThisWeek: number;
} {
  const completedThisWeek = streak.weekDays.filter((day) => day.completed).length;
  return {
    currentStreak: streak.currentStreak,
    bestStreak: streak.bestStreak,
    weeklyTrainingDays: streak.weeklyTrainingDays,
    completedThisWeek,
    missedThisWeek: streak.weekDays.length - completedThisWeek,
  };
}

export function getDaysRemaining(endDate: string, now = new Date()): number {
  const end = new Date(endDate).getTime();
  const diff = end - now.getTime();
  if (diff <= 0) {
    return 0;
  }
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function formatDaysRemaining(endDate: string, now = new Date()): string {
  const days = getDaysRemaining(endDate, now);
  if (days <= 0) {
    return 'Ends today';
  }
  if (days === 1) {
    return '1 day left';
  }
  return `${days} days left`;
}

export function formatXp(value: number): string {
  return value.toLocaleString('en-US');
}

export function formatRarity(rarity: AchievementBadge['rarity']): string {
  switch (rarity) {
    case 'common':
      return 'Common';
    case 'rare':
      return 'Rare';
    case 'epic':
      return 'Epic';
    case 'legendary':
      return 'Legendary';
    default:
      return rarity;
  }
}

export function formatUnlockedDate(iso: string | null): string {
  if (!iso) {
    return '';
  }
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function buildWeekDays(
  completedKeys: Array<TrainingDayStatus['key']>,
  todayKey?: TrainingDayStatus['key'],
): TrainingDayStatus[] {
  const labels: Array<{ key: TrainingDayStatus['key']; label: string }> = [
    { key: 'mon', label: 'Mon' },
    { key: 'tue', label: 'Tue' },
    { key: 'wed', label: 'Wed' },
    { key: 'thu', label: 'Thu' },
    { key: 'fri', label: 'Fri' },
    { key: 'sat', label: 'Sat' },
    { key: 'sun', label: 'Sun' },
  ];

  const completed = new Set(completedKeys);
  return labels.map((day) => ({
    key: day.key,
    label: day.label,
    completed: completed.has(day.key),
    isToday: todayKey === day.key,
  }));
}
