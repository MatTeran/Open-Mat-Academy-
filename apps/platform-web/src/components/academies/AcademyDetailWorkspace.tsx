'use client';

import Link from 'next/link';
import { useState } from 'react';

import { StatusBadge } from '@/components/ui/Primitives';

type Location = {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  timezone: string;
};

type Membership = {
  id: string;
  userId: string;
  role: string;
};

const TABS = ['Overview', 'Locations', 'People', 'Branding', 'Integrations'] as const;

export function AcademyDetailWorkspace({
  academyId,
  organizationId,
  locations,
  memberships,
  assignOwnerSlot,
}: {
  academyId: string;
  organizationId: string;
  locations: Location[];
  memberships: Membership[];
  assignOwnerSlot?: React.ReactNode;
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Overview');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-line pb-3">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-lg px-3 py-1.5 text-sm transition ${
              tab === t ? 'bg-bronze/10 font-semibold text-bronze' : 'text-mute hover:text-ink'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Overview' ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <Metric label="Locations" value={String(locations.length)} />
          <Metric label="Memberships" value={String(memberships.length)} />
          <Metric label="Integrations" value="0" hint="No fabricated connections" />
          <p className="sm:col-span-3 text-sm text-mute">
            <Link href={`/orgs/${organizationId}`} className="text-bronze hover:underline">
              View organization
            </Link>
            {' · '}
            <Link href="/onboarding" className="text-bronze hover:underline">
              Onboarding pipeline
            </Link>
          </p>
          {assignOwnerSlot}
        </div>
      ) : null}

      {tab === 'Locations' ? (
        <ul className="space-y-3 rounded-card border border-line bg-panel p-4 shadow-soft">
          {locations.map((location) => (
            <li key={location.id} className="border-b border-line pb-3 last:border-0">
              <p className="font-medium text-ink">{location.name}</p>
              <p className="text-sm text-mute">
                {[location.city, location.state].filter(Boolean).join(', ') || 'No city set'} ·{' '}
                {location.timezone}
              </p>
            </li>
          ))}
          {locations.length === 0 ? (
            <li className="text-sm text-mute">No locations yet.</li>
          ) : null}
        </ul>
      ) : null}

      {tab === 'People' ? (
        <ul className="divide-y divide-line rounded-card border border-line bg-panel shadow-soft">
          {memberships.map((row) => (
            <li
              key={row.id}
              className="flex items-baseline justify-between gap-4 px-4 py-3 text-sm"
            >
              <span className="font-mono text-xs text-ink">{row.userId}</span>
              <StatusBadge status={row.role} />
            </li>
          ))}
          {memberships.length === 0 ? (
            <li className="px-4 py-3 text-sm text-mute">No memberships yet.</li>
          ) : null}
        </ul>
      ) : null}

      {tab === 'Branding' ? (
        <div className="rounded-card border border-line bg-panel p-5 shadow-soft">
          <p className="text-sm text-mute">
            Branding Studio lives in Coach Web → Academy Settings → Branding. Platform Media lists
            assets across tenants.
          </p>
          <Link href="/media" className="mt-3 inline-block text-sm font-semibold text-bronze">
            Open Media →
          </Link>
        </div>
      ) : null}

      {tab === 'Integrations' ? (
        <div className="rounded-card border border-line bg-panel p-5 shadow-soft">
          <p className="text-sm text-mute">
            Academy connections are academy-scoped. Platform catalog:{' '}
            <Link href="/integrations" className="text-bronze hover:underline">
              Integrations
            </Link>
            . Zendesk live connect is checkpoint-gated.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <article className="rounded-card border border-line bg-panel p-4 shadow-soft">
      <p className="text-xs uppercase tracking-[0.12em] text-mute">{label}</p>
      <p className="mt-1 font-display text-3xl text-ink">{value}</p>
      {hint ? <p className="mt-1 text-xs text-mute">{hint}</p> : null}
    </article>
  );
}
