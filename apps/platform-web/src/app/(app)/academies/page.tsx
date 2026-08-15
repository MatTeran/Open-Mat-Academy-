import Link from 'next/link';

import { AcademiesDataTable } from '@/components/academies/AcademiesDataTable';
import { PageHeader } from '@/components/ui/Primitives';
import { requirePlatformSession } from '@/lib/auth/session';
import { listAcademiesSummary } from '@/lib/services/overview';

export default async function AcademiesPage() {
  await requirePlatformSession();
  const academies = await listAcademiesSummary();

  return (
    <div>
      <PageHeader
        eyebrow="Academies"
        title="Academies"
        description="Every academy on the My Gi platform across organizations."
        actions={
          <Link
            href="/onboarding/new"
            className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-panel"
          >
            Onboard academy
          </Link>
        }
      />
      <AcademiesDataTable rows={academies} />
    </div>
  );
}
