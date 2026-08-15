import Link from 'next/link';

import { SignOutButton } from '@/components/auth/AuthActions';
import { QuickAddMenu } from '@/components/layout/QuickAddMenu';
import { Sidebar } from '@/components/layout/Sidebar';
import type { PlatformSession } from '@/lib/auth/permissions';

export function AppShell({
  session,
  children,
}: {
  session: PlatformSession;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-ivory text-ink">
      <Sidebar
        operatorName={session.user.fullName ?? session.user.email}
        platformRole={session.platformRole}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-line bg-surface/90 px-6 py-3 backdrop-blur">
          <form action="/search" className="w-full max-w-lg">
            <input
              name="q"
              placeholder="Search academies, orgs, users…"
              className="w-full rounded-xl border border-line bg-panel px-3 py-2 text-sm outline-none ring-bronze focus:ring-1"
            />
          </form>
          <div className="flex items-center gap-3">
            <Link
              href="/notifications"
              className="rounded-lg border border-line px-3 py-2 text-sm text-mute hover:text-ink"
            >
              Alerts
            </Link>
            <QuickAddMenu />
            <SignOutButton />
          </div>
        </header>
        <main className="flex-1 px-6 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
