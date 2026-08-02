import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';

import { AchievementDetailModal } from '../../components/achievements/AchievementDetailModal';
import { AchievementMedalCard } from '../../components/achievements/AchievementMedalCard';
import {
  Button,
  ChallengeCard,
  EmptyState,
  FadeIn,
  JourneySkeleton,
  MonthlyChallengeCard,
  RecentAchievementsCarousel,
  Screen,
  SectionHeader,
  Spacer,
  Text,
  WeeklyStreakCard,
  XPProgressCard,
} from '../../components';
import { useAppTheme } from '../../hooks';
import { useJourney } from '../../lib/providers/JourneyProvider';
import { spacing } from '../../lib/theme';
import type { AchievementBadge } from '../../types/journey';
import type { HomeStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<HomeStackParamList, 'Journey'>;

export function JourneyScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const {
    isLoading,
    profile,
    streak,
    weeklyChallenges,
    monthlyChallenges,
    badges,
    recentAchievements,
    refreshing,
    refresh,
    getBadge,
    celebrateChallenge,
    celebratedChallengeIds,
  } = useJourney();

  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(
    null,
  );

  const badgeNameById = useMemo(() => {
    const map = new Map<string, string>();
    badges.forEach((badge) => map.set(badge.id, badge.name));
    return map;
  }, [badges]);

  useEffect(() => {
    weeklyChallenges.forEach((challenge) => {
      if (
        challenge.status === 'completed' ||
        challenge.currentProgress >= challenge.target
      ) {
        if (!celebratedChallengeIds.includes(challenge.id)) {
          celebrateChallenge(challenge.id);
          void Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success,
          );
        }
      }
    });
  }, [
    celebrateChallenge,
    celebratedChallengeIds,
    weeklyChallenges,
  ]);

  const openBadge = useCallback(
    (badgeId: string) => {
      const badge = getBadge(badgeId);
      if (badge) {
        setSelectedBadge(badge);
        if (badge.isUnlocked) {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }
    },
    [getBadge],
  );

  return (
    <Screen
      scroll
      contentStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            void refresh();
          }}
          tintColor={colors.goldAccent}
          colors={[colors.goldAccent]}
        />
      }
    >
      <FadeIn>
        <Button
          label="Back"
          variant="ghost"
          onPress={() => navigation.goBack()}
        />
        <Spacer size="sm" />
        <Text variant="hero" accessibilityRole="header">
          Journey
        </Text>
        <Spacer size="sm" />
        <Text variant="bodyMuted">
          Track training XP, streaks, challenges, and badges.
        </Text>
      </FadeIn>

      <Spacer size="xl" />

      {isLoading ? (
        <JourneySkeleton />
      ) : (
        <>
          <FadeIn delay={40}>
            <XPProgressCard profile={profile} />
          </FadeIn>

          <Spacer size="xl" />

          <FadeIn delay={80}>
            <WeeklyStreakCard streak={streak} />
          </FadeIn>

          <Spacer size="xl" />

          <FadeIn delay={120}>
            <SectionHeader title="Weekly Challenges" />
            {weeklyChallenges.length === 0 ? (
              <EmptyState
                title="No weekly challenges"
                message="New weekly challenges appear every Monday."
              />
            ) : (
              <View style={styles.stack}>
                {weeklyChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    celebrate={celebratedChallengeIds.includes(challenge.id)}
                  />
                ))}
              </View>
            )}
          </FadeIn>

          <Spacer size="xl" />

          <FadeIn delay={160}>
            <SectionHeader title="Monthly Challenges" />
            {monthlyChallenges.length === 0 ? (
              <EmptyState
                title="No monthly challenges"
                message="Monthly goals reset at the start of each month."
              />
            ) : (
              <View style={styles.stack}>
                {monthlyChallenges.map((challenge) => (
                  <MonthlyChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    badgeName={
                      challenge.badgeRewardId
                        ? badgeNameById.get(challenge.badgeRewardId)
                        : null
                    }
                  />
                ))}
              </View>
            )}
          </FadeIn>

          <Spacer size="xl" />

          <FadeIn delay={200}>
            <SectionHeader
              title="Achievement Gallery"
              actionLabel="View all"
              onAction={() => navigation.navigate('AchievementGallery')}
            />
            <Text variant="caption" muted>
              Collectible enamel medals across attendance, streaks, and more.
            </Text>
            <Spacer size="md" />
            <View style={styles.badgeGrid}>
              {badges.slice(0, 4).map((badge) => (
                <AchievementMedalCard
                  key={badge.id}
                  badge={badge}
                  celebrate={false}
                  onPress={() => openBadge(badge.id)}
                />
              ))}
            </View>
            <Spacer size="md" />
            <Button
              label="Open Achievement Gallery"
              variant="secondary"
              onPress={() => navigation.navigate('AchievementGallery')}
            />
          </FadeIn>

          <Spacer size="xl" />

          <FadeIn delay={240}>
            <SectionHeader title="Recent Achievements" />
            <RecentAchievementsCarousel
              items={recentAchievements}
              onPressItem={openBadge}
            />
          </FadeIn>
        </>
      )}

      <View style={styles.bottomSpace} />

      <AchievementDetailModal
        badge={selectedBadge}
        visible={Boolean(selectedBadge)}
        onClose={() => setSelectedBadge(null)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
  },
  stack: {
    gap: spacing.md,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  bottomSpace: {
    height: spacing.xl,
  },
});
