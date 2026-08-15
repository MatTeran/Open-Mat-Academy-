import Link from 'next/link';

import { PageHeader, SectionCard, UnavailableMetric } from '@/components/ui/Primitives';
import { requirePlatformSession } from '@/lib/auth/session';

export default async function IntegrationsDataPage() {
  await requirePlatformSession();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Data"
        title="Integrations"
        description="Connection health and request volume. Values appear only after live provider traffic — nothing fabricated."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <UnavailableMetric title="Connected academies" reason="No live connections yet." />
        <UnavailableMetric title="Healthy connections" reason="Awaiting provider traffic." />
        <UnavailableMetric title="API requests" reason="No integration logs recorded." />
        <UnavailableMetric title="Webhook success rate" reason="No deliveries yet." />
      </div>

      <SectionCard
        title="Provider adoption"
        action={
          <Link href="/integrations" className="text-sm text-bronze hover:underline">
            Provider catalog
          </Link>
        }
      >
        <p className="text-sm text-mute">
          Charts render when `integration_connections` and `integration_logs` contain real rows.
        </p>
      </SectionCard>
    </div>
  );
}
