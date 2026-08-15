import Link from 'next/link';

import { PROVIDER_REGISTRY } from '@openmat/shared/integrations/providers';
import { canManageAcademy } from '@openmat/shared/auth/membership';

import { requireCoachSession } from '@/lib/auth/session';
import {
  getAcademyBranding,
  getAcademyProfile,
  listLocations,
  listMedia,
} from '@/lib/settings/academySettingsStore';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-line bg-elevated p-4">
      <p className="text-xs uppercase tracking-wide text-mute">{label}</p>
      <p className="mt-1 font-display text-2xl text-white">{value}</p>
    </article>
  );
}

export default async function SettingsOverviewPage() {
  const session = await requireCoachSession();
  const canManage = canManageAcademy(session.memberships, session.academyId);
  const profile = getAcademyProfile(session.academyId, session.academyName);
  const branding = getAcademyBranding(session.academyId, session.academyName);
  const locations = listLocations(session.academyId);
  const media = listMedia(session.academyId).filter((m) => m.status === 'active');
  const connectable = PROVIDER_REGISTRY.filter((p) => p.connectable || p.id === 'zendesk');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-white">Overview</h2>
        <p className="mt-1 text-sm text-mute">
          Academy-level mission control for configuration health.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Profile" value={profile.email || profile.phone ? 'Ready' : 'Incomplete'} />
        <Stat
          label="Locations"
          value={`${locations.filter((l) => l.active).length} active`}
        />
        <Stat label="Branding" value={branding.workflowStatus} />
        <Stat label="Media assets" value={String(media.length)} />
      </div>

      <section className="rounded-2xl border border-line bg-surface p-5">
        <h3 className="font-display text-lg text-white">Quick links</h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {[
            ['/settings/profile', 'Edit academy profile'],
            ['/settings/branding', 'Open Branding Studio'],
            ['/settings/media', 'Media Library'],
            ['/settings/integrations', 'Connect tools'],
            ['/settings/security', 'Security Center'],
          ].map(([href, label]) => (
            <li key={href}>
              <Link href={href} className="text-sm text-gold-bright hover:underline">
                {label} →
              </Link>
            </li>
          ))}
        </ul>
        {!canManage ? (
          <p className="mt-4 text-xs text-mute">Changes require owner/manager role.</p>
        ) : null}
      </section>

      <section className="rounded-2xl border border-line bg-surface p-5">
        <h3 className="font-display text-lg text-white">Integrations snapshot</h3>
        <p className="mt-1 text-sm text-mute">
          No fabricated connections. Zendesk connect awaits platform checkpoint approval.
        </p>
        <ul className="mt-4 space-y-2">
          {connectable.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between rounded-xl border border-line bg-elevated px-3 py-2 text-sm"
            >
              <span className="text-white">{p.name}</span>
              <span className="text-mute">
                {p.id === 'zendesk' ? 'Awaiting approval' : p.availability}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
