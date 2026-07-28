import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAppTheme } from '@openmat/shared';

import { AchievementFormScreen } from '../screens/achievements/AchievementFormScreen';
import { AchievementsScreen } from '../screens/achievements/AchievementsScreen';
import { AnnouncementFormScreen } from '../screens/announcements/AnnouncementFormScreen';
import { AnnouncementsScreen } from '../screens/announcements/AnnouncementsScreen';
import { ChallengeFormScreen } from '../screens/challenges/ChallengeFormScreen';
import { ChallengesScreen } from '../screens/challenges/ChallengesScreen';
import { CommandCenterScreen } from '../screens/command/CommandCenterScreen';
import { PulseInsightScreen } from '../screens/command/PulseInsightScreen';
import { EventFormScreen } from '../screens/events/EventFormScreen';
import { EventsScreen } from '../screens/events/EventsScreen';
import { JourneyMemberScreen } from '../screens/journey/JourneyMemberScreen';
import { JourneyScreen } from '../screens/journey/JourneyScreen';
import { MediaLibraryScreen } from '../screens/media/MediaLibraryScreen';
import { MediaUploadScreen } from '../screens/media/MediaUploadScreen';
import { MoreScreen } from '../screens/more/MoreScreen';
import { NotificationFormScreen } from '../screens/notifications/NotificationFormScreen';
import { NotificationsScreen } from '../screens/notifications/NotificationsScreen';
import { TechniqueFormScreen } from '../screens/techniques/TechniqueFormScreen';
import { TechniquesScreen } from '../screens/techniques/TechniquesScreen';
import { coachStackScreenOptions } from './stackScreenOptions';
import type { MoreStackParamList } from './types';

const Stack = createNativeStackNavigator<MoreStackParamList>();

export function MoreNavigator() {
  const { colors } = useAppTheme();

  return (
    <Stack.Navigator screenOptions={coachStackScreenOptions(colors)}>
      <Stack.Screen
        name="MoreHome"
        component={MoreScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Announcements"
        component={AnnouncementsScreen}
        options={{ title: 'Announcements' }}
      />
      <Stack.Screen
        name="AnnouncementForm"
        component={AnnouncementFormScreen}
        options={{ title: 'Announcement' }}
      />
      <Stack.Screen
        name="CommandCenter"
        component={CommandCenterScreen}
        options={{ title: 'Command Center' }}
      />
      <Stack.Screen
        name="PulseInsight"
        component={PulseInsightScreen}
        options={{ title: 'Pulse Insights' }}
      />
      <Stack.Screen
        name="Techniques"
        component={TechniquesScreen}
        options={{ title: 'Techniques' }}
      />
      <Stack.Screen
        name="TechniqueForm"
        component={TechniqueFormScreen}
        options={{ title: 'Technique' }}
      />
      <Stack.Screen
        name="Challenges"
        component={ChallengesScreen}
        options={{ title: 'Challenges' }}
      />
      <Stack.Screen
        name="ChallengeForm"
        component={ChallengeFormScreen}
        options={{ title: 'Challenge' }}
      />
      <Stack.Screen
        name="Achievements"
        component={AchievementsScreen}
        options={{ title: 'Achievements' }}
      />
      <Stack.Screen
        name="AchievementForm"
        component={AchievementFormScreen}
        options={{ title: 'Achievement' }}
      />
      <Stack.Screen
        name="Events"
        component={EventsScreen}
        options={{ title: 'Events' }}
      />
      <Stack.Screen
        name="EventForm"
        component={EventFormScreen}
        options={{ title: 'Event' }}
      />
      <Stack.Screen
        name="MediaLibrary"
        component={MediaLibraryScreen}
        options={{ title: 'Media Library' }}
      />
      <Stack.Screen
        name="MediaUpload"
        component={MediaUploadScreen}
        options={{ title: 'Upload Media' }}
      />
      <Stack.Screen
        name="Journey"
        component={JourneyScreen}
        options={{ title: 'Member Journey' }}
      />
      <Stack.Screen
        name="JourneyMember"
        component={JourneyMemberScreen}
        options={{ title: 'Journey Detail' }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: 'Notifications' }}
      />
      <Stack.Screen
        name="NotificationForm"
        component={NotificationFormScreen}
        options={{ title: 'Notification' }}
      />
    </Stack.Navigator>
  );
}

export function shouldHideMoreTabBar(route: object) {
  const routeName = getFocusedRouteNameFromRoute(route as never) ?? 'MoreHome';
  return routeName !== 'MoreHome';
}
