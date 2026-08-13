'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { SESSION_COOKIE } from './session';
import { isDemoMode } from './permissions';

export async function demoSignIn() {
  if (!isDemoMode()) {
    throw new Error('Demo sign-in is disabled when Supabase is configured.');
  }
  const jar = await cookies();
  jar.set(SESSION_COOKIE, '1', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
  redirect('/orgs');
}

export async function demoSignOut() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect('/login');
}
