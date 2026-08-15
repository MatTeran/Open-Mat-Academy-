import Link from 'next/link';

import { provisionAcademyAction } from '@/lib/actions/provision';
import { OnboardingStepper } from '@/components/onboarding/OnboardingStepper';
import { PageHeader } from '@/components/ui/Primitives';
import { requirePlatformSession } from '@/lib/auth/session';
import { getTenantDirectory } from '@/lib/data/tenantDirectory';

export default async function OnboardAcademyPage() {
  const session = await requirePlatformSession();
  if (!session.canMutateTenants) {
    return (
      <PageHeader
        title="Onboard academy"
        description="Support role is read-only. Ask an ops or superadmin operator to provision academies."
      />
    );
  }

  const orgs = await (await getTenantDirectory()).listOrganizations();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Onboarding"
        title="Onboard academy"
        description="Create organization (optional), academy, location, owner membership, and trial plan without touching Supabase manually."
      />

      <OnboardingStepper activeIndex={0} />

      <p className="mb-6 rounded-xl border border-line bg-panel px-4 py-3 text-sm text-mute">
        Steps 1–5 are required for launch. Branding and Integrations are optional and never block
        academy launch.
      </p>

      <form
        action={provisionAcademyAction}
        className="space-y-8 rounded-card border border-line bg-panel p-6 shadow-soft"
      >
        <section className="space-y-3">
          <h2 className="font-display text-xl text-ink">1. Organization</h2>
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input type="radio" name="createOrg" value="true" defaultChecked />
            Create new organization
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input type="radio" name="createOrg" value="false" />
            Use existing organization
          </label>
          <input
            name="organizationName"
            placeholder="Organization name"
            className="w-full rounded-lg border border-line bg-ivory px-3 py-2 text-sm"
          />
          <input
            name="organizationSlug"
            placeholder="organization-slug (optional)"
            className="w-full rounded-lg border border-line bg-ivory px-3 py-2 text-sm"
          />
          <select
            name="organizationId"
            className="w-full rounded-lg border border-line bg-ivory px-3 py-2 text-sm"
            defaultValue=""
          >
            <option value="">Select existing org (if not creating)</option>
            {orgs.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl text-ink">2. Academy</h2>
          <input
            name="academyName"
            required
            placeholder="Academy name"
            className="w-full rounded-lg border border-line bg-ivory px-3 py-2 text-sm"
          />
          <input
            name="academySlug"
            placeholder="academy-slug (optional)"
            className="w-full rounded-lg border border-line bg-ivory px-3 py-2 text-sm"
          />
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl text-ink">3. Location</h2>
          <input
            name="locationName"
            required
            placeholder="Location name"
            className="w-full rounded-lg border border-line bg-ivory px-3 py-2 text-sm"
          />
          <input
            name="addressLine1"
            placeholder="Address"
            className="w-full rounded-lg border border-line bg-ivory px-3 py-2 text-sm"
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              name="city"
              placeholder="City"
              className="rounded-lg border border-line bg-ivory px-3 py-2 text-sm"
            />
            <input
              name="state"
              placeholder="State"
              className="rounded-lg border border-line bg-ivory px-3 py-2 text-sm"
            />
            <input
              name="postalCode"
              placeholder="ZIP"
              className="rounded-lg border border-line bg-ivory px-3 py-2 text-sm"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="country"
              defaultValue="United States"
              className="rounded-lg border border-line bg-ivory px-3 py-2 text-sm"
            />
            <input
              name="timezone"
              defaultValue="America/Los_Angeles"
              className="rounded-lg border border-line bg-ivory px-3 py-2 text-sm"
            />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl text-ink">4. Owner</h2>
          <input
            name="ownerUserId"
            placeholder="Existing auth user UUID"
            className="w-full rounded-lg border border-line bg-ivory px-3 py-2 font-mono text-sm"
          />
          <input
            name="ownerEmail"
            type="email"
            placeholder="Owner email (invite-by-email coming next)"
            className="w-full rounded-lg border border-line bg-ivory px-3 py-2 text-sm"
          />
          <p className="text-xs text-mute">
            Live mode currently requires an existing auth user UUID. Demo mode can assign any id
            string.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl text-ink">5. Plan</h2>
          <select
            name="planId"
            defaultValue="trial"
            className="w-full rounded-lg border border-line bg-ivory px-3 py-2 text-sm"
          >
            <option value="trial">Trial</option>
            <option value="starter">Starter</option>
            <option value="professional">Professional</option>
            <option value="academy_plus">Academy+</option>
            <option value="enterprise">Enterprise</option>
          </select>
          <p className="text-xs text-mute">
            Plan records are stored when the operations migration is applied. No payment is charged
            until Stripe is connected.
          </p>
        </section>

        <section className="space-y-3 rounded-xl border border-dashed border-line bg-ivory/60 p-4">
          <h2 className="font-display text-xl text-ink">8. Integrations (optional)</h2>
          <p className="text-sm text-mute">
            Connect Zendesk or custom webhooks after launch from Academy Settings. Skipping never
            blocks launch readiness.
          </p>
          <p className="text-sm text-mute">Connect now · Skip for later</p>
        </section>

        <div className="flex items-center justify-between border-t border-line pt-5">
          <Link href="/onboarding" className="text-sm text-mute hover:text-ink">
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-xl bg-bronze px-5 py-2.5 text-sm font-semibold text-panel shadow-soft hover:bg-bronze-soft"
          >
            Create academy
          </button>
        </div>
      </form>
    </div>
  );
}
