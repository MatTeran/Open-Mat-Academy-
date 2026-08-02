import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AchievementDetailModal } from '../../components/achievements/AchievementDetailModal';
import { AchievementMedalCard } from '../../components/achievements/AchievementMedalCard';
import { Button, FadeIn, Screen, Spacer, Text } from '../../components';
import { PRODUCTION_PROTOTYPE_IDS } from '../../components/achievements/artworks';
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
  const inProgressCount = badges.length - unlockedCount;

  const sections = useMemo(() => {
    return BADGE_CATEGORY_ORDER.map((category) => {
      const items = badges.filter((badge) => badge.category === category);
      const earned = items.filter((item) => item.isUnlocked).length;
      return { category, items, earned };
    }).filter((section) => section.items.length > 0);
  }, [badges]);

  const prototypes = useMemo(
    () =>
      PRODUCTION_PROTOTYPE_IDS.map((id) => badges.find((b) => b.id === id)).filter(
        (b): b is AchievementBadge => Boolean(b),
      ),
    [badges],
  );

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
          {unlockedCount} of {badges.length} earned
        </Text>
      </FadeIn>

      <Spacer size="md" />

      <FadeIn delay={40}>
        <View style={styles.summaryRow}>
          <SummaryCell value={unlockedCount} label="Earned" />
          <View style={styles.summaryDivider} />
          <SummaryCell value={inProgressCount} label="In Progress" />
          <View style={styles.summaryDivider} />
          <SummaryCell value={sections.length} label="Collections" />
        </View>
      </FadeIn>

      <Spacer size="xl" />

      {prototypes.length > 0 ? (
        <FadeIn delay={60}>
          <Text variant="subtitle" style={styles.sectionTitle}>
            Prototype Medals
          </Text>
          <Text variant="caption" style={styles.sectionMeta}>
            Production-quality set for approval
          </Text>
          <Spacer size="md" />
          <View style={styles.grid}>
            {prototypes.map((badge) => (
              <AchievementMedalCard
                key={`proto-${badge.id}`}
                badge={badge}
                celebrate={false}
                onPress={() => openBadge(badge.id)}
              />
            ))}
          </View>
          <Spacer size="xl" />
        </FadeIn>
      ) : null}

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

function SummaryCell({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.summaryStat}>
      <Text variant="subtitle" style={styles.summaryValue}>
        {value}
      </Text>
      <Text variant="caption" style={styles.summaryLabel}>
        {label}
      </Text>
    </View>
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
            {earned} of {total} earned
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
            celebrate={false}
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
    color: achievementTokens.textSecondary,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: achievementTokens.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: achievementTokens.border,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  summaryStat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  summaryValue: {
    color: achievementTokens.goldHighlight,
    fontSize: 18,
  },
  summaryLabel: {
    color: achievementTokens.textMuted,
    fontSize: 11,
  },
  summaryDivider: {
    width: 1,
    height: 28,
    backgroundColor: achievementTokens.border,
  },
  sectionHeader: {
    gap: 8,
  },
  sectionTitle: {
    color: achievementTokens.text,
  },
  sectionMeta: {
    color: achievementTokens.textMuted,
    marginTop: 2,
  },
  sectionTrack: {
    height: 2,
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
    rowGap: spacing.lg,
  },
});
