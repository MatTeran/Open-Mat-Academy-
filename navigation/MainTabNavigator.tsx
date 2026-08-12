import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { CenterLogTabIcon, TabBarIcon } from '../components';
import { useAppTheme } from '../hooks';
import { fontFamilies, w1Shadow } from '../lib/theme';
import { ScheduleScreen } from '../screens';
import {
  CommunityNavigator,
  shouldHideCommunityTabBar,
} from './CommunityNavigator';
import { HomeNavigator, shouldHideHomeTabBar } from './HomeNavigator';
import {
  ProfileNavigator,
  shouldHideProfileTabBar,
} from './ProfileNavigator';
import type { MainTabParamList } from './types';
import { WorkoutLogNavigator } from './WorkoutLogNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  const { colors, isDark } = useAppTheme();

  const tabBarStyle = {
    backgroundColor: isDark ? colors.secondaryBackground : '#F7F3EC',
    borderTopColor: 'transparent',
    borderTopWidth: 0,
    height: 82,
    paddingTop: 10,
    paddingBottom: 14,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    ...w1Shadow.card,
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: colors.goldAccent,
        tabBarInactiveTintColor: colors.secondaryText,
        tabBarLabelStyle: {
          fontFamily: fontFamilies.medium,
          fontSize: 10,
          letterSpacing: 0.6,
          textTransform: 'uppercase',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={({ route }) => ({
          tabBarStyle: shouldHideHomeTabBar(route)
            ? { display: 'none' }
            : tabBarStyle,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? 'home' : 'home-outline'}
              focused={focused}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? 'calendar' : 'calendar-outline'}
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="WorkoutLog"
        component={WorkoutLogNavigator}
        listeners={({ navigation }) => ({
          tabPress: () => {
            // Always land on the Training Log list (not a nested detail screen).
            navigation.navigate('WorkoutLog', { screen: 'WorkoutList' });
          },
        })}
        options={({ route }) => {
          const routeName =
            getFocusedRouteNameFromRoute(route) ?? 'WorkoutList';
          const hideTabBar =
            routeName === 'WorkoutDetails' ||
            routeName === 'YourGame' ||
            routeName === 'TechniqueDetail';

          return {
            title: 'Log',
            tabBarLabel: 'Log',
            tabBarStyle: hideTabBar ? { display: 'none' } : tabBarStyle,
            tabBarIcon: ({ focused }) => (
              <CenterLogTabIcon focused={focused} />
            ),
          };
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityNavigator}
        options={({ route }) => ({
          tabBarStyle: shouldHideCommunityTabBar(route)
            ? { display: 'none' }
            : tabBarStyle,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? 'people' : 'people-outline'}
              focused={focused}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={({ route }) => ({
          tabBarStyle: shouldHideProfileTabBar(route)
            ? { display: 'none' }
            : tabBarStyle,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? 'person' : 'person-outline'}
              focused={focused}
            />
          ),
        })}
      />
    </Tab.Navigator>
  );
}
