import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  AnnouncementDetailScreen,
  CommunityHomeScreen,
  TeamChatScreen,
} from '../screens';
import { useAppTheme } from '../hooks';
import type { CommunityStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<CommunityStackParamList>();

export function CommunityNavigator() {
  const { colors } = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.primaryBackground },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="CommunityHome" component={CommunityHomeScreen} />
      <Stack.Screen
        name="AnnouncementDetail"
        component={AnnouncementDetailScreen}
      />
      <Stack.Screen name="TeamChat" component={TeamChatScreen} />
    </Stack.Navigator>
  );
}

export function shouldHideCommunityTabBar(route: unknown): boolean {
  const routeName =
    getFocusedRouteNameFromRoute(route as never) ?? 'CommunityHome';
  return routeName === 'AnnouncementDetail' || routeName === 'TeamChat';
}
