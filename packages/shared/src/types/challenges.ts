export type ChallengePeriod = 'weekly' | 'monthly';

export type ChallengeKind =
  | 'attendance'
  | 'competition'
  | 'open_mat'
  | 'kids'
  | 'womens'
  | 'custom';

export type ChallengeStatus = 'draft' | 'active' | 'completed' | 'archived';

export interface CoachChallenge {
  id: string;
  name: string;
  description: string;
  kind: ChallengeKind;
  period: ChallengePeriod;
  xpReward: number;
  badgeId: string | null;
  badgeName: string | null;
  startDate: string;
  endDate: string;
  eligibleMemberIds: string[] | 'all';
  participantCount: number;
  completionCount: number;
  status: ChallengeStatus;
  academyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChallengeInput {
  name: string;
  description: string;
  kind: ChallengeKind;
  period: ChallengePeriod;
  xpReward: number;
  badgeId?: string | null;
  badgeName?: string | null;
  startDate: string;
  endDate: string;
  eligibleMemberIds?: string[] | 'all';
  status?: ChallengeStatus;
}

export type UpdateChallengeInput = Partial<CreateChallengeInput>;
