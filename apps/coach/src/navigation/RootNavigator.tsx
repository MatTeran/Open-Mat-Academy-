import {
  DarkTheme,
  NavigationContainer,
  Theme as NavTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';

import { useAuth, useAppTheme } from '@openmat/shared';

import { HeaderBackButton } from './HeaderBackButton';
import { CreateSheetScreen } from '../screens/create/CreateSheetScreen';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { colors, typography } = useAppTheme();
  const { isAuthenticated, isLoading } = useAuth();

  const navTheme: NavTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: colors.primaryBackground,
      card: colors.primaryBackground,
      text: colors.text,
      border: colors.border,
      primary: colors.goldAccent,
      notification: colors.highlightGold,
    },
    fonts: {
      regular: {
        fontFamily: typography.body.fontFamily ?? 'System',
        fontWeight: '400',
      },
      medium: {
        fontFamily: typography.subtitle.fontFamily ?? 'System',
        fontWeight: '500',
      },
      bold: {
        fontFamily: typography.title.fontFamily ?? 'System',
        fontWeight: '700',
      },
      heavy: {
        fontFamily: typography.hero.fontFamily ?? 'System',
        fontWeight: '800',
      },
    },
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.primaryBackground }} />
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen
              name="CreateModal"
              component={CreateSheetScreen}
              options={{
                presentation: 'modal',
                headerShown: true,
                title: 'Create',
                headerStyle: { backgroundColor: colors.elevatedSurface },
                headerTintColor: colors.goldAccent,
                headerTitleStyle: { color: colors.text },
                headerShadowVisible: false,
                headerLeft: () => <HeaderBackButton label="Close" />,
              }}
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
