import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '../../lib/theme';
import type { AchievementBadge } from '../../types/journey';
import {
  formatRarity,
  formatUnlockedDate,
  getBadgeProgress,
} from '../../utils/journey';
import { Text } from '../ui/Text';
import { ProgressBar } from './ProgressBar';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface AchievementBadgeCardProps {
  badge: AchievementBadge;
  onPress: () => void;
}

export function AchievementBadgeCard({
  badge,
  onPress,
}: AchievementBadgeCardProps) {
  const progress = getBadgeProgress(badge);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${badge.name}. ${badge.isUnlocked ? 'Unlocked' : 'Locked'}. ${badge.rarity} rarity.`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View
        style={[
          styles.iconWrap,
          badge.isUnlocked ? styles.iconUnlocked : styles.iconLocked,
        ]}
      >
        <Ionicons
          name={(badge.icon as IconName) || 'ribbon-outline'}
          size={22}
          color={badge.isUnlocked ? colors.goldAccent : colors.secondaryText}
        />
      </View>
      <Text variant="body" numberOfLines={1} style={styles.name}>
        {badge.name}
      </Text>
      <Text variant="caption" numberOfLines={2} style={styles.description}>
        {badge.description}
      </Text>
      <View style={styles.rarityPill}>
        <Text variant="caption" style={styles.rarityText}>
          {formatRarity(badge.rarity)}
        </Text>
      </View>
      {badge.isUnlocked ? (
        <Text variant="caption" gold>
          {formatUnlockedDate(badge.unlockedAt)}
        </Text>
      ) : (
        <>
          <ProgressBar progress={progress.percent} height={6} />
          <Text variant="caption">
            {progress.current} / {progress.target}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47.5%',
    minHeight: 196,
    backgroundColor: colors.secondaryBackground,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    borderWidth: 1,
  },
  iconUnlocked: {
    backgroundColor: colors.goldMuted,
    borderColor: colors.goldAccent,
  },
  iconLocked: {
    backgroundColor: colors.primaryBackground,
    borderColor: colors.border,
  },
  name: {
    color: colors.text,
  },
  description: {
    minHeight: 34,
  },
  rarityPill: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    backgroundColor: colors.goldMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginVertical: 2,
  },
  rarityText: {
    color: colors.goldAccent,
  },
});
