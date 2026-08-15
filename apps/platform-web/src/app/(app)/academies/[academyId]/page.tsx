import Link from 'next/link';
import { notFound } from 'next/navigation';

import { assignOwnerAction } from '@/lib/actions/tenants';
import { AcademyDetailWorkspace } from '@/components/academies/AcademyDetailWorkspace';
import { PageHeader, StatusBadge } from '@/components/ui/Primitives';
import { requirePlatformSession } from '@/lib/auth/session';
import { getTenantDirectory } from '@/lib/data/tenantDirectory';

export default async function AcademyDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ academyId: string }>;
  searchParams?: Promise<{ provisioned?: string }>;
}) {
  const { academyId } = await params;
  const query = (await searchParams) ?? {};
  const session = await requirePlatformSession();
  const directory = await getTenantDirectory();
  const academy = await directory.getAcademy(academyId);
  if (!academy) notFound();

  const [org, locations, memberships] = await Promise.all([
    directory.getOrganization(academy.organizationId),
    directory.listLocationsByAcademy(academy.id),
    directory.listMembershipsByAcademy(academy.id),
  ]);

  const assignOwnerSlot = session.canMutateTenants ? (
    <section className="sm:col-span-3 max-w-xl rounded-card border border-line bg-panel p-5 shadow-soft">
      <h2 className="font-display text-xl text-ink">Assign academy owner</h2>
      <p className="mt-2 text-sm text-mute">
        Writes `academy_memberships.role = owner` for an existing auth user id.
      </p>
      <form action={assignOwnerAction} className="mt-4 space-y-3">
        <input type="hidden" name="academyId" value={academy.id} />
        <input
          name="userId"
          required
          placeholder="auth user uuid"
          className="w-full rounded-lg border border-line bg-ivory px-3 py-2 font-mono text-sm"
        />
        <button
          type="submit"
          className="rounded-xl bg-bronze px-4 py-2 text-sm font-semibold text-panel"
        >
          Assign owner
        </button>
      </form>
    </section>
  ) : null;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Academy"
        title={academy.name}
        description={`${academy.id} · org ${org?.name ?? academy.organizationId}`}
        actions={<StatusBadge status={academy.status} />}
      />

      {query.provisioned === '1' ? (
        <p className="rounded-lg border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">
          Academy provisioned. Continue branding, staff invites, and schedule setup from the
          pipeline.
        </p>
      ) : null}

      <p className="flex flex-wrap gap-4 text-sm">
        <Link href={`/orgs/${academy.organizationId}`} className="text-mute hover:text-ink">
          ← Organization
        </Link>
        <Link href="/subscriptions" className="text-bronze hover:underline">
          Subscription
        </Link>
      </p>

      <AcademyDetailWorkspace
        academyId={academy.id}
        organizationId={academy.organizationId}
        locations={locations}
        memberships={memberships}
        assignOwnerSlot={assignOwnerSlot}
      />
    </div>
  );
}
