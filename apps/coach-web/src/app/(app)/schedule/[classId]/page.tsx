import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  cancelClassAction,
  updateAttendanceStatusAction,
} from '@/lib/actions/schedule';
import { getCoachWebData } from '@/lib/data';

export default async function ClassRosterPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  const data = getCoachWebData();
  const classItem = await data.classes.getById(classId);
  if (!classItem) {
    notFound();
  }
  const roster = await data.attendance.getRoster(classId);
  const all = await data.attendance.listByClass(classId);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Roster</p>
          <h1 className="font-display text-3xl text-white">{classItem.title}</h1>
          <p className="text-sm text-mute">
            {classItem.date} · {classItem.startTime}–{classItem.endTime} ·{' '}
            {classItem.instructorName}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/check-in?classId=${classId}`}
            className="rounded-xl bg-gold px-3 py-2 text-sm font-semibold text-ink"
          >
            Start Check-In
          </Link>
          <Link
            href={`/schedule/${classId}/edit`}
            className="rounded-xl border border-line px-3 py-2 text-sm text-mute"
          >
            Edit
          </Link>
          <form action={cancelClassAction}>
            <input type="hidden" name="classId" value={classId} />
            <button
              type="submit"
              className="rounded-xl border border-red-500/40 px-3 py-2 text-sm text-red-300"
            >
              Cancel class
            </button>
          </form>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['Reserved', roster.reserved.length],
          ['Checked in', roster.checkedIn.length],
          ['Waitlist', roster.waitlist.length],
          ['Absent', roster.absent.length],
        ].map(([label, value]) => (
          <div
            key={String(label)}
            className="rounded-2xl border border-line bg-surface p-4 shadow-card"
          >
            <p className="text-xs uppercase tracking-wide text-mute">{label}</p>
            <p className="font-display text-2xl text-white">{value}</p>
          </div>
        ))}
      </div>

      <section className="overflow-x-auto rounded-2xl border border-line bg-surface shadow-card">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-mute">
            <tr>
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Checked in</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {all.map((item) => (
              <tr key={item.id} className="border-t border-line/80">
                <td className="px-4 py-3">
                  {item.memberId ? (
                    <Link
                      href={`/members/${item.memberId}`}
                      className="text-white hover:text-gold"
                    >
                      {item.memberName}
                    </Link>
                  ) : (
                    <span className="text-white">{item.memberName}</span>
                  )}
                </td>
                <td className="px-4 py-3 capitalize text-mute">{item.status}</td>
                <td className="px-4 py-3 text-mute">
                  {item.checkedInAt
                    ? new Date(item.checkedInAt).toLocaleTimeString()
                    : '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {(['present', 'late', 'absent', 'waitlist', 'reserved'] as const).map(
                      (status) => (
                        <form key={status} action={updateAttendanceStatusAction}>
                          <input type="hidden" name="id" value={item.id} />
                          <input type="hidden" name="classId" value={classId} />
                          <input type="hidden" name="status" value={status} />
                          <button
                            type="submit"
                            className="text-xs text-gold disabled:opacity-30"
                            disabled={item.status === status}
                          >
                            {status}
                          </button>
                        </form>
                      ),
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
