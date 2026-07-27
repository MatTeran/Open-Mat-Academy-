import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '../../lib/theme';

function Bone({ height, width = '100%' }: { height: number; width?: number | `${number}%` }) {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.bone,
        { height, width, opacity },
      ]}
    />
  );
}

export function JourneySkeleton() {
  return (
    <View style={styles.stack} accessibilityLabel="Loading journey">
      <Bone height={140} />
      <Bone height={160} />
      <Bone height={120} />
      <Bone height={120} />
      <View style={styles.row}>
        <Bone height={96} width="30%" />
        <Bone height={96} width="30%" />
        <Bone height={96} width="30%" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  bone: {
    borderRadius: radii.lg,
    backgroundColor: colors.secondaryBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
