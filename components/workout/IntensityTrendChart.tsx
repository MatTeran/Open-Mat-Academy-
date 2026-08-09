import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  LayoutChangeEvent,
  StyleSheet,
  View,
} from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Path,
  Stop,
} from 'react-native-svg';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import type { IntensityWeekPoint } from '../../types/trainingInsights';

interface IntensityTrendChartProps {
  points: IntensityWeekPoint[];
}

const CHART_HEIGHT = 88;
const PAD_LEFT = 4;
const PAD_RIGHT = 4;
const PAD_TOP = 8;
const PAD_BOTTOM = 8;

function buildLinePath(coords: Array<{ x: number; y: number }>): string {
  if (coords.length === 0) {
    return '';
  }
  return coords
    .map((point, index) =>
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`,
    )
    .join(' ');
}

export function IntensityTrendChart({ points }: IntensityTrendChartProps) {
  const { colors } = useAppTheme();
  const [width, setWidth] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;

  const values = points.map((point) => point.average ?? 0);
  const hasData = points.some((point) => point.average != null);
  const maxValue = Math.max(10, ...values, 1);

  useEffect(() => {
    let mounted = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (!mounted) {
        return;
      }
      if (reduce) {
        progress.setValue(1);
        return;
      }
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    });
    return () => {
      mounted = false;
    };
  }, [points, progress]);

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  const chartWidth = Math.max(width, 1);
  const plotWidth = chartWidth - PAD_LEFT - PAD_RIGHT;
  const plotHeight = CHART_HEIGHT - PAD_TOP - PAD_BOTTOM;

  const coords = useMemo(() => {
    const plotted = points
      .map((point, index) => {
        if (point.average == null) {
          return null;
        }
        const x =
          PAD_LEFT +
          (points.length <= 1
            ? plotWidth / 2
            : (plotWidth * index) / (points.length - 1));
        const y =
          PAD_TOP + plotHeight - (point.average / maxValue) * plotHeight;
        return { x, y };
      })
      .filter((point): point is { x: number; y: number } => point != null);
    return plotted;
  }, [maxValue, plotHeight, plotWidth, points]);

  const linePath = buildLinePath(coords);
  const areaPath =
    coords.length > 0
      ? `${linePath} L ${coords[coords.length - 1].x} ${PAD_TOP + plotHeight} L ${coords[0].x} ${PAD_TOP + plotHeight} Z`
      : '';

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      {width > 0 && hasData ? (
        <Animated.View style={{ opacity: progress }}>
          <Svg width={chartWidth} height={CHART_HEIGHT}>
            <Defs>
              <LinearGradient id="intensityFill" x1="0" y1="0" x2="0" y2="1">
                <Stop
                  offset="0%"
                  stopColor={colors.goldAccent}
                  stopOpacity={0.32}
                />
                <Stop
                  offset="100%"
                  stopColor={colors.goldAccent}
                  stopOpacity={0.02}
                />
              </LinearGradient>
            </Defs>
            {areaPath ? (
              <Path d={areaPath} fill="url(#intensityFill)" />
            ) : null}
            {linePath ? (
              <Path
                d={linePath}
                stroke={colors.goldAccent}
                strokeWidth={2.25}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}
          </Svg>
        </Animated.View>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    minHeight: CHART_HEIGHT,
  },
  placeholder: {
    height: CHART_HEIGHT,
  },
});
