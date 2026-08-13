import Link from 'next/link';
import { notFound } from 'next/navigation';

import { assignOwnerAction } from '@/lib/actions/tenants';
import { requirePlatformSession } from '@/lib/auth/session';
import { getTenantDirectory } from '@/lib/data/tenantDirectory';

export default async function AcademyDetailPage({
  params,
}: {
  params: Promise<{ academyId: string }>;
}) {
  const { academyId } = await params;
  const session = await requirePlatformSession();
  const directory = getTenantDirectory();
  const academy = await directory.getAcademy(academyId);
  if (!academy) notFound();

  const [org, locations, memberships] = await Promise.all([
    directory.getOrganization(academy.organizationId),
    directory.listLocationsByAcademy(academy.id),
    directory.listMembershipsByAcademy(academy.id),
  ]);

  return (
    <div className="space-y-10">
      <header>
        <Link
          href={`/orgs/${academy.organizationId}`}
          className="text-sm text-mute hover:text-ink"
        >
          ← {org?.name ?? 'Organization'}
        </Link>
        <h1 className="mt-3 font-display text-4xl text-ink">{academy.name}</h1>
        <p className="mt-2 text-sm text-mute">
          {academy.id} · {academy.status}
        </p>
      </header>

      <section>
        <h2 className="font-display text-2xl text-ink">Locations</h2>
        <ul className="mt-4 space-y-3">
          {locations.map((location) => (
            <li key={location.id} className="border-b border-line pb-3">
              <p className="font-medium text-ink">{location.name}</p>
              <p className="text-sm text-mute">
                {[location.city, location.state].filter(Boolean).join(', ') ||
                  'No city set'}{' '}
                · {location.timezone}
              </p>
            </li>
          ))}
          {locations.length === 0 ? (
            <li className="text-sm text-mute">No locations yet.</li>
          ) : null}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-2xl text-ink">Memberships</h2>
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {memberships.map((row) => (
            <li
              key={row.id}
              className="flex items-baseline justify-between gap-4 py-3 text-sm"
            >
              <span className="font-mono text-ink">{row.userId}</span>
              <span className="uppercase tracking-wide text-moss">{row.role}</span>
            </li>
          ))}
          {memberships.length === 0 ? (
            <li className="py-3 text-sm text-mute">No memberships yet.</li>
          ) : null}
        </ul>
      </section>

      {session.canMutateTenants ? (
        <section className="max-w-xl">
          <h2 className="font-display text-2xl text-ink">Assign academy owner</h2>
          <p className="mt-2 text-sm text-mute">
            Writes `academy_memberships.role = owner` for an existing auth user id.
          </p>
          <form action={assignOwnerAction} className="mt-4 space-y-3">
            <input type="hidden" name="academyId" value={academy.id} />
            <input
              name="userId"
              required
              placeholder="auth user uuid"
              className="w-full rounded-md border border-line bg-panel px-3 py-2 font-mono text-sm"
            />
            <button
              type="submit"
              className="rounded-md bg-pine px-4 py-2 text-sm font-semibold text-panel hover:bg-moss"
            >
              Assign owner
            </button>
          </form>
        </section>
      ) : null}
    </div>
  );
}
