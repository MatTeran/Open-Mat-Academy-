import Link from 'next/link';

import {
  archiveAnnouncementAction,
  publishAnnouncementAction,
} from '@/lib/actions/announcements';
import { getCoachWebData } from '@/lib/data';

export default async function AnnouncementsPage({
  searchParams,
}: {
  searchParams: Promise<{ focus?: string }>;
}) {
  const { focus } = await searchParams;
  const data = getCoachWebData();
  const items = await data.announcements.list(data.academyId);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Comms</p>
          <h1 className="font-display text-3xl text-white">Announcements</h1>
          <p className="text-sm text-mute">
            Draft, schedule, publish, archive — push delivery remains future-ready.
          </p>
        </div>
        <Link
          href="/announcements/new"
          className="rounded-xl bg-gold px-4 py-2 text-sm font-semibold text-ink"
        >
          Create announcement
        </Link>
      </header>

      <div className="space-y-3">
        {items.map((item) => (
          <article
            key={item.id}
            className={`rounded-2xl border bg-surface p-5 shadow-card ${
              focus === item.id ? 'border-gold' : 'border-line'
            }`}
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-mute">
                  {item.status} · {item.category} · {item.audience}
                </p>
                <h2 className="mt-1 text-lg text-white">{item.title}</h2>
                <p className="mt-2 text-sm text-mute">{item.body}</p>
                <p className="mt-2 text-xs text-mute">
                  {item.authorName} · updated{' '}
                  {new Date(item.updatedAt).toLocaleString()}
                  {item.pushEnabled ? ' · push prepared' : ''}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.status !== 'published' ? (
                  <form action={publishAnnouncementAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <button
                      type="submit"
                      className="rounded-lg border border-gold/40 px-3 py-2 text-sm text-gold-bright"
                    >
                      Publish
                    </button>
                  </form>
                ) : null}
                <form action={archiveAnnouncementAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <button
                    type="submit"
                    className="rounded-lg border border-line px-3 py-2 text-sm text-mute"
                  >
                    Archive
                  </button>
                </form>
                <Link
                  href={`/announcements/new?duplicate=${item.id}`}
                  className="rounded-lg border border-line px-3 py-2 text-sm text-mute"
                >
                  Duplicate
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
