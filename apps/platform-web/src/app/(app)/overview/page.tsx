import Link from 'next/link';

import {
  EmptyState,
  KpiCard,
  PageHeader,
  SectionCard,
  StatusBadge,
  UnavailableMetric,
} from '@/components/ui/Primitives';
import { requirePlatformSession } from '@/lib/auth/session';
import {
  getOverviewMetrics,
  listAcademiesSummary,
} from '@/lib/services/overview';

function metricProps(metric: {
  available: boolean;
  value?: number;
  reason?: string;
}) {
  if (!metric.available) {
    return {
      value: '—',
      unavailable: true,
      hint: metric.reason,
    } as const;
  }
  return { value: metric.value ?? 0, unavailable: false } as const;
}

export default async function OverviewPage() {
  await requirePlatformSession();
  const [metrics, academies] = await Promise.all([
    getOverviewMetrics(),
    listAcademiesSummary(),
  ]);

  const attention = academies.filter((a) => a.status !== 'active').slice(0, 5);
  const recent = academies.slice(0, 6);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="My Gi"
        title="Overview"
        description="Operating snapshot for the My Gi platform — academies, people, and attention items."
        actions={
          <Link
            href="/onboarding/new"
            className="rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-panel hover:bg-ink-soft"
          >
            Onboard academy
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <KpiCard label="Organizations" href="/orgs" {...metricProps(metrics.organizations)} />
        <KpiCard label="Academies" href="/academies" {...metricProps(metrics.academies)} />
        <KpiCard label="Locations" href="/locations" {...metricProps(metrics.locations)} />
        <KpiCard label="Practitioners" href="/users" {...metricProps(metrics.practitioners)} />
        <KpiCard label="Coaches" href="/coaches" {...metricProps(metrics.coaches)} />
        <KpiCard label="Active academies" href="/academies" {...metricProps(metrics.activeAcademies)} />
        <KpiCard label="Trial academies" href="/subscriptions" {...metricProps(metrics.trialAcademies)} />
        <KpiCard label="Weekly active users" href="/data/engagement" {...metricProps(metrics.weeklyActiveUsers)} />
        <KpiCard label="Monthly active users" href="/data/engagement" {...metricProps(metrics.monthlyActiveUsers)} />
        <KpiCard label="MRR" href="/subscriptions" {...metricProps(metrics.mrr)} />
        <KpiCard label="ARR" href="/subscriptions" {...metricProps(metrics.arr)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Academies requiring attention"
          action={
            <Link href="/data/academy-health" className="text-sm text-bronze hover:underline">
              Health dashboard
            </Link>
          }
        >
          {attention.length === 0 ? (
            <p className="text-sm text-mute">No non-active academies in the current directory.</p>
          ) : (
            <ul className="divide-y divide-line">
              {attention.map((academy) => (
                <li key={academy.id} className="flex items-center justify-between py-3">
                  <div>
                    <Link href={`/academies/${academy.id}`} className="font-medium text-ink hover:text-bronze">
                      {academy.name}
                    </Link>
                    <p className="text-xs text-mute">{academy.organizationName}</p>
                  </div>
                  <StatusBadge status={academy.status} />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="Directory snapshot"
          action={
            <Link href="/onboarding" className="text-sm text-bronze hover:underline">
              Onboarding pipeline
            </Link>
          }
        >
          {recent.length === 0 ? (
            <EmptyState
              title="No academies yet"
              description="Provision the first academy to start monitoring platform health."
              action={
                <Link href="/onboarding/new" className="text-sm font-semibold text-bronze">
                  Start onboarding →
                </Link>
              }
            />
          ) : (
            <ul className="divide-y divide-line">
              {recent.map((academy) => (
                <li key={academy.id} className="flex items-center justify-between py-3">
                  <div>
                    <Link href={`/academies/${academy.id}`} className="font-medium text-ink hover:text-bronze">
                      {academy.name}
                    </Link>
                    <p className="text-xs text-mute">{academy.organizationName}</p>
                  </div>
                  <StatusBadge status={academy.status} />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <UnavailableMetric
          title="Engagement charts"
          reason={
            metrics.weeklyActiveUsers.available
              ? 'Ready'
              : metrics.weeklyActiveUsers.reason
          }
        />
        <UnavailableMetric
          title="Revenue"
          reason={metrics.mrr.available ? 'Ready' : metrics.mrr.reason}
        />
      </div>
    </div>
  );
}
