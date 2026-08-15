import { getSupabaseClient } from './client';

const OPEN_MAT_ACADEMY_ID = 'academy-open-mat';

/**
 * Idempotent roster onboarding after Member signup / first sign-in.
 * DB trigger also creates rows; this covers clients that already have a session.
 */
export async function ensureMemberRosterProfile(input: {
  userId: string;
  fullName?: string | null;
  email?: string | null;
}): Promise<void> {
  const client = getSupabaseClient();
  if (!client) {
    return;
  }

  const { error } = await client.rpc('ensure_member_roster_profile', {
    p_user_id: input.userId,
    p_full_name: input.fullName ?? null,
    p_email: input.email ?? null,
    p_academy_id: OPEN_MAT_ACADEMY_ID,
  });

  if (error) {
    // Trigger may have already inserted; ignore conflict-style failures.
    console.warn('[memberRoster] ensure failed', error.message);
  }
}
