import Link from 'next/link';
import { notFound } from 'next/navigation';

import { createAcademyAction } from '@/lib/actions/tenants';
import {
  EmptyState,
  PageHeader,
  StatusBadge,
} from '@/components/ui/Primitives';
import { requirePlatformSession } from '@/lib/auth/session';
import { getTenantDirectory } from '@/lib/data/tenantDirectory';

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const session = await requirePlatformSession();
  const directory = await getTenantDirectory();
  const org = await directory.getOrganization(orgId);
  if (!org) notFound();

  const academies = await directory.listAcademiesByOrg(org.id);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Organization"
        title={org.name}
        description={`${org.slug} · ${org.id}`}
        actions={<StatusBadge status={org.status} />}
      />
      <p>
        <Link href="/orgs" className="text-sm text-mute hover:text-ink">
          ← Organizations
        </Link>
      </p>

      <section className="rounded-card border border-line bg-panel shadow-soft">
        <div className="border-b border-line px-5 py-4">
          <h2 className="font-display text-xl text-ink">Academies</h2>
        </div>
        {academies.length === 0 ? (
          <div className="p-5">
            <EmptyState title="No academies" description="Add an academy to this organization." />
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {academies.map((academy) => (
              <li key={academy.id}>
                <Link
                  href={`/academies/${academy.id}`}
                  className="flex items-center justify-between px-5 py-4 hover:bg-ivory/70"
                >
                  <div>
                    <p className="font-medium text-ink">{academy.name}</p>
                    <p className="text-sm text-mute">{academy.slug ?? 'no-slug'}</p>
                  </div>
                  <StatusBadge status={academy.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {session.canMutateTenants ? (
        <section className="max-w-xl rounded-card border border-line bg-panel p-5 shadow-soft">
          <h2 className="font-display text-xl text-ink">Add academy</h2>
          <form action={createAcademyAction} className="mt-4 space-y-3">
            <input type="hidden" name="organizationId" value={org.id} />
            <input
              name="name"
              required
              placeholder="Academy name"
              className="w-full rounded-lg border border-line bg-ivory px-3 py-2 text-sm"
            />
            <input
              name="slug"
              required
              placeholder="academy-slug"
              className="w-full rounded-lg border border-line bg-ivory px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-panel"
            >
              Create academy
            </button>
          </form>
          <p className="mt-3 text-xs text-mute">
            Prefer the full wizard at{' '}
            <Link href="/onboarding/new" className="text-bronze hover:underline">
              /onboarding/new
            </Link>{' '}
            for location + owner + plan.
          </p>
        </section>
      ) : null}
    </div>
  );
}
