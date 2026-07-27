export type BadgeRarity = 'common' | 'rare' | 'elite';

export type BadgeCategory =
  | 'milestone'
  | 'streak'
  | 'competition'
  | 'attendance'
  | 'technique'
  | 'challenge';

export type BadgeRequirementType =
  | 'classes'
  | 'streak_days'
  | 'competition_wins'
  | 'early_bird_classes'
  | 'evening_classes'
  | 'open_mats'
  | 'techniques'
  | 'challenge_complete';

export type ChallengePeriod = 'weekly' | 'monthly';

export type ChallengeStatus = 'locked' | 'active' | 'completed';

export type ChallengeType =
  | 'train_classes'
  | 'learn_techniques'
  | 'open_mats'
  | 'training_sessions'
  | 'early_bird'
  | 'night_owl';

export type XPActivityType =
  | 'complete_class'
  | 'log_workout_notes'
  | 'log_technique'
  | 'complete_open_mat'
  | 'complete_weekly_challenge'
  | 'complete_monthly_challenge'
  | 'attend_seminar'
  | 'record_competition_match'
  | 'record_competition_win'
  | 'earn_badge';

export interface UserGamificationProfile {
  userId: string;
  level: number;
  totalXP: number;
  currentLevelXP: number;
  nextLevelXP: number;
  currentStreak: number;
  bestStreak: number;
  weeklyTrainingDays: number;
  unlockedBadgeIds: string[];
  activeChallengeIds: string[];
}

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  xpReward: number;
  requirementType: BadgeRequirementType;
  requirementTarget: number;
  requirementLabel: string;
  currentProgress: number;
  isUnlocked: boolean;
  unlockedAt: string | null;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  period: ChallengePeriod;
  target: number;
  currentProgress: number;
  xpReward: number;
  badgeRewardId: string | null;
  startDate: string;
  endDate: string;
  status: ChallengeStatus;
}

export interface ChallengeProgress {
  challengeId: string;
  current: number;
  target: number;
  percent: number;
  remaining: number;
  isComplete: boolean;
}

export interface XPActivity {
  id: string;
  activityType: XPActivityType;
  description: string;
  xpAmount: number;
  createdAt: string;
}

export interface TrainingDayStatus {
  key: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
  label: string;
  completed: boolean;
  isToday: boolean;
}

export interface TrainingStreak {
  currentStreak: number;
  bestStreak: number;
  weeklyTrainingDays: number;
  weekDays: TrainingDayStatus[];
}

export interface RecentAchievement {
  id: string;
  badgeId: string;
  name: string;
  unlockedAt: string;
}

export interface XPRewardConfig {
  completeClass: number;
  logWorkoutNotes: number;
  logTechnique: number;
  completeOpenMat: number;
  completeWeeklyChallenge: number;
  completeMonthlyChallenge: number;
  attendSeminar: number;
  recordCompetitionMatch: number;
  recordCompetitionWin: number;
}

export interface LevelProgress {
  level: number;
  totalXP: number;
  currentLevelXP: number;
  nextLevelXP: number;
  remainingXpToLevelUp: number;
  progressPercentage: number;
}
