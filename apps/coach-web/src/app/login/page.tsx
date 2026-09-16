import { redirect } from 'next/navigation';

import { BrandMark, SignInButton } from '@/components/auth/AuthActions';
import { getCoachSession, memberBlockedMessage } from '@/lib/auth/session';
import { isDemoMode } from '@/lib/auth/permissions';

export default async function LoginPage() {
  const session = await getCoachSession();
  if (session) {
    redirect('/command-center');
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.12),_transparent_55%)]" />
      <div className="relative w-full max-w-md rounded-2xl border border-line bg-surface p-8 shadow-card">
        <BrandMark />
        <h1 className="mt-6 font-display text-3xl tracking-tight text-white">
          Coach Web
        </h1>
        <p className="mt-3 text-sm leading-6 text-mute">
          Desktop mission control for My Gi academies. Members cannot access
          this dashboard.
        </p>
        <div className="mt-8 space-y-4">
          {isDemoMode() ? (
            <>
              <SignInButton />
              <p className="text-xs text-mute">
                Demo mode uses shared memory repositories — same domain models as
                Coach mobile.
              </p>
            </>
          ) : (
            <p className="rounded-xl border border-line bg-elevated p-4 text-sm text-mute">
              Configure Supabase env keys to enable live authentication.
              {memberBlockedMessage(null)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
