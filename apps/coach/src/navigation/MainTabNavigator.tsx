import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';

import { fontFamilies, useAppTheme } from '@openmat/shared';

import { TabBarIcon } from '../components/layout/TabBarIcon';
import { DashboardNavigator } from './DashboardNavigator';
import {
  MembersNavigator,
  shouldHideMembersTabBar,
} from './MembersNavigator';
import { MoreNavigator, shouldHideMoreTabBar } from './MoreNavigator';
import {
  ScheduleNavigator,
  shouldHideScheduleTabBar,
} from './ScheduleNavigator';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

function CreateTabPlaceholder() {
  return <View />;
}

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
        name="Dashboard"
        component={DashboardNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? 'grid' : 'grid-outline'}
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleNavigator}
        options={({ route }) => ({
          tabBarStyle: shouldHideScheduleTabBar(route)
            ? { display: 'none' }
            : tabBarStyle,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? 'calendar' : 'calendar-outline'}
              focused={focused}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Members"
        component={MembersNavigator}
        options={({ route }) => ({
          title: 'Members',
          tabBarLabel: 'Members',
          tabBarStyle: shouldHideMembersTabBar(route)
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
        name="Create"
        component={CreateTabPlaceholder}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate('CreateModal' as never);
          },
        })}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? 'add-circle' : 'add-circle-outline'}
              focused={focused}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreNavigator}
        options={({ route }) => ({
          tabBarStyle: shouldHideMoreTabBar(route)
            ? { display: 'none' }
            : tabBarStyle,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? 'ellipsis-horizontal' : 'ellipsis-horizontal-outline'}
              focused={focused}
            />
          ),
        })}
      />
    </Tab.Navigator>
  );
}

/** Create modal is hosted on the root stack. */
