import Link from 'next/link';

import { createOrganizationAction } from '@/lib/actions/tenants';
import {
  EmptyState,
  PageHeader,
  StatusBadge,
} from '@/components/ui/Primitives';
import { requirePlatformSession } from '@/lib/auth/session';
import { getTenantDirectory } from '@/lib/data/tenantDirectory';

export default async function OrganizationsPage() {
  const session = await requirePlatformSession();
  const orgs = await (await getTenantDirectory()).listOrganizations();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Academies"
        title="Organizations"
        description="Top-level My Gi tenants. Each organization may contain one or more academies."
      />

      {orgs.length === 0 ? (
        <EmptyState
          title="No organizations"
          description="Create an organization or run the academy onboarding wizard."
        />
      ) : (
        <div className="overflow-hidden rounded-card border border-line bg-panel shadow-soft">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line bg-ivory text-[11px] uppercase tracking-[0.12em] text-mute">
              <tr>
                <th className="px-4 py-3 font-semibold">Organization</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orgs.map((org) => (
                <tr key={org.id} className="hover:bg-ivory/60">
                  <td className="px-4 py-3">
                    <Link href={`/orgs/${org.id}`} className="font-medium text-ink hover:text-bronze">
                      {org.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-mute">{org.slug}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={org.status} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-mute">{org.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {session.canMutateTenants ? (
        <section className="max-w-xl rounded-card border border-line bg-panel p-5 shadow-soft">
          <h2 className="font-display text-xl text-ink">Create organization</h2>
          <form action={createOrganizationAction} className="mt-4 space-y-3">
            <input
              name="name"
              required
              placeholder="Organization name"
              className="w-full rounded-lg border border-line bg-ivory px-3 py-2 text-sm"
            />
            <input
              name="slug"
              required
              placeholder="slug-example"
              className="w-full rounded-lg border border-line bg-ivory px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-panel hover:bg-ink-soft"
            >
              Create organization
            </button>
          </form>
        </section>
      ) : null}
    </div>
  );
}
