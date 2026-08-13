import Link from 'next/link';
import { notFound } from 'next/navigation';

import { createAcademyAction } from '@/lib/actions/tenants';
import { requirePlatformSession } from '@/lib/auth/session';
import { getTenantDirectory } from '@/lib/data/tenantDirectory';

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const session = await requirePlatformSession();
  const directory = getTenantDirectory();
  const org = await directory.getOrganization(orgId);
  if (!org) notFound();

  const academies = await directory.listAcademiesByOrg(org.id);

  return (
    <div className="space-y-10">
      <header>
        <Link href="/orgs" className="text-sm text-mute hover:text-ink">
          ← Organizations
        </Link>
        <h1 className="mt-3 font-display text-4xl text-ink">{org.name}</h1>
        <p className="mt-2 text-sm text-mute">
          {org.slug} · {org.status} · {org.id}
        </p>
      </header>

      <section>
        <h2 className="font-display text-2xl text-ink">Academies</h2>
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {academies.map((academy) => (
            <li key={academy.id}>
              <Link
                href={`/academies/${academy.id}`}
                className="flex items-baseline justify-between gap-4 py-4 hover:bg-panel/70"
              >
                <div>
                  <p className="text-lg font-semibold text-ink">{academy.name}</p>
                  <p className="text-sm text-mute">
                    {academy.slug ?? 'no-slug'} · {academy.status}
                  </p>
                </div>
                <span className="text-sm text-pine">Open →</span>
              </Link>
            </li>
          ))}
          {academies.length === 0 ? (
            <li className="py-4 text-sm text-mute">No academies yet.</li>
          ) : null}
        </ul>
      </section>

      {session.canMutateTenants ? (
        <section className="max-w-xl">
          <h2 className="font-display text-2xl text-ink">Add academy</h2>
          <form action={createAcademyAction} className="mt-4 space-y-3">
            <input type="hidden" name="organizationId" value={org.id} />
            <input
              name="name"
              required
              placeholder="Academy name"
              className="w-full rounded-md border border-line bg-panel px-3 py-2 text-sm"
            />
            <input
              name="slug"
              required
              placeholder="academy-slug"
              className="w-full rounded-md border border-line bg-panel px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-md bg-pine px-4 py-2 text-sm font-semibold text-panel hover:bg-moss"
            >
              Create academy
            </button>
          </form>
        </section>
      ) : null}
    </div>
  );
}
