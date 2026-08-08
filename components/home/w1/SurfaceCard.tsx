import { PropsWithChildren } from 'react';
import {
  Pressable,
  type PressableProps,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { w1Radii, w1Shadow, w1Spacing } from '../../../lib/theme';

interface SurfaceCardProps extends PropsWithChildren {
  onPress?: PressableProps['onPress'];
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  accessibilityLabel?: string;
}

export function SurfaceCard({
  children,
  onPress,
  style,
  padded = true,
  accessibilityLabel,
}: SurfaceCardProps) {
  const { colors } = useAppTheme();

  const cardStyle = [
    styles.card,
    w1Shadow.card,
    {
      backgroundColor: colors.cardBackground,
      borderColor: colors.border,
    },
    padded && styles.padded,
    style,
  ];

  if (!onPress) {
    return <View style={cardStyle}>{children}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={(event) => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.(event);
      }}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <View style={cardStyle}>{children}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: w1Radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  padded: {
    padding: w1Spacing.cardPad,
  },
  pressed: {
    opacity: 0.96,
    transform: [{ scale: 0.985 }],
  },
});
