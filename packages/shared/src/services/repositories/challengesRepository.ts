import type {
  CoachChallenge,
  CreateChallengeInput,
  UpdateChallengeInput,
} from '../../types';

export interface ChallengeListQuery {
  academyId?: string;
  kind?: CoachChallenge['kind'];
  period?: CoachChallenge['period'];
  status?: CoachChallenge['status'];
}

export interface ChallengesRepository {
  list(query?: ChallengeListQuery): Promise<CoachChallenge[]>;
  getById(id: string): Promise<CoachChallenge | null>;
  create(
    input: CreateChallengeInput,
    meta: { academyId: string },
  ): Promise<CoachChallenge>;
  update(
    id: string,
    input: UpdateChallengeInput,
  ): Promise<CoachChallenge | null>;
}

export function createMemoryChallengesRepository(
  seed: CoachChallenge[] = [],
): ChallengesRepository {
  let challenges = [...seed];

  return {
    async list(query) {
      let result = [...challenges];
      if (query?.academyId) {
        result = result.filter((item) => item.academyId === query.academyId);
      }
      if (query?.kind) {
        result = result.filter((item) => item.kind === query.kind);
      }
      if (query?.period) {
        result = result.filter((item) => item.period === query.period);
      }
      if (query?.status) {
        result = result.filter((item) => item.status === query.status);
      }
      return result.sort((a, b) => a.startDate.localeCompare(b.startDate));
    },
    async getById(id) {
      return challenges.find((item) => item.id === id) ?? null;
    },
    async create(input, meta) {
      const now = new Date().toISOString();
      const created: CoachChallenge = {
        id: `challenge-${Date.now()}`,
        name: input.name.trim(),
        description: input.description.trim(),
        kind: input.kind,
        period: input.period,
        xpReward: input.xpReward,
        badgeId: input.badgeId ?? null,
        badgeName: input.badgeName ?? null,
        startDate: input.startDate,
        endDate: input.endDate,
        eligibleMemberIds: input.eligibleMemberIds ?? 'all',
        participantCount: 0,
        completionCount: 0,
        status: input.status ?? 'draft',
        academyId: meta.academyId,
        createdAt: now,
        updatedAt: now,
      };
      challenges = [created, ...challenges];
      return created;
    },
    async update(id, input) {
      const index = challenges.findIndex((item) => item.id === id);
      if (index < 0) {
        return null;
      }
      const current = challenges[index];
      const updated: CoachChallenge = {
        ...current,
        ...input,
        name: input.name?.trim() ?? current.name,
        description: input.description?.trim() ?? current.description,
        badgeId:
          input.badgeId !== undefined ? input.badgeId : current.badgeId,
        badgeName:
          input.badgeName !== undefined ? input.badgeName : current.badgeName,
        eligibleMemberIds:
          input.eligibleMemberIds !== undefined
            ? input.eligibleMemberIds
            : current.eligibleMemberIds,
        updatedAt: new Date().toISOString(),
      };
      challenges = [
        ...challenges.slice(0, index),
        updated,
        ...challenges.slice(index + 1),
      ];
      return updated;
    },
  };
}

export function createChallengesRepository(
  seed?: CoachChallenge[],
): ChallengesRepository {
  return createMemoryChallengesRepository(seed);
}
