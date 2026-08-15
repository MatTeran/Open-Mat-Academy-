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
  RadialGradient,
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

const VB_W = 440;
const VB_H = 128;

/**
 * Photorealistic-inspired 3D tied adult BJJ belt (Proposal 3 silhouette):
 * cylindrical fabric shading, layered knot wraps, draping tails,
 * integrated rank bar + promotion stripes.
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
    return Math.min(348, Math.max(256, Math.round(windowWidth * 0.8)));
  }, [width, windowWidth]);

  const stageHeight = Math.round(
    Math.min(112, Math.max(86, beltWidth * 0.3)),
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

  const gRoll = `roll-${uid}`;
  const gRollVert = `rollV-${uid}`;
  const gKnotRad = `knotR-${uid}`;
  const gKnotDiag = `knotD-${uid}`;
  const gBar = `bar-${uid}`;
  const gShadow = `sh-${uid}`;
  const gTail = `tail-${uid}`;

  const stripeCount = stripeIndexes.length;
  const stripeGap = 6.2;
  const stripeW = 4.6;
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
          {/* Cylindrical cloth roll (top → bottom) */}
          <LinearGradient id={gRoll} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={palette.beltHighlight} stopOpacity="1" />
            <Stop offset="18%" stopColor={palette.beltMid} stopOpacity="1" />
            <Stop offset="48%" stopColor={palette.beltColor} stopOpacity="1" />
            <Stop offset="78%" stopColor={palette.beltShade} stopOpacity="1" />
            <Stop offset="100%" stopColor={palette.beltDeep} stopOpacity="1" />
          </LinearGradient>
          {/* Lengthwise light falloff */}
          <LinearGradient id={gRollVert} x1="0" y1="0.5" x2="1" y2="0.5">
            <Stop offset="0%" stopColor={palette.beltDeep} stopOpacity="0.35" />
            <Stop offset="18%" stopColor={palette.beltColor} stopOpacity="0" />
            <Stop offset="82%" stopColor={palette.beltColor} stopOpacity="0" />
            <Stop offset="100%" stopColor={palette.beltDeep} stopOpacity="0.32" />
          </LinearGradient>
          <LinearGradient id={gTail} x1="0.2" y1="0" x2="0.85" y2="1">
            <Stop offset="0%" stopColor={palette.beltHighlight} stopOpacity="0.95" />
            <Stop offset="35%" stopColor={palette.beltColor} stopOpacity="1" />
            <Stop offset="100%" stopColor={palette.beltDeep} stopOpacity="1" />
          </LinearGradient>
          <RadialGradient id={gKnotRad} cx="42%" cy="32%" rx="62%" ry="58%">
            <Stop offset="0%" stopColor={palette.beltHighlight} stopOpacity="1" />
            <Stop offset="40%" stopColor={palette.beltMid} stopOpacity="1" />
            <Stop offset="78%" stopColor={palette.beltShade} stopOpacity="1" />
            <Stop offset="100%" stopColor={palette.beltDeep} stopOpacity="1" />
          </RadialGradient>
          <LinearGradient id={gKnotDiag} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={palette.beltHighlight} stopOpacity="0.95" />
            <Stop offset="45%" stopColor={palette.beltColor} stopOpacity="1" />
            <Stop offset="100%" stopColor={palette.beltDeep} stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id={gBar} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={palette.rankBarHighlight} stopOpacity="1" />
            <Stop offset="40%" stopColor={palette.rankBarColor} stopOpacity="1" />
            <Stop offset="100%" stopColor={palette.rankBarColor} stopOpacity="1" />
          </LinearGradient>
          <RadialGradient id={gShadow} cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#1A1510" stopOpacity="0.28" />
            <Stop offset="70%" stopColor="#1A1510" stopOpacity="0.1" />
            <Stop offset="100%" stopColor="#1A1510" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Ground contact shadow */}
        <Ellipse cx="220" cy="116" rx="168" ry="9" fill={`url(#${gShadow})`} />

        {/* ========== LEFT HORIZONTAL BAND ========== */}
        <G id="leftBand">
          {/* Underside thickness */}
          <Path
            d="M22 44
               C 48 38, 90 36, 140 37
               L 178 39
               C 186 40, 190 45, 188 52
               L 176 58
               C 140 60, 90 60, 48 58
               L 24 56
               C 14 54, 12 48, 16 45
               C 18 43, 20 44, 22 44 Z"
            fill={palette.beltDeep}
            opacity={0.55}
          />
          {/* Main cloth */}
          <Path
            d="M24 36
               C 52 31, 95 29, 145 30
               L 176 32
               C 184 33, 188 38, 186 45
               C 184 53, 176 56, 166 56
               L 145 57
               C 95 59, 52 58, 26 53
               C 16 51, 14 44, 18 40
               C 20 37, 22 36, 24 36 Z"
            fill={`url(#${gRoll})`}
            stroke={palette.outlineColor}
            strokeWidth={0.85}
          />
          {/* Lengthwise shading overlay */}
          <Path
            d="M24 36
               C 52 31, 95 29, 145 30
               L 176 32
               C 184 33, 188 38, 186 45
               C 184 53, 176 56, 166 56
               L 145 57
               C 95 59, 52 58, 26 53
               C 16 51, 14 44, 18 40
               C 20 37, 22 36, 24 36 Z"
            fill={`url(#${gRollVert})`}
          />
          {/* Specular ridge */}
          <Path
            d="M30 39 C 70 35, 120 35, 168 38"
            stroke={palette.beltHighlight}
            strokeWidth={2.2}
            opacity={0.55}
            fill="none"
            strokeLinecap="round"
          />
          {/* Weave stitches */}
          <Path
            d="M32 42 C 75 39, 120 39, 168 42"
            stroke={palette.beltShade}
            strokeWidth={0.7}
            opacity={0.4}
            fill="none"
          />
          <Path
            d="M32 49 C 75 51, 120 52, 168 49"
            stroke={palette.beltDeep}
            strokeWidth={0.65}
            opacity={0.28}
            fill="none"
          />
        </G>

        {/* ========== RIGHT HORIZONTAL BAND ========== */}
        <G id="rightBand">
          <Path
            d="M262 39
               L 300 37
               C 350 36, 390 38, 414 44
               C 424 46, 426 52, 418 56
               C 390 60, 350 60, 300 58
               L 264 56
               C 254 55, 250 50, 252 44
               C 253 40, 257 39, 262 39 Z"
            fill={palette.beltDeep}
            opacity={0.5}
          />
          <Path
            d="M264 32
               L 300 30
               C 350 29, 392 31, 416 36
               C 426 38, 428 45, 420 50
               C 416 54, 406 56, 396 55
               C 360 58, 320 58, 300 57
               L 266 55
               C 256 54, 252 48, 254 42
               C 255 36, 259 32, 264 32 Z"
            fill={`url(#${gRoll})`}
            stroke={palette.outlineColor}
            strokeWidth={0.85}
          />
          <Path
            d="M264 32
               L 300 30
               C 350 29, 392 31, 416 36
               C 426 38, 428 45, 420 50
               C 416 54, 406 56, 396 55
               C 360 58, 320 58, 300 57
               L 266 55
               C 256 54, 252 48, 254 42
               C 255 36, 259 32, 264 32 Z"
            fill={`url(#${gRollVert})`}
          />
          <Path
            d="M272 38 C 320 34, 370 35, 410 40"
            stroke={palette.beltHighlight}
            strokeWidth={2.2}
            opacity={0.55}
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d="M272 42 C 320 39, 370 40, 410 44"
            stroke={palette.beltShade}
            strokeWidth={0.7}
            opacity={0.4}
            fill="none"
          />
          <Path
            d="M272 49 C 320 51, 370 52, 410 48"
            stroke={palette.beltDeep}
            strokeWidth={0.65}
            opacity={0.28}
            fill="none"
          />
        </G>

        {/* ========== LEFT DRAPING TAIL ========== */}
        <G id="leftTail">
          <Path
            d="M128 52
               C 112 58, 96 72, 84 88
               C 76 100, 70 110, 68 114
               C 66 117, 62 116, 62 112
               C 64 100, 78 78, 98 64
               C 108 58, 120 54, 132 52 Z"
            fill={palette.beltDeep}
            opacity={0.45}
          />
          <Path
            d="M136 50
               C 118 56, 98 72, 86 90
               C 78 102, 72 112, 74 116
               C 76 119, 82 118, 86 114
               C 96 100, 116 76, 134 62
               C 140 56, 146 52, 152 50
               Z"
            fill={`url(#${gTail})`}
            stroke={palette.outlineColor}
            strokeWidth={0.75}
          />
          <Path
            d="M120 62 C 106 76, 94 94, 86 108"
            stroke={palette.beltHighlight}
            strokeWidth={1.6}
            opacity={0.35}
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d="M128 66 C 114 82, 100 98, 92 110"
            stroke={palette.beltDeep}
            strokeWidth={0.8}
            opacity={0.35}
            fill="none"
          />
        </G>

        {/* ========== RIGHT DRAPING TAIL + RANK BAR ========== */}
        <G id="rightTail">
          <Path
            d="M308 52
               C 328 58, 350 74, 364 90
               C 372 100, 378 110, 382 114
               C 385 117, 388 114, 386 110
               C 380 98, 360 74, 336 60
               C 326 54, 316 52, 308 52 Z"
            fill={palette.beltDeep}
            opacity={0.42}
          />
          <Path
            d="M300 50
               C 322 54, 348 72, 364 88
               C 374 100, 382 110, 384 114
               C 386 117, 392 115, 390 110
               C 384 98, 362 74, 334 58
               C 322 52, 310 50, 298 50
               Z"
            fill={`url(#${gTail})`}
            stroke={palette.outlineColor}
            strokeWidth={0.75}
          />
          <Path
            d="M318 60 C 338 74, 356 92, 370 106"
            stroke={palette.beltHighlight}
            strokeWidth={1.6}
            opacity={0.32}
            fill="none"
            strokeLinecap="round"
          />

          {/* Rank bar wrapped around tail — clear rectangular fabric band */}
          <G transform="translate(348 82) rotate(34)">
            {/* Soft bar shadow */}
            <Rect
              x={-15}
              y={-12}
              width={34}
              height={30}
              rx={3}
              fill="#000"
              opacity={0.22}
            />
            <Rect
              x={-17}
              y={-14}
              width={34}
              height={28}
              rx={3}
              fill={`url(#${gBar})`}
            />
            {/* Top edge catch-light */}
            <Rect
              x={-14}
              y={-12}
              width={28}
              height={2}
              rx={1}
              fill="#FFFFFF"
              opacity={0.18}
            />
            {/* Side seam */}
            <Rect
              x={-17}
              y={-12}
              width={1.5}
              height={24}
              fill="#000"
              opacity={0.25}
            />
            <Rect
              x={15.5}
              y={-12}
              width={1.5}
              height={24}
              fill="#000"
              opacity={0.25}
            />
            {/* Promotion stripes */}
            {stripeIndexes.map((index) => {
              const x = -stripeSpan / 2 + index * (stripeW + stripeGap);
              return (
                <G key={`stripe-${index}`}>
                  <Rect
                    x={x}
                    y={-9}
                    width={stripeW}
                    height={18}
                    rx={1.1}
                    fill={palette.stripeColor}
                  />
                  <Rect
                    x={x + 0.6}
                    y={-8.2}
                    width={stripeW * 0.35}
                    height={16.4}
                    rx={0.6}
                    fill="#FFFFFF"
                    opacity={0.35}
                  />
                </G>
              );
            })}
          </G>
        </G>

        {/* ========== FRONT OVERLAP NEAR KNOT ========== */}
        <G id="frontOverlap">
          <Path
            d="M158 34
               C 170 31, 184 31, 194 36
               C 198 39, 198 46, 194 52
               C 188 56, 176 57, 164 56
               C 156 55, 150 50, 150 44
               C 150 38, 154 35, 158 34 Z"
            fill={`url(#${gRoll})`}
            stroke={palette.outlineColor}
            strokeWidth={0.55}
          />
          <Path
            d="M246 36
               C 256 31, 272 31, 284 34
               C 290 36, 292 42, 288 48
               C 284 54, 272 57, 258 56
               C 250 55, 244 50, 244 44
               C 244 38, 246 36, 246 36 Z"
            fill={`url(#${gRoll})`}
            stroke={palette.outlineColor}
            strokeWidth={0.55}
          />
        </G>

        {/* ========== CENTRAL KNOT (square-knot inspired) ========== */}
        <G id="knot">
          {/* Knot contact shadow */}
          <Ellipse
            cx="220"
            cy="66"
            rx="34"
            ry="14"
            fill="#1A1510"
            opacity={0.26}
          />

          {/* Rear horizontal wrap */}
          <Path
            d="M188 40
               C 198 34, 214 32, 230 34
               C 244 36, 254 44, 252 54
               C 250 64, 238 72, 220 74
               C 202 72, 188 64, 186 54
               C 184 44, 186 40, 188 40 Z"
            fill={palette.beltDeep}
            stroke={palette.outlineColor}
            strokeWidth={0.6}
          />

          {/* Left diagonal loop */}
          <Path
            d="M192 36
               C 204 28, 222 28, 234 38
               C 240 44, 236 54, 226 58
               C 214 62, 198 58, 192 50
               C 188 44, 188 38, 192 36 Z"
            fill={`url(#${gKnotDiag})`}
            stroke={palette.outlineColor}
            strokeWidth={0.65}
            transform="rotate(-22 212 46)"
          />

          {/* Right diagonal loop (overlaps) */}
          <Path
            d="M198 38
               C 214 30, 234 32, 242 44
               C 246 52, 238 62, 224 64
               C 210 66, 196 58, 194 48
               C 192 42, 194 38, 198 38 Z"
            fill={`url(#${gKnotRad})`}
            stroke={palette.outlineColor}
            strokeWidth={0.65}
            transform="rotate(18 218 48)"
          />

          {/* Center compressed fold / vertical core */}
          <Path
            d="M208 34
               C 216 28, 228 28, 232 38
               C 234 46, 228 58, 220 62
               C 212 58, 206 46, 208 38
               C 208 36, 208 34, 208 34 Z"
            fill={`url(#${gKnotRad})`}
            stroke={palette.outlineColor}
            strokeWidth={0.55}
          />

          {/* Highlight crease across knot */}
          <Path
            d="M210 36 C 218 32, 226 34, 230 42"
            stroke={palette.beltHighlight}
            strokeWidth={1.8}
            opacity={0.6}
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d="M206 48 C 214 52, 224 52, 230 46"
            stroke={palette.beltDeep}
            strokeWidth={1.1}
            opacity={0.35}
            fill="none"
            strokeLinecap="round"
          />

          {/* Loose tuck hanging from knot (asymmetry) */}
          <Path
            d="M224 58
               C 232 62, 238 72, 236 84
               C 234 90, 226 88, 224 82
               C 222 74, 222 64, 224 58 Z"
            fill={`url(#${gTail})`}
            stroke={palette.outlineColor}
            strokeWidth={0.55}
          />
          <Path
            d="M228 64 C 232 70, 234 78, 232 84"
            stroke={palette.beltHighlight}
            strokeWidth={1.2}
            opacity={0.35}
            fill="none"
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
