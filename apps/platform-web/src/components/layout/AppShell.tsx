import Link from 'next/link';

import { SignOutButton } from '@/components/auth/AuthActions';
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
        <header className="flex items-center justify-between border-b border-line bg-panel/80 px-6 py-3 backdrop-blur">
          <form action="/search" className="w-full max-w-md">
            <input
              name="q"
              placeholder="Search academies, orgs, users…"
              className="w-full rounded-lg border border-line bg-ivory px-3 py-2 text-sm outline-none ring-bronze focus:ring-1"
            />
          </form>
          <div className="ml-4 flex items-center gap-4">
            <Link href="/onboarding/new" className="text-sm font-semibold text-bronze hover:text-bronze-soft">
              Onboard academy
            </Link>
            <SignOutButton />
          </div>
        </header>
        <main className="flex-1 px-6 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
