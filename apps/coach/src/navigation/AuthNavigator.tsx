import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAppTheme } from '@openmat/shared';

import { LoginScreen } from '../screens/auth/LoginScreen';
import { SplashScreen } from '../screens/auth/SplashScreen';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  const { colors } = useAppTheme();

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.primaryBackground },
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}
