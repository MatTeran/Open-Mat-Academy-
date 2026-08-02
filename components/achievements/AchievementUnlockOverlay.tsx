import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Modal,
  StyleSheet,
  View,
} from 'react-native';

import { rarityLabel } from '../../lib/achievements/meta';
import { achievementTokens } from '../../lib/achievements/tokens';
import type { AchievementBadge } from '../../types/journey';
import { formatXp } from '../../utils/journey';
import { Text } from '../ui/Text';
import { AchievementMedal } from './AchievementMedal';

type Props = {
  badge: AchievementBadge | null;
  visible: boolean;
  onDone: () => void;
};

/** Short unlock ceremony (<2s). No confetti. Respects reduced motion. */
export function AchievementUnlockOverlay({ badge, visible, onDone }: Props) {
  const spin = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const xpCount = useRef(new Animated.Value(0)).current;
  const [xpDisplay, setXpDisplay] = useState(0);

  useEffect(() => {
    if (!visible || !badge) {
      spin.setValue(0);
      fade.setValue(0);
      xpCount.setValue(0);
      setXpDisplay(0);
      return;
    }

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let listener: string | undefined;

    const finish = () => {
      if (!cancelled) onDone();
    };

    void (async () => {
      const reduce = await AccessibilityInfo.isReduceMotionEnabled();
      if (cancelled) return;

      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (reduce) {
        fade.setValue(1);
        setXpDisplay(badge.xpReward);
        timeoutId = setTimeout(finish, 900);
        return;
      }

      fade.setValue(0);
      spin.setValue(0);
      xpCount.setValue(0);
      listener = xpCount.addListener(({ value }) => {
        setXpDisplay(Math.round(value));
      });

      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(spin, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(xpCount, {
          toValue: badge.xpReward,
          duration: 900,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
      ]).start(({ finished }) => {
        if (finished && !cancelled) {
          timeoutId = setTimeout(finish, 650);
        }
      });
    })();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      if (listener) xpCount.removeListener(listener);
    };
  }, [badge, fade, onDone, spin, visible, xpCount]);

  if (!badge) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onDone}>
      <Animated.View style={[styles.backdrop, { opacity: fade }]}>
        <Animated.View
          style={{
            transform: [
              {
                rotateY: spin.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['70deg', '0deg'],
                }),
              },
              {
                scale: spin.interpolate({
                  inputRange: [0, 0.7, 1],
                  outputRange: [0.82, 1.05, 1],
                }),
              },
            ],
          }}
        >
          <AchievementMedal badge={badge} size={180} celebrate />
        </Animated.View>
        <View style={styles.copy}>
          <Text variant="caption" style={styles.rarity}>
            {rarityLabel(badge.rarity)} Achievement
          </Text>
          <Text variant="title" style={styles.name}>
            {badge.name}
          </Text>
          <Text variant="subtitle" style={styles.xp}>
            +{formatXp(xpDisplay)} XP
          </Text>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    gap: 22,
  },
  copy: {
    alignItems: 'center',
    gap: 6,
  },
  rarity: {
    color: achievementTokens.gold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  name: {
    color: achievementTokens.text,
    textAlign: 'center',
  },
  xp: {
    color: achievementTokens.goldHighlight,
    marginTop: 4,
  },
});
