import type {
  CoachMemberListItem,
  CoachMemberProfile,
} from '../../types';

export interface MembersRepository {
  list(query?: string): Promise<CoachMemberListItem[]>;
  getById(id: string): Promise<CoachMemberProfile | null>;
  search(query: string): Promise<CoachMemberListItem[]>;
}

export function createMemoryMembersRepository(
  seedProfiles: CoachMemberProfile[] = [],
): MembersRepository {
  const profiles = [...seedProfiles];

  const toListItem = (profile: CoachMemberProfile): CoachMemberListItem => ({
    id: profile.id,
    fullName: profile.fullName,
    email: profile.email,
    avatarUrl: profile.avatarUrl,
    belt: profile.belt,
    stripes: profile.stripes,
    membershipStatus: profile.membershipStatus,
    lastAttendedAt: profile.recentClasses[0]?.date ?? null,
  });

  return {
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

export function createMembersRepository(
  seedProfiles?: CoachMemberProfile[],
): MembersRepository {
  // Member roster remains mock-backed in Phase 1 until profiles table is shared.
  return createMemoryMembersRepository(seedProfiles);
}
