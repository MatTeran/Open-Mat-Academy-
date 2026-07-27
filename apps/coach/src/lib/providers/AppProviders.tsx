import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  AuthProvider,
  ThemeProvider,
  useAppTheme,
} from '@openmat/shared';

import { CoachDataProvider } from './CoachDataProvider';
import { MemberDevelopmentProvider } from './MemberDevelopmentProvider';
import { Phase2DataProvider } from './Phase2DataProvider';

function ThemedRoot({ children }: PropsWithChildren) {
  const { colors } = useAppTheme();
  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: colors.primaryBackground }}
    >
      <SafeAreaProvider>
        <AuthProvider appRole="coach">
          <CoachDataProvider>
            <Phase2DataProvider>
              <MemberDevelopmentProvider>{children}</MemberDevelopmentProvider>
            </Phase2DataProvider>
          </CoachDataProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <ThemeProvider
      variant="coach"
      storageKey="@open-mat/coach-appearance-preference"
      defaultPreference="dark"
    >
      <QueryClientProvider client={queryClient}>
        <ThemedRoot>{children}</ThemedRoot>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
