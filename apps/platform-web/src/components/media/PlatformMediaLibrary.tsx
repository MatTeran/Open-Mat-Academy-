'use client';

import { useMemo, useState } from 'react';

import {
  MEDIA_REQUIREMENTS,
  type MediaType,
} from '@openmat/shared/integrations/mediaValidation';

import { EmptyState, PageHeader, SectionCard } from '@/components/ui/Primitives';

type DemoAsset = {
  id: string;
  mediaType: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  academyId: string;
};

/** Platform media ops view — lists guidance + client-side demo filter; live query when connected. */
export function PlatformMediaLibrary({
  assets,
}: {
  assets: DemoAsset[];
}) {
  const [filter, setFilter] = useState<MediaType | 'all'>('all');
  const filtered = useMemo(
    () => (filter === 'all' ? assets : assets.filter((a) => a.mediaType === filter)),
    [assets, filter],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Platform"
        title="Media"
        description="Academy branding and media assets. Tenant isolation enforced by academy_id + RLS."
      />

      <SectionCard title="Upload requirements">
        <ul className="grid gap-3 sm:grid-cols-2">
          {(Object.keys(MEDIA_REQUIREMENTS) as MediaType[]).slice(0, 6).map((type) => {
            const req = MEDIA_REQUIREMENTS[type];
            return (
              <li key={type} className="rounded-xl border border-line bg-ivory px-3 py-2 text-sm">
                <p className="font-medium text-ink">{req.label}</p>
                <p className="text-mute">
                  {req.recommended} · max {Math.round(req.maxBytes / (1024 * 1024))} MB
                </p>
              </li>
            );
          })}
        </ul>
      </SectionCard>

      <div className="flex flex-wrap gap-2">
        <FilterChip active={filter === 'all'} onClick={() => setFilter('all')} label="All" />
        {(Object.keys(MEDIA_REQUIREMENTS) as MediaType[]).slice(0, 5).map((type) => (
          <FilterChip
            key={type}
            active={filter === type}
            onClick={() => setFilter(type)}
            label={MEDIA_REQUIREMENTS[type].label}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No media assets loaded"
          description="When connected to Supabase, platform admins list media_assets here. Academy owners upload via Coach Web → Settings → Media."
        />
      ) : (
        <div className="overflow-hidden rounded-card border border-line bg-panel shadow-soft">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line bg-ivory text-[11px] uppercase tracking-[0.12em] text-mute">
              <tr>
                <th className="px-4 py-3">File</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Academy</th>
                <th className="px-4 py-3">Size</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink">{row.fileName}</td>
                  <td className="px-4 py-3 text-mute">{row.mediaType}</td>
                  <td className="px-4 py-3 font-mono text-xs text-mute">{row.academyId}</td>
                  <td className="px-4 py-3 text-mute">{Math.round(row.fileSize / 1024)} KB</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs ${
        active ? 'bg-bronze text-panel' : 'border border-line text-mute hover:text-ink'
      }`}
    >
      {label}
    </button>
  );
}
