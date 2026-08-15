'use client';

import { useMemo, useState, useTransition } from 'react';

import { validateBrandColors } from '@openmat/shared/integrations/brandContrast';

import {
  previewBrandingAction,
  publishBrandingAction,
  saveBrandingDraftAction,
} from '@/lib/settings/actions';
import type { AcademyBrandingState } from '@/lib/settings/academySettingsStore';

type Device = 'mobile' | 'tablet' | 'desktop';

export function BrandingStudio({
  branding,
  published,
  canManage,
  academyName,
}: {
  branding: AcademyBrandingState;
  published: AcademyBrandingState | null;
  canManage: boolean;
  academyName: string;
}) {
  const [device, setDevice] = useState<Device>('mobile');
  const [form, setForm] = useState({
    displayName: branding.displayName,
    locationDisplayText: branding.locationDisplayText,
    tagline: branding.tagline,
    primaryColor: branding.primaryColor,
    secondaryColor: branding.secondaryColor,
    accentColor: branding.accentColor,
  });
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const warnings = useMemo(
    () =>
      validateBrandColors({
        primaryColor: form.primaryColor,
        secondaryColor: form.secondaryColor,
        accentColor: form.accentColor,
      }),
    [form],
  );

  const previewWidth =
    device === 'mobile' ? 'max-w-[320px]' : device === 'tablet' ? 'max-w-[520px]' : 'max-w-full';

  function onChange(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-white">Branding Studio</h2>
          <p className="mt-1 text-sm text-mute">
            Draft → Preview → Publish. Draft edits never affect the live My Gi experience until
            publish.
          </p>
        </div>
        <p className="rounded-full border border-line px-3 py-1 text-xs uppercase tracking-wide text-mute">
          {branding.workflowStatus}
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <form
          className="space-y-4 rounded-2xl border border-line bg-surface p-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (!canManage) return;
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => fd.set(k, v));
            startTransition(async () => {
              const result = await saveBrandingDraftAction(fd);
              setMessage(
                result.warnings.length
                  ? `Draft saved with ${result.warnings.length} contrast warning(s).`
                  : 'Draft saved.',
              );
            });
          }}
        >
          <Field
            label="Display name"
            value={form.displayName}
            onChange={(v) => onChange('displayName', v)}
            disabled={!canManage}
          />
          <Field
            label="Location display"
            value={form.locationDisplayText}
            onChange={(v) => onChange('locationDisplayText', v)}
            disabled={!canManage}
          />
          <Field
            label="Tagline"
            value={form.tagline}
            onChange={(v) => onChange('tagline', v)}
            disabled={!canManage}
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <ColorField
              label="Primary"
              value={form.primaryColor}
              onChange={(v) => onChange('primaryColor', v)}
              disabled={!canManage}
            />
            <ColorField
              label="Secondary"
              value={form.secondaryColor}
              onChange={(v) => onChange('secondaryColor', v)}
              disabled={!canManage}
            />
            <ColorField
              label="Accent"
              value={form.accentColor}
              onChange={(v) => onChange('accentColor', v)}
              disabled={!canManage}
            />
          </div>

          {warnings.length > 0 ? (
            <ul className="space-y-1 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
              {warnings.map((w) => (
                <li key={`${w.field}-${w.message}`}>{w.message}</li>
              ))}
            </ul>
          ) : null}

          {canManage ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={pending}
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-ink disabled:opacity-60"
              >
                Save draft
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await previewBrandingAction();
                    setMessage('Preview mode set for draft.');
                  })
                }
                className="rounded-xl border border-line px-4 py-2 text-sm text-white"
              >
                Set preview
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await publishBrandingAction();
                    setMessage('Published — live experience updated.');
                  })
                }
                className="rounded-xl border border-gold/40 bg-gold/15 px-4 py-2 text-sm text-gold-bright"
              >
                Publish
              </button>
            </div>
          ) : null}
          {message ? <p className="text-sm text-mute">{message}</p> : null}
        </form>

        <div className="space-y-3">
          <div className="flex gap-2">
            {(['mobile', 'tablet', 'desktop'] as Device[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDevice(d)}
                className={`rounded-lg px-3 py-1.5 text-xs uppercase tracking-wide ${
                  device === d ? 'bg-gold/20 text-gold-bright' : 'text-mute'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className={`mx-auto w-full ${previewWidth}`}>
            <PreviewPanel
              title="Member Mobile Home"
              brand={form}
              academyFallback={academyName}
            />
          </div>
          <div className={`mx-auto hidden w-full gap-3 md:grid ${previewWidth} md:grid-cols-2`}>
            <PreviewPanel title="Coach Mobile" brand={form} academyFallback={academyName} compact />
            <PreviewPanel title="Coach Web" brand={form} academyFallback={academyName} compact />
          </div>

          <div className="rounded-xl border border-line bg-elevated p-3 text-xs text-mute">
            Live published:{' '}
            {published
              ? `${published.displayName} · ${published.accentColor}`
              : 'Nothing published yet — members still see platform defaults.'}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="text-mute">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-xl border border-line bg-elevated px-3 py-2 text-white disabled:opacity-60"
      />
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="text-mute">{label}</span>
      <div className="flex gap-2">
        <input
          type="color"
          value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : '#9A6735'}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="h-10 w-12 rounded border border-line bg-transparent"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full rounded-xl border border-line bg-elevated px-3 py-2 font-mono text-xs text-white disabled:opacity-60"
        />
      </div>
    </label>
  );
}

function PreviewPanel({
  title,
  brand,
  academyFallback,
  compact,
}: {
  title: string;
  brand: {
    displayName: string;
    locationDisplayText: string;
    tagline: string;
    primaryColor: string;
    accentColor: string;
  };
  academyFallback: string;
  compact?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-[#FAF9F6] shadow-card">
      <div
        className={`${compact ? 'h-16' : 'h-28'} w-full`}
        style={{
          background: `linear-gradient(135deg, ${brand.primaryColor}, ${brand.accentColor})`,
        }}
      />
      <div className="space-y-1 p-4 text-[#20201E]">
        <p className="text-[10px] uppercase tracking-[0.16em] text-[#6F6C66]">{title}</p>
        <p className="font-display text-xl" style={{ color: brand.primaryColor }}>
          {brand.displayName || academyFallback}
        </p>
        {brand.locationDisplayText ? (
          <p className="text-xs text-[#6F6C66]">{brand.locationDisplayText}</p>
        ) : null}
        {brand.tagline ? <p className="text-sm text-[#3A3936]">{brand.tagline}</p> : null}
        <button
          type="button"
          className="mt-2 rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
          style={{ backgroundColor: brand.accentColor }}
        >
          Primary action
        </button>
        <p className="pt-2 text-[10px] text-[#6F6C66]">
          My Gi chrome stays platform-controlled · preview uses live components, not screenshots
        </p>
      </div>
    </div>
  );
}
