import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  ForgotPasswordScreen,
  LoginScreen,
  RegisterScreen,
  SplashScreen,
} from '../screens';
import { useAppTheme } from '../hooks';
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
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}
