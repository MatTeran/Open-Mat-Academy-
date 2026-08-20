import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';

import type { BeltRank } from '../../../types/user';
import {
  type BeltStripeCount,
  getBeltAppearance,
} from './beltConfig';

export interface BjjBeltDisplayProps {
  belt: BeltRank;
  stripes: BeltStripeCount;
  /** Optional width override; defaults to a compact card-fit size. */
  width?: number;
  /** Skip entrance motion when embedding in already-animated parents. */
  animate?: boolean;
}

/**
 * Reusable adult BJJ belt visualization — cloth body, knot depth,
 * rank bar, and dynamic promotion stripes.
 */
export function BjjBeltDisplay({
  belt,
  stripes,
  width,
  animate = true,
}: BjjBeltDisplayProps) {
  const { width: windowWidth } = useWindowDimensions();
  const palette = getBeltAppearance(belt);
  const opacity = useRef(new Animated.Value(animate ? 0 : 1)).current;
  const scale = useRef(new Animated.Value(animate ? 0.94 : 1)).current;
  const settleY = useRef(new Animated.Value(animate ? 8 : 0)).current;

  const beltWidth = useMemo(() => {
    if (typeof width === 'number') {
      return width;
    }
    // Compact: leave room for card padding on small phones.
    return Math.min(280, Math.max(210, windowWidth - 88));
  }, [width, windowWidth]);

  const height = Math.round(beltWidth * 0.22);
  const knotSize = Math.round(height * 1.15);
  const barWidth = Math.round(beltWidth * 0.16);
  const stripeGap = Math.max(3, Math.round(barWidth * 0.08));
  const stripeW = Math.max(3, Math.round(barWidth * 0.11));
  const stripeH = Math.round(height * 0.55);

  useEffect(() => {
    if (!animate) {
      return;
    }
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 480,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(settleY, {
        toValue: 0,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [animate, opacity, scale, settleY]);

  const stripeIndexes = useMemo(
    () => Array.from({ length: stripes }, (_, index) => index),
    [stripes],
  );

  return (
    <Animated.View
      accessibilityRole="image"
      accessibilityLabel={`${belt} belt${stripes > 0 ? `, ${stripes} stripes` : ''}`}
      style={[
        styles.stage,
        {
          width: beltWidth,
          height: height + 18,
          opacity,
          transform: [{ translateY: settleY }, { scale }],
        },
      ]}
    >
      {/* Left draping tail */}
      <View
        style={[
          styles.tail,
          styles.tailLeft,
          {
            height: height * 0.72,
            top: height * 0.34,
            backgroundColor: palette.beltColor,
            borderColor: palette.outlineColor,
            transform: [{ rotate: '-7deg' }],
            shadowColor: '#1A1712',
          },
        ]}
      >
        <LinearGradient
          colors={[palette.beltHighlight, 'transparent', 'rgba(0,0,0,0.22)']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={[styles.weaveLine, { backgroundColor: palette.beltShade }]}
        />
      </View>

      {/* Right draping tail + rank bar */}
      <View
        style={[
          styles.tail,
          styles.tailRight,
          {
            height: height * 0.78,
            top: height * 0.3,
            backgroundColor: palette.beltColor,
            borderColor: palette.outlineColor,
            transform: [{ rotate: '6deg' }],
            shadowColor: '#1A1712',
          },
        ]}
      >
        <LinearGradient
          colors={[palette.beltHighlight, 'transparent', 'rgba(0,0,0,0.25)']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={[
            styles.rankBar,
            {
              width: barWidth,
              backgroundColor: palette.rankBarColor,
            },
          ]}
        >
          <View style={[styles.stripeRow, { gap: stripeGap }]}>
            {stripeIndexes.map((index) => (
              <View
                key={`stripe-${index}`}
                style={{
                  width: stripeW,
                  height: stripeH,
                  borderRadius: 1.5,
                  backgroundColor: palette.stripeColor,
                }}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Main horizontal cloth behind knot */}
      <View
        style={[
          styles.cloth,
          {
            height,
            backgroundColor: palette.beltColor,
            borderColor: palette.outlineColor,
            shadowColor: '#1A1712',
          },
        ]}
      >
        <LinearGradient
          colors={[
            palette.beltHighlight,
            'rgba(255,255,255,0.04)',
            'rgba(0,0,0,0.28)',
          ]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={[
            styles.clothFold,
            { backgroundColor: palette.beltShade, opacity: 0.55 },
          ]}
        />
        <View
          style={[
            styles.clothFoldSecondary,
            { backgroundColor: palette.beltShade, opacity: 0.35 },
          ]}
        />
      </View>

      {/* Center knot — layered loops for depth */}
      <View
        style={[
          styles.knotWrap,
          {
            width: knotSize,
            height: knotSize,
            marginTop: (height - knotSize) / 2 + 2,
          },
        ]}
      >
        <View
          style={[
            styles.knotShadow,
            {
              width: knotSize * 0.92,
              height: knotSize * 0.55,
              backgroundColor: 'rgba(20,16,12,0.28)',
            },
          ]}
        />
        <View
          style={[
            styles.knotLoopBack,
            {
              width: knotSize * 0.78,
              height: knotSize * 0.48,
              backgroundColor: palette.beltShade,
              borderColor: palette.outlineColor,
            },
          ]}
        />
        <View
          style={[
            styles.knotLoopFront,
            {
              width: knotSize * 0.72,
              height: knotSize * 0.46,
              backgroundColor: palette.beltColor,
              borderColor: palette.outlineColor,
            },
          ]}
        >
          <LinearGradient
            colors={[palette.beltHighlight, 'transparent', 'rgba(0,0,0,0.35)']}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
        <View
          style={[
            styles.knotCore,
            {
              width: knotSize * 0.34,
              height: knotSize * 0.42,
              backgroundColor: palette.beltShade,
              borderColor: palette.outlineColor,
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.2)', 'transparent', 'rgba(0,0,0,0.4)']}
            style={StyleSheet.absoluteFill}
          />
        </View>
        {/* Loose end hanging from knot */}
        <View
          style={[
            styles.looseEnd,
            {
              width: knotSize * 0.28,
              height: knotSize * 0.55,
              backgroundColor: palette.beltColor,
              borderColor: palette.outlineColor,
            },
          ]}
        >
          <LinearGradient
            colors={[palette.beltHighlight, 'transparent', 'rgba(0,0,0,0.3)']}
            style={StyleSheet.absoluteFill}
          />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignSelf: 'center',
    justifyContent: 'flex-start',
    overflow: 'visible',
  },
  cloth: {
    width: '100%',
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    shadowOpacity: 0.14,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  clothFold: {
    position: 'absolute',
    left: '18%',
    right: '18%',
    top: '38%',
    height: 2,
    borderRadius: 1,
  },
  clothFoldSecondary: {
    position: 'absolute',
    left: '22%',
    right: '22%',
    top: '58%',
    height: 1.5,
    borderRadius: 1,
  },
  tail: {
    position: 'absolute',
    width: '34%',
    borderRadius: 9,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  tailLeft: {
    left: '4%',
  },
  tailRight: {
    right: '3%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 6,
  },
  weaveLine: {
    position: 'absolute',
    left: 8,
    right: 8,
    top: '45%',
    height: 1.5,
    opacity: 0.45,
    borderRadius: 1,
  },
  rankBar: {
    height: '78%',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  stripeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  knotWrap: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
  },
  knotShadow: {
    position: 'absolute',
    bottom: 2,
    borderRadius: 20,
  },
  knotLoopBack: {
    position: 'absolute',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    transform: [{ rotate: '-18deg' }],
  },
  knotLoopFront: {
    position: 'absolute',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    transform: [{ rotate: '16deg' }],
  },
  knotCore: {
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    zIndex: 2,
  },
  looseEnd: {
    position: 'absolute',
    bottom: -4,
    right: '18%',
    borderRadius: 7,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    transform: [{ rotate: '12deg' }],
    zIndex: 1,
  },
});
