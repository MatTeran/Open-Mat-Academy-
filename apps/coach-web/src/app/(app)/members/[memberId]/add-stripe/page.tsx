import { notFound } from 'next/navigation';

import { WebBeltBadge } from '@/components/development/WebBeltBadge';
import { addStripeAction } from '@/lib/actions/development';
import { getCoachWebData } from '@/lib/data';

export default async function AddStripePage({
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

  const fromStripe = bundle.development.stripes;
  const options = [1, 2, 3, 4].filter((value) => value > fromStripe);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-gold">Promotion</p>
        <h1 className="font-display text-3xl text-white">Add Stripe</h1>
        <p className="text-sm text-mute">
          Guided workflow — no direct edits. Coach confirmation required.
        </p>
      </header>

      <section className="rounded-2xl border border-line bg-surface p-5 shadow-card space-y-4">
        <p className="text-sm text-white">{profile.fullName}</p>
        <WebBeltBadge belt={bundle.development.belt} stripes={fromStripe} />
        <form action={addStripeAction} className="space-y-4">
          <input type="hidden" name="memberId" value={memberId} />
          <input type="hidden" name="fromStripe" value={fromStripe} />
          <label className="block text-sm">
            <span className="text-mute">New stripe</span>
            <select
              name="toStripe"
              required
              className="mt-1 w-full rounded-xl border border-line bg-elevated px-3 py-2 text-white"
              defaultValue={options[0]}
            >
              {options.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-mute">Date</span>
            <input
              name="date"
              type="date"
              required
              defaultValue={new Date().toISOString().slice(0, 10)}
              className="mt-1 w-full rounded-xl border border-line bg-elevated px-3 py-2 text-white"
            />
          </label>
          <label className="block text-sm">
            <span className="text-mute">Private notes</span>
            <textarea
              name="notes"
              rows={3}
              className="mt-1 w-full rounded-xl border border-line bg-elevated px-3 py-2 text-white"
            />
          </label>
          <button
            type="submit"
            disabled={options.length === 0}
            className="rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-ink disabled:opacity-40"
          >
            Confirm stripe
          </button>
        </form>
      </section>
    </div>
  );
}
