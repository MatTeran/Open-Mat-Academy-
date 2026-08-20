import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  TechniqueDetailScreen,
  WorkoutDetailsScreen,
  WorkoutLogListScreen,
  YourGameScreen,
} from '../screens';
import { useAppTheme } from '../hooks';
import type { WorkoutStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<WorkoutStackParamList>();

export function WorkoutLogNavigator() {
  const { colors } = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.primaryBackground },
        animation: 'fade_from_bottom',
      }}
    >
      <Stack.Screen name="WorkoutList" component={WorkoutLogListScreen} />
      <Stack.Screen name="WorkoutDetails" component={WorkoutDetailsScreen} />
      <Stack.Screen name="YourGame" component={YourGameScreen} />
      <Stack.Screen
        name="TechniqueDetail"
        component={TechniqueDetailScreen}
      />
    </Stack.Navigator>
  );
}
