'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { createSupabaseServerClient } from '@/lib/supabase/server';

import { isDemoMode } from './permissions';
import { SESSION_COOKIE } from './session';

export async function demoSignIn() {
  if (!isDemoMode()) {
    throw new Error('Demo sign-in is disabled when live Supabase mode is on.');
  }
  const jar = await cookies();
  jar.set(SESSION_COOKIE, '1', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
  redirect('/orgs');
}

export async function liveSignIn(formData: FormData) {
  if (isDemoMode()) {
    throw new Error('Live sign-in is disabled in demo mode.');
  }

  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  if (!email || !password) {
    redirect('/login?error=missing');
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect('/login?error=auth');
  }

  // Confirm platform allowlist before entering the app shell.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login?error=auth');
  }

  const { data: admin } = await supabase
    .from('platform_admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!admin) {
    await supabase.auth.signOut();
    redirect('/login?error=not_platform_admin');
  }

  redirect('/orgs');
}

export async function signOut() {
  if (isDemoMode()) {
    const jar = await cookies();
    jar.delete(SESSION_COOKIE);
    redirect('/login');
  }

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/login');
}

/** @deprecated use signOut */
export async function demoSignOut() {
  return signOut();
}
