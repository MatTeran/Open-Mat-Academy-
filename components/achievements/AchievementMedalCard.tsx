import { Pressable, StyleSheet, View } from 'react-native';

import { categoryLabel, rarityLabel } from '../../lib/achievements/meta';
import { achievementTokens } from '../../lib/achievements/tokens';
import type { AchievementBadge } from '../../types/journey';
import { getBadgeProgress } from '../../utils/journey';
import { Text } from '../ui/Text';
import { EnamelMedal } from './EnamelMedal';

interface AchievementMedalCardProps {
  badge: AchievementBadge;
  onPress: () => void;
  celebrate?: boolean;
}

export function AchievementMedalCard({
  badge,
  onPress,
  celebrate = false,
}: AchievementMedalCardProps) {
  const progress = getBadgeProgress(badge);
  const rarityColor = achievementTokens.rarity[badge.rarity];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${badge.name}. ${rarityLabel(badge.rarity)}. ${
        badge.isUnlocked ? 'Unlocked' : 'Locked'
      }`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
        badge.rarity === 'legendary' && badge.isUnlocked && styles.legendaryCard,
      ]}
    >
      <View style={styles.medalWrap}>
        <EnamelMedal badge={badge} size={88} celebrate={celebrate} />
      </View>

      <Text
        variant="body"
        numberOfLines={2}
        style={[styles.name, !badge.isUnlocked && styles.lockedText]}
      >
        {badge.name}
      </Text>

      <View style={[styles.rarityPill, { borderColor: rarityColor }]}>
        <Text variant="caption" style={{ color: rarityColor }}>
          {rarityLabel(badge.rarity)}
        </Text>
      </View>

      <Text variant="caption" style={styles.meta} numberOfLines={1}>
        {categoryLabel(badge.category)}
      </Text>

      {!badge.isUnlocked ? (
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.max(4, progress.percent)}%` },
            ]}
          />
        </View>
      ) : (
        <Text variant="caption" style={styles.earned}>
          Earned
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47.5%',
    minHeight: 214,
    backgroundColor: achievementTokens.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: achievementTokens.border,
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 14,
    alignItems: 'center',
    gap: 6,
  },
  legendaryCard: {
    borderColor: 'rgba(212,175,55,0.45)',
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  medalWrap: {
    marginBottom: 4,
    minHeight: 92,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    color: achievementTokens.text,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 18,
    minHeight: 36,
  },
  lockedText: {
    color: achievementTokens.textMuted,
  },
  rarityPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  meta: {
    color: achievementTokens.textMuted,
  },
  progressTrack: {
    marginTop: 4,
    width: '100%',
    height: 4,
    borderRadius: 999,
    backgroundColor: '#222222',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: achievementTokens.gold,
  },
  earned: {
    marginTop: 4,
    color: achievementTokens.gold,
  },
});
