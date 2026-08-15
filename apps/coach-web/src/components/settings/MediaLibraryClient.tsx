'use client';

import { useState, useTransition } from 'react';

import {
  MEDIA_REQUIREMENTS,
  type MediaType,
} from '@openmat/shared/integrations/mediaValidation';

import {
  archiveMediaAction,
  registerMediaMetadataAction,
} from '@/lib/settings/actions';
import type { MediaAssetState } from '@/lib/settings/academySettingsStore';

export function MediaLibraryClient({
  assets,
  canManage,
}: {
  assets: MediaAssetState[];
  canManage: boolean;
}) {
  const [mediaType, setMediaType] = useState<MediaType>('academy_logo');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const req = MEDIA_REQUIREMENTS[mediaType];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-white">Media Library</h2>
        <p className="mt-1 text-sm text-mute">
          Academy-scoped assets. Validation runs server-side. Executable uploads are rejected.
        </p>
      </div>

      {canManage ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-5">
          <label className="block space-y-1 text-sm">
            <span className="text-mute">Media type</span>
            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value as MediaType)}
              className="w-full rounded-xl border border-line bg-elevated px-3 py-2 text-white"
            >
              {Object.entries(MEDIA_REQUIREMENTS).map(([id, meta]) => (
                <option key={id} value={id}>
                  {meta.label}
                </option>
              ))}
            </select>
          </label>
          <p className="mt-3 text-sm text-mute">
            Recommended: {req.recommended}. Max {Math.round(req.maxBytes / (1024 * 1024))} MB.
            Accepts PNG / JPG / WebP.
          </p>
          <input
            type="file"
            accept={req.accept.join(',')}
            className="mt-4 block w-full text-sm text-mute file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-semibold file:text-ink"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const fd = new FormData();
              fd.set('mediaType', mediaType);
              fd.set('fileName', file.name);
              fd.set('mimeType', file.type || 'application/octet-stream');
              fd.set('fileSize', String(file.size));
              startTransition(async () => {
                const result = await registerMediaMetadataAction(fd);
                if (!result.ok) setError(result.error);
                else setError(null);
              });
            }}
          />
          {pending ? <p className="mt-2 text-xs text-mute">Validating…</p> : null}
          {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}
          <p className="mt-3 text-xs text-mute">
            Demo registers metadata after validation. Live Storage upload attaches when Supabase
            credentials are configured for Coach Web.
          </p>
        </div>
      ) : null}

      <ul className="space-y-2">
        {assets.length === 0 ? (
          <li className="rounded-2xl border border-line bg-surface px-4 py-8 text-center text-sm text-mute">
            No media assets yet.
          </li>
        ) : (
          assets.map((asset) => (
            <li
              key={asset.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3"
            >
              <div>
                <p className="text-sm text-white">{asset.fileName}</p>
                <p className="text-xs text-mute">
                  {asset.mediaType} · {asset.mimeType} · {Math.round(asset.fileSize / 1024)} KB ·{' '}
                  {asset.status}
                </p>
              </div>
              {canManage && asset.status === 'active' ? (
                <form action={archiveMediaAction}>
                  <input type="hidden" name="id" value={asset.id} />
                  <button type="submit" className="text-sm text-mute hover:text-white">
                    Archive
                  </button>
                </form>
              ) : null}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
