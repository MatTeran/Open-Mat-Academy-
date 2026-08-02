import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
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
import { achievementTokens } from '../../lib/achievements/tokens';
import type { AchievementBadge } from '../../types/journey';

interface EnamelMedalProps {
  badge: Pick<
    AchievementBadge,
    'category' | 'rarity' | 'icon' | 'isUnlocked' | 'id'
  >;
  size?: number;
  /** Play a soft unlock bloom when true. */
  celebrate?: boolean;
}

function shapePath(
  shape: MedalShape,
  center: number,
  radius: number,
): string {
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
    case 'medal':
    case 'coin':
    case 'circle':
    default:
      return '';
  }
}

function Motif({
  motif,
  cx,
  cy,
  scale,
  unlocked,
}: {
  motif: MedalMotif;
  cx: number;
  cy: number;
  scale: number;
  unlocked: boolean;
}) {
  const stroke = unlocked
    ? achievementTokens.goldHighlight
    : achievementTokens.textMuted;
  const fill = unlocked
    ? 'rgba(244,211,94,0.18)'
    : 'rgba(138,138,138,0.12)';
  const s = scale;

  switch (motif) {
    case 'sunrise':
      return (
        <G>
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
    case 'trophy':
      return (
        <G>
          <Path
            d={`M ${cx - 10 * s} ${cy - 8 * s}
              L ${cx + 10 * s} ${cy - 8 * s}
              L ${cx + 7 * s} ${cy + 4 * s}
              Q ${cx} ${cy + 10 * s} ${cx - 7 * s} ${cy + 4 * s}
              Z`}
            fill={fill}
            stroke={stroke}
            strokeWidth={1.5}
          />
          <Path
            d={`M ${cx} ${cy + 8 * s} L ${cx} ${cy + 14 * s}`}
            stroke={stroke}
            strokeWidth={1.6}
          />
          <Path
            d={`M ${cx - 8 * s} ${cy + 14 * s} L ${cx + 8 * s} ${cy + 14 * s}`}
            stroke={stroke}
            strokeWidth={1.6}
            strokeLinecap="round"
          />
        </G>
      );
    case 'people':
      return (
        <G>
          <Circle cx={cx - 8 * s} cy={cy - 6 * s} r={4.5 * s} fill={fill} stroke={stroke} strokeWidth={1.3} />
          <Circle cx={cx + 8 * s} cy={cy - 6 * s} r={4.5 * s} fill={fill} stroke={stroke} strokeWidth={1.3} />
          <Circle cx={cx} cy={cy - 8 * s} r={5 * s} fill={fill} stroke={stroke} strokeWidth={1.3} />
          <Path
            d={`M ${cx - 16 * s} ${cy + 12 * s} Q ${cx - 8 * s} ${cy + 2 * s} ${cx} ${cy + 4 * s}
              Q ${cx + 8 * s} ${cy + 2 * s} ${cx + 16 * s} ${cy + 12 * s}`}
            fill="none"
            stroke={stroke}
            strokeWidth={1.5}
          />
        </G>
      );
    case 'shield':
      return (
        <Path
          d={`M ${cx} ${cy - 14 * s}
            L ${cx + 12 * s} ${cy - 8 * s}
            L ${cx + 12 * s} ${cy + 2 * s}
            Q ${cx + 12 * s} ${cy + 12 * s} ${cx} ${cy + 16 * s}
            Q ${cx - 12 * s} ${cy + 12 * s} ${cx - 12 * s} ${cy + 2 * s}
            L ${cx - 12 * s} ${cy - 8 * s}
            Z`}
          fill={fill}
          stroke={stroke}
          strokeWidth={1.6}
        />
      );
    case 'moon':
      return (
        <Path
          d={`M ${cx + 6 * s} ${cy - 12 * s}
            A ${14 * s} ${14 * s} 0 1 0 ${cx + 6 * s} ${cy + 12 * s}
            A ${10 * s} ${10 * s} 0 1 1 ${cx + 6 * s} ${cy - 12 * s}
            Z`}
          fill={fill}
          stroke={stroke}
          strokeWidth={1.5}
        />
      );
    case 'calendar':
      return (
        <G>
          <Path
            d={`M ${cx - 12 * s} ${cy - 8 * s}
              H ${cx + 12 * s}
              V ${cy + 12 * s}
              H ${cx - 12 * s}
              Z`}
            fill={fill}
            stroke={stroke}
            strokeWidth={1.5}
          />
          <Path
            d={`M ${cx - 12 * s} ${cy - 2 * s} H ${cx + 12 * s}`}
            stroke={stroke}
            strokeWidth={1.4}
          />
        </G>
      );
    case 'bolt':
      return (
        <Path
          d={`M ${cx + 2 * s} ${cy - 16 * s}
            L ${cx - 8 * s} ${cy + 1 * s}
            L ${cx} ${cy + 1 * s}
            L ${cx - 2 * s} ${cy + 16 * s}
            L ${cx + 8 * s} ${cy - 1 * s}
            L ${cx} ${cy - 1 * s}
            Z`}
          fill={fill}
          stroke={stroke}
          strokeWidth={1.4}
        />
      );
    case 'laurel':
      return (
        <G>
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
    case 'crown':
      return (
        <Path
          d={`M ${cx - 14 * s} ${cy + 6 * s}
            L ${cx - 14 * s} ${cy - 2 * s}
            L ${cx - 6 * s} ${cy + 4 * s}
            L ${cx} ${cy - 12 * s}
            L ${cx + 6 * s} ${cy + 4 * s}
            L ${cx + 14 * s} ${cy - 2 * s}
            L ${cx + 14 * s} ${cy + 6 * s}
            Z`}
          fill={fill}
          stroke={stroke}
          strokeWidth={1.5}
        />
      );
    case 'star':
      return (
        <Polygon
          points={`${cx},${cy - 14 * s} ${cx + 4 * s},${cy - 4 * s} ${cx + 14 * s},${cy - 4 * s} ${cx + 6 * s},${cy + 3 * s} ${cx + 9 * s},${cy + 14 * s} ${cx},${cy + 7 * s} ${cx - 9 * s},${cy + 14 * s} ${cx - 6 * s},${cy + 3 * s} ${cx - 14 * s},${cy - 4 * s} ${cx - 4 * s},${cy - 4 * s}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={1.4}
        />
      );
    case 'mat':
    default:
      return (
        <G>
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

export function EnamelMedal({
  badge,
  size = 96,
  celebrate = false,
}: EnamelMedalProps) {
  const shape = categoryShape(badge.category);
  const motif = motifForBadge(badge.icon, badge.category);
  const unlocked = badge.isUnlocked;
  const legendary = badge.rarity === 'legendary' && unlocked;
  const epic = badge.rarity === 'epic' && unlocked;

  const bloom = useRef(new Animated.Value(celebrate && unlocked ? 0 : 1)).current;
  const scale = useRef(new Animated.Value(celebrate && unlocked ? 0.86 : 1)).current;

  useEffect(() => {
    if (!celebrate || !unlocked) {
      return;
    }
    Animated.parallel([
      Animated.timing(bloom, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [bloom, celebrate, scale, unlocked]);

  const gid = useMemo(
    () => `medal-${badge.id}-${size}`.replace(/[^a-zA-Z0-9_-]/g, ''),
    [badge.id, size],
  );

  const c = size / 2;
  const outerR = size * 0.46;
  const enamelR = size * 0.34;
  const motifScale = size / 96;
  const rimPoly = shapePath(shape, c, outerR);
  const enamelPoly = shapePath(shape, c, enamelR);
  const isPoly = shape === 'hexagon';
  const isPath = shape === 'shield' || shape === 'crest';
  const showRibbon = shape === 'medal';

  const rimLight = unlocked
    ? achievementTokens.goldRimLight
    : '#5A5A5A';
  const rimMid = unlocked ? achievementTokens.gold : '#3A3A3A';
  const rimDeep = unlocked ? achievementTokens.goldDeep : '#222222';
  const enamel = unlocked
    ? achievementTokens.enamel
    : achievementTokens.enamelLocked;

  return (
    <Animated.View
      style={[
        styles.wrap,
        { width: size, height: size, transform: [{ scale }], opacity: bloom },
      ]}
    >
      {legendary ? (
        <View
          pointerEvents="none"
          style={[
            styles.legendaryAura,
            {
              width: size * 1.18,
              height: size * 1.18,
              borderRadius: size,
            },
          ]}
        />
      ) : null}

      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <LinearGradient id={`${gid}-rim`} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={rimLight} />
            <Stop offset="42%" stopColor={rimMid} />
            <Stop offset="78%" stopColor={rimDeep} />
            <Stop offset="100%" stopColor={rimLight} stopOpacity={0.85} />
          </LinearGradient>
          <RadialGradient id={`${gid}-enamel`} cx="35%" cy="30%" rx="70%" ry="70%">
            <Stop
              offset="0%"
              stopColor={unlocked ? '#2A2A2A' : '#1C1C1C'}
            />
            <Stop offset="55%" stopColor={enamel} />
            <Stop offset="100%" stopColor="#050505" />
          </RadialGradient>
          <LinearGradient id={`${gid}-bevel`} x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={unlocked ? 0.35 : 0.12} />
            <Stop offset="45%" stopColor="#FFFFFF" stopOpacity={0} />
            <Stop offset="100%" stopColor="#000000" stopOpacity={0.45} />
          </LinearGradient>
          <RadialGradient id={`${gid}-glow`} cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop
              offset="0%"
              stopColor={
                legendary
                  ? achievementTokens.goldHighlight
                  : epic
                    ? achievementTokens.rarity.epic
                    : achievementTokens.gold
              }
              stopOpacity={unlocked ? 0.35 : 0}
            />
            <Stop offset="100%" stopColor="#000000" stopOpacity={0} />
          </RadialGradient>
        </Defs>

        {/* Soft under-glow */}
        <Circle cx={c} cy={c} r={outerR + 2} fill={`url(#${gid}-glow)`} />

        {showRibbon ? (
          <G opacity={unlocked ? 0.95 : 0.4}>
            <Path
              d={`M ${c - size * 0.16} ${c - outerR + 2}
                L ${c - size * 0.05} ${c - outerR * 0.55}
                L ${c - size * 0.22} ${c - outerR * 0.35}
                Z`}
              fill={rimMid}
            />
            <Path
              d={`M ${c + size * 0.16} ${c - outerR + 2}
                L ${c + size * 0.05} ${c - outerR * 0.55}
                L ${c + size * 0.22} ${c - outerR * 0.35}
                Z`}
              fill={rimDeep}
            />
          </G>
        ) : null}

        {/* Metallic rim body */}
        {isPoly ? (
          <Polygon points={rimPoly} fill={`url(#${gid}-rim)`} />
        ) : isPath ? (
          <Path d={rimPoly} fill={`url(#${gid}-rim)`} />
        ) : (
          <Circle cx={c} cy={c} r={outerR} fill={`url(#${gid}-rim)`} />
        )}

        {/* Soft bevel wash over rim */}
        {isPoly ? (
          <Polygon
            points={rimPoly}
            fill={`url(#${gid}-bevel)`}
            opacity={0.4}
          />
        ) : isPath ? (
          <Path d={rimPoly} fill={`url(#${gid}-bevel)`} opacity={0.4} />
        ) : (
          <Circle
            cx={c}
            cy={c}
            r={outerR}
            fill={`url(#${gid}-bevel)`}
            opacity={0.4}
          />
        )}

        {/* Matte enamel center */}
        {isPoly ? (
          <Polygon points={enamelPoly} fill={`url(#${gid}-enamel)`} />
        ) : isPath ? (
          <Path d={enamelPoly} fill={`url(#${gid}-enamel)`} />
        ) : (
          <Circle cx={c} cy={c} r={enamelR} fill={`url(#${gid}-enamel)`} />
        )}

        {/* Coin double ring */}
        {shape === 'coin' && unlocked ? (
          <Circle
            cx={c}
            cy={c}
            r={enamelR * 0.86}
            fill="none"
            stroke={achievementTokens.gold}
            strokeOpacity={0.45}
            strokeWidth={1.2}
          />
        ) : null}

        {/* Specular highlight */}
        <Ellipse
          cx={c - size * 0.12}
          cy={c - size * 0.16}
          rx={size * 0.16}
          ry={size * 0.08}
          fill="#FFFFFF"
          opacity={unlocked ? 0.22 : 0.08}
        />

        <Motif
          motif={motif}
          cx={c}
          cy={c + (showRibbon ? size * 0.04 : 0)}
          scale={motifScale}
          unlocked={unlocked}
        />

        {!unlocked ? (
          <G opacity={0.85}>
            <Circle cx={c} cy={c} r={outerR} fill="#050505" opacity={0.42} />
            <Path
              d={`M ${c - 6} ${c - 2}
                V ${c - 7}
                A 6 6 0 0 1 ${c + 6} ${c - 7}
                V ${c - 2}
                H ${c + 9}
                V ${c + 10}
                H ${c - 9}
                V ${c - 2}
                Z`}
              fill={achievementTokens.textMuted}
            />
          </G>
        ) : null}
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendaryAura: {
    position: 'absolute',
    backgroundColor: 'rgba(244,211,94,0.12)',
  },
});
