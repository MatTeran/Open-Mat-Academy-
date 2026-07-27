export interface MemberJourneySnapshot {
  memberId: string;
  memberName: string;
  avatarUrl: string | null;
  level: number;
  totalXP: number;
  currentLevelXP: number;
  nextLevelXP: number;
  weeklyGoalTarget: number;
  weeklyGoalProgress: number;
  currentStreak: number;
  bestStreak: number;
  activeChallenges: Array<{
    id: string;
    name: string;
    progress: number;
    target: number;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    earnedAt: string;
  }>;
  recentActivity: Array<{
    id: string;
    label: string;
    timestamp: string;
  }>;
}

/** Coach journey view is read-only — XP is never editable by coaches. */
export interface JourneyOverview {
  activeMembers: number;
  averageStreak: number;
  weeklyGoalCompletionRate: number;
  activeChallenges: number;
  snapshots: MemberJourneySnapshot[];
}
