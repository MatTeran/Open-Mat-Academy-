import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAppTheme } from '@openmat/shared';

import { AnnouncementFormScreen } from '../screens/announcements/AnnouncementFormScreen';
import { CheckInScreen } from '../screens/checkin/CheckInScreen';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { ClassFormScreen } from '../screens/schedule/ClassFormScreen';
import { coachStackScreenOptions } from './stackScreenOptions';
import type { DashboardStackParamList } from './types';

const Stack = createNativeStackNavigator<DashboardStackParamList>();

export function DashboardNavigator() {
  const { colors } = useAppTheme();

  return (
    <Stack.Navigator screenOptions={coachStackScreenOptions(colors)}>
      <Stack.Screen
        name="DashboardHome"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CheckIn"
        component={CheckInScreen}
        options={{ title: 'Digital Check-In' }}
      />
      <Stack.Screen
        name="AnnouncementForm"
        component={AnnouncementFormScreen}
        options={{ title: 'Announcement' }}
      />
      <Stack.Screen
        name="ClassForm"
        component={ClassFormScreen}
        options={{ title: 'Class' }}
      />
    </Stack.Navigator>
  );
}
