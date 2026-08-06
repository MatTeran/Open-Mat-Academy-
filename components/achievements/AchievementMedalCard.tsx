import * as Haptics from 'expo-haptics';
import { useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import { rarityLabel } from '../../lib/achievements/meta';
import { achievementTokens } from '../../lib/achievements/tokens';
import type { AchievementBadge } from '../../types/journey';
import { getBadgeProgress } from '../../utils/journey';
import { Text } from '../ui/Text';
import { AchievementMedal } from './AchievementMedal';

interface AchievementMedalCardProps {
  badge: AchievementBadge;
  onPress: () => void;
  celebrate?: boolean;
  /** Larger medal treatment for featured / prototype showcase. */
  featured?: boolean;
}

/** Short gallery status — rarity · earned, or progress only. */
export function galleryStatusLine(badge: AchievementBadge): string {
  if (badge.isUnlocked) {
    return `${rarityLabel(badge.rarity)} · Earned`;
  }
  const progress = getBadgeProgress(badge);
  const unit = shortRequirementUnit(badge.requirementLabel, badge.requirementType);
  return `${progress.current} of ${progress.target} ${unit}`;
}

function shortRequirementUnit(label: string, type: string): string {
  const lower = label.toLowerCase();
  if (type.includes('streak') || lower.includes('streak') || lower.includes('day')) {
    return 'days';
  }
  if (lower.includes('evening') || lower.includes('night')) {
    return 'evening classes';
  }
  if (lower.includes('early')) {
    return 'early classes';
  }
  if (lower.includes('open mat')) {
    return 'open mats';
  }
  if (lower.includes('class')) {
    return 'classes';
  }
  if (lower.includes('challenge')) {
    return 'challenges';
  }
  return lower.replace(/completed|earned/g, '').trim() || 'complete';
}

export function achievementA11yLabel(badge: AchievementBadge): string {
  const rarity = rarityLabel(badge.rarity);
  if (badge.isUnlocked) {
    return `${badge.name}, ${rarity} achievement, earned.`;
  }
  const progress = getBadgeProgress(badge);
  const unit = shortRequirementUnit(badge.requirementLabel, badge.requirementType);
  return `${badge.name}, ${rarity} achievement, ${progress.current} of ${progress.target} ${unit} completed.`;
}

export function AchievementMedalCard({
  badge,
  onPress,
  celebrate = false,
  featured = false,
}: AchievementMedalCardProps) {
  const { width, fontScale } = useWindowDimensions();
  const singleColumn = fontScale >= 1.35 || width < 340;
  const medalSize = useMemo(() => {
    if (featured) {
      if (singleColumn) {
        return Math.min(168, Math.max(140, width * 0.5));
      }
      const col = (width - 48 - 20) / 2;
      return Math.min(162, Math.max(138, col * 0.88));
    }
    if (singleColumn) {
      return Math.min(150, Math.max(120, width * 0.42));
    }
    const col = (width - 48 - 20) / 2;
    return Math.min(148, Math.max(118, col * 0.78));
  }, [featured, singleColumn, width]);

  const status = galleryStatusLine(badge);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={achievementA11yLabel(badge)}
      onPress={() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [
        styles.item,
        featured && styles.itemFeatured,
        singleColumn ? styles.itemFull : styles.itemHalf,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.medalWrap, featured && styles.medalWrapFeatured]}>
        <AchievementMedal badge={badge} size={medalSize} celebrate={celebrate} />
      </View>

      <Text
        variant="body"
        numberOfLines={2}
        style={[
          styles.name,
          featured && styles.nameFeatured,
          !badge.isUnlocked && styles.lockedText,
        ]}
      >
        {badge.name}
      </Text>

      <Text variant="caption" style={styles.status} numberOfLines={1}>
        {status}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    gap: 8,
    minHeight: 196,
  },
  itemFeatured: {
    minHeight: 228,
    paddingVertical: 14,
  },
  itemHalf: {
    width: '47%',
  },
  itemFull: {
    width: '100%',
  },
  pressed: {
    opacity: 0.94,
    transform: [{ scale: 0.975 }],
  },
  medalWrap: {
    marginBottom: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 128,
  },
  medalWrapFeatured: {
    minHeight: 150,
  },
  name: {
    color: achievementTokens.text,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '600',
    minHeight: 38,
  },
  nameFeatured: {
    fontSize: 16,
    lineHeight: 20,
  },
  lockedText: {
    color: achievementTokens.textSecondary,
  },
  status: {
    color: achievementTokens.textMuted,
    textAlign: 'center',
    fontSize: 12,
  },
});
