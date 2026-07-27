/**
 * Centralized React Query keys for cache consistency at scale.
 */
export const queryKeys = {
  auth: {
    session: ['auth', 'session'] as const,
  },
  profile: {
    me: ['profile', 'me'] as const,
    byId: (id: string) => ['profile', id] as const,
  },
  schedule: {
    upcoming: ['schedule', 'upcoming'] as const,
    byDate: (date: string) => ['schedule', date] as const,
  },
  workouts: {
    list: ['workouts', 'list'] as const,
    detail: (id: string) => ['workouts', id] as const,
  },
} as const;
