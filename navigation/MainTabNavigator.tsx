import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { TabBarIcon } from '../components';
import { useAppTheme } from '../hooks';
import { fontFamilies } from '../lib/theme';
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
  const { colors } = useAppTheme();

  const tabBarStyle = {
    backgroundColor: colors.primaryBackground,
    borderTopColor: colors.border,
    height: 64,
    paddingTop: 6,
    paddingBottom: 8,
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
          fontSize: 11,
          letterSpacing: 0.2,
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
            <TabBarIcon name={focused ? 'home' : 'home-outline'} focused={focused} />
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
        name="WorkoutLog"
        component={WorkoutLogNavigator}
        options={({ route }) => {
          const routeName =
            getFocusedRouteNameFromRoute(route) ?? 'WorkoutList';
          const hideTabBar = routeName === 'WorkoutDetails';

          return {
            title: 'Log',
            tabBarStyle: hideTabBar ? { display: 'none' } : tabBarStyle,
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                name={focused ? 'barbell' : 'barbell-outline'}
                focused={focused}
              />
            ),
          };
        }}
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
