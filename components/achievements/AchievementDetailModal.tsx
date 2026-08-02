import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  Share,
  StyleSheet,
  View,
} from 'react-native';

import { categoryLabel, rarityLabel } from '../../lib/achievements/meta';
import { achievementTokens } from '../../lib/achievements/tokens';
import type { AchievementBadge } from '../../types/journey';
import {
  formatUnlockedDate,
  formatXp,
  getBadgeProgress,
} from '../../utils/journey';
import { Button } from '../ui/Button';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';
import { AchievementMedal } from './AchievementMedal';

interface AchievementDetailModalProps {
  badge: AchievementBadge | null;
  visible: boolean;
  onClose: () => void;
}

export function AchievementDetailModal({
  badge,
  visible,
  onClose,
}: AchievementDetailModalProps) {
  const rise = useRef(new Animated.Value(0)).current;
  const tilt = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      rise.setValue(0);
      tilt.setValue(0);
      return;
    }
    // One-shot entrance — no continuous idle loop (battery / reduced motion).
    Animated.parallel([
      Animated.timing(rise, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(tilt, {
          toValue: 1,
          duration: 420,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(tilt, {
          toValue: 0.5,
          duration: 380,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [rise, tilt, visible]);

  if (!badge) {
    return null;
  }

  const progress = getBadgeProgress(badge);
  const rarityColor = achievementTokens.rarity[badge.rarity];

  const handleShare = async () => {
    const message = badge.isUnlocked
      ? `I earned the ${badge.name} ${rarityLabel(badge.rarity)} medal on Open Mat Academy — ${badge.description}`
      : `Working toward ${badge.name} on Open Mat Academy — ${progress.current} of ${progress.target} ${badge.requirementLabel}.`;
    try {
      await Share.share({ message, title: badge.name });
    } catch {
      // dismissed
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        accessibilityLabel="Close achievement details"
      >
        <Animated.View
          style={[
            styles.sheet,
            {
              opacity: rise,
              transform: [
                {
                  translateY: rise.interpolate({
                    inputRange: [0, 1],
                    outputRange: [18, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Pressable onPress={(event) => event.stopPropagation()}>
            <Animated.View
              style={[
                styles.medalStage,
                {
                  transform: [
                    {
                      rotateZ: tilt.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: ['-3deg', '2deg', '0deg'],
                      }),
                    },
                    {
                      scale: tilt.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0.94, 1.03, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <AchievementMedal
                badge={badge}
                size={168}
                celebrate={badge.isUnlocked}
              />
            </Animated.View>

            <Spacer size="md" />
            <Text variant="title" style={styles.center}>
              {badge.name}
            </Text>
            <Spacer size="xs" />
            <Text variant="caption" style={[styles.center, { color: rarityColor }]}>
              {rarityLabel(badge.rarity)} Achievement
            </Text>
            <Spacer size="xs" />
            <Text variant="caption" style={styles.category}>
              {categoryLabel(badge.category)}
            </Text>

            <Spacer size="sm" />
            <Text variant="bodyMuted" style={styles.center}>
              {badge.description}
            </Text>

            <Spacer size="lg" />
            <View style={styles.statBlock}>
              {badge.isUnlocked ? (
                <>
                  <Text variant="caption" style={styles.label}>
                    Earned
                  </Text>
                  <Text variant="body" style={styles.statText}>
                    {formatUnlockedDate(badge.unlockedAt)}
                  </Text>
                  <Spacer size="sm" />
                  <Text variant="caption" style={styles.label}>
                    Requirement
                  </Text>
                  <Text variant="body" style={styles.statText}>
                    {badge.requirementLabel}: {progress.target}
                  </Text>
                </>
              ) : (
                <>
                  <Text variant="caption" style={styles.label}>
                    Progress
                  </Text>
                  <Text variant="body" style={styles.statText}>
                    {progress.current} of {progress.target}{' '}
                    {badge.requirementLabel.toLowerCase()} completed
                  </Text>
                  <Text variant="caption" style={styles.remaining}>
                    {progress.remaining} remaining
                  </Text>
                </>
              )}
            </View>

            <Spacer size="md" />
            <Text variant="caption" style={styles.label}>
              XP reward
            </Text>
            <Text variant="subtitle" style={styles.xp}>
              +{formatXp(badge.xpReward)} XP
            </Text>

            <Spacer size="xl" />
            <Button label="Share Achievement" onPress={() => void handleShare()} />
            <Spacer size="sm" />
            <Button label="Done" variant="ghost" onPress={onClose} />
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: achievementTokens.overlay,
    justifyContent: 'center',
    padding: 20,
  },
  sheet: {
    backgroundColor: achievementTokens.card,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: achievementTokens.border,
    padding: 22,
  },
  medalStage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  center: {
    textAlign: 'center',
    color: achievementTokens.text,
  },
  category: {
    textAlign: 'center',
    color: achievementTokens.textMuted,
  },
  statBlock: {
    backgroundColor: achievementTokens.cardElevated,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: achievementTokens.border,
  },
  label: {
    color: achievementTokens.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  statText: {
    color: achievementTokens.text,
    marginTop: 4,
  },
  remaining: {
    marginTop: 6,
    color: achievementTokens.textMuted,
  },
  xp: {
    color: achievementTokens.goldHighlight,
    marginTop: 4,
  },
});
