import { QueryClient } from '@tanstack/react-query';

/**
 * Shared React Query client tuned for a mobile academy app.
 * Stale times keep list screens snappy without over-fetching.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 30,
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
