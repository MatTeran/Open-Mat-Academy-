/**
 * My Gi Version W.1 — premium warm-neutral design language.
 * Soft ivory surfaces, charcoal type, restrained bronze accents.
 * Soft floating shadows (neumorphic-lite) matching the Home mockup.
 */

export const w1Colors = {
  background: '#F3F0EA',
  card: '#FFFCF8',
  cardGradientEnd: '#F7F2EA',
  text: '#1C1A17',
  textSecondary: '#7A6554',
  accent: '#7C5D49',
  accentSoft: 'rgba(124, 93, 73, 0.12)',
  accentMuted: 'rgba(124, 93, 73, 0.22)',
  border: 'rgba(28, 26, 23, 0.06)',
  overlay: 'rgba(20, 18, 14, 0.38)',
  white: '#FFFFFF',
  track: 'rgba(28, 26, 23, 0.08)',
  buttonTop: '#FBF8F3',
  buttonBottom: '#EDE6DC',
} as const;

export const w1Radii = {
  card: 24,
  chip: 999,
  control: 14,
  day: 999,
  button: 14,
} as const;

export const w1Spacing = {
  screenX: 20,
  cardGap: 14,
  section: 28,
  cardPad: 20,
} as const;

/** Soft elevated shadows — high blur, low opacity (mockup float). */
export const w1Shadow = {
  card: {
    shadowColor: '#1A1510',
    shadowOpacity: 0.12,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  soft: {
    shadowColor: '#1A1510',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  button: {
    shadowColor: '#1A1510',
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  fab: {
    shadowColor: '#1A1510',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
} as const;
