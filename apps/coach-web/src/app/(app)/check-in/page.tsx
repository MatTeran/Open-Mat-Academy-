import Link from 'next/link';

import { checkInAction } from '@/lib/actions/schedule';
import { getCoachWebData } from '@/lib/data';

export default async function CheckInPage({
  searchParams,
}: {
  searchParams: Promise<{ classId?: string; q?: string }>;
}) {
  const params = await searchParams;
  const data = getCoachWebData();
  const today = new Date().toISOString().slice(0, 10);
  const classes = await data.classes.list({ date: today });
  const classId = params.classId ?? classes[0]?.id;
  const selected = classId ? await data.classes.getById(classId) : null;
  const roster = classId ? await data.attendance.listByClass(classId) : [];
  const members = await data.members.list(params.q);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-gold">Operations</p>
        <h1 className="font-display text-3xl text-white">Check-In</h1>
        <p className="text-sm text-mute">
          Desktop roster check-in using the same attendance repository as Coach mobile.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {classes.map((item) => (
          <Link
            key={item.id}
            href={`/check-in?classId=${item.id}`}
            className={`rounded-xl px-3 py-2 text-sm ${
              item.id === classId
                ? 'bg-gold/15 text-gold-bright'
                : 'border border-line text-mute'
            }`}
          >
            {item.startTime} · {item.title}
          </Link>
        ))}
      </div>

      {selected ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-2xl border border-line bg-surface p-5 shadow-card">
            <h2 className="mb-3 font-display text-lg text-white">
              Manual check-in · {selected.title}
            </h2>
            <form className="mb-4" action="/check-in" method="get">
              <input type="hidden" name="classId" value={selected.id} />
              <input
                name="q"
                defaultValue={params.q ?? ''}
                placeholder="Search members"
                className="w-full rounded-xl border border-line bg-elevated px-3 py-2 text-sm text-white"
              />
            </form>
            <ul className="space-y-2">
              {members.map((member) => (
                <li
                  key={member.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-line bg-elevated px-3 py-2"
                >
                  <div>
                    <p className="text-sm text-white">{member.fullName}</p>
                    <p className="text-xs capitalize text-mute">
                      {member.belt} · {member.stripes} stripes
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <form action={checkInAction}>
                      <input type="hidden" name="classId" value={selected.id} />
                      <input type="hidden" name="memberId" value={member.id} />
                      <input type="hidden" name="memberName" value={member.fullName} />
                      <input type="hidden" name="status" value="present" />
                      <button type="submit" className="text-xs text-gold">
                        Check in
                      </button>
                    </form>
                    <form action={checkInAction}>
                      <input type="hidden" name="classId" value={selected.id} />
                      <input type="hidden" name="memberId" value={member.id} />
                      <input type="hidden" name="memberName" value={member.fullName} />
                      <input type="hidden" name="status" value="late" />
                      <button type="submit" className="text-xs text-gold">
                        Late
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
            <form action={checkInAction} className="mt-4 space-y-2 border-t border-line pt-4">
              <input type="hidden" name="classId" value={selected.id} />
              <input type="hidden" name="status" value="walk_in" />
              <input
                name="memberName"
                required
                placeholder="Walk-in / visitor name"
                className="w-full rounded-xl border border-line bg-elevated px-3 py-2 text-sm text-white"
              />
              <label className="flex items-center gap-2 text-xs text-mute">
                <input type="checkbox" name="isFirstVisit" /> First visit / visitor
              </label>
              <button
                type="submit"
                className="rounded-xl border border-gold/40 px-3 py-2 text-sm text-gold-bright"
              >
                Add walk-in
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-line bg-surface p-5 shadow-card">
            <h2 className="mb-3 font-display text-lg text-white">Current roster</h2>
            <ul className="space-y-2 text-sm">
              {roster.map((item) => (
                <li key={item.id} className="flex justify-between text-mute">
                  <span>{item.memberName}</span>
                  <span className="capitalize">{item.status}</span>
                </li>
              ))}
            </ul>
            <Link
              href={`/schedule/${selected.id}`}
              className="mt-4 inline-block text-sm text-gold"
            >
              Open full roster
            </Link>
          </section>
        </div>
      ) : (
        <p className="text-sm text-mute">No classes scheduled today.</p>
      )}
    </div>
  );
}
