import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import {
  Text,
  spacing,
  type BeltRank,
  type BeltStripeCount,
} from '@openmat/shared';

const BELT_COLORS: Record<
  BeltRank,
  { fill: string; stripe: string; border: string }
> = {
  white: {
    fill: '#F2F2F0',
    stripe: '#141414',
    border: 'rgba(212,175,55,0.55)',
  },
  blue: {
    fill: '#1A4F9C',
    stripe: '#F4F4F4',
    border: 'rgba(212,175,55,0.4)',
  },
  purple: {
    fill: '#5A2D82',
    stripe: '#F4F4F4',
    border: 'rgba(212,175,55,0.4)',
  },
  brown: {
    fill: '#6B3F24',
    stripe: '#F4F4F4',
    border: 'rgba(212,175,55,0.4)',
  },
  black: {
    fill: '#0E0E0E',
    stripe: '#F4F4F4',
    border: 'rgba(212,175,55,0.75)',
  },
};

interface BeltBadgeProps {
  belt: BeltRank;
  stripes: BeltStripeCount;
  size?: 'md' | 'lg';
  showLabel?: boolean;
}

/** Authentic BJJ belt: cloth body + right rank sleeve with tape stripes. */
export function BeltBadge({
  belt,
  stripes,
  size = 'lg',
  showLabel = true,
}: BeltBadgeProps) {
  const palette = BELT_COLORS[belt];
  const width = size === 'lg' ? 236 : 180;
  const height = size === 'lg' ? 28 : 22;
  const sleeve = size === 'lg' ? 64 : 52;
  const tapeWidth = size === 'lg' ? 6 : 5;
  const tapeHeight = height - 10;

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.belt,
          {
            width,
            height,
            backgroundColor: palette.fill,
            borderColor: palette.border,
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.22)', 'transparent', 'rgba(0,0,0,0.18)']}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <View style={styles.tip} />
        <View style={styles.bodySpacer} />
        <View
          style={[
            styles.sleeve,
            {
              width: sleeve,
              backgroundColor:
                belt === 'black' ? 'rgba(30,30,30,0.98)' : 'rgba(0,0,0,0.18)',
            },
          ]}
        >
          {Array.from({ length: 4 }).map((_, index) => {
            const filled = index < stripes;
            return (
              <View
                key={`tape-${index}`}
                style={[
                  styles.tape,
                  {
                    width: tapeWidth,
                    height: tapeHeight,
                    backgroundColor: filled ? palette.stripe : 'transparent',
                    opacity: filled ? 1 : 0.22,
                    borderWidth: filled ? 0 : StyleSheet.hairlineWidth,
                    borderColor: palette.stripe,
                  },
                ]}
              />
            );
          })}
        </View>
      </View>
      {showLabel ? (
        <Text variant="subtitle">
          {belt.charAt(0).toUpperCase() + belt.slice(1)} Belt · {stripes} stripe
          {stripes === 1 ? '' : 's'}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  belt: {
    borderRadius: 3,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  tip: {
    marginLeft: 6,
    width: 4,
    height: '55%',
    borderRadius: 2,
    backgroundColor: 'rgba(212,175,55,0.65)',
  },
  bodySpacer: {
    flex: 1,
  },
  sleeve: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: 'rgba(0,0,0,0.28)',
  },
  tape: {
    borderRadius: 1,
  },
});
