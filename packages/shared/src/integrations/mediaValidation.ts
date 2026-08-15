export type MediaType =
  | 'academy_logo'
  | 'academy_icon'
  | 'academy_mobile_hero'
  | 'academy_desktop_hero'
  | 'location_photo'
  | 'coach_profile'
  | 'event_image'
  | 'curriculum_media'
  | 'other';

export const MEDIA_REQUIREMENTS: Record<
  MediaType,
  { label: string; recommended: string; accept: string[]; maxBytes: number }
> = {
  academy_logo: {
    label: 'Academy Logo',
    recommended: '1024 × 1024',
    accept: ['image/png', 'image/jpeg', 'image/webp'],
    maxBytes: 5 * 1024 * 1024,
  },
  academy_icon: {
    label: 'Square App / Avatar Logo',
    recommended: '512 × 512',
    accept: ['image/png', 'image/jpeg', 'image/webp'],
    maxBytes: 2 * 1024 * 1024,
  },
  academy_mobile_hero: {
    label: 'Mobile Hero',
    recommended: '1080 × 1920',
    accept: ['image/png', 'image/jpeg', 'image/webp'],
    maxBytes: 8 * 1024 * 1024,
  },
  academy_desktop_hero: {
    label: 'Desktop Hero',
    recommended: '1920 × 1080',
    accept: ['image/png', 'image/jpeg', 'image/webp'],
    maxBytes: 10 * 1024 * 1024,
  },
  location_photo: {
    label: 'Location Photo',
    recommended: '1600 × 900',
    accept: ['image/png', 'image/jpeg', 'image/webp'],
    maxBytes: 8 * 1024 * 1024,
  },
  coach_profile: {
    label: 'Coach Profile',
    recommended: '800 × 800',
    accept: ['image/png', 'image/jpeg', 'image/webp'],
    maxBytes: 3 * 1024 * 1024,
  },
  event_image: {
    label: 'Event Image',
    recommended: '1600 × 900',
    accept: ['image/png', 'image/jpeg', 'image/webp'],
    maxBytes: 8 * 1024 * 1024,
  },
  curriculum_media: {
    label: 'Curriculum Media',
    recommended: '1600 × 900',
    accept: ['image/png', 'image/jpeg', 'image/webp'],
    maxBytes: 10 * 1024 * 1024,
  },
  other: {
    label: 'Other',
    recommended: 'varies',
    accept: ['image/png', 'image/jpeg', 'image/webp'],
    maxBytes: 10 * 1024 * 1024,
  },
};

const BLOCKED_EXTENSIONS = new Set([
  '.exe',
  '.js',
  '.mjs',
  '.html',
  '.htm',
  '.svg',
  '.php',
  '.sh',
  '.bat',
  '.cmd',
  '.dll',
]);

export type MediaValidationResult =
  | { ok: true }
  | { ok: false; error: string };

/** Server-side validation — never rely on the client alone. */
export function validateMediaUpload(input: {
  mediaType: MediaType;
  mimeType: string;
  fileName: string;
  fileSize: number;
}): MediaValidationResult {
  const req = MEDIA_REQUIREMENTS[input.mediaType];
  if (!req) return { ok: false, error: 'Unknown media type.' };

  const lower = input.fileName.toLowerCase();
  for (const ext of BLOCKED_EXTENSIONS) {
    if (lower.endsWith(ext)) {
      return { ok: false, error: 'Executable or unsafe file types are not allowed.' };
    }
  }

  if (!req.accept.includes(input.mimeType)) {
    return {
      ok: false,
      error: `MIME type ${input.mimeType} is not allowed for ${req.label}.`,
    };
  }

  if (input.fileSize <= 0 || input.fileSize > req.maxBytes) {
    return {
      ok: false,
      error: `File must be between 1 byte and ${Math.round(req.maxBytes / (1024 * 1024))} MB.`,
    };
  }

  return { ok: true };
}
