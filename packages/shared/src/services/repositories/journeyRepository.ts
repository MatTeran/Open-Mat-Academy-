import type { JourneyOverview } from '../../types';

export interface JourneyRepository {
  getOverview(): Promise<JourneyOverview>;
}

const emptyJourneyOverview: JourneyOverview = {
  activeMembers: 0,
  averageStreak: 0,
  weeklyGoalCompletionRate: 0,
  activeChallenges: 0,
  snapshots: [],
};

export function createMemoryJourneyRepository(
  seed: JourneyOverview = emptyJourneyOverview,
): JourneyRepository {
  const overview = seed;

  return {
    async getOverview() {
      return {
        ...overview,
        snapshots: overview.snapshots.map((snapshot) => ({
          ...snapshot,
          activeChallenges: snapshot.activeChallenges.map((challenge) => ({
            ...challenge,
          })),
          achievements: snapshot.achievements.map((achievement) => ({
            ...achievement,
          })),
          recentActivity: snapshot.recentActivity.map((activity) => ({
            ...activity,
          })),
        })),
      };
    },
  };
}

export function createJourneyRepository(
  seed?: JourneyOverview,
): JourneyRepository {
  return createMemoryJourneyRepository(seed);
}
