import { StyleSheet, View, ViewStyle } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import type { BeltRank } from '../../types/user';
import { Text } from '../ui/Text';

const BELT_COLORS: Record<BeltRank, string> = {
  white: '#F5F5F5',
  blue: '#1D4ED8',
  purple: '#7C3AED',
  brown: '#78350F',
  black: '#111111',
};

interface BeltBadgeProps {
  belt: BeltRank;
  stripes: 0 | 1 | 2 | 3 | 4;
  size?: 'md' | 'lg';
  /** Center the belt + caption (profile hero). */
  centered?: boolean;
  compact?: boolean;
}

export function BeltBadge({
  belt,
  stripes,
  size = 'md',
  centered = false,
  compact = false,
}: BeltBadgeProps) {
  const { colors } = useAppTheme();
  const height = size === 'lg' ? 28 : compact ? 14 : 18;
  const stripeWidth = size === 'lg' ? 5 : compact ? 3 : 3;
  const wrapStyle: ViewStyle = centered
    ? styles.wrapCentered
    : styles.wrap;

  return (
    <View style={wrapStyle}>
      <View
        style={[
          styles.belt,
          compact && styles.beltCompact,
          {
            height,
            backgroundColor: BELT_COLORS[belt],
            borderColor:
              belt === 'white' || belt === 'black'
                ? colors.border
                : 'transparent',
          },
        ]}
      >
        <View style={styles.stripeTrack}>
          {Array.from({ length: 4 }).map((_, index) => (
            <View
              key={`stripe-${index}`}
              style={[
                styles.stripe,
                {
                  width: stripeWidth,
                  height: height - (compact ? 4 : 6),
                  opacity: index < stripes ? 1 : 0.2,
                  backgroundColor:
                    belt === 'white' || belt === 'black'
                      ? colors.goldAccent
                      : '#FFFFFF',
                },
              ]}
            />
          ))}
        </View>
      </View>
      <Text
        variant="caption"
        style={[styles.caption, { color: colors.secondaryText }]}
      >
        {belt.charAt(0).toUpperCase() + belt.slice(1)} · {stripes} stripe
        {stripes === 1 ? '' : 's'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    gap: spacing.xs,
  },
  wrapCentered: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  belt: {
    width: '100%',
    maxWidth: 220,
    borderRadius: radii.sm,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  beltCompact: {
    width: 160,
    maxWidth: 160,
  },
  stripeTrack: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 4,
  },
  stripe: {
    borderRadius: 1,
  },
  caption: {},
});