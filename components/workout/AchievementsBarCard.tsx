import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import type { AchievementBadge } from '../../types/journey';
import { FEATURED_MEDAL_IDS } from '../achievements/artworks';
import { AchievementMedal } from '../achievements/AchievementMedal';
import { Card } from '../ui/Card';
import { Text } from '../ui/Text';

interface AchievementsBarCardProps {
  badges: AchievementBadge[];
  onPress: () => void;
}

const MEDAL_SIZE = 46;

/**
 * Compact horizontal achievements strip for the Progress tab —
 * quick scan of collectible medals without opening the full gallery.
 */
export function AchievementsBarCard({
  badges,
  onPress,
}: AchievementsBarCardProps) {
  const { colors } = useAppTheme();

  const preview = useMemo(() => {
    const byId = new Map(badges.map((badge) => [badge.id, badge]));
    const featured = FEATURED_MEDAL_IDS.map((id) => byId.get(id)).filter(
      (badge): badge is AchievementBadge => Boolean(badge),
    );
    if (featured.length > 0) {
      return featured.slice(0, 8);
    }
    return [...badges]
      .sort((a, b) => Number(b.isUnlocked) - Number(a.isUnlocked))
      .slice(0, 8);
  }, [badges]);

  const earnedCount = useMemo(
    () => badges.filter((badge) => badge.isUnlocked).length,
    [badges],
  );

  return (
    <Card onPress={onPress} style={styles.card} padded={false}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text variant="subtitle">Achievements</Text>
            <Text variant="caption" muted>
              {earnedCount} of {badges.length} earned
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.secondaryText}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.medalRow}
        >
          {preview.map((badge) => (
            <View key={badge.id} style={styles.medalHit}>
              <AchievementMedal badge={badge} size={MEDAL_SIZE} />
            </View>
          ))}
        </ScrollView>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
  },
  inner: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  medalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: 2,
    paddingRight: spacing.sm,
  },
  medalHit: {
    width: MEDAL_SIZE + 4,
    height: MEDAL_SIZE + 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
