import Link from 'next/link';

import { createOrganizationAction } from '@/lib/actions/tenants';
import { requirePlatformSession } from '@/lib/auth/session';
import { getTenantDirectory } from '@/lib/data/tenantDirectory';

export default async function OrganizationsPage() {
  const session = await requirePlatformSession();
  const orgs = await (await getTenantDirectory()).listOrganizations();

  return (
    <div className="space-y-10">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-moss">Directory</p>
        <h1 className="mt-2 font-display text-4xl text-ink">Organizations</h1>
        <p className="mt-3 text-sm leading-6 text-mute">
          Top-level My Gi tenants. Each organization may contain one or more academies.
        </p>
      </header>

      <ul className="divide-y divide-line border-y border-line">
        {orgs.map((org) => (
          <li key={org.id}>
            <Link
              href={`/orgs/${org.id}`}
              className="flex items-baseline justify-between gap-4 py-5 transition hover:bg-panel/70"
            >
              <div>
                <p className="font-display text-2xl text-ink">{org.name}</p>
                <p className="mt-1 text-sm text-mute">
                  {org.slug} · {org.status}
                </p>
              </div>
              <span className="text-sm text-pine">Open →</span>
            </Link>
          </li>
        ))}
      </ul>

      {session.canMutateTenants ? (
        <section className="max-w-xl">
          <h2 className="font-display text-2xl text-ink">Create organization</h2>
          <form action={createOrganizationAction} className="mt-4 space-y-3">
            <input
              name="name"
              required
              placeholder="Organization name"
              className="w-full rounded-md border border-line bg-panel px-3 py-2 text-sm"
            />
            <input
              name="slug"
              required
              placeholder="slug-example"
              className="w-full rounded-md border border-line bg-panel px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-md bg-pine px-4 py-2 text-sm font-semibold text-panel hover:bg-moss"
            >
              Create organization
            </button>
          </form>
        </section>
      ) : null}
    </div>
  );
}
