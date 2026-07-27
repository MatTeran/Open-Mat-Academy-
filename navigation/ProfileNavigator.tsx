import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  AttendanceScreen,
  BeltRankScreen,
  LinkedFamilyScreen,
  MembershipScreen,
  NotificationsScreen,
  PaymentMethodScreen,
  ProfileHomeScreen,
  SettingsScreen,
} from '../screens';
import { useAppTheme } from '../hooks';
import type { ProfileStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const DETAIL_ROUTES: Array<keyof ProfileStackParamList> = [
  'Membership',
  'BeltRank',
  'PaymentMethod',
  'Attendance',
  'Settings',
  'Notifications',
  'LinkedFamily',
];

export function ProfileNavigator() {
  const { colors } = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.primaryBackground },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="ProfileHome" component={ProfileHomeScreen} />
      <Stack.Screen name="Membership" component={MembershipScreen} />
      <Stack.Screen name="BeltRank" component={BeltRankScreen} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
      <Stack.Screen name="Attendance" component={AttendanceScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="LinkedFamily" component={LinkedFamilyScreen} />
    </Stack.Navigator>
  );
}

export function shouldHideProfileTabBar(route: unknown): boolean {
  const routeName =
    getFocusedRouteNameFromRoute(route as never) ?? 'ProfileHome';
  return DETAIL_ROUTES.includes(routeName as keyof ProfileStackParamList);
}
