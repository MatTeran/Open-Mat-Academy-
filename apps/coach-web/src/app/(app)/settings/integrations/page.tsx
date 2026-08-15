import Link from 'next/link';

import { PROVIDER_REGISTRY } from '@openmat/shared/integrations/providers';
import { canManageAcademy } from '@openmat/shared/auth/membership';

import { requireCoachSession } from '@/lib/auth/session';

export default async function IntegrationsSettingsPage() {
  const session = await requireCoachSession();
  const canManage = canManageAcademy(session.memberships, session.academyId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-white">Connect your tools</h2>
        <p className="mt-1 text-sm text-mute">
          Connect the software your academy already uses to My Gi. Credentials are sealed
          server-side and never returned to the browser.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {PROVIDER_REGISTRY.map((provider) => (
          <article
            key={provider.id}
            className="rounded-2xl border border-line bg-surface p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-xl text-white">{provider.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-wide text-mute">
                  {provider.category}
                </p>
              </div>
              <span className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-wide text-mute">
                {provider.availability.replace('_', ' ')}
              </span>
            </div>
            <p className="mt-3 text-sm text-mute">{provider.description}</p>
            <div className="mt-4">
              {provider.id === 'zendesk' ? (
                <p className="text-sm text-mute">
                  Not connected · Live connect awaits Command Center checkpoint approval.
                </p>
              ) : provider.id === 'custom_webhook' && canManage ? (
                <Link
                  href="/settings/integrations/webhooks"
                  className="text-sm text-gold-bright hover:underline"
                >
                  Configure →
                </Link>
              ) : provider.connectable && canManage ? (
                <button
                  type="button"
                  disabled
                  className="text-sm text-mute"
                  title="Connectable after provider adapter enablement"
                >
                  Connect
                </button>
              ) : (
                <p className="text-sm text-mute">Coming soon</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
