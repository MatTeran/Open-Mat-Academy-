import { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import type { BeltRank } from '../../../types/user';
import {
  type BeltStripeCount,
  getBeltAppearance,
} from './beltConfig';

export interface BjjBeltDisplayProps {
  belt: BeltRank;
  stripes: BeltStripeCount;
  /** Optional width override; defaults to ~84% of card-fit width. */
  width?: number;
  /** Skip entrance motion when embedding in already-animated parents. */
  animate?: boolean;
}

/**
 * Photorealistic tied adult BJJ belt — product image per rank,
 * with dynamic promotion stripes overlaid on the rank tip.
 */
export function BjjBeltDisplay({
  belt,
  stripes,
  width,
  animate = true,
}: BjjBeltDisplayProps) {
  const { width: windowWidth } = useWindowDimensions();
  const appearance = getBeltAppearance(belt);
  const opacity = useRef(new Animated.Value(animate ? 0 : 1)).current;
  const scale = useRef(new Animated.Value(animate ? 0.96 : 1)).current;
  const settleY = useRef(new Animated.Value(animate ? 6 : 0)).current;

  const beltWidth = useMemo(() => {
    if (typeof width === 'number') {
      return width;
    }
    return Math.min(348, Math.max(260, Math.round(windowWidth * 0.82)));
  }, [width, windowWidth]);

  // Asset aspect ~1.5 (880x587 after resize) — keep card-friendly height.
  const stageHeight = Math.round(beltWidth * 0.58);

  useEffect(() => {
    if (!animate) {
      return;
    }
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 480,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(settleY, {
        toValue: 0,
        duration: 480,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [animate, opacity, scale, settleY]);

  const stripeIndexes = useMemo(
    () => Array.from({ length: stripes }, (_, index) => index),
    [stripes],
  );

  const overlay = appearance.stripeOverlay;
  const overlayWidth = (beltWidth * overlay.widthPct) / 100;
  const overlayHeight = (stageHeight * overlay.heightPct) / 100;
  const stripeGap = Math.max(3, overlayWidth * 0.14);
  const stripeW = Math.max(3, overlayWidth * 0.16);
  const stripeH = overlayHeight * 0.72;
  const stripeSpan =
    stripeIndexes.length > 0
      ? stripeIndexes.length * stripeW + (stripeIndexes.length - 1) * stripeGap
      : 0;

  return (
    <Animated.View
      accessibilityRole="image"
      accessibilityLabel={`${belt} belt${stripes > 0 ? `, ${stripes} stripes` : ''}`}
      style={[
        styles.stage,
        {
          width: beltWidth,
          height: stageHeight,
          opacity,
          transform: [{ translateY: settleY }, { scale }],
        },
      ]}
    >
      <Image
        source={appearance.image}
        style={styles.image}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />

      {/* Dynamic promotion stripes on the rank tip */}
      {stripeIndexes.length > 0 ? (
        <View
          pointerEvents="none"
          style={[
            styles.stripeOverlay,
            {
              right: (beltWidth * overlay.rightPct) / 100,
              top: (stageHeight * overlay.topPct) / 100,
              width: overlayWidth,
              height: overlayHeight,
              transform: [{ rotate: `${overlay.rotateDeg}deg` }],
            },
          ]}
        >
          <View
            style={[
              styles.stripeRow,
              {
                width: stripeSpan,
                gap: stripeGap,
              },
            ]}
          >
            {stripeIndexes.map((index) => (
              <View
                key={`stripe-${index}`}
                style={{
                  width: stripeW,
                  height: stripeH,
                  borderRadius: 1.5,
                  backgroundColor: appearance.stripeColor,
                  shadowColor: '#000',
                  shadowOpacity: 0.25,
                  shadowRadius: 1,
                  shadowOffset: { width: 0, height: 0.5 },
                }}
              />
            ))}
          </View>
        </View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignSelf: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  stripeOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stripeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
