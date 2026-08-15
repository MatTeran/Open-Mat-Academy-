'use server';

import { revalidatePath } from 'next/cache';

import { validateBrandColors } from '@openmat/shared/integrations/brandContrast';
import {
  validateMediaUpload,
  type MediaType,
} from '@openmat/shared/integrations/mediaValidation';
import { canManageAcademy } from '@openmat/shared/auth/membership';

import { requireCoachSession } from '@/lib/auth/session';
import {
  addMediaAsset,
  archiveMedia,
  deactivateLocation,
  publishBranding,
  saveAcademyProfile,
  saveBrandingDraft,
  setBrandingPreview,
  upsertLocation,
} from '@/lib/settings/academySettingsStore';

async function requireManager() {
  const session = await requireCoachSession();
  if (!canManageAcademy(session.memberships, session.academyId)) {
    throw new Error('Only academy owners and managers can change academy settings.');
  }
  return session;
}

export async function updateAcademyProfileAction(formData: FormData) {
  const session = await requireManager();
  saveAcademyProfile(session.academyId, {
    name: String(formData.get('name') ?? ''),
    description: String(formData.get('description') ?? ''),
    website: String(formData.get('website') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    email: String(formData.get('email') ?? ''),
    tagline: String(formData.get('tagline') ?? ''),
    timezone: String(formData.get('timezone') ?? 'America/Los_Angeles'),
    socialLinks: {
      instagram: String(formData.get('instagram') ?? '') || undefined,
      facebook: String(formData.get('facebook') ?? '') || undefined,
      youtube: String(formData.get('youtube') ?? '') || undefined,
    },
  });
  revalidatePath('/settings/profile');
}

export async function saveLocationAction(formData: FormData) {
  const session = await requireManager();
  upsertLocation(session.academyId, {
    id: String(formData.get('id') ?? '') || undefined,
    name: String(formData.get('name') ?? ''),
    address: String(formData.get('address') ?? ''),
    city: String(formData.get('city') ?? ''),
    state: String(formData.get('state') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    email: String(formData.get('email') ?? ''),
    timezone: String(formData.get('timezone') ?? 'America/Los_Angeles'),
    active: formData.get('active') !== 'false',
  });
  revalidatePath('/settings/locations');
}

export async function deactivateLocationAction(formData: FormData) {
  const session = await requireManager();
  deactivateLocation(session.academyId, String(formData.get('id')));
  revalidatePath('/settings/locations');
}

export async function saveBrandingDraftAction(formData: FormData) {
  const session = await requireManager();
  const primaryColor = String(formData.get('primaryColor') ?? '');
  const secondaryColor = String(formData.get('secondaryColor') ?? '');
  const accentColor = String(formData.get('accentColor') ?? '');
  const warnings = validateBrandColors({ primaryColor, secondaryColor, accentColor });

  saveBrandingDraft(session.academyId, session.academyName, {
    displayName: String(formData.get('displayName') ?? ''),
    locationDisplayText: String(formData.get('locationDisplayText') ?? ''),
    tagline: String(formData.get('tagline') ?? ''),
    primaryColor,
    secondaryColor,
    accentColor,
  });
  revalidatePath('/settings/branding');
  return { warnings };
}

export async function previewBrandingAction() {
  const session = await requireManager();
  setBrandingPreview(session.academyId, session.academyName);
  revalidatePath('/settings/branding');
}

export async function publishBrandingAction() {
  const session = await requireManager();
  publishBranding(session.academyId, session.academyName);
  revalidatePath('/settings/branding');
}

export async function registerMediaMetadataAction(formData: FormData) {
  const session = await requireManager();
  const mediaType = String(formData.get('mediaType') ?? 'other') as MediaType;
  const fileName = String(formData.get('fileName') ?? '');
  const mimeType = String(formData.get('mimeType') ?? '');
  const fileSize = Number(formData.get('fileSize') ?? 0);

  const validation = validateMediaUpload({ mediaType, mimeType, fileName, fileSize });
  if (!validation.ok) {
    return { ok: false as const, error: validation.error };
  }

  // Demo/metadata path — live Storage upload wires when Supabase env is configured.
  addMediaAsset(session.academyId, {
    mediaType,
    fileName,
    mimeType,
    fileSize,
  });
  revalidatePath('/settings/media');
  revalidatePath('/settings/branding');
  return { ok: true as const };
}

export async function archiveMediaAction(formData: FormData) {
  const session = await requireManager();
  archiveMedia(session.academyId, String(formData.get('id')));
  revalidatePath('/settings/media');
}
