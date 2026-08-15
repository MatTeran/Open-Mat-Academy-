import { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

import type { BeltRank } from '../../../types/user';
import {
  type BeltStripeCount,
  getBeltImage,
} from './beltConfig';

export interface BjjBeltDisplayProps {
  belt: BeltRank;
  stripes: BeltStripeCount;
  /** Optional width override; defaults to ~84% of card-fit width. */
  width?: number;
  /** Skip entrance motion when embedding in already-animated parents. */
  animate?: boolean;
}

/** Asset intrinsic aspect (~960×640). */
const BELT_ASPECT = 960 / 640;

/**
 * Photorealistic tied adult BJJ belt — clean product photo per rank/stripes.
 * Stripes live on the tip in the asset; no runtime overlay or drop shadow.
 */
export function BjjBeltDisplay({
  belt,
  stripes,
  width,
  animate = true,
}: BjjBeltDisplayProps) {
  const { width: windowWidth } = useWindowDimensions();
  const image = getBeltImage(belt, stripes);
  const opacity = useRef(new Animated.Value(animate ? 0 : 1)).current;
  const scale = useRef(new Animated.Value(animate ? 0.96 : 1)).current;
  const settleY = useRef(new Animated.Value(animate ? 6 : 0)).current;

  const beltWidth = useMemo(() => {
    if (typeof width === 'number') {
      return width;
    }
    return Math.min(348, Math.max(260, Math.round(windowWidth * 0.82)));
  }, [width, windowWidth]);

  const stageHeight = Math.round(beltWidth / BELT_ASPECT);

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
        source={image}
        style={styles.image}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignSelf: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    backgroundColor: 'transparent',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
