import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '../../lib/theme';
import type { Challenge } from '../../types/journey';
import {
  formatDaysRemaining,
  formatXp,
  getChallengeProgress,
} from '../../utils/journey';
import { Card } from '../ui/Card';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';
import { ProgressBar } from './ProgressBar';

interface ChallengeCardProps {
  challenge: Challenge;
  celebrate?: boolean;
}

export function ChallengeCard({
  challenge,
  celebrate = false,
}: ChallengeCardProps) {
  const progress = getChallengeProgress(challenge);
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!celebrate && !progress.isComplete) {
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [celebrate, progress.isComplete, pulse]);

  const glowOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.4],
  });

  return (
    <View style={styles.wrap}>
      {(celebrate || progress.isComplete) && (
        <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />
      )}
      <Card style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.copy}>
            <Text variant="subtitle">{challenge.title}</Text>
            <Spacer size="xs" />
            <Text variant="caption">{challenge.description}</Text>
          </View>
          <View
            style={[
              styles.xpPill,
              progress.isComplete ? styles.xpComplete : undefined,
            ]}
          >
            <Text
              variant="caption"
              style={progress.isComplete ? styles.xpCompleteText : styles.xpText}
            >
              +{formatXp(challenge.xpReward)} XP
            </Text>
          </View>
        </View>

        <Spacer size="md" />
        <ProgressBar
          progress={progress.percent}
          tone={progress.isComplete ? 'success' : 'gold'}
          accessibilityLabel={`${challenge.title} progress ${progress.current} of ${progress.target}`}
        />
        <Spacer size="sm" />
        <View style={styles.metaRow}>
          <Text variant="body">
            {progress.current} / {progress.target}
            {challenge.type === 'learn_techniques'
              ? ' Techniques'
              : challenge.type === 'open_mats'
                ? ' Open Mats'
                : challenge.type === 'training_sessions'
                  ? ' Training Sessions'
                  : ' Classes'}
          </Text>
          <Text variant="caption">
            {progress.isComplete
              ? 'Completed'
              : formatDaysRemaining(challenge.endDate)}
          </Text>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radii.lg,
    backgroundColor: colors.goldAccent,
  },
  card: {
    backgroundColor: colors.secondaryBackground,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  xpPill: {
    borderRadius: radii.pill,
    backgroundColor: colors.goldMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  xpComplete: {
    backgroundColor: 'rgba(34, 197, 94, 0.16)',
  },
  xpText: {
    color: colors.goldAccent,
  },
  xpCompleteText: {
    color: colors.success,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
});
