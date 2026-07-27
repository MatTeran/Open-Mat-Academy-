import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '../../lib/theme';
import type { RecentAchievement } from '../../types/journey';
import { formatUnlockedDate } from '../../utils/journey';
import { Text } from '../ui/Text';
import { EmptyState } from './EmptyState';

interface RecentAchievementsCarouselProps {
  items: RecentAchievement[];
  onPressItem: (badgeId: string) => void;
}

export function RecentAchievementsCarousel({
  items,
  onPressItem,
}: RecentAchievementsCarouselProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No recent achievements"
        message="Complete challenges and training goals to earn badges."
      />
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {items.map((item) => (
        <Pressable
          key={item.id}
          accessibilityRole="button"
          accessibilityLabel={`${item.name}, unlocked ${formatUnlockedDate(item.unlockedAt)}`}
          onPress={() => onPressItem(item.badgeId)}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        >
          <View style={styles.iconWrap}>
            <Ionicons name="medal-outline" size={20} color={colors.goldAccent} />
          </View>
          <Text variant="body" numberOfLines={1}>
            {item.name}
          </Text>
          <Text variant="caption" numberOfLines={2}>
            Unlocked {formatUnlockedDate(item.unlockedAt)}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.md,
    paddingRight: spacing.md,
  },
  card: {
    width: 168,
    minHeight: 120,
    backgroundColor: colors.secondaryBackground,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  pressed: {
    opacity: 0.92,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.goldMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxs,
  },
});
