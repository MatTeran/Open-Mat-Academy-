import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing, w1Shadow } from '../../lib/theme';
import type { BeltRank } from '../../types/user';
import { Text } from '../ui/Text';
import {
  BjjBeltDisplay,
  formatBeltRankTitle,
  type BeltStripeCount,
} from './BjjBeltDisplay';

interface ProfileBeltBarProps {
  belt: BeltRank;
  stripes: BeltStripeCount;
  promotedAt: string;
  timeAtRankLabel: string;
  onPress: () => void;
}

function formatPromotedDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Full-width "Your Rank" card — realistic belt + promotion meta. */
export function ProfileBeltBar({
  belt,
  stripes,
  promotedAt,
  timeAtRankLabel,
  onPress,
}: ProfileBeltBarProps) {
  const { colors } = useAppTheme();
  const rankTitle = formatBeltRankTitle(belt, stripes);

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Your rank: ${rankTitle}. Promoted ${formatPromotedDate(promotedAt)}. Time at rank ${timeAtRankLabel}.`}
      onPress={handlePress}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <View
        style={[
          styles.card,
          w1Shadow.card,
          {
            backgroundColor: colors.secondaryBackground,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text
              variant="caption"
              style={[styles.headerLabel, { color: colors.goldAccent }]}
            >
              YOUR RANK
            </Text>
            <Ionicons
              name="ribbon-outline"
              size={15}
              color={colors.goldAccent}
              style={styles.headerIcon}
            />
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.secondaryText}
          />
        </View>

        <View style={styles.beltStage}>
          <BjjBeltDisplay belt={belt} stripes={stripes} />
        </View>

        <Text
          variant="subtitle"
          style={[styles.rankTitle, { color: colors.text }]}
        >
          {rankTitle}
        </Text>

        <View style={[styles.metaRow, { borderTopColor: colors.border }]}>
          <View style={styles.metaCol}>
            <View style={styles.metaLabelRow}>
              <Ionicons
                name="calendar-outline"
                size={13}
                color={colors.secondaryText}
              />
              <Text
                variant="caption"
                style={{ color: colors.secondaryText, marginLeft: 5 }}
              >
                Promoted
              </Text>
            </View>
            <Text variant="body" style={[styles.metaValue, { color: colors.text }]}>
              {formatPromotedDate(promotedAt)}
            </Text>
          </View>

          <View
            style={[styles.metaDivider, { backgroundColor: colors.border }]}
          />

          <View style={styles.metaCol}>
            <View style={styles.metaLabelRow}>
              <Ionicons
                name="time-outline"
                size={13}
                color={colors.secondaryText}
              />
              <Text
                variant="caption"
                style={{ color: colors.secondaryText, marginLeft: 5 }}
              >
                Time at Rank
              </Text>
            </View>
            <Text variant="body" style={[styles.metaValue, { color: colors.text }]}>
              {timeAtRankLabel}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
  card: {
    width: '100%',
    borderRadius: radii.xl,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    overflow: 'visible',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLabel: {
    letterSpacing: 1.1,
    fontSize: 11,
  },
  headerIcon: {
    marginLeft: 6,
  },
  beltStage: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    minHeight: 148,
  },
  rankTitle: {
    textAlign: 'center',
    fontSize: 17,
    letterSpacing: 0.6,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.sm,
    marginTop: spacing.xxs,
  },
  metaCol: {
    flex: 1,
    gap: 3,
  },
  metaLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  metaDivider: {
    width: StyleSheet.hairlineWidth,
    marginHorizontal: spacing.md,
    alignSelf: 'stretch',
  },
});
