import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AchievementDetailModal } from '../../components/achievements/AchievementDetailModal';
import { AchievementMedalCard } from '../../components/achievements/AchievementMedalCard';
import { Button, FadeIn, Screen, Spacer, Text } from '../../components';
import {
  BADGE_CATEGORY_ORDER,
  categoryLabel,
} from '../../lib/achievements/meta';
import { achievementTokens } from '../../lib/achievements/tokens';
import { useJourney } from '../../lib/providers/JourneyProvider';
import { spacing } from '../../lib/theme';
import type { AchievementBadge, BadgeCategory } from '../../types/journey';
import type { HomeStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<HomeStackParamList, 'AchievementGallery'>;

export function AchievementGalleryScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { badges, getBadge } = useJourney();
  const [selected, setSelected] = useState<AchievementBadge | null>(null);

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  const sections = useMemo(() => {
    return BADGE_CATEGORY_ORDER.map((category) => {
      const items = badges.filter((badge) => badge.category === category);
      const earned = items.filter((item) => item.isUnlocked).length;
      return { category, items, earned };
    }).filter((section) => section.items.length > 0);
  }, [badges]);

  const openBadge = useCallback(
    (badgeId: string) => {
      const badge = getBadge(badgeId);
      if (!badge) {
        return;
      }
      setSelected(badge);
      if (badge.isUnlocked) {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        void Haptics.selectionAsync();
      }
    },
    [getBadge],
  );

  return (
    <Screen
      scroll
      flushTop
      contentStyle={{
        ...styles.content,
        paddingTop: insets.top + spacing.md,
        backgroundColor: achievementTokens.background,
      }}
    >
      <FadeIn>
        <Button label="Back" variant="ghost" onPress={() => navigation.goBack()} />
        <Spacer size="sm" />
        <Text variant="hero" style={styles.title}>
          Achievements
        </Text>
        <Spacer size="xs" />
        <Text variant="bodyMuted" style={styles.subtitle}>
          Collectible academy medals. {unlockedCount} of {badges.length} earned.
        </Text>
      </FadeIn>

      <Spacer size="lg" />

      <FadeIn delay={40}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryStat}>
            <Text variant="title" style={styles.summaryValue}>
              {unlockedCount}
            </Text>
            <Text variant="caption" style={styles.summaryLabel}>
              Unlocked
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryStat}>
            <Text variant="title" style={styles.summaryValue}>
              {badges.length - unlockedCount}
            </Text>
            <Text variant="caption" style={styles.summaryLabel}>
              In progress
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryStat}>
            <Text variant="title" style={styles.summaryValue}>
              {sections.length}
            </Text>
            <Text variant="caption" style={styles.summaryLabel}>
              Categories
            </Text>
          </View>
        </View>
      </FadeIn>

      <Spacer size="xl" />

      {sections.map((section, index) => (
        <FadeIn key={section.category} delay={80 + index * 40}>
          <CategorySection
            category={section.category}
            earned={section.earned}
            total={section.items.length}
            items={section.items}
            onPressBadge={openBadge}
          />
          <Spacer size="xl" />
        </FadeIn>
      ))}

      <View style={{ height: spacing.xxl }} />

      <AchievementDetailModal
        badge={selected}
        visible={Boolean(selected)}
        onClose={() => setSelected(null)}
      />
    </Screen>
  );
}

function CategorySection({
  category,
  earned,
  total,
  items,
  onPressBadge,
}: {
  category: BadgeCategory;
  earned: number;
  total: number;
  items: AchievementBadge[];
  onPressBadge: (id: string) => void;
}) {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <View>
          <Text variant="subtitle" style={styles.sectionTitle}>
            {categoryLabel(category)}
          </Text>
          <Text variant="caption" style={styles.sectionMeta}>
            {earned} / {total} collected
          </Text>
        </View>
        <View style={styles.sectionTrack}>
          <View
            style={[
              styles.sectionFill,
              { width: `${total === 0 ? 0 : (earned / total) * 100}%` },
            ]}
          />
        </View>
      </View>
      <Spacer size="md" />
      <View style={styles.grid}>
        {items.map((badge) => (
          <AchievementMedalCard
            key={badge.id}
            badge={badge}
            celebrate={badge.isUnlocked}
            onPress={() => onPressBadge(badge.id)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    paddingHorizontal: spacing.lg,
  },
  title: {
    color: achievementTokens.text,
  },
  subtitle: {
    color: achievementTokens.textMuted,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: achievementTokens.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: achievementTokens.border,
    paddingVertical: 18,
    paddingHorizontal: 10,
  },
  summaryStat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  summaryValue: {
    color: achievementTokens.goldHighlight,
  },
  summaryLabel: {
    color: achievementTokens.textMuted,
  },
  summaryDivider: {
    width: 1,
    height: 36,
    backgroundColor: achievementTokens.border,
  },
  sectionHeader: {
    gap: 10,
  },
  sectionTitle: {
    color: achievementTokens.text,
  },
  sectionMeta: {
    color: achievementTokens.textMuted,
    marginTop: 2,
  },
  sectionTrack: {
    height: 3,
    borderRadius: 999,
    backgroundColor: '#1F1F1F',
    overflow: 'hidden',
  },
  sectionFill: {
    height: '100%',
    backgroundColor: achievementTokens.gold,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
});
