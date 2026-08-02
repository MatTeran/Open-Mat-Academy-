import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAppTheme } from '../hooks';
import { AchievementGalleryScreen } from '../screens/achievements/AchievementGalleryScreen';
import { JourneyScreen, LocalEventsScreen } from '../screens';
import { HomeScreen } from '../screens/main/HomeScreen';
import type { HomeStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeNavigator() {
  const { colors } = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.primaryBackground },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Journey" component={JourneyScreen} />
      <Stack.Screen
        name="AchievementGallery"
        component={AchievementGalleryScreen}
      />
      <Stack.Screen name="LocalEvents" component={LocalEventsScreen} />
    </Stack.Navigator>
  );
}

export function shouldHideHomeTabBar(route: unknown): boolean {
  const routeName = getFocusedRouteNameFromRoute(route as never) ?? 'HomeMain';
  return (
    routeName === 'Journey' ||
    routeName === 'AchievementGallery' ||
    routeName === 'LocalEvents'
  );
}
