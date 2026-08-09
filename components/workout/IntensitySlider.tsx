import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import {
  LayoutChangeEvent,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import {
  intensityScoreToBand,
  intensityScoreToCategory,
} from '../../lib/data/workoutOptions';
import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import type { TrainingIntensity } from '../../types/workout';
import { Text } from '../ui/Text';
import { Spacer } from '../ui/Spacer';

interface IntensitySliderProps {
  value: number | null;
  onChange: (score: number, intensity: TrainingIntensity) => void;
  onClear?: () => void;
}

const MIN = 1;
const MAX = 10;

function scoreFromX(x: number, width: number): number {
  if (width <= 0) {
    return MIN;
  }
  const ratio = Math.min(1, Math.max(0, x / width));
  return Math.round(ratio * (MAX - MIN) + MIN);
}

export function IntensitySlider({
  value,
  onChange,
  onClear,
}: IntensitySliderProps) {
  const { colors } = useAppTheme();
  const widthRef = useRef(0);
  const lastBandRef = useRef<string | null>(null);
  const score = value ?? 5;
  const band = intensityScoreToBand(score);
  const fillRatio = (score - MIN) / (MAX - MIN);

  const applyScore = (next: number) => {
    const clamped = Math.min(MAX, Math.max(MIN, next));
    const nextBand = intensityScoreToBand(clamped);
    if (lastBandRef.current && lastBandRef.current !== nextBand) {
      void Haptics.selectionAsync();
    }
    lastBandRef.current = nextBand;
    onChange(clamped, intensityScoreToCategory(clamped));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        applyScore(scoreFromX(event.nativeEvent.locationX, widthRef.current));
      },
      onPanResponderMove: (event) => {
        applyScore(scoreFromX(event.nativeEvent.locationX, widthRef.current));
      },
    }),
  ).current;

  const onLayout = (event: LayoutChangeEvent) => {
    widthRef.current = event.nativeEvent.layout.width;
  };

  return (
    <View>
      <View style={styles.header}>
        <Text variant="label">Intensity</Text>
        {onClear && value != null ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear intensity rating"
            onPress={onClear}
            hitSlop={8}
          >
            <Text variant="caption" style={{ color: colors.secondaryText }}>
              Clear
            </Text>
          </Pressable>
        ) : null}
      </View>
      <Spacer size="xs" />
      <Text
        variant="subtitle"
        style={{ color: colors.text }}
        accessibilityLabel={
          value == null
            ? 'Intensity not rated'
            : `Intensity ${score} out of 10, ${band}`
        }
      >
        {value == null ? 'Not rated' : `${score} / 10`}
        {value != null ? (
          <Text variant="bodyMuted"> · {band}</Text>
        ) : null}
      </Text>
      <Spacer size="sm" />
      <View
        style={[styles.track, { backgroundColor: colors.goldMuted }]}
        onLayout={onLayout}
        {...panResponder.panHandlers}
        accessibilityRole="adjustable"
        accessibilityLabel="Training intensity"
        accessibilityValue={{
          min: MIN,
          max: MAX,
          now: score,
          text: value == null ? 'Not rated' : `${score} of 10, ${band}`,
        }}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${Math.max(8, fillRatio * 100)}%`,
              backgroundColor: colors.goldAccent,
            },
          ]}
        />
        <View
          style={[
            styles.thumb,
            {
              left: `${fillRatio * 100}%`,
              backgroundColor: colors.elevatedSurface,
              borderColor: colors.goldAccent,
            },
          ]}
        />
      </View>
      <Spacer size="xs" />
      <View style={styles.scale}>
        <Text variant="caption" muted>
          Light
        </Text>
        <Text variant="caption" muted>
          Moderate
        </Text>
        <Text variant="caption" muted>
          Hard
        </Text>
        <Text variant="caption" muted>
          Competition
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  track: {
    height: 28,
    borderRadius: radii.pill,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: radii.pill,
  },
  thumb: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    marginLeft: -11,
    top: 3,
  },
  scale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxs,
  },
});
