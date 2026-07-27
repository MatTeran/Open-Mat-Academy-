import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
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

import { colors, radii, spacing } from '../../lib/theme';
import type { AchievementBadge } from '../../types/journey';
import {
  formatRarity,
  formatUnlockedDate,
  formatXp,
  getBadgeProgress,
} from '../../utils/journey';
import { Button } from '../ui/Button';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';
import { ProgressBar } from './ProgressBar';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface BadgeDetailModalProps {
  badge: AchievementBadge | null;
  visible: boolean;
  onClose: () => void;
}

export function BadgeDetailModal({
  badge,
  visible,
  onClose,
}: BadgeDetailModalProps) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible || !badge?.isUnlocked) {
      pulse.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1100,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [badge?.isUnlocked, pulse, visible]);

  if (!badge) {
    return null;
  }

  const progress = getBadgeProgress(badge);
  const glowScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });
  const glowOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.45],
  });

  const handleShare = async () => {
    const message = badge.isUnlocked
      ? `I unlocked ${badge.name} on Open Mat — ${badge.description}`
      : `Working toward ${badge.name} on Open Mat — ${progress.current}/${progress.target} ${badge.requirementLabel}.`;
    try {
      await Share.share({ message });
    } catch {
      // User dismissed share sheet.
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close badge details">
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          <View style={styles.artworkWrap}>
            {badge.isUnlocked ? (
              <Animated.View
                style={[
                  styles.glow,
                  { opacity: glowOpacity, transform: [{ scale: glowScale }] },
                ]}
              />
            ) : null}
            <View
              style={[
                styles.artwork,
                badge.isUnlocked ? styles.artworkUnlocked : styles.artworkLocked,
              ]}
            >
              <Ionicons
                name={(badge.icon as IconName) || 'ribbon-outline'}
                size={42}
                color={badge.isUnlocked ? colors.goldAccent : colors.secondaryText}
              />
            </View>
          </View>

          <Spacer size="md" />
          <Text variant="title" style={styles.center}>
            {badge.name}
          </Text>
          <Spacer size="xs" />
          <Text variant="caption" gold style={styles.center}>
            {formatRarity(badge.rarity)}
          </Text>
          <Spacer size="sm" />
          <Text variant="bodyMuted" style={styles.center}>
            {badge.description}
          </Text>

          <Spacer size="lg" />
          <Text variant="caption">Requirements</Text>
          <Spacer size="xs" />
          <Text variant="body">
            {badge.requirementTarget} {badge.requirementLabel}
          </Text>

          <Spacer size="md" />
          <ProgressBar
            progress={progress.percent}
            tone={badge.isUnlocked ? 'success' : 'gold'}
            height={10}
          />
          <Spacer size="sm" />
          <Text variant="body">
            {progress.current} / {progress.target} {badge.requirementLabel}
          </Text>
          {!badge.isUnlocked ? (
            <>
              <Spacer size="xs" />
              <Text variant="caption">
                {progress.remaining} remaining
              </Text>
            </>
          ) : (
            <>
              <Spacer size="xs" />
              <Text variant="caption" gold>
                Unlocked {formatUnlockedDate(badge.unlockedAt)}
              </Text>
            </>
          )}

          <Spacer size="md" />
          <Text variant="caption">
            XP {badge.isUnlocked ? 'earned' : 'reward'}: +{formatXp(badge.xpReward)}
          </Text>

          <Spacer size="xl" />
          <Button label="Share Achievement" onPress={handleShare} />
          <Spacer size="sm" />
          <Button label="Close" variant="ghost" onPress={onClose} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  sheet: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  artworkWrap: {
    alignSelf: 'center',
    width: 104,
    height: 104,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 104,
    height: 104,
    borderRadius: radii.pill,
    backgroundColor: colors.goldAccent,
  },
  artwork: {
    width: 88,
    height: 88,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  artworkUnlocked: {
    backgroundColor: colors.goldMuted,
    borderColor: colors.goldAccent,
  },
  artworkLocked: {
    backgroundColor: colors.primaryBackground,
    borderColor: colors.border,
  },
  center: {
    textAlign: 'center',
  },
});
