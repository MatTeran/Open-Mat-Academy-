import type {
  AcademyRoleAssignment,
  AcademyRoleKey,
  AddStripeInput,
  BeltStripeCount,
  CompetitionProfile,
  MemberDevelopmentBundle,
  MemberDevelopmentRecord,
  MemberDevelopmentSummary,
  PromoteBeltInput,
  PromotionHistoryEntry,
  SetAcademyRolesInput,
  UpdateCompetitionProfileInput,
} from '../../types/memberDevelopment';
import type { BeltRank } from '../../types/user';
import type { CoachNote } from '../../types/members';
import {
  formatTimeAtBelt,
  nextBeltRank,
  nextStripeCount,
} from '../../types/memberDevelopment';
import { isSupabaseConfigured } from '../supabase/client';
import type { CoachNotesRepository } from './coachNotesRepository';

export interface MemberDevelopmentAuthor {
  id: string;
  name: string;
  academyId: string;
}

export interface MemberDevelopmentRepository {
  getByMemberId(memberId: string): Promise<MemberDevelopmentBundle | null>;
  addStripe(
    input: AddStripeInput,
    author: MemberDevelopmentAuthor,
  ): Promise<MemberDevelopmentBundle>;
  promoteBelt(
    input: PromoteBeltInput,
    author: MemberDevelopmentAuthor,
  ): Promise<MemberDevelopmentBundle>;
  updateCompetitionProfile(
    input: UpdateCompetitionProfileInput,
  ): Promise<CompetitionProfile>;
  setAcademyRoles(
    input: SetAcademyRolesInput,
    author: MemberDevelopmentAuthor,
  ): Promise<AcademyRoleAssignment[]>;
}

interface MemoryStore {
  development: MemberDevelopmentRecord[];
  history: PromotionHistoryEntry[];
  competition: CompetitionProfile[];
  roles: AcademyRoleAssignment[];
  summaries: Record<string, Omit<MemberDevelopmentSummary, 'belt' | 'stripes' | 'timeAtCurrentBeltLabel'>>;
}

function buildSummary(
  development: MemberDevelopmentRecord,
  partial: MemoryStore['summaries'][string] | undefined,
): MemberDevelopmentSummary {
  const base = partial ?? {
    classesAttended: 0,
    attendancePercent: 0,
    currentStreakDays: 0,
    weeklyGoal: 3,
    weeklyGoalProgress: 0,
    achievementsCount: 0,
    competitionMedals: 0,
    academyJoinDate: development.timeAtBeltStartedAt.slice(0, 10),
  };
  return {
    belt: development.belt,
    stripes: development.stripes,
    ...base,
    timeAtCurrentBeltLabel: formatTimeAtBelt(development.timeAtBeltStartedAt),
  };
}

function assertStripeProgression(
  from: BeltStripeCount,
  to: BeltStripeCount,
): void {
  if (to <= from) {
    throw new Error('New stripe must be higher than the current stripe.');
  }
  if (to > 4) {
    throw new Error('Maximum stripe count is 4.');
  }
  const expected = nextStripeCount(from);
  if (expected !== null && to !== expected && to !== from + 1) {
    // Allow jumping only one step at a time in the happy path; still accept
    // any higher stripe if coach intentionally sets it (manual correction).
  }
}

function assertBeltProgression(from: BeltRank, to: BeltRank): void {
  if (from === to) {
    throw new Error('New belt must differ from the current belt.');
  }
  const next = nextBeltRank(from);
  if (next && to !== next) {
    // Coaches may correct ranks; only block demotions silently? Allow any change
    // except same belt — academy owners sometimes correct records.
  }
}

export function createMemoryMemberDevelopmentRepository(
  seed: Partial<MemoryStore> = {},
  notesRepo?: CoachNotesRepository,
): MemberDevelopmentRepository {
  const store: MemoryStore = {
    development: [...(seed.development ?? [])],
    history: [...(seed.history ?? [])],
    competition: [...(seed.competition ?? [])],
    roles: [...(seed.roles ?? [])],
    summaries: { ...(seed.summaries ?? {}) },
  };

  const loadBundle = async (
    memberId: string,
  ): Promise<MemberDevelopmentBundle | null> => {
    const development = store.development.find(
      (item) => item.memberId === memberId,
    );
    if (!development) {
      return null;
    }
    const history = store.history
      .filter((item) => item.memberId === memberId)
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
    const competition =
      store.competition.find((item) => item.memberId === memberId) ?? null;
    const roles = store.roles.filter((item) => item.memberId === memberId);
    const notes = notesRepo ? await notesRepo.listByMember(memberId) : [];
    return {
      development,
      history,
      competition,
      roles,
      notes,
      summary: buildSummary(development, store.summaries[memberId]),
    };
  };

  const upsertDevelopment = (
    memberId: string,
    patch: Partial<MemberDevelopmentRecord> &
      Pick<MemberDevelopmentRecord, 'belt' | 'stripes'>,
    author: MemberDevelopmentAuthor,
  ): MemberDevelopmentRecord => {
    const now = new Date().toISOString();
    const index = store.development.findIndex(
      (item) => item.memberId === memberId,
    );
    if (index < 0) {
      const created: MemberDevelopmentRecord = {
        id: `dev-${memberId}`,
        memberId,
        academyId: author.academyId,
        belt: patch.belt,
        stripes: patch.stripes,
        promotionDate: patch.promotionDate ?? now.slice(0, 10),
        promotedById: patch.promotedById ?? author.id,
        promotedByName: patch.promotedByName ?? author.name,
        timeAtBeltStartedAt: patch.timeAtBeltStartedAt ?? now,
        updatedAt: now,
      };
      store.development = [created, ...store.development];
      return created;
    }
    const current = store.development[index];
    const updated: MemberDevelopmentRecord = {
      ...current,
      ...patch,
      updatedAt: now,
    };
    store.development = [
      ...store.development.slice(0, index),
      updated,
      ...store.development.slice(index + 1),
    ];
    return updated;
  };

  return {
    async getByMemberId(memberId) {
      return loadBundle(memberId);
    },

    async addStripe(input, author) {
      assertStripeProgression(input.fromStripe, input.toStripe);
      const existing = store.development.find(
        (item) => item.memberId === input.memberId,
      );
      if (!existing) {
        throw new Error('Member development record not found.');
      }
      if (existing.stripes !== input.fromStripe) {
        throw new Error('Current stripe does not match the member record.');
      }

      const now = new Date().toISOString();
      upsertDevelopment(
        input.memberId,
        {
          belt: existing.belt,
          stripes: input.toStripe,
          promotionDate: input.date,
          promotedById: author.id,
          promotedByName: author.name,
          timeAtBeltStartedAt: existing.timeAtBeltStartedAt,
        },
        author,
      );

      const entry: PromotionHistoryEntry = {
        id: `promo-${Date.now()}`,
        memberId: input.memberId,
        type: 'stripe',
        belt: existing.belt,
        stripe: input.toStripe,
        date: input.date,
        coachId: author.id,
        coachName: author.name,
        notes: input.notes?.trim() || null,
        createdAt: now,
      };
      store.history = [entry, ...store.history];

      const bundle = await loadBundle(input.memberId);
      if (!bundle) {
        throw new Error('Failed to reload member development.');
      }
      return bundle;
    },

    async promoteBelt(input, author) {
      assertBeltProgression(input.fromBelt, input.toBelt);
      const existing = store.development.find(
        (item) => item.memberId === input.memberId,
      );
      if (!existing) {
        throw new Error('Member development record not found.');
      }
      if (existing.belt !== input.fromBelt) {
        throw new Error('Current belt does not match the member record.');
      }

      // Side-effect flags are accepted for future wiring (notify / achievement /
      // community / share card). No automatic promotion logic lives here.
      void input.notifyMember;
      void input.createAchievement;
      void input.postToCommunity;
      void input.generateShareCard;

      const now = new Date().toISOString();
      upsertDevelopment(
        input.memberId,
        {
          belt: input.toBelt,
          stripes: 0,
          promotionDate: input.date,
          promotedById: author.id,
          promotedByName: author.name,
          timeAtBeltStartedAt: `${input.date}T12:00:00.000Z`,
        },
        author,
      );

      const entry: PromotionHistoryEntry = {
        id: `promo-${Date.now()}`,
        memberId: input.memberId,
        type: 'belt',
        belt: input.toBelt,
        stripe: 0,
        date: input.date,
        coachId: author.id,
        coachName: author.name,
        notes: input.notes?.trim() || null,
        createdAt: now,
      };
      store.history = [entry, ...store.history];

      const bundle = await loadBundle(input.memberId);
      if (!bundle) {
        throw new Error('Failed to reload member development.');
      }
      return bundle;
    },

    async updateCompetitionProfile(input) {
      const now = new Date().toISOString();
      const index = store.competition.findIndex(
        (item) => item.memberId === input.memberId,
      );
      const next: CompetitionProfile = {
        id:
          index >= 0
            ? store.competition[index].id
            : `comp-profile-${input.memberId}`,
        memberId: input.memberId,
        preferredRuleSet: input.preferredRuleSet,
        division: input.division,
        weightClass: input.weightClass.trim(),
        preferredWeightKg: input.preferredWeightKg,
        teamStatus: input.teamStatus,
        experience: input.experience,
        eligibilityNotes: input.eligibilityNotes?.trim() || null,
        updatedAt: now,
      };
      if (index >= 0) {
        store.competition = [
          ...store.competition.slice(0, index),
          next,
          ...store.competition.slice(index + 1),
        ];
      } else {
        store.competition = [next, ...store.competition];
      }
      return next;
    },

    async setAcademyRoles(input, author) {
      const unique = Array.from(new Set(input.roles));
      const now = new Date().toISOString();
      store.roles = store.roles.filter(
        (item) => item.memberId !== input.memberId,
      );
      const assigned: AcademyRoleAssignment[] = unique.map((role, index) => ({
        id: `role-${input.memberId}-${role}-${index}`,
        memberId: input.memberId,
        role,
        assignedAt: now,
        assignedById: author.id,
        assignedByName: author.name,
      }));
      store.roles = [...assigned, ...store.roles];
      return assigned;
    },
  };
}

/**
 * Supabase-backed repository placeholder.
 * Memory store is used until the shared profiles table is wired end-to-end.
 * Schema + RLS land in the companion migration.
 */
export function createSupabaseMemberDevelopmentRepository(
  notesRepo?: CoachNotesRepository,
): MemberDevelopmentRepository {
  // Until live profiles exist, fall back to empty memory so the Coach UI
  // remains functional offline / guest.
  return createMemoryMemberDevelopmentRepository({}, notesRepo);
}

export function createMemberDevelopmentRepository(
  seed?: Partial<MemoryStore>,
  notesRepo?: CoachNotesRepository,
): MemberDevelopmentRepository {
  if (isSupabaseConfigured()) {
    return createSupabaseMemberDevelopmentRepository(notesRepo);
  }
  return createMemoryMemberDevelopmentRepository(seed, notesRepo);
}
