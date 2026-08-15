import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getProviderMeta } from '@openmat/shared/integrations/providers';

import { PageHeader, StatusBadge, UnavailableMetric } from '@/components/ui/Primitives';
import { requirePlatformSession } from '@/lib/auth/session';

export default async function ProviderDetailPage({
  params,
}: {
  params: Promise<{ providerId: string }>;
}) {
  await requirePlatformSession();
  const { providerId } = await params;
  const provider = getProviderMeta(providerId);
  if (!provider) notFound();

  return (
    <div className="space-y-6">
      <p>
        <Link href="/integrations" className="text-sm text-mute hover:text-ink">
          ← Integrations
        </Link>
      </p>
      <PageHeader
        eyebrow={provider.category}
        title={provider.name}
        description={provider.description}
        actions={<StatusBadge status={provider.availability} />}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <UnavailableMetric
          title="Connected academies"
          reason="No live connections until a provider adapter is enabled and academies connect."
        />
        <UnavailableMetric
          title="Requests today"
          reason="Integration request metrics require live provider traffic."
        />
      </div>

      {provider.id === 'zendesk' ? (
        <div className="rounded-card border border-line bg-panel p-5 shadow-soft">
          <h2 className="font-display text-xl text-ink">Checkpoint gate</h2>
          <p className="mt-2 text-sm leading-6 text-mute">
            Zendesk OAuth / API token connect is intentionally disabled until you approve the
            Phase 2 checkpoint. Credential vault and provider adapter interfaces are ready.
          </p>
        </div>
      ) : null}

      {provider.id === 'custom_webhook' ? (
        <div className="rounded-card border border-line bg-panel p-5 shadow-soft">
          <h2 className="font-display text-xl text-ink">Custom webhooks</h2>
          <p className="mt-2 text-sm leading-6 text-mute">
            Academy owners configure outbound endpoints under Academy Settings → Integrations.
            Signing secrets are sealed via the credential vault and never returned to the browser.
          </p>
        </div>
      ) : null}
    </div>
  );
}
