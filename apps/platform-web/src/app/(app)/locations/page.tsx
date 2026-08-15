import Link from 'next/link';

import {
  EmptyState,
  PageHeader,
  StatusBadge,
} from '@/components/ui/Primitives';
import { requirePlatformSession } from '@/lib/auth/session';
import { getTenantDirectory } from '@/lib/data/tenantDirectory';
import { listAcademiesSummary } from '@/lib/services/overview';

export default async function LocationsPage() {
  await requirePlatformSession();
  const academies = await listAcademiesSummary();
  const directory = await getTenantDirectory();

  const rows = [];
  for (const academy of academies) {
    const locations = await directory.listLocationsByAcademy(academy.id);
    for (const location of locations) {
      rows.push({
        ...location,
        academyName: academy.name,
        organizationName: academy.organizationName,
      });
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Academies"
        title="Locations"
        description="Physical sites across the My Gi academy network."
      />

      {rows.length === 0 ? (
        <EmptyState
          title="No locations"
          description="Locations appear when academies are provisioned with a site."
        />
      ) : (
        <div className="overflow-hidden rounded-card border border-line bg-panel shadow-soft">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line bg-ivory text-[11px] uppercase tracking-[0.12em] text-mute">
              <tr>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">Academy</th>
                <th className="px-4 py-3 font-semibold">City</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((location) => (
                <tr key={location.id} className="hover:bg-ivory/60">
                  <td className="px-4 py-3 font-medium text-ink">{location.name}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/academies/${location.academyId}`}
                      className="text-mute hover:text-bronze"
                    >
                      {location.academyName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-mute">
                    {[location.city, location.state].filter(Boolean).join(', ') || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={location.isActive ? 'active' : 'suspended'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
