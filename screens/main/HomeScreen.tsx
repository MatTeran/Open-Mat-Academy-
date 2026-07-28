import {
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, StyleSheet, View } from 'react-native';

import {
  FadeIn,
  HomeHeroBanner,
  JourneySummaryCard,
  LatestAnnouncementCard,
  LocalEventsTile,
  NextClassCard,
  NotificationPermissionCard,
  QuickActions,
  Screen,
  Spacer,
  Text,
  UpcomingEvents,
} from '../../components';
import { useAuth, useNotifications } from '../../hooks';
import {
  HOME_USER_SUMMARY,
  NEXT_CLASS_SUMMARY,
  QUICK_ACTIONS,
  UPCOMING_EVENTS,
} from '../../lib/mocks/home';
import { scheduleClassReminder } from '../../lib/notifications';
import { useCommunity } from '../../lib/providers/CommunityProvider';
import { useJourney } from '../../lib/providers/JourneyProvider';
import { spacing } from '../../lib/theme';
import type { HomeStackParamList, MainTabParamList } from '../../types';
import type {
  HomeUserSummary,
  NextClassReservationStatus,
  QuickActionId,
} from '../../types/home';
import {
  getFirstName,
  getGreeting,
  getMotivationalMessage,
} from '../../utils';

type HomeNavigation = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'HomeMain'>,
  BottomTabNavigationProp<MainTabParamList>
>;

const CHECK_IN_XP = 100;

export function HomeScreen() {
  const { user } = useAuth();
  const { announcements } = useCommunity();
  const { profile, streak, awardXp } = useJourney();
  const {
    permissionPromptStatus,
    enableNotifications,
    deferPermissionPrompt,
    openSettings,
  } = useNotifications();
  const navigation = useNavigation<HomeNavigation>();

  const [reservationStatus, setReservationStatus] =
    useState<NextClassReservationStatus>(
      NEXT_CLASS_SUMMARY.reservationStatus,
    );
  const [actionLoading, setActionLoading] = useState(false);
  const [xpEarnedLabel, setXpEarnedLabel] = useState<string | null>(null);
  const [weeklyClassesCompleted, setWeeklyClassesCompleted] = useState(
    HOME_USER_SUMMARY.weeklyClassesCompleted,
  );
  const [permissionLoading, setPermissionLoading] = useState(false);
  const [permissionMessage, setPermissionMessage] = useState<string | null>(
    null,
  );

  const showPermissionCard = permissionPromptStatus === 'unknown';
  const showBlockedCard = permissionPromptStatus === 'blocked';

  const latestAnnouncement = useMemo(() => {
    return [...announcements].sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
    )[0];
  }, [announcements]);

  const journeySummary: HomeUserSummary = useMemo(
    () => ({
      firstName: getFirstName(user?.fullName),
      level: profile.level,
      currentXP: profile.currentLevelXP,
      nextLevelXP: profile.nextLevelXP,
      weeklyClassesCompleted,
      weeklyClassGoal: HOME_USER_SUMMARY.weeklyClassGoal,
      weeklyTrainingDays:
        streak.weeklyTrainingDays || HOME_USER_SUMMARY.weeklyTrainingDays,
      currentStreak: streak.currentStreak || HOME_USER_SUMMARY.currentStreak,
      bestStreak: streak.bestStreak || HOME_USER_SUMMARY.bestStreak,
    }),
    [
      profile.currentLevelXP,
      profile.level,
      profile.nextLevelXP,
      streak.bestStreak,
      streak.currentStreak,
      streak.weeklyTrainingDays,
      user?.fullName,
      weeklyClassesCompleted,
    ],
  );

  const greeting = getGreeting();
  const firstName = getFirstName(user?.fullName);
  const motivationalMessage = getMotivationalMessage({
    weeklyClassesCompleted,
    weeklyClassGoal: HOME_USER_SUMMARY.weeklyClassGoal,
  });

  useEffect(() => {
    if (!xpEarnedLabel) {
      return;
    }
    const timer = setTimeout(() => setXpEarnedLabel(null), 2800);
    return () => clearTimeout(timer);
  }, [xpEarnedLabel]);

  const wait = (ms: number) =>
    new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });

  const handlePrimaryClassAction = async () => {
    if (actionLoading) {
      return;
    }
    if (
      reservationStatus === 'reserved' ||
      reservationStatus === 'checked_in'
    ) {
      return;
    }

    setActionLoading(true);
    try {
      if (reservationStatus === 'available') {
        await wait(500);
        setReservationStatus('reserved');
        AccessibilityInfo.announceForAccessibility?.(
          `Reserved ${NEXT_CLASS_SUMMARY.title}. Mock reservation only.`,
        );
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        void scheduleClassReminder({
          classId: NEXT_CLASS_SUMMARY.id,
          classTitle: NEXT_CLASS_SUMMARY.title,
          startsAt: new Date(NEXT_CLASS_SUMMARY.startsAt),
        });
        // Soon classes open check-in shortly after reserve in this mock flow.
        if (NEXT_CLASS_SUMMARY.status === 'soon') {
          await wait(900);
          setReservationStatus('check_in');
          AccessibilityInfo.announceForAccessibility?.(
            `Check in is now available for ${NEXT_CLASS_SUMMARY.title}.`,
          );
        }
        return;
      }

      if (reservationStatus === 'check_in') {
        await wait(450);
        setReservationStatus('checked_in');
        setWeeklyClassesCompleted((current) =>
          Math.min(current + 1, HOME_USER_SUMMARY.weeklyClassGoal),
        );
        awardXp(CHECK_IN_XP, `Checked in · ${NEXT_CLASS_SUMMARY.title}`);
        setXpEarnedLabel(`+${CHECK_IN_XP} XP`);
        AccessibilityInfo.announceForAccessibility?.(
          `Checked in to ${NEXT_CLASS_SUMMARY.title}. Plus ${CHECK_IN_XP} XP.`,
        );
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );
        return;
      }

      if (reservationStatus === 'class_full') {
        await wait(450);
        AccessibilityInfo.announceForAccessibility?.(
          `Joined waitlist for ${NEXT_CLASS_SUMMARY.title}. Mock action only.`,
        );
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleQuickAction = (id: QuickActionId) => {
    switch (id) {
      case 'reserveClass':
      case 'viewSchedule':
        navigation.navigate('Schedule');
        break;
      case 'logTraining':
        navigation.navigate('WorkoutLog');
        break;
      case 'logTechnique':
        navigation.navigate('WorkoutLog', {
          screen: 'WorkoutDetails',
        });
        break;
      default:
        break;
    }
  };

  return (
    <Screen scroll padded={false} flushTop contentStyle={styles.content}>
      <HomeHeroBanner
        greeting={greeting}
        firstName={firstName}
        motivationalMessage={motivationalMessage}
      />

      <View style={styles.body}>
        <FadeIn delay={60}>
          <NextClassCard
            nextClass={NEXT_CLASS_SUMMARY}
            reservationStatus={reservationStatus}
            actionLoading={actionLoading}
            xpEarnedLabel={xpEarnedLabel}
            onPrimaryAction={() => {
              void handlePrimaryClassAction();
            }}
            onOpenDetails={() => navigation.navigate('Schedule')}
          />
        </FadeIn>

        {showPermissionCard || showBlockedCard ? (
          <>
            <Spacer size="md" />
            <FadeIn delay={80}>
              <NotificationPermissionCard
                loading={permissionLoading}
                statusMessage={permissionMessage}
                showOpenSettings={showBlockedCard}
                onEnable={() => {
                  setPermissionLoading(true);
                  setPermissionMessage(null);
                  void enableNotifications()
                    .then((result) => {
                      setPermissionMessage(result.message);
                    })
                    .finally(() => setPermissionLoading(false));
                }}
                onNotNow={() => {
                  void deferPermissionPrompt();
                }}
                onOpenSettings={() => {
                  void openSettings();
                }}
              />
            </FadeIn>
          </>
        ) : null}

        <Spacer size="md" />

        <FadeIn delay={100}>
          <JourneySummaryCard
            summary={journeySummary}
            onOpenJourney={() => navigation.navigate('Journey')}
          />
        </FadeIn>

        {latestAnnouncement ? (
          <>
            <Spacer size="md" />
            <FadeIn delay={140}>
              <Text variant="subtitle" style={styles.sectionTitle}>
                Academy Announcement
              </Text>
              <Spacer size="sm" />
              <LatestAnnouncementCard
                announcement={latestAnnouncement}
                onPress={() =>
                  navigation.navigate('Community', {
                    screen: 'AnnouncementDetail',
                    params: { announcementId: latestAnnouncement.id },
                  })
                }
              />
            </FadeIn>
          </>
        ) : null}

        <Spacer size="md" />

        <FadeIn delay={160}>
          <LocalEventsTile
            onPress={() => navigation.navigate('LocalEvents')}
          />
        </FadeIn>

        <Spacer size="lg" />

        <FadeIn delay={180}>
          <QuickActions actions={QUICK_ACTIONS} onAction={handleQuickAction} />
        </FadeIn>

        <Spacer size="lg" />

        <FadeIn delay={220}>
          <UpcomingEvents events={UPCOMING_EVENTS} />
        </FadeIn>

        <View style={styles.bottomSpace} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
  },
  body: {
    width: '100%',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: 17,
  },
  bottomSpace: {
    height: spacing.xl,
  },
});
