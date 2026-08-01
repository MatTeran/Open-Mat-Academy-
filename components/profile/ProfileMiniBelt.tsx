import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii } from '../../lib/theme';
import type { BeltRank } from '../../types/user';

const BELT_COLORS: Record<BeltRank, string> = {
  white: '#F5F5F5',
  blue: '#1D4ED8',
  purple: '#7C3AED',
  brown: '#78350F',
  black: '#111111',
};

interface ProfileMiniBeltProps {
  belt: BeltRank;
  stripes: 0 | 1 | 2 | 3 | 4;
  /** `compact` for small tiles; `wide` for the full-width profile bar. */
  size?: 'compact' | 'wide';
}

/** Belt stripe bar for profile surfaces. */
export function ProfileMiniBelt({
  belt,
  stripes,
  size = 'compact',
}: ProfileMiniBeltProps) {
  const { colors } = useAppTheme();
  const needsBorder = belt === 'white' || belt === 'black';
  const wide = size === 'wide';

  return (
    <View
      style={[
        styles.belt,
        wide && styles.beltWide,
        {
          backgroundColor: BELT_COLORS[belt],
          borderColor: needsBorder ? colors.border : 'transparent',
        },
      ]}
    >
      <View style={[styles.stripes, wide && styles.stripesWide]}>
        {Array.from({ length: 4 }).map((_, index) => (
          <View
            key={`stripe-${index}`}
            style={[
              styles.stripe,
              wide && styles.stripeWide,
              {
                opacity: index < stripes ? 1 : 0.22,
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
  );
}

const styles = StyleSheet.create({
  belt: {
    height: 16,
    borderRadius: radii.sm,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  beltWide: {
    width: '100%',
    height: 28,
    borderRadius: radii.md,
    paddingHorizontal: 14,
  },
  stripes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 3,
  },
  stripesWide: {
    gap: 5,
  },
  stripe: {
    width: 3,
    height: 10,
    borderRadius: 1,
  },
  stripeWide: {
    width: 5,
    height: 18,
    borderRadius: 1.5,
  },
});
