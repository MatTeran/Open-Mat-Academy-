export type AchievementCategory =
  | 'attendance'
  | 'competition'
  | 'academy'
  | 'special';

export type AchievementRarity = 'common' | 'rare' | 'elite' | 'legendary';

export interface CoachAchievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  icon: string;
  tint: string;
  xpReward: number;
  requirementLabel: string;
  awardedCount: number;
  isActive: boolean;
  academyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAchievementInput {
  title: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  icon: string;
  tint: string;
  xpReward: number;
  requirementLabel: string;
  isActive?: boolean;
}

export type UpdateAchievementInput = Partial<CreateAchievementInput>;
