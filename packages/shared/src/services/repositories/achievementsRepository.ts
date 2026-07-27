import type {
  CoachAchievement,
  CreateAchievementInput,
  UpdateAchievementInput,
} from '../../types';

export interface AchievementListQuery {
  academyId?: string;
  category?: CoachAchievement['category'];
  rarity?: CoachAchievement['rarity'];
  activeOnly?: boolean;
}

export interface AchievementsRepository {
  list(query?: AchievementListQuery): Promise<CoachAchievement[]>;
  getById(id: string): Promise<CoachAchievement | null>;
  create(
    input: CreateAchievementInput,
    meta: { academyId: string },
  ): Promise<CoachAchievement>;
  update(
    id: string,
    input: UpdateAchievementInput,
  ): Promise<CoachAchievement | null>;
}

export function createMemoryAchievementsRepository(
  seed: CoachAchievement[] = [],
): AchievementsRepository {
  let achievements = [...seed];

  return {
    async list(query) {
      let result = [...achievements];
      if (query?.academyId) {
        result = result.filter((item) => item.academyId === query.academyId);
      }
      if (query?.category) {
        result = result.filter((item) => item.category === query.category);
      }
      if (query?.rarity) {
        result = result.filter((item) => item.rarity === query.rarity);
      }
      if (query?.activeOnly) {
        result = result.filter((item) => item.isActive);
      }
      return result.sort((a, b) => a.title.localeCompare(b.title));
    },
    async getById(id) {
      return achievements.find((item) => item.id === id) ?? null;
    },
    async create(input, meta) {
      const now = new Date().toISOString();
      const created: CoachAchievement = {
        id: `achievement-${Date.now()}`,
        title: input.title.trim(),
        description: input.description.trim(),
        category: input.category,
        rarity: input.rarity,
        icon: input.icon,
        tint: input.tint,
        xpReward: input.xpReward,
        requirementLabel: input.requirementLabel.trim(),
        awardedCount: 0,
        isActive: input.isActive ?? true,
        academyId: meta.academyId,
        createdAt: now,
        updatedAt: now,
      };
      achievements = [created, ...achievements];
      return created;
    },
    async update(id, input) {
      const index = achievements.findIndex((item) => item.id === id);
      if (index < 0) {
        return null;
      }
      const current = achievements[index];
      const updated: CoachAchievement = {
        ...current,
        ...input,
        title: input.title?.trim() ?? current.title,
        description: input.description?.trim() ?? current.description,
        requirementLabel:
          input.requirementLabel?.trim() ?? current.requirementLabel,
        updatedAt: new Date().toISOString(),
      };
      achievements = [
        ...achievements.slice(0, index),
        updated,
        ...achievements.slice(index + 1),
      ];
      return updated;
    },
  };
}

export function createAchievementsRepository(
  seed?: CoachAchievement[],
): AchievementsRepository {
  return createMemoryAchievementsRepository(seed);
}
