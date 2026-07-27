'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { SESSION_COOKIE } from '@/lib/auth/session';

export async function demoSignIn() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, '1', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
  redirect('/command-center');
}

export async function demoSignOut() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect('/login');
}
