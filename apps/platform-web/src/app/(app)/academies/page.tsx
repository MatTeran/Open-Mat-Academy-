import Link from 'next/link';

import {
  EmptyState,
  PageHeader,
  StatusBadge,
} from '@/components/ui/Primitives';
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
            className="rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-panel"
          >
            Onboard academy
          </Link>
        }
      />

      {academies.length === 0 ? (
        <EmptyState
          title="No academies"
          description="Use the onboarding wizard to provision the first academy."
        />
      ) : (
        <div className="overflow-hidden rounded-card border border-line bg-panel shadow-soft">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line bg-ivory text-[11px] uppercase tracking-[0.12em] text-mute">
              <tr>
                <th className="px-4 py-3 font-semibold">Academy</th>
                <th className="px-4 py-3 font-semibold">Organization</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {academies.map((academy) => (
                <tr key={academy.id} className="hover:bg-ivory/60">
                  <td className="px-4 py-3">
                    <Link
                      href={`/academies/${academy.id}`}
                      className="font-medium text-ink hover:text-bronze"
                    >
                      {academy.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-mute">
                    <Link href={`/orgs/${academy.organizationId}`} className="hover:text-ink">
                      {academy.organizationName}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={academy.status} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-mute">{academy.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
