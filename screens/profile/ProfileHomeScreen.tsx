import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Share, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  appearanceLabel,
  Banner,
  Button,
  FadeIn,
  ProfileActionButton,
  ProfileAttendanceSnapshot,
  ProfileAvatar,
  ProfileHighlightTile,
  ProfileMenuGroup,
  ProfileMenuRow,
  ProfileMiniBelt,
  ProfileSectionHeader,
  ProfileStatsRow,
  Screen,
  Spacer,
  Text,
} from '../../components';
import { useAuth, useAppTheme } from '../../hooks';
import {
  formatMembershipPlan,
  formatMembershipStatus,
} from '../../lib/mocks/profile';
import { useProfile } from '../../lib/providers/ProfileProvider';
import { spacing } from '../../lib/theme';
import type { MainTabParamList } from '../../types';
import type { ProfileStackParamList } from '../../types/navigation';
import {
  getAuthErrorMessage,
  getFirstName,
  pickProfilePhoto,
  promptProfilePhotoActions,
} from '../../utils';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileHome'>;
type ProfileNavigation = CompositeNavigationProp<
  Props['navigation'],
  BottomTabNavigationProp<MainTabParamList>
>;

function getInitials(fullName: string | null | undefined): string {
  if (!fullName?.trim()) {
    return 'DM';
  }
  return fullName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function formatMemberSince(iso: string): string {
  const year = new Date(iso).getFullYear();
  if (Number.isNaN(year)) {
    return 'MEMBER';
  }
  return `MEMBER SINCE ${year}`;
}

export function ProfileHomeScreen({ navigation }: Props) {
  const tabNavigation = navigation as ProfileNavigation;
  const insets = useSafeAreaInsets();
  const { isDark, preference } = useAppTheme();
  const { user, signOut, isGuest } = useAuth();
  const {
    hub,
    beltLabel,
    stripesLabel,
    paymentLabel,
    familyCountLabel,
    setAvatarUri,
  } = useProfile();
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayName = user?.fullName || 'Open Mat Athlete';
  const academyLine = hub.membership.academyName.toUpperCase();

  const handleSignOut = async () => {
    setError(null);
    setLoading(true);
    try {
      await signOut();
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const applyPhoto = async (source: 'camera' | 'library') => {
    setError(null);
    setPhotoLoading(true);
    try {
      const uri = await pickProfilePhoto(source);
      if (uri) {
        await setAvatarUri(uri);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not update profile photo.',
      );
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleAvatarPress = () => {
    promptProfilePhotoActions({
      hasPhoto: Boolean(hub.avatarUri),
      onTakePhoto: () => {
        void applyPhoto('camera');
      },
      onChooseLibrary: () => {
        void applyPhoto('library');
      },
      onRemove: () => {
        void setAvatarUri(null);
      },
    });
  };

  const handleShareProfile = async () => {
    try {
      await Share.share({
        message: `${displayName} · ${beltLabel} belt · ${hub.membership.academyName}`,
      });
    } catch {
      // User dismissed the share sheet.
    }
  };

  return (
    <Screen scroll flushTop padded contentStyle={styles.content}>
      <View
        style={[
          styles.heroShell,
          { paddingTop: insets.top + spacing.lg },
        ]}
      >
        <LinearGradient
          colors={
            isDark
              ? ['rgba(212,175,55,0.18)', 'rgba(13,13,13,0)']
              : ['rgba(196,160,53,0.16)', 'rgba(245,245,243,0)']
          }
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        <FadeIn>
          <View style={styles.hero}>
            <ProfileAvatar
              uri={hub.avatarUri}
              initials={getInitials(user?.fullName)}
              onPress={handleAvatarPress}
              size={112}
              ring
            />

            <Spacer size="md" />
            <Text variant="label" gold style={styles.eyebrow}>
              {isGuest ? 'GUEST DEMO' : formatMemberSince(hub.membership.memberSince)}
            </Text>
            <Spacer size="xs" />
            <Text variant="hero" style={styles.name} numberOfLines={2}>
              {displayName}
            </Text>
            <Spacer size="xxs" />
            <Text variant="caption" muted style={styles.academy}>
              {academyLine}
            </Text>

            {photoLoading ? (
              <>
                <Spacer size="xs" />
                <Text variant="caption" gold>
                  Updating photo…
                </Text>
              </>
            ) : !hub.avatarUri ? (
              <>
                <Spacer size="xs" />
                <Text variant="caption" muted>
                  Add a photo, {getFirstName(user?.fullName)}
                </Text>
              </>
            ) : null}
          </View>
        </FadeIn>
      </View>

      <Spacer size="lg" />

      <FadeIn delay={40}>
        <ProfileStatsRow
          stats={[
            {
              value: `${hub.attendanceSummary.classesAttended}`,
              label: 'Classes',
            },
            {
              value: `${hub.attendanceSummary.streakDays}`,
              label: 'Day streak',
            },
            {
              value: `${hub.attendanceSummary.openMats}`,
              label: 'Open mats',
            },
          ]}
        />
      </FadeIn>

      <Spacer size="md" />

      <FadeIn delay={70}>
        <View style={styles.actions}>
          <ProfileActionButton
            label="Share"
            icon="share-outline"
            onPress={() => {
              void handleShareProfile();
            }}
          />
          <ProfileActionButton
            label="Edit"
            icon="create-outline"
            variant="filled"
            onPress={() => navigation.navigate('Settings')}
          />
        </View>
      </FadeIn>

      <Spacer size="xl" />

      <FadeIn delay={100}>
        <View style={styles.tiles}>
          <ProfileHighlightTile
            label="Belt"
            title={beltLabel}
            subtitle={stripesLabel}
            icon="ribbon-outline"
            onPress={() => navigation.navigate('BeltRank')}
            media={
              <ProfileMiniBelt
                belt={hub.beltProgress.belt}
                stripes={hub.beltProgress.stripes}
              />
            }
          />
          <ProfileHighlightTile
            label="Membership"
            title={formatMembershipPlan(hub.membership.plan)}
            subtitle={formatMembershipStatus(hub.membership.status)}
            icon="card-outline"
            onPress={() => navigation.navigate('Membership')}
          />
        </View>
      </FadeIn>

      <Spacer size="md" />

      <FadeIn delay={120}>
        <ProfileAttendanceSnapshot
          summary={hub.attendanceSummary}
          onPress={() => navigation.navigate('Attendance')}
        />
      </FadeIn>

      <Spacer size="xl" />

      <FadeIn delay={140}>
        <ProfileSectionHeader title="Training" />
        <ProfileMenuGroup>
          <ProfileMenuRow
            icon="map-outline"
            label="Journey"
            value="XP, streaks & badges"
            onPress={() =>
              tabNavigation.navigate('Home', { screen: 'Journey' })
            }
            showDivider
            accent
          />
          <ProfileMenuRow
            icon="barbell-outline"
            label="Workout Log"
            value="Sessions & mat time"
            onPress={() =>
              tabNavigation.navigate('WorkoutLog', { screen: 'WorkoutList' })
            }
          />
        </ProfileMenuGroup>
      </FadeIn>

      <Spacer size="lg" />

      <FadeIn delay={160}>
        <ProfileSectionHeader title="Account" />
        <ProfileMenuGroup>
          <ProfileMenuRow
            icon="wallet-outline"
            label="Payment Method"
            value={paymentLabel}
            onPress={() => navigation.navigate('PaymentMethod')}
            showDivider
          />
          <ProfileMenuRow
            icon="people-outline"
            label="Linked Family"
            value={familyCountLabel}
            onPress={() => navigation.navigate('LinkedFamily')}
          />
        </ProfileMenuGroup>
      </FadeIn>

      <Spacer size="lg" />

      <FadeIn delay={180}>
        <ProfileSectionHeader title="Preferences" />
        <ProfileMenuGroup>
          <ProfileMenuRow
            icon="settings-outline"
            label="Settings"
            value={`${appearanceLabel(preference)} mode · preferences`}
            onPress={() => navigation.navigate('Settings')}
            showDivider
          />
          <ProfileMenuRow
            icon="notifications-outline"
            label="Notifications"
            value="Manage alerts"
            onPress={() => navigation.navigate('Notifications')}
          />
        </ProfileMenuGroup>
      </FadeIn>

      {error ? (
        <>
          <Spacer size="md" />
          <Banner message={error} />
        </>
      ) : null}

      <Spacer size="xl" />

      <FadeIn delay={200}>
        <Button
          label="Log out"
          variant="secondary"
          loading={loading}
          onPress={handleSignOut}
        />
      </FadeIn>

      <View style={styles.bottomSpace} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
  },
  heroShell: {
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    overflow: 'hidden',
  },
  hero: {
    width: '100%',
    alignItems: 'center',
  },
  eyebrow: {
    letterSpacing: 1.4,
    textAlign: 'center',
  },
  name: {
    textAlign: 'center',
    fontSize: 34,
    lineHeight: 40,
  },
  academy: {
    textAlign: 'center',
    letterSpacing: 0.8,
  },
  actions: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.sm,
  },
  tiles: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  bottomSpace: {
    height: spacing.xxl,
  },
});
