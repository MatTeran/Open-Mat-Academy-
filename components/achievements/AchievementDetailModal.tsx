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
import { EnamelMedal } from './EnamelMedal';

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

  useEffect(() => {
    if (!visible) {
      rise.setValue(0);
      return;
    }
    Animated.timing(rise, {
      toValue: 1,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [rise, visible]);

  if (!badge) {
    return null;
  }

  const progress = getBadgeProgress(badge);
  const rarityColor = achievementTokens.rarity[badge.rarity];

  const handleShare = async () => {
    const message = badge.isUnlocked
      ? `I earned the ${badge.name} ${rarityLabel(badge.rarity)} medal on Open Mat Academy — ${badge.description}`
      : `Working toward ${badge.name} on Open Mat Academy — ${progress.current}/${progress.target} ${badge.requirementLabel}.`;
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
            <View style={styles.medalStage}>
              <EnamelMedal
                badge={badge}
                size={132}
                celebrate={badge.isUnlocked}
              />
            </View>

            <Spacer size="md" />
            <Text variant="title" style={styles.center}>
              {badge.name}
            </Text>
            <Spacer size="xs" />
            <View style={styles.metaRow}>
              <View style={[styles.chip, { borderColor: rarityColor }]}>
                <Text variant="caption" style={{ color: rarityColor }}>
                  {rarityLabel(badge.rarity)}
                </Text>
              </View>
              <View style={styles.chip}>
                <Text variant="caption" style={styles.chipText}>
                  {categoryLabel(badge.category)}
                </Text>
              </View>
            </View>

            <Spacer size="sm" />
            <Text variant="bodyMuted" style={styles.center}>
              {badge.description}
            </Text>

            <Spacer size="lg" />
            <View style={styles.statBlock}>
              <Text variant="caption" style={styles.label}>
                Progress
              </Text>
              <Spacer size="xs" />
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    {
                      width: `${badge.isUnlocked ? 100 : Math.max(4, progress.percent)}%`,
                      backgroundColor: badge.isUnlocked
                        ? achievementTokens.goldHighlight
                        : achievementTokens.gold,
                    },
                  ]}
                />
              </View>
              <Spacer size="xs" />
              <Text variant="body" style={styles.statText}>
                {progress.current} / {progress.target} {badge.requirementLabel}
              </Text>
              {badge.isUnlocked ? (
                <Text variant="caption" style={styles.earned}>
                  Earned {formatUnlockedDate(badge.unlockedAt)}
                </Text>
              ) : (
                <Text variant="caption" style={styles.remaining}>
                  {progress.remaining} remaining
                </Text>
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
            <Button label="Close" variant="ghost" onPress={onClose} />
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
    paddingVertical: 8,
  },
  center: {
    textAlign: 'center',
    color: achievementTokens.text,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: achievementTokens.border,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  chipText: {
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
  track: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#222',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
  statText: {
    color: achievementTokens.text,
  },
  earned: {
    marginTop: 4,
    color: achievementTokens.gold,
  },
  remaining: {
    marginTop: 4,
    color: achievementTokens.textMuted,
  },
  xp: {
    color: achievementTokens.goldHighlight,
    marginTop: 4,
  },
});
