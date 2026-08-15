import { canManageAcademy } from '@openmat/shared/auth/membership';
import { PROVIDER_REGISTRY } from '@openmat/shared/integrations/providers';

import { requireCoachSession } from '@/lib/auth/session';
import { listLocations } from '@/lib/settings/academySettingsStore';

export default async function SecuritySettingsPage() {
  const session = await requireCoachSession();
  const canManage = canManageAcademy(session.memberships, session.academyId);
  const locations = listLocations(session.academyId);
  const managers = session.memberships.filter((m) =>
    ['owner', 'admin', 'manager'].includes(m.role),
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-white">Security Center</h2>
        <p className="mt-1 text-sm text-mute">
          Administrators, integration connections, and revoke actions — never raw secrets.
        </p>
      </div>

      <section className="rounded-2xl border border-line bg-surface p-5">
        <h3 className="font-display text-lg text-white">Active administrators</h3>
        <ul className="mt-3 divide-y divide-line">
          {managers.map((m) => (
            <li key={m.id} className="flex justify-between py-2 text-sm">
              <span className="font-mono text-xs text-mute">{m.userId}</span>
              <span className="capitalize text-white">{m.role}</span>
            </li>
          ))}
          {managers.length === 0 ? (
            <li className="py-2 text-sm text-mute">No manager-tier memberships in session.</li>
          ) : null}
        </ul>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-5">
        <h3 className="font-display text-lg text-white">Integration connections</h3>
        <p className="mt-1 text-sm text-mute">No live connections. Zendesk gated until approval.</p>
        <ul className="mt-3 space-y-2">
          {PROVIDER_REGISTRY.filter((p) => p.availability !== 'coming_soon').map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between rounded-xl border border-line bg-elevated px-3 py-2 text-sm"
            >
              <span className="text-white">{p.name}</span>
              <span className="text-mute">Not connected</span>
            </li>
          ))}
        </ul>
        {canManage ? (
          <p className="mt-3 text-xs text-mute">
            Revoke / rotate actions appear after a connection exists.
          </p>
        ) : null}
      </section>

      <section className="rounded-2xl border border-line bg-surface p-5">
        <h3 className="font-display text-lg text-white">Webhook endpoints</h3>
        <p className="mt-1 text-sm text-mute">
          Schema ready (`webhook_endpoints`). Delivery worker lands after checkpoint.
        </p>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-5">
        <h3 className="font-display text-lg text-white">API clients</h3>
        <p className="mt-1 text-sm text-mute">
          Foundation table `api_clients` exists. Keys are hashed; full key shown once at creation
          (post-checkpoint).
        </p>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-5">
        <h3 className="font-display text-lg text-white">Locations in scope</h3>
        <p className="mt-1 text-sm text-mute">
          {locations.filter((l) => l.active).length} active ·{' '}
          {locations.filter((l) => !l.active).length} inactive
        </p>
      </section>
    </div>
  );
}
