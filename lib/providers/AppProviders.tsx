import { QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { queryClient } from '../queryClient';
import { AuthProvider } from './AuthProvider';
import { CommunityProvider } from './CommunityProvider';
import { JourneyProvider } from './JourneyProvider';
import { NotificationProvider } from './NotificationProvider';
import { ProfileProvider } from './ProfileProvider';
import { ThemeProvider, useAppTheme } from './ThemeProvider';
import { WorkoutProvider } from './WorkoutProvider';

function ThemedRoot({ children }: PropsWithChildren) {
  const { colors } = useAppTheme();
  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: colors.primaryBackground }}
    >
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <NotificationProvider>
              <CommunityProvider>
                <WorkoutProvider>
                  <ProfileProvider>
                    <JourneyProvider>{children}</JourneyProvider>
                  </ProfileProvider>
                </WorkoutProvider>
              </CommunityProvider>
            </NotificationProvider>
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

/**
 * Root provider composition — keep third-party context here,
 * not inside individual screens.
 */
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <ThemedRoot>{children}</ThemedRoot>
    </ThemeProvider>
  );
}
