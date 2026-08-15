import { canManageAcademy } from '@openmat/shared/auth/membership';

import { requireCoachSession } from '@/lib/auth/session';
import {
  deactivateLocationAction,
  saveLocationAction,
} from '@/lib/settings/actions';
import { listLocations } from '@/lib/settings/academySettingsStore';

export default async function LocationsSettingsPage() {
  const session = await requireCoachSession();
  const canManage = canManageAcademy(session.memberships, session.academyId);
  const locations = listLocations(session.academyId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-white">Locations</h2>
        <p className="mt-1 text-sm text-mute">
          Create and deactivate locations. Historical operational data remains intact after
          deactivation.
        </p>
      </div>

      <ul className="space-y-3">
        {locations.map((loc) => (
          <li key={loc.id} className="rounded-2xl border border-line bg-surface p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-white">
                  {loc.name}{' '}
                  {!loc.active ? (
                    <span className="text-xs uppercase tracking-wide text-mute">(inactive)</span>
                  ) : null}
                </p>
                <p className="mt-1 text-sm text-mute">
                  {[loc.address, loc.city, loc.state].filter(Boolean).join(', ') || 'No address'} ·{' '}
                  {loc.timezone}
                </p>
              </div>
              {canManage && loc.active ? (
                <form action={deactivateLocationAction}>
                  <input type="hidden" name="id" value={loc.id} />
                  <button type="submit" className="text-sm text-mute hover:text-white">
                    Deactivate
                  </button>
                </form>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {canManage ? (
        <form action={saveLocationAction} className="space-y-3 rounded-2xl border border-line bg-surface p-5">
          <h3 className="font-display text-lg text-white">Add location</h3>
          <input
            name="name"
            required
            placeholder="Location name"
            className="w-full rounded-xl border border-line bg-elevated px-3 py-2 text-sm text-white"
          />
          <input
            name="address"
            placeholder="Address"
            className="w-full rounded-xl border border-line bg-elevated px-3 py-2 text-sm text-white"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="city"
              placeholder="City"
              className="rounded-xl border border-line bg-elevated px-3 py-2 text-sm text-white"
            />
            <input
              name="state"
              placeholder="State"
              className="rounded-xl border border-line bg-elevated px-3 py-2 text-sm text-white"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="phone"
              placeholder="Phone"
              className="rounded-xl border border-line bg-elevated px-3 py-2 text-sm text-white"
            />
            <input
              name="email"
              placeholder="Email"
              className="rounded-xl border border-line bg-elevated px-3 py-2 text-sm text-white"
            />
          </div>
          <input
            name="timezone"
            defaultValue="America/Los_Angeles"
            className="w-full rounded-xl border border-line bg-elevated px-3 py-2 text-sm text-white"
          />
          <button
            type="submit"
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-ink"
          >
            Create location
          </button>
        </form>
      ) : null}
    </div>
  );
}
