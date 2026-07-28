import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAppTheme } from '@openmat/shared';

import { CheckInScreen } from '../screens/checkin/CheckInScreen';
import { ClassDetailScreen } from '../screens/schedule/ClassDetailScreen';
import { ClassFormScreen } from '../screens/schedule/ClassFormScreen';
import { ScheduleScreen } from '../screens/schedule/ScheduleScreen';
import { coachStackScreenOptions } from './stackScreenOptions';
import type { ScheduleStackParamList } from './types';

const Stack = createNativeStackNavigator<ScheduleStackParamList>();

export function ScheduleNavigator() {
  const { colors } = useAppTheme();

  return (
    <Stack.Navigator screenOptions={coachStackScreenOptions(colors)}>
      <Stack.Screen
        name="ScheduleHome"
        component={ScheduleScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ClassDetail"
        component={ClassDetailScreen}
        options={{ title: 'Class' }}
      />
      <Stack.Screen
        name="ClassForm"
        component={ClassFormScreen}
        options={{ title: 'Edit Class' }}
      />
      <Stack.Screen
        name="CheckIn"
        component={CheckInScreen}
        options={{ title: 'Digital Check-In' }}
      />
    </Stack.Navigator>
  );
}

export function shouldHideScheduleTabBar(route: object) {
  const routeName = getFocusedRouteNameFromRoute(route as never) ?? 'ScheduleHome';
  return routeName !== 'ScheduleHome';
}
