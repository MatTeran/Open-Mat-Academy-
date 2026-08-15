export type BrandingWorkflowStatus = 'draft' | 'preview' | 'published';

export type AcademyBrandingState = {
  academyId: string;
  workflowStatus: BrandingWorkflowStatus;
  displayName: string;
  locationDisplayText: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  publishedSnapshot: AcademyBrandingState | null;
  updatedAt: string;
};

export type AcademyProfileState = {
  academyId: string;
  name: string;
  description: string;
  website: string;
  phone: string;
  email: string;
  tagline: string;
  timezone: string;
  socialLinks: { instagram?: string; facebook?: string; youtube?: string };
};

export type AcademyLocationState = {
  id: string;
  academyId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  timezone: string;
  active: boolean;
};

export type MediaAssetState = {
  id: string;
  academyId: string;
  mediaType: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  status: 'active' | 'archived';
  createdAt: string;
};

type Store = {
  profiles: Record<string, AcademyProfileState>;
  branding: Record<string, AcademyBrandingState>;
  locations: Record<string, AcademyLocationState[]>;
  media: Record<string, MediaAssetState[]>;
};

const globalStore = globalThis as typeof globalThis & {
  __mygiAcademySettingsStore?: Store;
};

function store(): Store {
  if (!globalStore.__mygiAcademySettingsStore) {
    globalStore.__mygiAcademySettingsStore = {
      profiles: {},
      branding: {},
      locations: {},
      media: {},
    };
  }
  return globalStore.__mygiAcademySettingsStore;
}

function defaultProfile(academyId: string, name: string): AcademyProfileState {
  return {
    academyId,
    name,
    description: '',
    website: '',
    phone: '',
    email: '',
    tagline: '',
    timezone: 'America/Los_Angeles',
    socialLinks: {},
  };
}

function defaultBranding(academyId: string, name: string): AcademyBrandingState {
  return {
    academyId,
    workflowStatus: 'draft',
    displayName: name,
    locationDisplayText: '',
    tagline: '',
    primaryColor: '#9A6735',
    secondaryColor: '#3A3936',
    accentColor: '#9A6735',
    publishedSnapshot: null,
    updatedAt: new Date().toISOString(),
  };
}

export function getAcademyProfile(academyId: string, name: string): AcademyProfileState {
  const s = store();
  if (!s.profiles[academyId]) s.profiles[academyId] = defaultProfile(academyId, name);
  return { ...s.profiles[academyId] };
}

export function saveAcademyProfile(
  academyId: string,
  patch: Partial<AcademyProfileState>,
): AcademyProfileState {
  const current = getAcademyProfile(academyId, patch.name ?? 'Academy');
  const next = { ...current, ...patch, academyId };
  store().profiles[academyId] = next;
  return { ...next };
}

export function getAcademyBranding(academyId: string, name: string): AcademyBrandingState {
  const s = store();
  if (!s.branding[academyId]) s.branding[academyId] = defaultBranding(academyId, name);
  return structuredClone(s.branding[academyId]);
}

export function saveBrandingDraft(
  academyId: string,
  name: string,
  patch: Partial<AcademyBrandingState>,
): AcademyBrandingState {
  const current = getAcademyBranding(academyId, name);
  const next: AcademyBrandingState = {
    ...current,
    ...patch,
    academyId,
    workflowStatus: 'draft',
    publishedSnapshot: current.publishedSnapshot,
    updatedAt: new Date().toISOString(),
  };
  store().branding[academyId] = next;
  return structuredClone(next);
}

export function setBrandingPreview(academyId: string, name: string): AcademyBrandingState {
  const current = getAcademyBranding(academyId, name);
  const next = {
    ...current,
    workflowStatus: 'preview' as const,
    updatedAt: new Date().toISOString(),
  };
  store().branding[academyId] = next;
  return structuredClone(next);
}

export function publishBranding(academyId: string, name: string): AcademyBrandingState {
  const current = getAcademyBranding(academyId, name);
  const published: AcademyBrandingState = {
    ...current,
    workflowStatus: 'published',
    publishedSnapshot: null,
    updatedAt: new Date().toISOString(),
  };
  const next: AcademyBrandingState = {
    ...published,
    publishedSnapshot: { ...published, publishedSnapshot: null },
  };
  store().branding[academyId] = next;
  return structuredClone(next);
}

/** Live experience uses published snapshot only — draft edits must not leak. */
export function getPublishedBranding(
  academyId: string,
  name: string,
): AcademyBrandingState | null {
  const current = getAcademyBranding(academyId, name);
  return current.publishedSnapshot ? structuredClone(current.publishedSnapshot) : null;
}

export function listLocations(academyId: string): AcademyLocationState[] {
  const s = store();
  if (!s.locations[academyId]) {
    s.locations[academyId] = [
      {
        id: `${academyId}-loc-1`,
        academyId,
        name: 'Main Floor',
        address: '100 Mat St',
        city: 'Los Angeles',
        state: 'CA',
        phone: '',
        email: '',
        timezone: 'America/Los_Angeles',
        active: true,
      },
    ];
  }
  return s.locations[academyId].map((l) => ({ ...l }));
}

export function upsertLocation(
  academyId: string,
  location: Partial<AcademyLocationState> & { id?: string; name: string },
): AcademyLocationState {
  const list = listLocations(academyId);
  const id = location.id ?? `${academyId}-loc-${Date.now()}`;
  const existing = list.findIndex((l) => l.id === id);
  const row: AcademyLocationState = {
    id,
    academyId,
    name: location.name,
    address: location.address ?? '',
    city: location.city ?? '',
    state: location.state ?? '',
    phone: location.phone ?? '',
    email: location.email ?? '',
    timezone: location.timezone ?? 'America/Los_Angeles',
    active: location.active ?? true,
  };
  if (existing >= 0) list[existing] = row;
  else list.push(row);
  store().locations[academyId] = list;
  return { ...row };
}

export function deactivateLocation(academyId: string, locationId: string): void {
  const list = listLocations(academyId).map((l) =>
    l.id === locationId ? { ...l, active: false } : l,
  );
  store().locations[academyId] = list;
}

export function listMedia(academyId: string): MediaAssetState[] {
  return (store().media[academyId] ?? []).map((m) => ({ ...m }));
}

export function addMediaAsset(
  academyId: string,
  asset: Omit<MediaAssetState, 'id' | 'academyId' | 'createdAt' | 'status'>,
): MediaAssetState {
  const row: MediaAssetState = {
    id: `media-${Date.now()}`,
    academyId,
    status: 'active',
    createdAt: new Date().toISOString(),
    ...asset,
  };
  const list = listMedia(academyId);
  list.unshift(row);
  store().media[academyId] = list;
  return { ...row };
}

export function archiveMedia(academyId: string, assetId: string): void {
  store().media[academyId] = listMedia(academyId).map((m) =>
    m.id === assetId ? { ...m, status: 'archived' as const } : m,
  );
}

/** Test helper — reset store between isolation tests. */
export function __resetAcademySettingsStoreForTests() {
  globalStore.__mygiAcademySettingsStore = {
    profiles: {},
    branding: {},
    locations: {},
    media: {},
  };
}
