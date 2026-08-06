import { memo, useEffect, useMemo, useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Polygon,
  RadialGradient,
  Stop,
} from 'react-native-svg';

import {
  categoryEdgeEngraving,
  categoryShape,
  type MedalShape,
} from '../../lib/achievements/meta';
import { materialForRarity } from '../../lib/achievements/materials';
import type { AchievementBadge } from '../../types/journey';
import { getMedalArtwork, getMedalReferenceFace } from './artworks';
import { InterimSealArt } from './artworks/InterimSealArt';
import { MedalEdgeEngraving } from './medal/MedalEdgeEngraving';
import { MedalSerialMark } from './medal/MedalSerialMark';

export type AchievementMedalProps = {
  badge: Pick<
    AchievementBadge,
    'id' | 'category' | 'rarity' | 'icon' | 'isUnlocked' | 'currentProgress' | 'requirementTarget'
  >;
  size?: number;
  /** Soft one-shot entrance when unlocked. */
  celebrate?: boolean;
  /** 0–1 locked perimeter progress (circular shapes only). */
  progress?: number;
};

function shapePath(shape: MedalShape, center: number, radius: number): string {
  const c = center;
  const r = radius;

  switch (shape) {
    case 'hexagon': {
      const pts = Array.from({ length: 6 }).map((_, i) => {
        const a = (Math.PI / 180) * (60 * i - 30);
        return `${c + r * Math.cos(a)},${c + r * Math.sin(a)}`;
      });
      return pts.join(' ');
    }
    case 'shield': {
      const top = c - r * 0.95;
      const bottom = c + r * 1.05;
      const left = c - r * 0.85;
      const right = c + r * 0.85;
      return `M ${left} ${top + r * 0.2}
        Q ${left} ${top} ${c} ${top}
        Q ${right} ${top} ${right} ${top + r * 0.2}
        L ${right} ${c + r * 0.15}
        Q ${right} ${c + r * 0.7} ${c} ${bottom}
        Q ${left} ${c + r * 0.7} ${left} ${c + r * 0.15}
        Z`;
    }
    case 'crest': {
      const top = c - r * 1.0;
      const bottom = c + r * 1.08;
      const left = c - r * 0.9;
      const right = c + r * 0.9;
      return `M ${c} ${top}
        Q ${c - r * 0.35} ${top + r * 0.15} ${left} ${top + r * 0.28}
        L ${left} ${c + r * 0.1}
        Q ${left} ${c + r * 0.75} ${c} ${bottom}
        Q ${right} ${c + r * 0.75} ${right} ${c + r * 0.1}
        L ${right} ${top + r * 0.28}
        Q ${c + r * 0.35} ${top + r * 0.15} ${c} ${top}
        Z`;
    }
    case 'coin': {
      // Special — octagonal commemorative coin
      const pts = Array.from({ length: 8 }).map((_, i) => {
        const a = (Math.PI / 180) * (45 * i - 22.5);
        return `${c + r * Math.cos(a)},${c + r * Math.sin(a)}`;
      });
      return pts.join(' ');
    }
    case 'medal': // Competition — round championship medallion (+ ribbon)
    case 'circle':
    default:
      return '';
  }
}

function AchievementMedalInner({
  badge,
  size = 136,
  celebrate = false,
  progress,
}: AchievementMedalProps) {
  const shape = categoryShape(badge.category);
  const edgeType = categoryEdgeEngraving(badge.category);
  const unlocked = badge.isUnlocked;
  const material = useMemo(
    () => materialForRarity(badge.rarity, unlocked),
    [badge.rarity, unlocked],
  );
  const Artwork = getMedalArtwork(badge.id) ?? InterimSealArt;
  const referenceFace = getMedalReferenceFace(badge.id);
  const legendary = badge.rarity === 'legendary' && unlocked;
  const showDetailMarks = size >= 152;

  const bloom = useRef(new Animated.Value(celebrate && unlocked ? 0 : 1)).current;
  const scaleAnim = useRef(new Animated.Value(celebrate && unlocked ? 0.88 : 1)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!celebrate || !unlocked) {
      return;
    }
    let cancelled = false;
    void AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (cancelled) return;
      if (reduce) {
        bloom.setValue(1);
        scaleAnim.setValue(1);
        return;
      }
      Animated.parallel([
        Animated.timing(bloom, {
          toValue: 1,
          duration: 520,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(shimmer, {
            toValue: 1,
            duration: 700,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(shimmer, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    });
    return () => {
      cancelled = true;
    };
  }, [bloom, celebrate, scaleAnim, shimmer, unlocked]);

  const gid = useMemo(
    () => `ach-medal-${badge.id}-${size}`.replace(/[^a-zA-Z0-9_-]/g, ''),
    [badge.id, size],
  );

  const c = size / 2;
  const outerR = size * 0.46;
  const midR = size * 0.405;
  const enamelR = size * 0.335;
  const motifScale = size / 96;
  const rimPoly = shapePath(shape, c, outerR);
  const midPoly = shapePath(shape, c, midR);
  const enamelPoly = shapePath(shape, c, enamelR);
  const isPoly = shape === 'hexagon' || shape === 'coin';
  const isPath = shape === 'shield' || shape === 'crest';
  const showRibbon = shape === 'medal';
  const isCircle = shape === 'circle' || shape === 'medal';
  const edgeOnCircle = isCircle;

  const progressRatio =
    typeof progress === 'number'
      ? Math.min(1, Math.max(0, progress))
      : Math.min(1, Math.max(0, badge.currentProgress / Math.max(1, badge.requirementTarget)));
  const showArc = !unlocked && isCircle && progressRatio > 0 && progressRatio < 1;
  const arcLen = 2 * Math.PI * (outerR + 1.5);
  const arcDash = Math.max(6, progressRatio * arcLen);

  const shellStyle = {
    width: size,
    height: size,
    transform: [{ scale: scaleAnim }],
    opacity: bloom,
    shadowColor: material.edgeGlow,
    shadowOpacity: unlocked ? (legendary ? 0.55 : 0.35) : 0.18,
    shadowRadius: unlocked ? (legendary ? 16 : 11) : 7,
    shadowOffset: { width: 0, height: 6 },
    elevation: unlocked ? 9 : 4,
  } as const;

  const celebrateShimmer =
    celebrate && unlocked ? (
      <Animated.View
        pointerEvents="none"
        style={[
          styles.shimmer,
          {
            opacity: shimmer.interpolate({
              inputRange: [0, 0.4, 1],
              outputRange: [0, 0.35, 0],
            }),
            transform: [
              {
                translateX: shimmer.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-size * 0.4, size * 0.4],
                }),
              },
              { rotate: '18deg' },
            ],
          },
        ]}
      />
    ) : null;

  // Approved art-direction renders — full photoreal face for hero prototypes.
  if (referenceFace) {
    return (
      <Animated.View style={[styles.wrap, shellStyle]}>
        {legendary ? (
          <View
            pointerEvents="none"
            style={[
              styles.legendaryAura,
              {
                width: size * 1.16,
                height: size * 1.16,
                borderRadius: size,
              },
            ]}
          />
        ) : null}

        <Image
          source={referenceFace}
          style={{
            width: size,
            height: size,
            opacity: unlocked ? 1 : 0.62,
          }}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />

        {!unlocked ? (
          <View
            pointerEvents="none"
            style={[
              styles.lockedWash,
              {
                width: size * 0.88,
                height: size * 0.88,
                borderRadius: size,
              },
            ]}
          />
        ) : null}

        {showArc || !unlocked ? (
          <Svg
            pointerEvents="none"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            style={StyleSheet.absoluteFill}
          >
            {showArc ? (
              <Circle
                cx={c}
                cy={c}
                r={outerR + 1.5}
                fill="none"
                stroke={material.rimHighlight}
                strokeWidth={2.4}
                strokeDasharray={`${arcDash} ${arcLen}`}
                strokeLinecap="round"
                opacity={0.8}
                transform={`rotate(-90 ${c} ${c})`}
              />
            ) : null}
            {!unlocked ? (
              <G opacity={0.7}>
                <Path
                  d={`M ${c - 3.5} ${c + outerR * 0.78}
                      V ${c + outerR * 0.7}
                      A 3.5 3.5 0 0 1 ${c + 3.5} ${c + outerR * 0.7}
                      V ${c + outerR * 0.78}
                      H ${c + 5}
                      V ${c + outerR * 0.92}
                      H ${c - 5}
                      V ${c + outerR * 0.78}
                      Z`}
                  fill="none"
                  stroke={material.rimHighlight}
                  strokeWidth={1}
                  opacity={0.55}
                />
              </G>
            ) : null}
          </Svg>
        ) : null}

        {celebrateShimmer}
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.wrap, shellStyle]}>
      {legendary ? (
        <View
          pointerEvents="none"
          style={[
            styles.legendaryAura,
            {
              width: size * 1.16,
              height: size * 1.16,
              borderRadius: size,
            },
          ]}
        />
      ) : null}

      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <LinearGradient id={`${gid}-rim`} x1="8%" y1="0%" x2="92%" y2="100%">
            <Stop offset="0%" stopColor={material.rimHighlight} />
            <Stop offset="28%" stopColor={material.rimOuter} />
            <Stop offset="62%" stopColor={material.rimMid} />
            <Stop offset="100%" stopColor={material.rimInner} />
          </LinearGradient>
          <LinearGradient id={`${gid}-bevel`} x1="20%" y1="0%" x2="80%" y2="100%">
            <Stop offset="0%" stopColor={material.bevelLight} />
            <Stop offset="48%" stopColor={material.rimMid} stopOpacity={0.35} />
            <Stop offset="100%" stopColor={material.bevelDark} />
          </LinearGradient>
          <RadialGradient id={`${gid}-enamel`} cx="36%" cy="30%" rx="72%" ry="72%">
            <Stop offset="0%" stopColor={material.enamelTop} />
            <Stop offset="55%" stopColor={material.enamelMid} />
            <Stop offset="100%" stopColor={material.enamelDeep} />
          </RadialGradient>
          <LinearGradient id={`${gid}-sheen`} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={unlocked ? 0.26 : 0.12} />
            <Stop offset="42%" stopColor="#FFFFFF" stopOpacity={0} />
            <Stop
              offset="100%"
              stopColor={material.rimHighlight}
              stopOpacity={unlocked ? 0.14 : 0.06}
            />
          </LinearGradient>
        </Defs>

        {/* Soft ground shadow */}
        <Ellipse
          cx={c}
          cy={size * 0.93}
          rx={size * 0.3}
          ry={size * 0.05}
          fill="#000000"
          opacity={0.38}
        />

        {/* Championship ribbon (competition) */}
        {showRibbon ? (
          <G opacity={unlocked ? 0.95 : 0.45}>
            <Path
              d={`M ${c - size * 0.15} ${c - outerR + 2}
                L ${c - size * 0.04} ${c - outerR * 0.52}
                L ${c - size * 0.2} ${c - outerR * 0.32}
                Z`}
              fill={material.rimMid}
            />
            <Path
              d={`M ${c + size * 0.15} ${c - outerR + 2}
                L ${c + size * 0.04} ${c - outerR * 0.52}
                L ${c + size * 0.2} ${c - outerR * 0.32}
                Z`}
              fill={material.rimInner}
            />
          </G>
        ) : null}

        {/* Outer metallic silhouette */}
        {isPoly ? (
          <Polygon points={rimPoly} fill={`url(#${gid}-rim)`} />
        ) : isPath ? (
          <Path d={rimPoly} fill={`url(#${gid}-rim)`} />
        ) : (
          <Circle cx={c} cy={c} r={outerR} fill={`url(#${gid}-rim)`} />
        )}

        {/* Category edge machining */}
        <MedalEdgeEngraving
          cx={c}
          cy={c}
          radius={outerR - 1.2}
          type={edgeType}
          color={material.rimHighlight}
          unlocked={unlocked}
          enabled={edgeOnCircle}
        />

        {/* Inner bevel */}
        {isPoly ? (
          <Polygon points={midPoly} fill={`url(#${gid}-bevel)`} />
        ) : isPath ? (
          <Path d={midPoly} fill={`url(#${gid}-bevel)`} />
        ) : (
          <Circle cx={c} cy={c} r={midR} fill={`url(#${gid}-bevel)`} />
        )}

        {/* Enamel center */}
        {isPoly ? (
          <Polygon points={enamelPoly} fill={`url(#${gid}-enamel)`} />
        ) : isPath ? (
          <Path d={enamelPoly} fill={`url(#${gid}-enamel)`} />
        ) : (
          <Circle cx={c} cy={c} r={enamelR} fill={`url(#${gid}-enamel)`} />
        )}

        {/* Legendary double ring */}
        {legendary ? (
          <Circle
            cx={c}
            cy={c}
            r={enamelR * 0.9}
            fill="none"
            stroke={material.rimOuter}
            strokeOpacity={unlocked ? 0.45 : 0.22}
            strokeWidth={1}
          />
        ) : null}

        {/* Raised artwork (prototype or interim seal) */}
        <Artwork
          cx={c}
          cy={c + (showRibbon ? size * 0.02 : 0)}
          s={motifScale}
          material={material}
          unlocked={unlocked}
        />

        <MedalSerialMark
          cx={c}
          cy={c}
          s={motifScale}
          color={material.rimHighlight}
          unlocked={unlocked}
          showDetail={showDetailMarks}
          serial="OM-2026"
          edition="#0001"
        />

        {/* Directional highlight */}
        <Ellipse
          cx={c - size * 0.1}
          cy={c - size * 0.16}
          rx={size * 0.18}
          ry={size * 0.09}
          fill="#FFFFFF"
          opacity={unlocked ? 0.22 : 0.1}
        />

        {/* Glass sheen */}
        {isPoly ? (
          <Polygon points={rimPoly} fill={`url(#${gid}-sheen)`} />
        ) : isPath ? (
          <Path d={rimPoly} fill={`url(#${gid}-sheen)`} />
        ) : (
          <Circle cx={c} cy={c} r={outerR} fill={`url(#${gid}-sheen)`} />
        )}

        {/* Locked progress arc */}
        {showArc ? (
          <Circle
            cx={c}
            cy={c}
            r={outerR + 1.5}
            fill="none"
            stroke={material.rimHighlight}
            strokeWidth={2.4}
            strokeDasharray={`${arcDash} ${arcLen}`}
            strokeLinecap="round"
            opacity={0.8}
            transform={`rotate(-90 ${c} ${c})`}
          />
        ) : null}

        {/* Subtle lock engraving — not a heavy black veil */}
        {!unlocked ? (
          <G opacity={0.7}>
            <Path
              d={`M ${c - 3.5} ${c + outerR * 0.78}
                  V ${c + outerR * 0.7}
                  A 3.5 3.5 0 0 1 ${c + 3.5} ${c + outerR * 0.7}
                  V ${c + outerR * 0.78}
                  H ${c + 5}
                  V ${c + outerR * 0.92}
                  H ${c - 5}
                  V ${c + outerR * 0.78}
                  Z`}
              fill="none"
              stroke={material.rimHighlight}
              strokeWidth={1}
              opacity={0.55}
            />
          </G>
        ) : null}
      </Svg>

      {celebrateShimmer}
    </Animated.View>
  );
}

const AchievementMedal = memo(AchievementMedalInner);
export default AchievementMedal;
export { AchievementMedal };

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendaryAura: {
    position: 'absolute',
    backgroundColor: 'rgba(244,211,94,0.1)',
  },
  shimmer: {
    position: 'absolute',
    width: 28,
    height: '120%',
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  lockedWash: {
    position: 'absolute',
    backgroundColor: 'rgba(28,32,36,0.42)',
  },
});
