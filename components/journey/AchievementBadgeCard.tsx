import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
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
  const { colors } = useAppTheme();
  const progress = getBadgeProgress(badge);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${badge.name}. ${badge.isUnlocked ? 'Unlocked' : 'Locked'}. ${badge.rarity} rarity.`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.secondaryBackground,
          borderColor: colors.border,
        },
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          badge.isUnlocked
            ? {
                backgroundColor: colors.goldMuted,
                borderColor: colors.goldAccent,
              }
            : {
                backgroundColor: colors.primaryBackground,
                borderColor: colors.border,
              },
        ]}
      >
        <Ionicons
          name={(badge.icon as IconName) || 'ribbon-outline'}
          size={22}
          color={badge.isUnlocked ? colors.goldAccent : colors.secondaryText}
        />
      </View>
      <Text variant="body" numberOfLines={1}>
        {badge.name}
      </Text>
      <Text variant="caption" muted numberOfLines={2} style={styles.description}>
        {badge.description}
      </Text>
      <View
        style={[styles.rarityPill, { backgroundColor: colors.goldMuted }]}
      >
        <Text variant="caption" style={{ color: colors.goldAccent }}>
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
          <Text variant="caption" muted>
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
    borderRadius: radii.lg,
    borderWidth: 1,
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
  description: {
    minHeight: 34,
  },
  rarityPill: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginVertical: 2,
  },
});
