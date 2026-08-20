import { PropsWithChildren } from 'react';
import {
  Pressable,
  type PressableProps,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { w1Radii, w1Shadow, w1Spacing } from '../../../lib/theme';

interface SurfaceCardProps extends PropsWithChildren {
  onPress?: PressableProps['onPress'];
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  accessibilityLabel?: string;
}

/**
 * Soft floating card — shadow lives on an outer wrapper so iOS does not
 * clip it (overflow:hidden on the same view kills shadows).
 */
export function SurfaceCard({
  children,
  onPress,
  style,
  padded = true,
  accessibilityLabel,
}: SurfaceCardProps) {
  const { colors, isDark } = useAppTheme();

  const content = (
    <View style={[styles.shadowHost, w1Shadow.card, style]}>
      <LinearGradient
        colors={
          isDark
            ? [colors.cardBackground, colors.cardBackground]
            : ['#FFFFFF', '#F8F3EC']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.surface,
          {
            borderColor: isDark ? colors.border : 'rgba(28, 26, 23, 0.05)',
          },
          padded && styles.padded,
        ]}
      >
        {children}
      </LinearGradient>
    </View>
  );

  if (!onPress) {
    return content;
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
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadowHost: {
    borderRadius: w1Radii.card,
    backgroundColor: 'transparent',
  },
  surface: {
    borderRadius: w1Radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  padded: {
    padding: w1Spacing.cardPad,
  },
  pressed: {
    opacity: 0.97,
    transform: [{ scale: 0.985 }],
  },
});
