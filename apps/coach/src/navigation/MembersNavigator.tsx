import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAppTheme, fontFamilies } from '@openmat/shared';

import { AddStripeScreen } from '../screens/members/AddStripeScreen';
import { CompetitionProfileEditScreen } from '../screens/members/CompetitionProfileEditScreen';
import { MemberDetailScreen } from '../screens/members/MemberDetailScreen';
import { MembersScreen } from '../screens/members/MembersScreen';
import { PromoteBeltScreen } from '../screens/members/PromoteBeltScreen';
import type { MembersStackParamList } from './types';

const Stack = createNativeStackNavigator<MembersStackParamList>();

export function MembersNavigator() {
  const { colors } = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primaryBackground },
        headerTintColor: colors.goldAccent,
        headerTitleStyle: {
          fontFamily: fontFamilies.semibold,
          color: colors.text,
        },
        contentStyle: { backgroundColor: colors.primaryBackground },
      }}
    >
      <Stack.Screen
        name="MembersHome"
        component={MembersScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MemberDetail"
        component={MemberDetailScreen}
        options={{ title: 'Member Management' }}
      />
      <Stack.Screen
        name="AddStripe"
        component={AddStripeScreen}
        options={{ title: 'Add Stripe', presentation: 'modal' }}
      />
      <Stack.Screen
        name="PromoteBelt"
        component={PromoteBeltScreen}
        options={{ title: 'Promote Belt', presentation: 'modal' }}
      />
      <Stack.Screen
        name="CompetitionProfileEdit"
        component={CompetitionProfileEditScreen}
        options={{ title: 'Competition Profile', presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}

export function shouldHideMembersTabBar(route: object) {
  const routeName = getFocusedRouteNameFromRoute(route as never) ?? 'MembersHome';
  return routeName !== 'MembersHome';
}
