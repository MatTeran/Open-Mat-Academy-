import Link from 'next/link';

import { SignOutButton } from '@/components/auth/AuthActions';
import type { PlatformSession } from '@/lib/auth/permissions';

export function AppShell({
  session,
  children,
}: {
  session: PlatformSession;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-line/80 bg-panel/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-end justify-between gap-6 px-6 py-5">
          <div>
            <Link href="/orgs" className="font-display text-3xl text-pine">
              My Gi
            </Link>
            <p className="mt-1 text-sm text-mute">
              Platform directory · {session.user.fullName} · {session.platformRole}
            </p>
          </div>
          <nav className="flex items-center gap-5">
            <Link href="/orgs" className="text-sm font-medium text-ink hover:text-pine">
              Organizations
            </Link>
            <SignOutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
