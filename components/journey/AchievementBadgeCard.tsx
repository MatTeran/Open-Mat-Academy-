import { Pressable, StyleSheet, View } from 'react-native';

import { EnamelMedal } from '../achievements/EnamelMedal';
import { rarityLabel } from '../../lib/achievements/meta';
import { achievementTokens } from '../../lib/achievements/tokens';
import type { AchievementBadge } from '../../types/journey';
import { getBadgeProgress } from '../../utils/journey';
import { Text } from '../ui/Text';

interface AchievementBadgeCardProps {
  badge: AchievementBadge;
  onPress: () => void;
}

/** Compact Journey preview card — full gallery uses AchievementMedalCard. */
export function AchievementBadgeCard({
  badge,
  onPress,
}: AchievementBadgeCardProps) {
  const progress = getBadgeProgress(badge);
  const rarityColor = achievementTokens.rarity[badge.rarity];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${badge.name}. ${badge.isUnlocked ? 'Unlocked' : 'Locked'}. ${rarityLabel(badge.rarity)} rarity.`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      <EnamelMedal badge={badge} size={72} celebrate={badge.isUnlocked} />
      <Text
        variant="body"
        numberOfLines={2}
        style={[styles.name, { color: achievementTokens.text }]}
      >
        {badge.name}
      </Text>
      <View style={[styles.rarityPill, { borderColor: rarityColor }]}>
        <Text variant="caption" style={{ color: rarityColor }}>
          {rarityLabel(badge.rarity)}
        </Text>
      </View>
      {badge.isUnlocked ? (
        <Text variant="caption" style={{ color: achievementTokens.gold }}>
          Earned
        </Text>
      ) : (
        <Text variant="caption" style={{ color: achievementTokens.textMuted }}>
          {progress.current}/{progress.target}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47.5%',
    minHeight: 180,
    backgroundColor: achievementTokens.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: achievementTokens.border,
    padding: 12,
    gap: 6,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  name: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 18,
    minHeight: 36,
  },
  rarityPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
});
