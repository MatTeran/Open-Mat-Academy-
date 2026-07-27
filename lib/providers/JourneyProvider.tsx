import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { cloneJourneyMocks } from '../mocks/journey';
import type {
  AchievementBadge,
  Challenge,
  RecentAchievement,
  TrainingStreak,
  UserGamificationProfile,
  XPActivity,
} from '../../types/journey';
import { getLevelProgress } from '../../utils/journey';

interface JourneyContextValue {
  isLoading: boolean;
  profile: UserGamificationProfile;
  streak: TrainingStreak;
  weeklyChallenges: Challenge[];
  monthlyChallenges: Challenge[];
  badges: AchievementBadge[];
  recentAchievements: RecentAchievement[];
  xpActivities: XPActivity[];
  refreshing: boolean;
  refresh: () => Promise<void>;
  getBadge: (id: string) => AchievementBadge | undefined;
  celebrateChallenge: (challengeId: string) => void;
  celebratedChallengeIds: string[];
  awardXp: (amount: number, description?: string) => void;
}

const JourneyContext = createContext<JourneyContextValue | null>(null);

async function wait(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export function JourneyProvider({ children }: PropsWithChildren) {
  const initial = cloneJourneyMocks();
  const [profile, setProfile] = useState(initial.profile);
  const [streak, setStreak] = useState(initial.streak);
  const [weeklyChallenges, setWeeklyChallenges] = useState(
    initial.weeklyChallenges,
  );
  const [monthlyChallenges, setMonthlyChallenges] = useState(
    initial.monthlyChallenges,
  );
  const [badges, setBadges] = useState(initial.badges);
  const [recentAchievements, setRecentAchievements] = useState(
    initial.recentAchievements,
  );
  const [xpActivities, setXpActivities] = useState(initial.xpActivities);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [celebratedChallengeIds, setCelebratedChallengeIds] = useState<
    string[]
  >([]);

  const hydrate = useCallback(async () => {
    const next = cloneJourneyMocks();
    const progress = getLevelProgress(next.profile.totalXP);
    setProfile({
      ...next.profile,
      level: progress.level,
      currentLevelXP: progress.currentLevelXP,
      nextLevelXP: progress.nextLevelXP,
    });
    setStreak(next.streak);
    setWeeklyChallenges(next.weeklyChallenges);
    setMonthlyChallenges(next.monthlyChallenges);
    setBadges(next.badges);
    setRecentAchievements(next.recentAchievements);
    setXpActivities(next.xpActivities);
  }, []);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      await wait(650);
      if (!mounted) {
        return;
      }
      await hydrate();
      if (mounted) {
        setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [hydrate]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await wait(700);
    await hydrate();
    setRefreshing(false);
  }, [hydrate]);

  const getBadge = useCallback(
    (id: string) => badges.find((badge) => badge.id === id),
    [badges],
  );

  const celebrateChallenge = useCallback((challengeId: string) => {
    setCelebratedChallengeIds((current) =>
      current.includes(challengeId) ? current : [...current, challengeId],
    );
  }, []);

  const awardXp = useCallback((amount: number, description = 'XP earned') => {
    if (amount <= 0) {
      return;
    }
    setProfile((current) => {
      const progress = getLevelProgress(current.totalXP + amount);
      return {
        ...current,
        totalXP: progress.totalXP,
        level: progress.level,
        currentLevelXP: progress.currentLevelXP,
        nextLevelXP: progress.nextLevelXP,
      };
    });
    setXpActivities((current) => [
      {
        id: `xp-${Date.now()}`,
        activityType: 'complete_class',
        description,
        xpAmount: amount,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
  }, []);

  const value = useMemo<JourneyContextValue>(
    () => ({
      isLoading,
      profile,
      streak,
      weeklyChallenges,
      monthlyChallenges,
      badges,
      recentAchievements,
      xpActivities,
      refreshing,
      refresh,
      getBadge,
      celebrateChallenge,
      celebratedChallengeIds,
      awardXp,
    }),
    [
      isLoading,
      profile,
      streak,
      weeklyChallenges,
      monthlyChallenges,
      badges,
      recentAchievements,
      xpActivities,
      refreshing,
      refresh,
      getBadge,
      celebrateChallenge,
      celebratedChallengeIds,
      awardXp,
    ],
  );

  return (
    <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
  );
}

export function useJourney(): JourneyContextValue {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error('useJourney must be used within JourneyProvider');
  }
  return context;
}
