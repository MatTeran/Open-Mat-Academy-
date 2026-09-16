'use client';

import Link from 'next/link';

import { demoSignIn, demoSignOut } from '@/lib/auth/actions';

export function SignInButton() {
  return (
    <form action={demoSignIn}>
      <button
        type="submit"
        className="rounded-xl bg-gold px-5 py-3 font-semibold text-ink transition hover:bg-gold-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright"
      >
        Continue as Coach Rivera
      </button>
    </form>
  );
}

export function SignOutButton() {
  return (
    <form action={demoSignOut}>
      <button
        type="submit"
        className="rounded-lg px-3 py-2 text-sm text-mute transition hover:bg-elevated hover:text-white"
      >
        Sign out
      </button>
    </form>
  );
}

export function BrandMark({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="font-display text-xl tracking-[0.18em] text-gold">
      MY GI
    </Link>
  );
}
