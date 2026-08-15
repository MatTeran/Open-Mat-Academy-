import {
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, Linking, StyleSheet, View } from 'react-native';

import {
  AcademyAnnouncementCard,
  AcademyUpcomingEvents,
  DashboardGrid,
  FadeIn,
  AcademyHero,
  GreetingSection,
  JourneyCard,
  LocalEventsHomeCard,
  NotificationPermissionCard,
  QuickActionsRow,
  Screen,
  Spacer,
  TrainingStreakCard,
  UpcomingEventCard,
  W1NextClassCard,
} from '../../components';
import { useAuth, useNotifications, useProfile } from '../../hooks';
import {
  HOME_USER_SUMMARY,
  NEXT_CLASS_SUMMARY,
  QUICK_ACTIONS,
  UPCOMING_EVENTS,
} from '../../lib/mocks/home';
import { scheduleClassReminder } from '../../lib/notifications';
import { useCommunity } from '../../lib/providers/CommunityProvider';
import { useJourney } from '../../lib/providers/JourneyProvider';
import { spacing, w1Spacing } from '../../lib/theme';
import { searchLocalEvents } from '../../services/events/localEventsSearch';
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

function parseAcademy(membershipName?: string | null): {
  academyName: string;
  locationLabel: string;
} {
  const raw = membershipName?.trim() || 'My Gi · Tracy';
  const [namePart, locationPart] = raw.split('·').map((part) => part.trim());
  return {
    academyName: (namePart || 'My Gi').toUpperCase(),
    locationLabel: (locationPart || 'Tracy, California').toUpperCase(),
  };
}

export function HomeScreen() {
  const { user } = useAuth();
  const { hub } = useProfile();
  const { announcements, seminars } = useCommunity();
  const { profile, streak, awardXp } = useJourney();
  const {
    permissionPromptStatus,
    enableNotifications,
    deferPermissionPrompt,
    openSettings,
    unreadCount,
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

  const localEventsQuery = useQuery({
    queryKey: ['home-local-events'],
    queryFn: () => searchLocalEvents({ radiusMiles: 250 }),
    staleTime: 1000 * 60 * 30,
  });

  const nearestLocalEvent = localEventsQuery.data?.events?.[0] ?? null;

  const { academyName, locationLabel } = useMemo(
    () => parseAcademy(hub.membership.academyName),
    [hub.membership.academyName],
  );

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
    currentStreak: journeySummary.currentStreak,
  });

  const latestAnnouncement = announcements[0] ?? null;

  const featuredSeminar = useMemo(() => {
    const seminar = seminars[0];
    if (seminar) {
      const datePart = seminar.dateLabel.replace(/\s*·\s*/g, ', ').toUpperCase();
      const timePart = seminar.timeLabel.split(/[–-]/)[0]?.trim() ?? seminar.timeLabel;
      return {
        title: seminar.title,
        whenLabel: `${datePart} • ${timePart}`,
      };
    }
    return {
      title: 'Guard Retention Masterclass',
      whenLabel: 'SAT, AUG 10 • 1:00 PM',
    };
  }, [seminars]);

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
          `Reserved ${NEXT_CLASS_SUMMARY.title}.`,
        );
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        void scheduleClassReminder({
          classId: NEXT_CLASS_SUMMARY.id,
          classTitle: NEXT_CLASS_SUMMARY.title,
          startsAt: new Date(NEXT_CLASS_SUMMARY.startsAt),
        });
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
          `Joined waitlist for ${NEXT_CLASS_SUMMARY.title}.`,
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
        return;
      case 'logTraining':
      case 'logTechnique':
        navigation.navigate('WorkoutLog', {
          screen: 'WorkoutDetails',
        });
        return;
      default:
        return;
    }
  };

  const openNearestEvent = () => {
    if (nearestLocalEvent?.url) {
      void Linking.openURL(nearestLocalEvent.url).catch(() => {
        navigation.navigate('LocalEvents');
      });
      return;
    }
    navigation.navigate('LocalEvents');
  };

  return (
    <Screen scroll padded={false} flushTop contentStyle={styles.content}>
      <AcademyHero
        academyName={academyName}
        locationLabel={
          locationLabel.includes(',')
            ? locationLabel
            : `${locationLabel}, CALIFORNIA`
        }
        unreadCount={unreadCount}
        onPressNotifications={() =>
          navigation.navigate('Profile', { screen: 'Notifications' })
        }
      />

      <View style={styles.body}>
        <FadeIn delay={40}>
          <GreetingSection
            greeting={greeting}
            firstName={firstName}
            message={motivationalMessage}
          />
        </FadeIn>

        <Spacer size="md" />

        <FadeIn delay={80}>
          <DashboardGrid
            left={
              <W1NextClassCard
                nextClass={NEXT_CLASS_SUMMARY}
                reservationStatus={reservationStatus}
                actionLoading={actionLoading}
                xpEarnedLabel={xpEarnedLabel}
                onPrimaryAction={() => {
                  void handlePrimaryClassAction();
                }}
                onOpenDetails={() => navigation.navigate('Schedule')}
              />
            }
            right={
              <JourneyCard
                summary={journeySummary}
                onOpenJourney={() => navigation.navigate('Journey')}
              />
            }
          />
        </FadeIn>

        {showPermissionCard || showBlockedCard ? (
          <>
            <Spacer size="md" />
            <View style={styles.inset}>
              <FadeIn delay={100}>
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
            </View>
          </>
        ) : null}

        <Spacer size="md" />
        <FadeIn delay={120}>
          <View style={styles.inset}>
            <UpcomingEventCard
              title={featuredSeminar.title}
              whenLabel={featuredSeminar.whenLabel}
              onPress={() => navigation.navigate('Community')}
            />
          </View>
        </FadeIn>

        <Spacer size="md" />
        <FadeIn delay={150}>
          <View style={styles.inset}>
            <TrainingStreakCard
              currentStreak={journeySummary.currentStreak}
              weekDays={streak.weekDays}
              onPress={() => navigation.navigate('Journey')}
            />
          </View>
        </FadeIn>

        {latestAnnouncement ? (
          <>
            <Spacer size="md" />
            <FadeIn delay={180}>
              <View style={styles.inset}>
                <AcademyAnnouncementCard
                  announcement={latestAnnouncement}
                  onPress={() =>
                    navigation.navigate('Community', {
                      screen: 'AnnouncementDetail',
                      params: { announcementId: latestAnnouncement.id },
                    })
                  }
                />
              </View>
            </FadeIn>
          </>
        ) : null}

        <Spacer size="md" />
        <FadeIn delay={210}>
          <View style={styles.inset}>
            <LocalEventsHomeCard
              event={nearestLocalEvent}
              loading={localEventsQuery.isLoading}
              onPressEvent={openNearestEvent}
              onViewAll={() => navigation.navigate('LocalEvents')}
            />
          </View>
        </FadeIn>

        <Spacer size="md" />
        <FadeIn delay={240}>
          <View style={styles.inset}>
            <QuickActionsRow
              actions={QUICK_ACTIONS}
              onAction={handleQuickAction}
            />
          </View>
        </FadeIn>

        <Spacer size="md" />
        <FadeIn delay={270}>
          <View style={styles.inset}>
            <AcademyUpcomingEvents
              events={UPCOMING_EVENTS}
              onPressEvent={() => navigation.navigate('Community')}
            />
          </View>
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
    paddingTop: spacing.lg,
  },
  inset: {
    paddingHorizontal: w1Spacing.screenX,
  },
  bottomSpace: {
    height: 120,
  },
});
