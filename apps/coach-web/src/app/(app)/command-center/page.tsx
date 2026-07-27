import Link from 'next/link';

import { getCoachWebData } from '@/lib/data';

function Panel({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-lg text-white">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function actionHref(
  actionId: string,
  entityId?: string,
): string {
  switch (actionId) {
    case 'viewMember':
    case 'messageMember':
      return entityId ? `/members/${entityId}` : '/members';
    case 'manageClass':
    case 'approveWaitlist':
      return entityId ? `/schedule/${entityId}` : '/schedule';
    case 'publishAnnouncement':
      return entityId ? `/announcements?focus=${entityId}` : '/announcements';
    default:
      return '/command-center';
  }
}

export default async function CommandCenterPage() {
  const data = getCoachWebData();
  const center = await data.commandCenter.getCommandCenter();
  const today = new Date().toISOString().slice(0, 10);
  const todaysClasses = await data.classes.list({ date: today });

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">Mission Control</p>
        <h1 className="font-display text-3xl text-white md:text-4xl">
          Command Center
        </h1>
        <p className="max-w-2xl text-sm text-mute">
          What needs your attention right now — not a spreadsheet of vanity metrics.
        </p>
      </header>

      <Panel title="Academy Pulse">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {center.pulse.map((metric) => (
            <article
              key={metric.id}
              className="rounded-xl border border-line bg-elevated p-4"
            >
              <div
                className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold"
                style={{ backgroundColor: `${metric.tint}22`, color: metric.tint }}
              >
                ●
              </div>
              <p className="text-xs uppercase tracking-wide text-mute">
                {metric.label}
              </p>
              <p className="mt-1 font-display text-2xl text-white">{metric.value}</p>
              {metric.trendLabel ? (
                <p className="mt-1 text-xs text-mute">{metric.trendLabel}</p>
              ) : null}
            </article>
          ))}
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Needs Attention">
          <ul className="space-y-3">
            {center.attention.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-3 rounded-xl border border-line bg-elevated p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="text-xs text-mute">{item.subtitle}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wide text-gold">
                    {item.priority}
                  </p>
                </div>
                <Link
                  href={actionHref(item.actionId, item.entityId)}
                  className="inline-flex rounded-lg border border-gold/40 px-3 py-2 text-sm text-gold-bright transition hover:bg-gold/10"
                >
                  {item.actionLabel}
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-6">
          <Panel title="Member Momentum">
            <ul className="space-y-3">
              {center.momentum.map((card) => (
                <li key={card.id} className="rounded-xl border border-line bg-elevated p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-white">{card.memberName}</p>
                      <p className="font-medium text-gold-bright">{card.headline}</p>
                      <p className="text-xs text-mute">{card.detail}</p>
                    </div>
                    <Link
                      href={`/members/${card.memberId}`}
                      className="text-xs text-gold"
                    >
                      View
                    </Link>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink">
                    <div
                      className="h-full rounded-full bg-gold"
                      style={{ width: `${card.progressPercent}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Quick Commands">
            <div className="grid grid-cols-2 gap-2">
              {center.quickCommands.map((command) => {
                const href =
                  command.id === 'createAnnouncement'
                    ? '/announcements/new'
                    : command.id === 'startCheckIn'
                      ? '/check-in'
                      : command.id === 'createClass'
                        ? '/schedule/new'
                        : command.id === 'manageMembers'
                          ? '/members'
                          : '/command-center';
                return (
                  <Link
                    key={command.id}
                    href={href}
                    className="rounded-xl border border-line bg-elevated px-3 py-3 text-sm text-white transition hover:border-gold/40"
                  >
                    {command.label}
                  </Link>
                );
              })}
            </div>
          </Panel>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel
          title="Today's Classes"
          action={
            <Link href="/schedule" className="text-sm text-gold">
              Open schedule
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-mute">
                <tr>
                  <th className="pb-2 pr-4 font-medium">Time</th>
                  <th className="pb-2 pr-4 font-medium">Class</th>
                  <th className="pb-2 pr-4 font-medium">Instructor</th>
                  <th className="pb-2 pr-4 font-medium">Gi</th>
                  <th className="pb-2 pr-4 font-medium">Cap</th>
                  <th className="pb-2 pr-4 font-medium">In</th>
                  <th className="pb-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {todaysClasses.map((item) => (
                  <tr key={item.id} className="border-t border-line/80">
                    <td className="py-3 pr-4 text-mute">{item.startTime}</td>
                    <td className="py-3 pr-4 text-white">{item.title}</td>
                    <td className="py-3 pr-4 text-mute">{item.instructorName}</td>
                    <td className="py-3 pr-4 text-mute">
                      {item.giType === 'gi' ? 'Gi' : 'No-Gi'}
                    </td>
                    <td className="py-3 pr-4 text-mute">
                      {item.reservedCount}/{item.capacity}
                    </td>
                    <td className="py-3 pr-4 text-mute">{item.checkedInCount}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/schedule/${item.id}`}
                          className="text-xs text-gold"
                        >
                          Roster
                        </Link>
                        <Link
                          href={`/check-in?classId=${item.id}`}
                          className="text-xs text-gold"
                        >
                          Check-In
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Live Activity">
          <ul className="space-y-3">
            {center.liveFeed.map((item) => (
              <li key={item.id} className="rounded-xl border border-line bg-elevated p-4">
                <p className="text-sm text-white">{item.title}</p>
                <p className="text-xs text-mute">
                  {item.subtitle} · {new Date(item.timestamp).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Analytics Snapshots">
        <div className="grid gap-3 md:grid-cols-2">
          {center.snapshots.map((snap) => (
            <article
              key={snap.id}
              className="rounded-xl border border-line bg-elevated p-4"
            >
              <p className="text-xs uppercase tracking-wide text-mute">{snap.label}</p>
              <p className="mt-1 font-display text-2xl text-white">{snap.value}</p>
              <p className="text-xs text-mute">{snap.helper}</p>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  );
}
