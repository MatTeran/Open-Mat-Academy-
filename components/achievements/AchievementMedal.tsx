import { memo, useEffect, useMemo, useRef } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, View } from 'react-native';
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
  categoryShape,
  motifForBadge,
  type MedalMotif,
  type MedalShape,
} from '../../lib/achievements/meta';
import { materialForRarity, materialPalette } from '../../lib/achievements/materials';
import type { AchievementBadge } from '../../types/journey';
import { CenturyClubArt } from './artworks/CenturyClubArt';
import { EarlyBirdArt } from './artworks/EarlyBirdArt';
import { FirstClassArt } from './artworks/FirstClassArt';
import { Streak30Art } from './artworks/Streak30Art';

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

/** Unique collectible art — prototypes only until approved. */
const PROTOTYPE_IDS = new Set([
  'badge-first-class',
  'badge-early-bird',
  'badge-100-classes',
  'badge-30-day-streak',
]);

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
    case 'medal': {
      // Octagonal championship medallion
      const pts = Array.from({ length: 8 }).map((_, i) => {
        const a = (Math.PI / 180) * (45 * i - 22.5);
        return `${c + r * Math.cos(a)},${c + r * Math.sin(a)}`;
      });
      return pts.join(' ');
    }
    case 'coin':
    case 'circle':
    default:
      return '';
  }
}

function FallbackMotif({
  motif,
  cx,
  cy,
  scale,
  unlocked,
  accent,
}: {
  motif: MedalMotif;
  cx: number;
  cy: number;
  scale: number;
  unlocked: boolean;
  accent: string;
}) {
  const stroke = unlocked ? accent : materialPalette.gunmetalLight;
  const fill = unlocked ? `${accent}2E` : 'rgba(138,138,138,0.14)';
  const s = scale;
  const opacity = unlocked ? 1 : 0.72;

  switch (motif) {
    case 'sunrise':
      return (
        <G opacity={opacity}>
          <Circle cx={cx} cy={cy + 2 * s} r={10 * s} fill={fill} stroke={stroke} strokeWidth={1.6} />
          {[-2, -1, 0, 1, 2].map((i) => (
            <Path
              key={i}
              d={`M ${cx + i * 5 * s} ${cy - 14 * s} L ${cx + i * 6.5 * s} ${cy - 20 * s}`}
              stroke={stroke}
              strokeWidth={1.4}
              strokeLinecap="round"
            />
          ))}
        </G>
      );
    case 'flame':
      return (
        <Path
          opacity={opacity}
          d={`M ${cx} ${cy + 14 * s}
            C ${cx - 14 * s} ${cy + 2 * s}, ${cx - 10 * s} ${cy - 10 * s}, ${cx} ${cy - 16 * s}
            C ${cx + 4 * s} ${cy - 6 * s}, ${cx + 12 * s} ${cy - 2 * s}, ${cx + 10 * s} ${cy + 8 * s}
            C ${cx + 8 * s} ${cy + 14 * s}, ${cx + 4 * s} ${cy + 16 * s}, ${cx} ${cy + 14 * s}
            Z`}
          fill={fill}
          stroke={stroke}
          strokeWidth={1.6}
        />
      );
    case 'moon':
      return (
        <Path
          opacity={opacity}
          d={`M ${cx + 6 * s} ${cy - 12 * s}
            A ${14 * s} ${14 * s} 0 1 0 ${cx + 6 * s} ${cy + 12 * s}
            A ${10 * s} ${10 * s} 0 1 1 ${cx + 6 * s} ${cy - 12 * s}
            Z`}
          fill={fill}
          stroke={stroke}
          strokeWidth={1.5}
        />
      );
    case 'laurel':
      return (
        <G opacity={opacity}>
          <Path
            d={`M ${cx - 4 * s} ${cy + 12 * s}
              Q ${cx - 18 * s} ${cy + 4 * s} ${cx - 14 * s} ${cy - 12 * s}`}
            fill="none"
            stroke={stroke}
            strokeWidth={1.6}
          />
          <Path
            d={`M ${cx + 4 * s} ${cy + 12 * s}
              Q ${cx + 18 * s} ${cy + 4 * s} ${cx + 14 * s} ${cy - 12 * s}`}
            fill="none"
            stroke={stroke}
            strokeWidth={1.6}
          />
          <Circle cx={cx} cy={cy - 2 * s} r={5 * s} fill={fill} stroke={stroke} strokeWidth={1.3} />
        </G>
      );
    case 'mat':
    default:
      return (
        <G opacity={opacity}>
          <Path
            d={`M ${cx - 14 * s} ${cy - 8 * s}
              H ${cx + 14 * s}
              V ${cy + 10 * s}
              H ${cx - 14 * s}
              Z`}
            fill={fill}
            stroke={stroke}
            strokeWidth={1.5}
          />
          <Path
            d={`M ${cx - 8 * s} ${cy - 8 * s} V ${cy + 10 * s}
              M ${cx} ${cy - 8 * s} V ${cy + 10 * s}
              M ${cx + 8 * s} ${cy - 8 * s} V ${cy + 10 * s}`}
            stroke={stroke}
            strokeWidth={1.2}
            opacity={0.7}
          />
        </G>
      );
  }
}

function PrototypeArtwork({
  badgeId,
  cx,
  cy,
  scale,
  material,
  unlocked,
}: {
  badgeId: string;
  cx: number;
  cy: number;
  scale: number;
  material: ReturnType<typeof materialForRarity>;
  unlocked: boolean;
}) {
  const props = { cx, cy, s: scale, material, unlocked };
  switch (badgeId) {
    case 'badge-first-class':
      return <FirstClassArt {...props} />;
    case 'badge-early-bird':
      return <EarlyBirdArt {...props} />;
    case 'badge-100-classes':
      return <CenturyClubArt {...props} />;
    case 'badge-30-day-streak':
      return <Streak30Art {...props} />;
    default:
      return null;
  }
}

function AchievementMedalInner({
  badge,
  size = 136,
  celebrate = false,
  progress,
}: AchievementMedalProps) {
  const shape = categoryShape(badge.category);
  const motif = motifForBadge(badge.icon, badge.category);
  const unlocked = badge.isUnlocked;
  const material = useMemo(
    () => materialForRarity(badge.rarity, unlocked),
    [badge.rarity, unlocked],
  );
  const isPrototype = PROTOTYPE_IDS.has(badge.id);
  const legendary = badge.rarity === 'legendary' && unlocked;

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
  const isPoly = shape === 'hexagon' || shape === 'medal';
  const isPath = shape === 'shield' || shape === 'crest';
  const isCircle = !isPoly && !isPath;

  const progressRatio =
    typeof progress === 'number'
      ? Math.min(1, Math.max(0, progress))
      : Math.min(1, Math.max(0, badge.currentProgress / Math.max(1, badge.requirementTarget)));
  const showArc = !unlocked && isCircle && progressRatio > 0 && progressRatio < 1;
  const arcLen = 2 * Math.PI * (outerR + 1.5);
  const arcDash = Math.max(6, progressRatio * arcLen);

  return (
    <Animated.View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          transform: [{ scale: scaleAnim }],
          opacity: bloom,
          shadowColor: material.edgeGlow,
          shadowOpacity: unlocked ? (legendary ? 0.55 : 0.35) : 0.18,
          shadowRadius: unlocked ? (legendary ? 16 : 11) : 7,
          shadowOffset: { width: 0, height: 6 },
          elevation: unlocked ? 9 : 4,
        },
      ]}
    >
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

        {/* Outer metallic silhouette */}
        {isPoly ? (
          <Polygon points={rimPoly} fill={`url(#${gid}-rim)`} />
        ) : isPath ? (
          <Path d={rimPoly} fill={`url(#${gid}-rim)`} />
        ) : (
          <Circle cx={c} cy={c} r={outerR} fill={`url(#${gid}-rim)`} />
        )}

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

        {/* Coin / legendary engraved rings */}
        {(shape === 'coin' || legendary) && (
          <Circle
            cx={c}
            cy={c}
            r={enamelR * 0.88}
            fill="none"
            stroke={material.rimOuter}
            strokeOpacity={unlocked ? 0.4 : 0.22}
            strokeWidth={1}
          />
        )}

        {/* Raised artwork */}
        {isPrototype ? (
          <PrototypeArtwork
            badgeId={badge.id}
            cx={c}
            cy={c}
            scale={motifScale}
            material={material}
            unlocked={unlocked}
          />
        ) : (
          <FallbackMotif
            motif={motif}
            cx={c}
            cy={c}
            scale={motifScale}
            unlocked={unlocked}
            accent={material.accent}
          />
        )}

        {/* Tiny OM engraving */}
        <Path
          d={`M ${c - 5} ${c + enamelR * 0.72}
              L ${c - 2} ${c + enamelR * 0.58}
              L ${c} ${c + enamelR * 0.7}
              L ${c + 2} ${c + enamelR * 0.58}
              L ${c + 5} ${c + enamelR * 0.72}`}
          fill="none"
          stroke={material.rimHighlight}
          strokeOpacity={unlocked ? 0.28 : 0.16}
          strokeWidth={0.9}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Directional highlight */}
        <Ellipse
          cx={c - size * 0.1}
          cy={c - size * 0.16}
          rx={size * 0.18}
          ry={size * 0.09}
          fill="#FFFFFF"
          opacity={unlocked ? 0.2 : 0.1}
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

      {/* One-shot highlight sweep (celebrate only) */}
      {celebrate && unlocked ? (
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
      ) : null}
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
});
