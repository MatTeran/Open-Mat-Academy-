import Link from 'next/link';

import {
  EmptyState,
  PageHeader,
  StatusBadge,
} from '@/components/ui/Primitives';
import { requirePlatformSession } from '@/lib/auth/session';
import { isDemoMode } from '@/lib/auth/permissions';
import { listAcademiesSummary } from '@/lib/services/overview';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function OnboardingPipelinePage() {
  await requirePlatformSession();
  const academies = await listAcademiesSummary();

  let rows: Array<{
    academyId: string;
    name: string;
    status: string;
    percent: number;
    nextAction: string | null;
  }> = academies.map((a) => ({
    academyId: a.id,
    name: a.name,
    status: 'configuring',
    percent: 20,
    nextAction: 'Complete onboarding milestones',
  }));

  if (!isDemoMode()) {
    try {
      const client = await createSupabaseServerClient();
      const { data } = await client
        .from('academy_onboarding')
        .select('academy_id, status, percent_complete, recommended_next_action');
      if (data) {
        const byId = new Map(data.map((row) => [String(row.academy_id), row]));
        rows = academies.map((academy) => {
          const onboarding = byId.get(academy.id);
          return {
            academyId: academy.id,
            name: academy.name,
            status: onboarding ? String(onboarding.status) : 'lead',
            percent: onboarding ? Number(onboarding.percent_complete ?? 0) : 0,
            nextAction: onboarding
              ? (onboarding.recommended_next_action as string | null)
              : 'Start onboarding',
          };
        });
      }
    } catch {
      // table may not exist until migration applied
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Academies"
        title="Onboarding pipeline"
        description="Track where each academy is in launch readiness."
        actions={
          <Link
            href="/onboarding/new"
            className="rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-panel"
          >
            Onboard academy
          </Link>
        }
      />

      {rows.length === 0 ? (
        <EmptyState
          title="No academies in pipeline"
          description="Provision an academy to begin tracking milestones."
        />
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <Link
              key={row.academyId}
              href={`/academies/${row.academyId}`}
              className="block rounded-card border border-line bg-panel p-5 shadow-soft hover:border-bronze/30"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-xl text-ink">{row.name}</p>
                  <p className="mt-1 text-sm text-mute">
                    {row.nextAction ?? 'No next action'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={row.status} />
                  <span className="text-sm font-semibold text-ink">{row.percent}%</span>
                </div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-ivory-2">
                <div
                  className="h-full rounded-full bg-bronze"
                  style={{ width: `${Math.min(100, Math.max(0, row.percent))}%` }}
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
