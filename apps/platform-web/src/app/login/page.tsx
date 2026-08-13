import { redirect } from 'next/navigation';

import {
  BrandMark,
  LiveSignInForm,
  SignInButton,
} from '@/components/auth/AuthActions';
import { isDemoMode } from '@/lib/auth/permissions';
import { getPlatformSession } from '@/lib/auth/session';

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const session = await getPlatformSession();
  if (session) {
    redirect('/orgs');
  }

  const params = (await searchParams) ?? {};
  const demo = isDemoMode();

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
            owner assignment — wired to the same Supabase tenant tables as Coach
            and Member apps.
          </p>
        </section>
        <section className="rounded-2xl border border-line bg-panel/90 p-8 shadow-[0_20px_60px_rgba(20,32,26,0.08)]">
          <h2 className="font-display text-2xl text-ink">Platform sign in</h2>
          <p className="mt-3 text-sm leading-6 text-mute">
            Access requires a `platform_admins` row. Academy owner/coach roles are
            not enough.
          </p>
          <div className="mt-8">
            {demo ? (
              <>
                <SignInButton />
                <p className="mt-4 text-xs text-mute">
                  Demo mode (in-memory fixtures). Set Supabase env keys and
                  `NEXT_PUBLIC_PLATFORM_WEB_DEMO=0` for live data.
                </p>
              </>
            ) : (
              <>
                <LiveSignInForm error={params.error} />
                <p className="mt-4 text-xs text-mute">
                  Live mode reads organizations, academies, locations, and
                  memberships from Supabase.
                </p>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
