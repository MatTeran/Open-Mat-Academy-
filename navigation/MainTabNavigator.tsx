import {
  getFocusedRouteNameFromRoute,
  type NavigationProp,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useRef, useState } from 'react';

import {
  CenterLogTabIcon,
  QuickLogSheet,
  type QuickLogActionId,
  TabBarIcon,
} from '../components';
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
  const [quickLogOpen, setQuickLogOpen] = useState(false);
  const navigationRef = useRef<NavigationProp<MainTabParamList> | null>(null);

  const tabBarStyle = {
    backgroundColor: isDark ? colors.secondaryBackground : colors.cardBackground,
    borderTopColor: colors.border,
    height: 78,
    paddingTop: 8,
    paddingBottom: 12,
    ...w1Shadow.soft,
  };

  const handleQuickLogAction = (action: QuickLogActionId) => {
    setQuickLogOpen(false);
    const navigation = navigationRef.current;
    if (!navigation) {
      return;
    }
    switch (action) {
      case 'logTraining':
      case 'logTechnique':
      case 'logCompetition':
      case 'addNote':
        navigation.navigate('WorkoutLog', { screen: 'WorkoutDetails' });
        break;
      case 'viewLog':
        navigation.navigate('WorkoutLog', { screen: 'WorkoutList' });
        break;
      default:
        break;
    }
  };

  return (
    <>
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
            tabPress: (event) => {
              event.preventDefault();
              navigationRef.current = navigation;
              setQuickLogOpen(true);
            },
            focus: () => {
              navigationRef.current = navigation;
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

      <QuickLogSheet
        visible={quickLogOpen}
        onClose={() => setQuickLogOpen(false)}
        onAction={handleQuickLogAction}
      />
    </>
  );
}
