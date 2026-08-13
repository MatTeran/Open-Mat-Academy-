import { redirect } from 'next/navigation';

import { BrandMark, SignInButton } from '@/components/auth/AuthActions';
import { isDemoMode } from '@/lib/auth/permissions';
import { getPlatformSession } from '@/lib/auth/session';

export default async function LoginPage() {
  const session = await getPlatformSession();
  if (session) {
    redirect('/orgs');
  }

  return (
    <div className="relative flex min-h-screen items-center px-6">
      <div className="mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <section>
          <BrandMark />
          <h1 className="mt-8 max-w-xl font-display text-5xl leading-tight text-ink md:text-6xl">
            Operate every academy from one directory.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-mute">
            My Gi Command Center manages organizations, academies, locations, and
            owner assignment — separate from Coach Web mission control.
          </p>
        </section>
        <section className="rounded-2xl border border-line bg-panel/90 p-8 shadow-[0_20px_60px_rgba(20,32,26,0.08)]">
          <h2 className="font-display text-2xl text-ink">Platform sign in</h2>
          <p className="mt-3 text-sm leading-6 text-mute">
            Access requires a `platform_admins` row. Academy owner/coach roles are
            not enough.
          </p>
          <div className="mt-8">
            {isDemoMode() ? (
              <>
                <SignInButton />
                <p className="mt-4 text-xs text-mute">
                  Demo mode uses in-memory tenant fixtures for local review.
                </p>
              </>
            ) : (
              <p className="rounded-lg border border-line bg-canvas px-4 py-3 text-sm text-mute">
                Configure Supabase env keys and seed a platform admin to enable
                live auth.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
