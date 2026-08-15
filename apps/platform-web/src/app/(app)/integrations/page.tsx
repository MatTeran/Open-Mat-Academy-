import Link from 'next/link';

import { PROVIDER_REGISTRY } from '@openmat/shared/integrations/providers';

import {
  EmptyState,
  PageHeader,
  StatusBadge,
} from '@/components/ui/Primitives';
import { requirePlatformSession } from '@/lib/auth/session';

export default async function PlatformIntegrationsPage() {
  await requirePlatformSession();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Platform"
        title="Integrations"
        description="Providers My Gi supports. Live Zendesk connect is gated until checkpoint approval — no fabricated connections."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {PROVIDER_REGISTRY.map((provider) => (
          <div
            key={provider.id}
            className="rounded-card border border-line bg-panel p-5 shadow-soft transition hover:shadow-lift"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-xl text-ink">{provider.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-mute">
                  {provider.category}
                </p>
              </div>
              <StatusBadge status={provider.availability} />
            </div>
            <p className="mt-3 text-sm leading-6 text-mute">{provider.description}</p>
            <div className="mt-5">
              {provider.connectable ? (
                <Link
                  href={`/integrations/${provider.id}`}
                  className="text-sm font-semibold text-bronze hover:text-bronze-soft"
                >
                  Configure →
                </Link>
              ) : provider.id === 'zendesk' ? (
                <p className="text-sm text-mute">
                  Connectable after checkpoint — awaiting approval (no live tokens).
                </p>
              ) : (
                <p className="text-sm text-mute">Coming soon</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <EmptyState
        title="Integration health"
        description="Connected academy counts and request charts appear after providers are live and events are recorded. Nothing is fabricated here."
      />
    </div>
  );
}
