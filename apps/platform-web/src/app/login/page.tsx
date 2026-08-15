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
    redirect('/overview');
  }

  const params = (await searchParams) ?? {};
  const demo = isDemoMode();

  return (
    <div className="relative flex min-h-screen items-center px-6">
      <div className="mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <section>
          <BrandMark />
          <h1 className="mt-8 max-w-xl font-display text-5xl leading-tight text-ink md:text-6xl">
            Operate the My Gi network from one command center.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-mute">
            Onboard academies, monitor health, manage plans and branding, and support
            gyms — without opening Supabase for day-to-day operations.
          </p>
        </section>
        <section className="rounded-card border border-line bg-panel p-8 shadow-soft">
          <h2 className="font-display text-2xl text-ink">Platform sign in</h2>
          <p className="mt-3 text-sm leading-6 text-mute">
            Access requires a `platform_admins` row. Academy owner or coach roles are
            never enough.
          </p>
          <div className="mt-8">
            {demo ? (
              <>
                <SignInButton />
                <p className="mt-4 text-xs text-mute">
                  Demo mode uses in-memory fixtures. Set Supabase keys and
                  `NEXT_PUBLIC_PLATFORM_WEB_DEMO=0` for live tenant data.
                </p>
              </>
            ) : (
              <>
                <LiveSignInForm error={params.error} />
                <p className="mt-4 text-xs text-mute">
                  Live mode reads the shared My Gi tenant tables used by Coach and Member apps.
                </p>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
