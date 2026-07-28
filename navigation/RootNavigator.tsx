import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { NotificationHost, Text } from '../components';
import { useAuth, useAppTheme } from '../hooks';
import { APP_NAME } from '../lib/constants';
import {
  navigationRef,
  setNavigationReady,
} from '../lib/notifications';
import { spacing } from '../lib/theme';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Top-level navigator: Auth stack vs Main tabs from persisted Supabase session.
 */
export function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const { colors, isDark } = useAppTheme();

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.primaryBackground,
      card: colors.primaryBackground,
      primary: colors.goldAccent,
      text: colors.text,
      border: colors.border,
      notification: colors.goldAccent,
    },
  };

  if (isLoading) {
    return (
      <View
        style={[styles.boot, { backgroundColor: colors.primaryBackground }]}
      >
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Text variant="brand" gold>
          {APP_NAME.toUpperCase()}
        </Text>
        <ActivityIndicator
          color={colors.goldAccent}
          style={styles.spinner}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.primaryBackground }}>
      <NavigationContainer
        ref={navigationRef}
        theme={navigationTheme}
        onReady={() => setNavigationReady(true)}
      >
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Stack.Navigator
          screenOptions={{ headerShown: false, animation: 'fade' }}
        >
          {isAuthenticated ? (
            <Stack.Screen name="Main" component={MainTabNavigator} />
          ) : (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
      {isAuthenticated ? <NotificationHost /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  spinner: {
    marginTop: spacing.sm,
  },
});
