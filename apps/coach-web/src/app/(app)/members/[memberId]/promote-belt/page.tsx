import { notFound } from 'next/navigation';

import { WebBeltBadge } from '@/components/development/WebBeltBadge';
import { promoteBeltAction } from '@/lib/actions/development';
import { getCoachWebData } from '@/lib/data';

const BELTS = ['white', 'blue', 'purple', 'brown', 'black'] as const;

export default async function PromoteBeltPage({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = await params;
  const data = getCoachWebData();
  const profile = await data.members.getById(memberId);
  const bundle = await data.development.getByMemberId(memberId);
  if (!profile || !bundle) {
    notFound();
  }

  const fromBelt = bundle.development.belt;
  const options = BELTS.filter((belt) => belt !== fromBelt);
  const suggested =
    BELTS[Math.min(BELTS.indexOf(fromBelt) + 1, BELTS.length - 1)] ?? 'blue';

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-gold">Promotion</p>
        <h1 className="font-display text-3xl text-white">Promote Belt</h1>
        <p className="text-sm text-mute">
          My Gi never auto-promotes. Attendance and XP are context only.
        </p>
      </header>

      <section className="rounded-2xl border border-line bg-surface p-5 shadow-card space-y-4">
        <p className="text-sm text-white">{profile.fullName}</p>
        <WebBeltBadge belt={fromBelt} stripes={bundle.development.stripes} />
        <form action={promoteBeltAction} className="space-y-4">
          <input type="hidden" name="memberId" value={memberId} />
          <input type="hidden" name="fromBelt" value={fromBelt} />
          <label className="block text-sm">
            <span className="text-mute">New belt</span>
            <select
              name="toBelt"
              required
              defaultValue={suggested === fromBelt ? options[0] : suggested}
              className="mt-1 w-full rounded-xl border border-line bg-elevated px-3 py-2 capitalize text-white"
            >
              {options.map((belt) => (
                <option key={belt} value={belt}>
                  {belt}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-mute">Promotion date</span>
            <input
              name="date"
              type="date"
              required
              defaultValue={new Date().toISOString().slice(0, 10)}
              className="mt-1 w-full rounded-xl border border-line bg-elevated px-3 py-2 text-white"
            />
          </label>
          <label className="block text-sm">
            <span className="text-mute">Optional notes</span>
            <textarea
              name="notes"
              rows={3}
              className="mt-1 w-full rounded-xl border border-line bg-elevated px-3 py-2 text-white"
            />
          </label>
          <fieldset className="space-y-2 text-sm text-mute">
            <legend className="mb-1 text-white">Options</legend>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="notifyMember" defaultChecked />
              Notify member
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="createAchievement" defaultChecked />
              Create achievement
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="postToCommunity" />
              Post to community
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="generateShareCard" />
              Generate share card (future)
            </label>
          </fieldset>
          <button
            type="submit"
            className="rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-ink"
          >
            Confirm promotion
          </button>
        </form>
      </section>
    </div>
  );
}
