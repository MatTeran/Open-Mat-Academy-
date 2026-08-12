import type { BeltRank } from '../../types/user';
import type { MembershipPlan, MembershipStatus } from '../../types/membership';
import type { CoachMemberProfile } from '../../types/members';
import { OPEN_MAT_ACADEMY_ID, OPEN_MAT_ACADEMY_NAME } from '../../constants/academy';
import { getSupabaseClient } from './client';

export interface ProfileRow {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  belt: BeltRank;
  stripes: number;
  membership_plan: MembershipPlan;
  membership_status: MembershipStatus;
  academy_id: string;
  created_at: string;
  updated_at: string;
}

function clampStripes(value: number): 0 | 1 | 2 | 3 | 4 {
  if (value <= 0) return 0;
  if (value === 1) return 1;
  if (value === 2) return 2;
  if (value === 3) return 3;
  return 4;
}

/** Map a live profiles row into the Coach member detail shape. */
export function mapProfileRowToCoachMember(
  row: ProfileRow,
  academyName = OPEN_MAT_ACADEMY_NAME,
): CoachMemberProfile {
  const stripes = clampStripes(row.stripes ?? 0);
  const memberSince = row.created_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10);

  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    avatarUrl: row.avatar_url,
    belt: row.belt,
    stripes,
    membershipPlan: row.membership_plan,
    membershipStatus: row.membership_status,
    academyName,
    journey: {
      belt: row.belt,
      stripes,
      memberSince,
      totalClasses: 0,
      levelLabel: 'New member',
      nextMilestone: 'First week on the mats',
    },
    achievements: [],
    emergencyContact: null,
    waivers: [],
    coachNotes: [],
    competitionHistory: [],
    recentClasses: [],
    trainingStats: {
      classesThisMonth: 0,
      classesThisYear: 0,
      openMatsThisMonth: 0,
      attendanceRate: 0,
      currentStreakDays: 0,
      favoriteClassType: 'Fundamentals',
    },
    isFirstTimer: true,
    createdAt: row.created_at,
  };
}

/**
 * Idempotent roster onboarding after Member signup / first sign-in.
 * Relies on public.ensure_member_roster_profile (security definer).
 */
export async function ensureMemberRosterProfile(input: {
  userId: string;
  fullName?: string | null;
  email?: string | null;
  academyId?: string;
}): Promise<ProfileRow | null> {
  const client = getSupabaseClient();
  if (!client) {
    return null;
  }

  const { data, error } = await client.rpc('ensure_member_roster_profile', {
    p_user_id: input.userId,
    p_full_name: input.fullName ?? null,
    p_email: input.email ?? null,
    p_academy_id: input.academyId ?? OPEN_MAT_ACADEMY_ID,
  });

  if (error) {
    // Trigger may have already created the row; fall back to a direct read.
    const { data: existing } = await client
      .from('profiles')
      .select('*')
      .eq('id', input.userId)
      .maybeSingle();
    if (existing) {
      return existing as ProfileRow;
    }
    console.warn('[memberRoster] ensure failed', error.message);
    return null;
  }

  return (data as ProfileRow | null) ?? null;
}

export async function listAcademyProfileRows(
  academyId = OPEN_MAT_ACADEMY_ID,
): Promise<ProfileRow[]> {
  const client = getSupabaseClient();
  if (!client) {
    return [];
  }

  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('academy_id', academyId)
    .order('full_name', { ascending: true });

  if (error) {
    console.warn('[memberRoster] list failed', error.message);
    return [];
  }

  return (data as ProfileRow[]) ?? [];
}

export async function getProfileRowById(
  id: string,
): Promise<ProfileRow | null> {
  const client = getSupabaseClient();
  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.warn('[memberRoster] get failed', error.message);
    return null;
  }

  return (data as ProfileRow | null) ?? null;
}

/** Mock-first merge: sample roster stays, live signups append (dedupe email/id). */
export function mergeMemberProfiles(
  mocks: CoachMemberProfile[],
  live: CoachMemberProfile[],
): CoachMemberProfile[] {
  const byId = new Set(mocks.map((m) => m.id));
  const byEmail = new Set(
    mocks.map((m) => m.email.trim().toLowerCase()).filter(Boolean),
  );

  const extras = live.filter((row) => {
    const email = row.email.trim().toLowerCase();
    if (byId.has(row.id)) return false;
    if (email && byEmail.has(email)) return false;
    return true;
  });

  return [...mocks, ...extras].sort((a, b) =>
    a.fullName.localeCompare(b.fullName),
  );
}
