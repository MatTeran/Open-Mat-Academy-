import { createAnnouncementAction } from '@/lib/actions/announcements';
import { getCoachWebData } from '@/lib/data';

export default async function NewAnnouncementPage({
  searchParams,
}: {
  searchParams: Promise<{ duplicate?: string }>;
}) {
  const { duplicate } = await searchParams;
  const data = getCoachWebData();
  const source = duplicate ? await data.announcements.getById(duplicate) : null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-gold">Comms</p>
        <h1 className="font-display text-3xl text-white">
          {source ? 'Duplicate announcement' : 'Create announcement'}
        </h1>
      </header>
      <form
        action={createAnnouncementAction}
        className="space-y-4 rounded-2xl border border-line bg-surface p-5 shadow-card"
      >
        <label className="block text-sm">
          <span className="text-mute">Title</span>
          <input
            name="title"
            required
            defaultValue={source?.title ?? ''}
            className="mt-1 w-full rounded-xl border border-line bg-elevated px-3 py-2 text-white"
          />
        </label>
        <label className="block text-sm">
          <span className="text-mute">Body</span>
          <textarea
            name="body"
            required
            rows={6}
            defaultValue={source?.body ?? ''}
            className="mt-1 w-full rounded-xl border border-line bg-elevated px-3 py-2 text-white"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-mute">Category</span>
            <select
              name="category"
              defaultValue={source?.category ?? 'general'}
              className="mt-1 w-full rounded-xl border border-line bg-elevated px-3 py-2 text-white"
            >
              <option value="general">General</option>
              <option value="schedule">Schedule</option>
              <option value="competition">Competition</option>
              <option value="promotion">Promotion</option>
              <option value="facility">Facility</option>
              <option value="urgent">Urgent</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-mute">Audience</span>
            <select
              name="audience"
              defaultValue={source?.audience ?? 'all'}
              className="mt-1 w-full rounded-xl border border-line bg-elevated px-3 py-2 text-white"
            >
              <option value="all">Entire academy</option>
              <option value="adults">Adults</option>
              <option value="kids">Kids</option>
              <option value="competitors">Competition team</option>
              <option value="coaches">Coaches</option>
            </select>
          </label>
        </div>
        <label className="block text-sm">
          <span className="text-mute">Schedule publish (optional)</span>
          <input
            name="scheduledAt"
            type="datetime-local"
            className="mt-1 w-full rounded-xl border border-line bg-elevated px-3 py-2 text-white"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-mute">
          <input type="checkbox" name="publish" /> Publish now
        </label>
        <label className="flex items-center gap-2 text-sm text-mute">
          <input type="checkbox" name="pushEnabled" /> Prepare push notification
        </label>
        <button
          type="submit"
          className="rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-ink"
        >
          Save announcement
        </button>
      </form>
    </div>
  );
}
