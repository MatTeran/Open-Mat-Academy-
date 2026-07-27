import { PropsWithChildren } from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';

export interface CardProps extends PropsWithChildren {
  onPress?: PressableProps['onPress'];
  padded?: boolean;
  style?: ViewStyle;
}

/**
 * Elevated surface for interactive dashboard modules.
 */
export function Card({
  children,
  onPress,
  padded = true,
  style,
}: CardProps) {
  const { colors } = useAppTheme();
  const cardStyle = [
    styles.card,
    {
      backgroundColor: colors.secondaryBackground,
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
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <View style={cardStyle}>{children}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  padded: {
    padding: spacing.lg,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
});
