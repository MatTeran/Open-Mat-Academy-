import { useEffect, useId, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Svg, {
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

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

const VB_W = 400;
const VB_H = 112;

/**
 * Realistic tied adult BJJ belt — layered SVG fabric, knot, draping tails,
 * rank bar, and promotion stripes (Proposal 3 silhouette).
 */
export function BjjBeltDisplay({
  belt,
  stripes,
  width,
  animate = true,
}: BjjBeltDisplayProps) {
  const { width: windowWidth } = useWindowDimensions();
  const palette = getBeltAppearance(belt);
  const uid = useId().replace(/:/g, '');
  const opacity = useRef(new Animated.Value(animate ? 0 : 1)).current;
  const scale = useRef(new Animated.Value(animate ? 0.94 : 1)).current;
  const settleY = useRef(new Animated.Value(animate ? 8 : 0)).current;

  const beltWidth = useMemo(() => {
    if (typeof width === 'number') {
      return width;
    }
    // ~80–88% of card content width across phone sizes.
    return Math.min(340, Math.max(248, Math.round(windowWidth * 0.78)));
  }, [width, windowWidth]);

  const stageHeight = Math.round(
    Math.min(105, Math.max(78, beltWidth * 0.28)),
  );

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

  const gCloth = `beltCloth-${uid}`;
  const gKnot = `beltKnot-${uid}`;
  const gBar = `beltBar-${uid}`;
  const gShadow = `beltShadow-${uid}`;

  // Stripe layout on rank bar (right tail).
  const stripeCount = stripeIndexes.length;
  const stripeGap = 5.5;
  const stripeW = 4.2;
  const stripeSpan =
    stripeCount > 0 ? stripeCount * stripeW + (stripeCount - 1) * stripeGap : 0;

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
      <Svg
        width={beltWidth}
        height={stageHeight}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <Defs>
          <LinearGradient id={gCloth} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={palette.beltHighlight} stopOpacity="0.95" />
            <Stop offset="28%" stopColor={palette.beltColor} stopOpacity="1" />
            <Stop offset="72%" stopColor={palette.beltColor} stopOpacity="1" />
            <Stop offset="100%" stopColor={palette.beltShade} stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id={gKnot} x1="0.15" y1="0" x2="0.85" y2="1">
            <Stop offset="0%" stopColor={palette.beltHighlight} stopOpacity="0.9" />
            <Stop offset="45%" stopColor={palette.beltColor} stopOpacity="1" />
            <Stop offset="100%" stopColor={palette.beltShade} stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id={gBar} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={palette.rankBarColor} stopOpacity="1" />
            <Stop
              offset="100%"
              stopColor={palette.rankBarColor}
              stopOpacity="0.88"
            />
          </LinearGradient>
          <LinearGradient id={gShadow} x1="0.5" y1="0" x2="0.5" y2="1">
            <Stop offset="0%" stopColor="#1A1510" stopOpacity="0.22" />
            <Stop offset="100%" stopColor="#1A1510" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Soft ground shadow */}
        <Ellipse
          cx="200"
          cy="102"
          rx="148"
          ry="7"
          fill={`url(#${gShadow})`}
        />

        {/* —— Rear horizontal band (behind knot) —— */}
        <G id="rearBelt">
          <Path
            d="M28 34
               C 55 30, 95 29, 145 30
               L 175 31
               C 182 31, 186 35, 186 40
               C 186 47, 181 51, 173 51
               L 145 52
               C 95 54, 55 54, 28 50
               C 18 48, 16 42, 18 38
               C 20 34, 24 35, 28 34 Z"
            fill={`url(#${gCloth})`}
            stroke={palette.outlineColor}
            strokeWidth={0.8}
          />
          <Path
            d="M226 31
               L 255 30
               C 305 29, 345 30, 372 34
               C 380 36, 382 40, 380 44
               C 378 49, 372 51, 364 50
               C 340 54, 300 54, 255 52
               L 228 51
               C 220 51, 216 47, 216 41
               C 216 35, 220 31, 226 31 Z"
            fill={`url(#${gCloth})`}
            stroke={palette.outlineColor}
            strokeWidth={0.8}
          />
          {/* Stitching lines */}
          <Path
            d="M34 38 C 70 35, 110 35, 160 37"
            stroke={palette.beltShade}
            strokeWidth={0.9}
            opacity={0.45}
            fill="none"
          />
          <Path
            d="M34 45 C 70 47, 110 48, 160 46"
            stroke={palette.beltShade}
            strokeWidth={0.7}
            opacity={0.35}
            fill="none"
          />
          <Path
            d="M240 37 C 280 35, 330 35, 366 38"
            stroke={palette.beltShade}
            strokeWidth={0.9}
            opacity={0.45}
            fill="none"
          />
          <Path
            d="M240 46 C 280 48, 330 48, 366 45"
            stroke={palette.beltShade}
            strokeWidth={0.7}
            opacity={0.35}
            fill="none"
          />
        </G>

        {/* —— Left draping tail —— */}
        <G id="leftTail">
          <Path
            d="M118 48
               C 108 52, 96 62, 88 74
               C 82 84, 76 94, 72 98
               C 70 100, 66 99, 66 96
               C 68 88, 78 72, 92 60
               C 100 54, 110 50, 122 48
               Z"
            fill={palette.beltShade}
            opacity={0.85}
          />
          <Path
            d="M124 46
               C 112 52, 98 64, 90 78
               C 84 88, 78 96, 76 99
               C 74 101, 78 102, 82 100
               C 90 92, 104 74, 118 60
               C 124 54, 130 50, 136 48
               L 128 46 Z"
            fill={`url(#${gCloth})`}
            stroke={palette.outlineColor}
            strokeWidth={0.7}
          />
          <Path
            d="M112 58 C 102 70, 94 84, 88 94"
            stroke={palette.beltShade}
            strokeWidth={0.8}
            opacity={0.4}
            fill="none"
          />
        </G>

        {/* —— Right draping tail + rank bar —— */}
        <G id="rightTail">
          <Path
            d="M278 48
               C 292 54, 310 68, 322 82
               C 330 92, 336 98, 340 100
               C 344 102, 346 98, 344 94
               C 338 84, 322 66, 302 54
               C 294 50, 286 48, 278 48 Z"
            fill={palette.beltShade}
            opacity={0.8}
          />
          <Path
            d="M272 46
               C 288 50, 308 64, 322 78
               C 332 90, 340 98, 342 100
               C 344 102, 348 100, 346 96
               C 340 86, 322 68, 300 54
               C 290 48, 280 46, 268 46
               Z"
            fill={`url(#${gCloth})`}
            stroke={palette.outlineColor}
            strokeWidth={0.7}
          />
          {/* Rank bar — rectangular wrap on the right tail */}
          <G transform="translate(312 70) rotate(32)">
            <Rect
              x={-16}
              y={-14}
              width={32}
              height={28}
              rx={2.5}
              fill={`url(#${gBar})`}
            />
            <Rect
              x={-14}
              y={-12}
              width={28}
              height={1.2}
              fill="#FFFFFF"
              opacity={0.12}
            />
            {stripeIndexes.map((index) => {
              const x =
                -stripeSpan / 2 + index * (stripeW + stripeGap);
              return (
                <Rect
                  key={`stripe-${index}`}
                  x={x}
                  y={-10}
                  width={stripeW}
                  height={20}
                  rx={1}
                  fill={palette.stripeColor}
                />
              );
            })}
          </G>
          <Path
            d="M286 56 C 300 66, 318 82, 330 94"
            stroke={palette.beltShade}
            strokeWidth={0.8}
            opacity={0.35}
            fill="none"
          />
        </G>

        {/* —— Front band segments near knot —— */}
        <G id="frontBelt">
          <Path
            d="M148 32
               C 160 30, 172 30, 182 33
               C 188 35, 190 40, 188 46
               C 186 52, 178 54, 168 54
               C 158 54, 148 52, 142 48
               C 138 45, 140 36, 148 32 Z"
            fill={`url(#${gCloth})`}
            stroke={palette.outlineColor}
            strokeWidth={0.6}
          />
          <Path
            d="M218 33
               C 228 30, 240 30, 252 32
               C 260 34, 262 42, 258 48
               C 254 52, 244 54, 232 54
               C 222 54, 214 52, 210 46
               C 208 40, 212 35, 218 33 Z"
            fill={`url(#${gCloth})`}
            stroke={palette.outlineColor}
            strokeWidth={0.6}
          />
        </G>

        {/* —— Central knot (layered wraps) —— */}
        <G id="knot">
          <Ellipse
            cx="200"
            cy="58"
            rx="28"
            ry="10"
            fill="#1A1510"
            opacity={0.22}
          />
          {/* Lower wrap */}
          <Path
            d="M176 42
               C 184 36, 196 34, 208 36
               C 220 38, 228 44, 226 52
               C 224 60, 214 66, 200 68
               C 186 66, 174 60, 172 52
               C 170 44, 172 40, 176 42 Z"
            fill={palette.beltShade}
            stroke={palette.outlineColor}
            strokeWidth={0.7}
          />
          {/* Diagonal wrap left */}
          <Path
            d="M182 38
               C 190 32, 204 30, 214 36
               C 220 40, 218 48, 210 52
               C 200 56, 188 54, 182 48
               C 178 44, 178 40, 182 38 Z"
            fill={`url(#${gKnot})`}
            stroke={palette.outlineColor}
            strokeWidth={0.6}
            transform="rotate(-18 200 44)"
          />
          {/* Diagonal wrap right */}
          <Path
            d="M186 40
               C 198 34, 214 34, 222 42
               C 226 48, 220 56, 208 58
               C 196 60, 184 54, 182 46
               C 180 42, 182 40, 186 40 Z"
            fill={`url(#${gKnot})`}
            stroke={palette.outlineColor}
            strokeWidth={0.6}
            transform="rotate(16 204 46)"
          />
          {/* Center compressed fold */}
          <Path
            d="M192 36
               C 198 32, 206 32, 210 38
               C 212 44, 208 52, 200 54
               C 192 52, 188 44, 190 38
               C 190 36, 192 36, 192 36 Z"
            fill={palette.beltShade}
            stroke={palette.outlineColor}
            strokeWidth={0.5}
          />
          <Path
            d="M194 38 C 200 36, 206 38, 208 44"
            stroke={palette.beltHighlight}
            strokeWidth={1.2}
            opacity={0.55}
            fill="none"
          />
          {/* Small loose tuck under knot */}
          <Path
            d="M204 54
               C 210 58, 214 66, 212 74
               C 210 78, 204 76, 202 72
               C 200 66, 200 58, 204 54 Z"
            fill={`url(#${gCloth})`}
            stroke={palette.outlineColor}
            strokeWidth={0.5}
          />
        </G>
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignSelf: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
});
