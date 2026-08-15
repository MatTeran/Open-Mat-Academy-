import { SettingsNav } from '@/components/settings/SettingsNav';
import { requireCoachSession } from '@/lib/auth/session';
import { canManageAcademy } from '@openmat/shared/auth/membership';

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireCoachSession();
  const canManage = canManageAcademy(session.memberships, session.academyId);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">Academy Settings</p>
        <h1 className="font-display text-3xl text-white">{session.academyName}</h1>
        <p className="max-w-2xl text-sm text-mute">
          Self-service configuration for your academy. My Gi remains the platform brand —
          you own the academy experience.
        </p>
      </header>

      {!canManage ? (
        <p className="rounded-xl border border-line bg-elevated px-4 py-3 text-sm text-mute">
          Viewing settings requires owner or manager membership to make changes. Coaches can
          browse read-only where available.
        </p>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-line bg-surface p-3">
          <SettingsNav />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
