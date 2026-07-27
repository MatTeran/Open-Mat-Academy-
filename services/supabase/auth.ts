import type { Session, User } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';

import type {
  AuthCredentials,
  AuthSession,
  AuthUser,
  RegisterPayload,
} from '../../types';
import { getSupabaseClient } from './client';

export class AuthServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthServiceError';
  }
}

function requireClient() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new AuthServiceError(
      'Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY.',
    );
  }
  return supabase;
}

export function mapAuthUser(user: User | null | undefined): AuthUser | null {
  if (!user) {
    return null;
  }

  const fullName =
    typeof user.user_metadata?.full_name === 'string'
      ? user.user_metadata.full_name
      : null;

  return {
    id: user.id,
    email: user.email ?? '',
    fullName,
  };
}

export function mapAuthSession(session: Session | null): AuthSession | null {
  if (!session) {
    return null;
  }

  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    userId: session.user.id,
    expiresAt: session.expires_at ?? 0,
  };
}

export async function getSession(): Promise<{
  session: AuthSession | null;
  user: AuthUser | null;
}> {
  const supabase = requireClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new AuthServiceError(error.message);
  }

  return {
    session: mapAuthSession(data.session),
    user: mapAuthUser(data.session?.user),
  };
}

export function onAuthStateChange(
  callback: (payload: {
    session: AuthSession | null;
    user: AuthUser | null;
  }) => void,
) {
  const supabase = requireClient();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback({
      session: mapAuthSession(session),
      user: mapAuthUser(session?.user),
    });
  });

  return () => {
    subscription.unsubscribe();
  };
}

export async function signInWithEmail({
  email,
  password,
}: AuthCredentials): Promise<{ session: AuthSession; user: AuthUser }> {
  const supabase = requireClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error || !data.session || !data.user) {
    throw new AuthServiceError(error?.message ?? 'Unable to sign in.');
  }

  return {
    session: mapAuthSession(data.session)!,
    user: mapAuthUser(data.user)!,
  };
}

export async function signUpWithEmail({
  email,
  password,
  fullName,
}: RegisterPayload): Promise<{
  session: AuthSession | null;
  user: AuthUser | null;
  needsEmailConfirmation: boolean;
}> {
  const supabase = requireClient();
  const redirectTo = Linking.createURL('/');

  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: { full_name: fullName.trim() },
      emailRedirectTo: redirectTo,
    },
  });

  if (error) {
    throw new AuthServiceError(error.message);
  }

  const session = mapAuthSession(data.session);
  const user = mapAuthUser(data.user);

  return {
    session,
    user,
    needsEmailConfirmation: !session,
  };
}

export async function resetPasswordForEmail(email: string): Promise<void> {
  const supabase = requireClient();
  const redirectTo = Linking.createURL('auth/reset');

  const { error } = await supabase.auth.resetPasswordForEmail(
    email.trim().toLowerCase(),
    { redirectTo },
  );

  if (error) {
    throw new AuthServiceError(error.message);
  }
}

export async function signOut(): Promise<void> {
  const supabase = requireClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new AuthServiceError(error.message);
  }
}
