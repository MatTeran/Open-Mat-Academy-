import { canManageAcademy } from '@openmat/shared/auth/membership';

import { requireCoachSession } from '@/lib/auth/session';
import { updateAcademyProfileAction } from '@/lib/settings/actions';
import { getAcademyProfile } from '@/lib/settings/academySettingsStore';

export default async function AcademyProfilePage() {
  const session = await requireCoachSession();
  const canManage = canManageAcademy(session.memberships, session.academyId);
  const profile = getAcademyProfile(session.academyId, session.academyName);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-white">Academy Profile</h2>
        <p className="mt-1 text-sm text-mute">
          Public contact and identity for {session.academyName}. Scoped to your academy only.
        </p>
      </div>

      <form action={updateAcademyProfileAction} className="space-y-4 rounded-2xl border border-line bg-surface p-5">
        <Field label="Display name" name="name" defaultValue={profile.name} disabled={!canManage} />
        <label className="block space-y-1 text-sm">
          <span className="text-mute">Description</span>
          <textarea
            name="description"
            rows={4}
            defaultValue={profile.description}
            disabled={!canManage}
            className="w-full rounded-xl border border-line bg-elevated px-3 py-2 text-white disabled:opacity-60"
          />
        </label>
        <Field label="Website" name="website" defaultValue={profile.website} disabled={!canManage} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone" name="phone" defaultValue={profile.phone} disabled={!canManage} />
          <Field label="Email" name="email" defaultValue={profile.email} disabled={!canManage} />
        </div>
        <Field label="Tagline" name="tagline" defaultValue={profile.tagline} disabled={!canManage} />
        <Field label="Timezone" name="timezone" defaultValue={profile.timezone} disabled={!canManage} />
        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label="Instagram"
            name="instagram"
            defaultValue={profile.socialLinks.instagram ?? ''}
            disabled={!canManage}
          />
          <Field
            label="Facebook"
            name="facebook"
            defaultValue={profile.socialLinks.facebook ?? ''}
            disabled={!canManage}
          />
          <Field
            label="YouTube"
            name="youtube"
            defaultValue={profile.socialLinks.youtube ?? ''}
            disabled={!canManage}
          />
        </div>
        {canManage ? (
          <button
            type="submit"
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-gold-bright"
          >
            Save profile
          </button>
        ) : null}
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  disabled,
}: {
  label: string;
  name: string;
  defaultValue: string;
  disabled: boolean;
}) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="text-mute">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        disabled={disabled}
        className="w-full rounded-xl border border-line bg-elevated px-3 py-2 text-white disabled:opacity-60"
      />
    </label>
  );
}
