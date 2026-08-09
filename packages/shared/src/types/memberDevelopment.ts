import type { BeltRank } from './user';
import type { CoachNote } from './members';

/** Stripe count on an adult BJJ belt. */
export type BeltStripeCount = 0 | 1 | 2 | 3 | 4;

export type PromotionType = 'stripe' | 'belt';

export interface PromotionHistoryEntry {
  id: string;
  memberId: string;
  type: PromotionType;
  belt: BeltRank;
  stripe: BeltStripeCount;
  date: string;
  coachId: string;
  coachName: string;
  notes: string | null;
  /** Academy that owns this official promotion record. */
  academyId: string;
  createdAt: string;
}

export type CompetitionRuleSet =
  | 'ibjjf'
  | 'jjwl'
  | 'naga'
  | 'grappling_industries';

export type CompetitionDivision = 'adult' | 'masters' | 'juvenile';

export type CompetitionTeamStatus = 'active' | 'inactive';

export type CompetitionExperience =
  | 'beginner'
  | 'intermediate'
  | 'advanced';

/**
 * Competition profile — separate from belt rank.
 * Stores preferred rules, division, and future eligibility metadata.
 */
export interface CompetitionProfile {
  id: string;
  memberId: string;
  preferredRuleSet: CompetitionRuleSet;
  division: CompetitionDivision;
  weightClass: string;
  preferredWeightKg: number | null;
  teamStatus: CompetitionTeamStatus;
  experience: CompetitionExperience;
  /** Free-form eligibility notes for future tournaments. */
  eligibilityNotes: string | null;
  updatedAt: string;
}

export type AcademyRoleKey =
  | 'assistant_coach'
  | 'kids_coach'
  | 'competition_team'
  | 'academy_ambassador'
  | 'volunteer'
  | 'front_desk';

export interface AcademyRoleAssignment {
  id: string;
  memberId: string;
  role: AcademyRoleKey;
  academyId: string;
  assignedAt: string;
  assignedById: string;
  assignedByName: string;
}

/**
 * Official academy belt record for a member.
 * Journey XP is intentionally separate and never drives promotions.
 */
export interface MemberDevelopmentRecord {
  id: string;
  memberId: string;
  academyId: string;
  belt: BeltRank;
  stripes: BeltStripeCount;
  promotionDate: string | null;
  promotedById: string | null;
  promotedByName: string | null;
  /** ISO timestamp when the member earned their current belt. */
  timeAtBeltStartedAt: string;
  updatedAt: string;
}

export interface MemberDevelopmentSummary {
  belt: BeltRank;
  stripes: BeltStripeCount;
  classesAttended: number;
  attendancePercent: number;
  currentStreakDays: number;
  weeklyGoal: number;
  weeklyGoalProgress: number;
  achievementsCount: number;
  competitionMedals: number;
  academyJoinDate: string;
  timeAtCurrentBeltLabel: string;
}

export interface MemberDevelopmentBundle {
  development: MemberDevelopmentRecord;
  history: PromotionHistoryEntry[];
  competition: CompetitionProfile | null;
  roles: AcademyRoleAssignment[];
  /** Coach-only notes. Never returned to Member app queries. */
  notes: CoachNote[];
  summary: MemberDevelopmentSummary;
}

export interface AddStripeInput {
  memberId: string;
  fromStripe: BeltStripeCount;
  toStripe: BeltStripeCount;
  date: string;
  notes?: string;
}

export interface PromoteBeltInput {
  memberId: string;
  fromBelt: BeltRank;
  toBelt: BeltRank;
  date: string;
  notes?: string;
  notifyMember: boolean;
  createAchievement: boolean;
  postToCommunity: boolean;
  /** Future share-card generation — accepted, not implemented. */
  generateShareCard: boolean;
}

export interface UpdateCompetitionProfileInput {
  memberId: string;
  preferredRuleSet: CompetitionRuleSet;
  division: CompetitionDivision;
  weightClass: string;
  preferredWeightKg: number | null;
  teamStatus: CompetitionTeamStatus;
  experience: CompetitionExperience;
  eligibilityNotes?: string | null;
}

export interface SetAcademyRolesInput {
  memberId: string;
  roles: AcademyRoleKey[];
}

export interface PromotionSideEffects {
  notifyMember: boolean;
  createAchievement: boolean;
  postToCommunity: boolean;
  generateShareCard: boolean;
}

export const BELT_RANKS: readonly BeltRank[] = [
  'white',
  'blue',
  'purple',
  'brown',
  'black',
] as const;

export const BELT_STRIPE_COUNTS: readonly BeltStripeCount[] = [
  0, 1, 2, 3, 4,
] as const;

export const ACADEMY_ROLE_KEYS: readonly AcademyRoleKey[] = [
  'assistant_coach',
  'kids_coach',
  'competition_team',
  'academy_ambassador',
  'volunteer',
  'front_desk',
] as const;

export const COMPETITION_RULE_SETS: readonly CompetitionRuleSet[] = [
  'ibjjf',
  'jjwl',
  'naga',
  'grappling_industries',
] as const;

export const COMPETITION_DIVISIONS: readonly CompetitionDivision[] = [
  'adult',
  'masters',
  'juvenile',
] as const;

export const COMPETITION_TEAM_STATUSES: readonly CompetitionTeamStatus[] = [
  'active',
  'inactive',
] as const;

export const COMPETITION_EXPERIENCES: readonly CompetitionExperience[] = [
  'beginner',
  'intermediate',
  'advanced',
] as const;

export function beltRankLabel(belt: BeltRank): string {
  return `${belt.charAt(0).toUpperCase()}${belt.slice(1)} Belt`;
}

export function academyRoleLabel(role: AcademyRoleKey): string {
  switch (role) {
    case 'assistant_coach':
      return 'Assistant Coach';
    case 'kids_coach':
      return 'Kids Coach';
    case 'competition_team':
      return 'Competition Team';
    case 'academy_ambassador':
      return 'Academy Ambassador';
    case 'volunteer':
      return 'Volunteer';
    case 'front_desk':
      return 'Front Desk';
    default: {
      const _exhaustive: never = role;
      return _exhaustive;
    }
  }
}

export function competitionRuleSetLabel(value: CompetitionRuleSet): string {
  switch (value) {
    case 'ibjjf':
      return 'IBJJF';
    case 'jjwl':
      return 'JJWL';
    case 'naga':
      return 'NAGA';
    case 'grappling_industries':
      return 'Grappling Industries';
    default: {
      const _exhaustive: never = value;
      return _exhaustive;
    }
  }
}

export function formatTimeAtBelt(startedAt: string, now = new Date()): string {
  const start = new Date(startedAt);
  if (Number.isNaN(start.getTime())) {
    return '—';
  }
  const ms = Math.max(0, now.getTime() - start.getTime());
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  if (days < 30) {
    return `${days} day${days === 1 ? '' : 's'}`;
  }
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} month${months === 1 ? '' : 's'}`;
  }
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (rem === 0) {
    return `${years} year${years === 1 ? '' : 's'}`;
  }
  return `${years}y ${rem}mo`;
}

/** Next belt in adult progression, or null at black. */
export function nextBeltRank(belt: BeltRank): BeltRank | null {
  const index = BELT_RANKS.indexOf(belt);
  if (index < 0 || index >= BELT_RANKS.length - 1) {
    return null;
  }
  return BELT_RANKS[index + 1];
}

export function nextStripeCount(
  stripes: BeltStripeCount,
): BeltStripeCount | null {
  if (stripes >= 4) {
    return null;
  }
  return (stripes + 1) as BeltStripeCount;
}
