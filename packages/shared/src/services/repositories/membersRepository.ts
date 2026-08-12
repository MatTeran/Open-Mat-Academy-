import { OPEN_MAT_ACADEMY_ID } from '../../constants/academy';
import type {
  CoachMemberListItem,
  CoachMemberProfile,
} from '../../types';
import { getSupabaseClient, isSupabaseConfigured } from '../supabase/client';
import {
  getProfileRowById,
  listAcademyProfileRows,
  mapProfileRowToCoachMember,
  mergeMemberProfiles,
} from '../supabase/memberRoster';

export interface MembersRepository {
  list(query?: string): Promise<CoachMemberListItem[]>;
  /** Full profiles — mock sample data first, then live Supabase signups. */
  listProfiles(): Promise<CoachMemberProfile[]>;
  getById(id: string): Promise<CoachMemberProfile | null>;
  search(query: string): Promise<CoachMemberListItem[]>;
}

function toListItem(profile: CoachMemberProfile): CoachMemberListItem {
  return {
    id: profile.id,
    fullName: profile.fullName,
    email: profile.email,
    avatarUrl: profile.avatarUrl,
    belt: profile.belt,
    stripes: profile.stripes,
    membershipStatus: profile.membershipStatus,
    lastAttendedAt: profile.recentClasses[0]?.date ?? null,
  };
}

export function createMemoryMembersRepository(
  seedProfiles: CoachMemberProfile[] = [],
): MembersRepository {
  const profiles = [...seedProfiles];

  return {
    async listProfiles() {
      return [...profiles].sort((a, b) => a.fullName.localeCompare(b.fullName));
    },
    async list(query) {
      const items = profiles.map(toListItem);
      if (!query?.trim()) {
        return items.sort((a, b) => a.fullName.localeCompare(b.fullName));
      }
      return this.search(query);
    },
    async getById(id) {
      return profiles.find((profile) => profile.id === id) ?? null;
    },
    async search(query) {
      const needle = query.trim().toLowerCase();
      return profiles
        .filter(
          (profile) =>
            profile.fullName.toLowerCase().includes(needle) ||
            profile.email.toLowerCase().includes(needle),
        )
        .map(toListItem)
        .sort((a, b) => a.fullName.localeCompare(b.fullName));
    },
  };
}

/**
 * Mock sample roster + live Supabase profiles for the academy.
 * Sample members are always kept; real signups append (deduped).
 */
export function createHybridMembersRepository(
  seedProfiles: CoachMemberProfile[] = [],
  academyId: string = OPEN_MAT_ACADEMY_ID,
): MembersRepository {
  const memory = createMemoryMembersRepository(seedProfiles);

  async function loadMerged(): Promise<CoachMemberProfile[]> {
    if (!getSupabaseClient()) {
      return memory.listProfiles();
    }
    const rows = await listAcademyProfileRows(academyId);
    const live = rows.map((row) => mapProfileRowToCoachMember(row));
    return mergeMemberProfiles(seedProfiles, live);
  }

  return {
    async listProfiles() {
      return loadMerged();
    },
    async list(query) {
      const profiles = await loadMerged();
      const items = profiles.map(toListItem);
      if (!query?.trim()) {
        return items;
      }
      const needle = query.trim().toLowerCase();
      return items.filter(
        (item) =>
          item.fullName.toLowerCase().includes(needle) ||
          item.email.toLowerCase().includes(needle),
      );
    },
    async getById(id) {
      const fromSeed = await memory.getById(id);
      if (fromSeed) {
        return fromSeed;
      }
      const row = await getProfileRowById(id);
      return row ? mapProfileRowToCoachMember(row) : null;
    },
    async search(query) {
      return this.list(query);
    },
  };
}

export function createMembersRepository(
  seedProfiles?: CoachMemberProfile[],
): MembersRepository {
  const seed = seedProfiles ?? [];
  if (isSupabaseConfigured()) {
    return createHybridMembersRepository(seed);
  }
  return createMemoryMembersRepository(seed);
}

export function createSupabaseMembersRepository(
  seedProfiles: CoachMemberProfile[] = [],
): MembersRepository {
  return createHybridMembersRepository(seedProfiles);
}
