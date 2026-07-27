import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  Button,
  Card,
  IconBadge,
  Screen,
  Spacer,
  Text,
  radii,
  spacing,
  useAppTheme,
  useAuth,
  type IconName,
} from '@openmat/shared';

import { FadeInItem } from '../../components/ui/Motion';
import type {
  MainTabParamList,
  MoreStackParamList,
} from '../../navigation/types';

type Nav = CompositeNavigationProp<
  NativeStackNavigationProp<MoreStackParamList, 'MoreHome'>,
  BottomTabNavigationProp<MainTabParamList>
>;

interface Props {
  navigation: Nav;
}

const LINKS: Array<{
  title: string;
  subtitle: string;
  icon: IconName;
  tint: string;
  onPress: (navigation: Nav) => void;
}> = [
  {
    title: 'Command Center',
    subtitle: 'Mission control · what needs attention now',
    icon: 'pulse-outline',
    tint: '#F5F5F5',
    onPress: (navigation) => navigation.navigate('CommandCenter'),
  },
  {
    title: 'Announcements',
    subtitle: 'Draft, schedule, and publish',
    icon: 'megaphone-outline',
    tint: '#F5F5F5',
    onPress: (navigation) => navigation.navigate('Announcements'),
  },
  {
    title: 'Digital Check-In',
    subtitle: 'Manage today’s attendance',
    icon: 'qr-code-outline',
    tint: '#38BDF8',
    onPress: (navigation) =>
      navigation.navigate('Dashboard', {
        screen: 'CheckIn',
        params: undefined,
      }),
  },
  {
    title: 'Class Management',
    subtitle: 'Schedule and roster tools',
    icon: 'calendar-outline',
    tint: '#FFFFFF',
    onPress: (navigation) =>
      (navigation.navigate as (name: string) => void)('Schedule'),
  },
  {
    title: 'Members',
    subtitle: 'Profiles, notes, and history',
    icon: 'people-outline',
    tint: '#22C55E',
    onPress: (navigation) =>
      (navigation.navigate as (name: string) => void)('Members'),
  },
  {
    title: 'Techniques',
    subtitle: 'Coach library and favorites',
    icon: 'book-outline',
    tint: '#FB7185',
    onPress: (navigation) => navigation.navigate('Techniques'),
  },
  {
    title: 'Challenges',
    subtitle: 'XP goals and badges',
    icon: 'trophy-outline',
    tint: '#A78BFA',
    onPress: (navigation) => navigation.navigate('Challenges'),
  },
  {
    title: 'Achievements',
    subtitle: 'Badge catalog and awards',
    icon: 'ribbon-outline',
    tint: '#FFFFFF',
    onPress: (navigation) => navigation.navigate('Achievements'),
  },
  {
    title: 'Events',
    subtitle: 'Seminars, closures, and RSVPs',
    icon: 'ticket-outline',
    tint: '#38BDF8',
    onPress: (navigation) => navigation.navigate('Events'),
  },
  {
    title: 'Media Library',
    subtitle: 'Albums and recent uploads',
    icon: 'albums-outline',
    tint: '#22C55E',
    onPress: (navigation) => navigation.navigate('MediaLibrary'),
  },
  {
    title: 'Member Journey',
    subtitle: 'Read-only XP and progress',
    icon: 'map-outline',
    tint: '#F59E0B',
    onPress: (navigation) => navigation.navigate('Journey'),
  },
  {
    title: 'Notifications',
    subtitle: 'Draft and simulate sends',
    icon: 'notifications-outline',
    tint: '#38BDF8',
    onPress: (navigation) => navigation.navigate('Notifications'),
  },
];

export function MoreScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const { user, signOut, isGuest } = useAuth();

  return (
    <Screen scroll>
      <Text variant="hero">More</Text>
      <Text variant="body" muted>
        Academy tools and account
      </Text>

      <Spacer size="lg" />
      <Card elevated>
        <Text variant="subtitle">{user?.fullName ?? 'Coach'}</Text>
        <Text variant="caption" muted>
          {user?.email}
          {isGuest ? ' · Guest demo' : ''}
        </Text>
        <Text variant="caption" gold>
          Role prepared for coach permissions
        </Text>
      </Card>

      <Spacer size="lg" />
      <View style={styles.list}>
        {LINKS.map((link, index) => (
          <FadeInItem key={link.title} index={index}>
            <Pressable
              onPress={() => link.onPress(navigation)}
              style={[
                styles.row,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              <IconBadge name={link.icon} tint={link.tint} />
              <View style={styles.copy}>
                <Text variant="subtitle">{link.title}</Text>
                <Text variant="caption" muted>
                  {link.subtitle}
                </Text>
              </View>
            </Pressable>
          </FadeInItem>
        ))}
      </View>

      <Spacer size="xl" />
      <Button label="Sign Out" variant="secondary" onPress={() => signOut()} />
      <Spacer size="xl" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
  row: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
});
