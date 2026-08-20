/**
 * My Gi Version W.1 — premium warm-neutral design language.
 * Soft ivory surfaces, charcoal type, restrained bronze accents.
 */

export const w1Colors = {
  background: '#F5F3EE',
  card: '#FAF9F6',
  text: '#20201E',
  textSecondary: '#6F6C66',
  accent: '#9A6735',
  accentSoft: 'rgba(154, 103, 53, 0.12)',
  accentMuted: 'rgba(154, 103, 53, 0.22)',
  border: 'rgba(0, 0, 0, 0.06)',
  overlay: 'rgba(20, 18, 14, 0.38)',
  white: '#FFFFFF',
  track: 'rgba(32, 32, 30, 0.08)',
} as const;

export const w1Radii = {
  /** Soft controls / media thumbnails */
  control: 14,
  /** Primary surface cards */
  card: 24,
  /** Day dots / circular chips */
  day: 999,
  /** Pills / status chips */
  chip: 999,
} as const;

export const w1Spacing = {
  /** Page horizontal margin — aligns greeting, dashboard, events, streak */
  screenX: 24,
  cardGap: 12,
  section: 24,
  cardPad: 20,
} as const;

export const w1Shadow = {
  card: {
    shadowColor: '#1A1712',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  soft: {
    shadowColor: '#1A1712',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
} as const;
