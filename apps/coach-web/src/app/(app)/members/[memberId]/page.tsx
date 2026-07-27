import Link from 'next/link';
import { notFound } from 'next/navigation';

import { WebBeltBadge } from '@/components/development/WebBeltBadge';
import { getCoachWebData } from '@/lib/data';

const TABS = [
  'overview',
  'attendance',
  'development',
  'competition',
  'notes',
  'activity',
] as const;

export default async function MemberProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ memberId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { memberId } = await params;
  const { tab: rawTab } = await searchParams;
  const tab = TABS.includes(rawTab as (typeof TABS)[number])
    ? (rawTab as (typeof TABS)[number])
    : 'overview';

  const data = getCoachWebData();
  const profile = await data.members.getById(memberId);
  if (!profile) {
    notFound();
  }
  const development = await data.development.getByMemberId(memberId);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6 shadow-card lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Member</p>
          <h1 className="font-display text-3xl text-white">{profile.fullName}</h1>
          <p className="text-sm text-mute">
            {profile.email}
            {profile.phone ? ` · ${profile.phone}` : ''}
          </p>
          <p className="mt-2 text-sm capitalize text-mute">
            {profile.membershipPlan} · {profile.membershipStatus}
          </p>
        </div>
        {development ? (
          <WebBeltBadge
            belt={development.development.belt}
            stripes={development.development.stripes}
          />
        ) : null}
      </header>

      <nav className="flex flex-wrap gap-2" aria-label="Member sections">
        {TABS.map((item) => (
          <Link
            key={item}
            href={`/members/${memberId}?tab=${item}`}
            className={`rounded-xl px-3 py-2 text-sm capitalize ${
              tab === item
                ? 'bg-gold/15 text-gold-bright'
                : 'border border-line text-mute hover:text-white'
            }`}
          >
            {item === 'notes' ? 'Coach Notes' : item}
          </Link>
        ))}
      </nav>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <section className="space-y-4">
          {tab === 'overview' ? (
            <Card title="Overview">
              <p className="text-sm text-mute">
                Journey {profile.journey.levelLabel} · {profile.journey.totalClasses}{' '}
                classes · Member since {profile.journey.memberSince}
              </p>
              <p className="mt-2 text-sm text-mute">
                Attendance {profile.trainingStats.attendanceRate}% · Streak{' '}
                {profile.trainingStats.currentStreakDays}d
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Meta label="Emergency" value={profile.emergencyContact?.name ?? '—'} />
                <Meta
                  label="Waivers"
                  value={
                    profile.waivers.every((w) => w.status === 'valid')
                      ? 'Valid'
                      : 'Needs attention'
                  }
                />
              </div>
            </Card>
          ) : null}

          {tab === 'attendance' ? (
            <Card title="Recent Classes">
              <ul className="space-y-2 text-sm">
                {profile.recentClasses.map((item) => (
                  <li key={`${item.id}-${item.date}`} className="text-mute">
                    {item.title} · {item.date} · {item.status}
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          {tab === 'development' ? (
            <Card title="Member Development">
              {development ? (
                <div className="space-y-4">
                  <WebBeltBadge
                    belt={development.development.belt}
                    stripes={development.development.stripes}
                  />
                  <p className="text-sm text-mute">
                    Promoted {development.development.promotionDate ?? '—'} by{' '}
                    {development.development.promotedByName ?? '—'} ·{' '}
                    {development.summary.timeAtCurrentBeltLabel} at belt
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/members/${memberId}/add-stripe`}
                      className="rounded-xl border border-gold/40 px-3 py-2 text-sm text-gold-bright"
                    >
                      Add Stripe
                    </Link>
                    <Link
                      href={`/members/${memberId}/promote-belt`}
                      className="rounded-xl bg-gold px-3 py-2 text-sm font-semibold text-ink"
                    >
                      Promote Belt
                    </Link>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm text-white">Promotion history</h3>
                    <ul className="space-y-2">
                      {development.history.map((entry) => (
                        <li key={entry.id} className="text-sm text-mute">
                          {entry.type === 'belt'
                            ? `${entry.belt} belt`
                            : `${entry.stripe} stripe(s)`}{' '}
                          · {entry.date} · {entry.coachName}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-mute">No development record.</p>
              )}
            </Card>
          ) : null}

          {tab === 'competition' ? (
            <Card title="Competition">
              {development?.competition ? (
                <div className="grid gap-3 sm:grid-cols-2 text-sm text-mute">
                  <Meta label="Rule set" value={development.competition.preferredRuleSet} />
                  <Meta label="Division" value={development.competition.division} />
                  <Meta label="Weight" value={development.competition.weightClass} />
                  <Meta label="Team" value={development.competition.teamStatus} />
                </div>
              ) : (
                <p className="text-sm text-mute">No competition profile.</p>
              )}
              <h3 className="mb-2 mt-4 text-sm text-white">Results</h3>
              <ul className="space-y-2 text-sm text-mute">
                {profile.competitionHistory.map((item) => (
                  <li key={item.id}>
                    {item.eventName} · {item.result} · {item.date}
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          {tab === 'notes' ? (
            <Card title="Private Coach Notes">
              <p className="mb-3 text-xs text-mute">
                Never visible in the Member app.
              </p>
              <ul className="space-y-3">
                {(development?.notes ?? profile.coachNotes).map((note) => (
                  <li key={note.id} className="rounded-xl border border-line bg-elevated p-3">
                    <p className="text-sm text-white">{note.body}</p>
                    <p className="mt-1 text-xs text-mute">
                      {note.authorName} · {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          {tab === 'activity' ? (
            <Card title="Achievements">
              <ul className="space-y-2 text-sm text-mute">
                {profile.achievements.map((item) => (
                  <li key={item.id}>
                    {item.title} · {item.earnedAt}
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
        </section>

        <aside className="space-y-4">
          <Card title="Quick links">
            <div className="flex flex-col gap-2 text-sm">
              <Link href={`/members/${memberId}?tab=development`} className="text-gold">
                Open development
              </Link>
              <Link href="/schedule" className="text-gold">
                Schedule
              </Link>
              <Link href="/announcements" className="text-gold">
                Announcements
              </Link>
            </div>
          </Card>
          {development ? (
            <Card title="Academy roles">
              <ul className="space-y-1 text-sm text-mute">
                {development.roles.length === 0 ? (
                  <li>None assigned</li>
                ) : (
                  development.roles.map((role) => (
                    <li key={role.id}>{role.role.replaceAll('_', ' ')}</li>
                  ))
                )}
              </ul>
            </Card>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-card">
      <h2 className="mb-3 font-display text-lg text-white">{title}</h2>
      {children}
    </section>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-mute">{label}</p>
      <p className="text-sm capitalize text-white">{value}</p>
    </div>
  );
}
