export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends AuthCredentials {
  fullName: string;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  userId: string;
  expiresAt: number;
}

/**
 * App roles for permission gates.
 * - member: read-own development (no coach notes)
 * - coach: create/update member development
 * - manager / owner: full access
 * - admin / staff: legacy aliases (admin ≈ owner, staff ≈ coach)
 */
export type UserRole =
  | 'member'
  | 'coach'
  | 'manager'
  | 'owner'
  | 'admin'
  | 'staff';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
  /** Optional until Supabase profiles/roles are wired. */
  role?: UserRole;
}
