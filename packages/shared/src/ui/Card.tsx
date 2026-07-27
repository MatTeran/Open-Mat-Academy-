import { PropsWithChildren } from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { useAppTheme } from '../providers/ThemeProvider';
import { radii, spacing } from '../theme';

export interface CardProps extends PropsWithChildren {
  onPress?: PressableProps['onPress'];
  padded?: boolean;
  elevated?: boolean;
  style?: ViewStyle;
}

export function Card({
  children,
  onPress,
  padded = true,
  elevated = false,
  style,
}: CardProps) {
  const { colors } = useAppTheme();
  const cardStyle = [
    styles.card,
    {
      backgroundColor: elevated
        ? colors.elevatedSurface
        : colors.cardBackground ?? colors.secondaryBackground,
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
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  padded: {
    padding: spacing.lg,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
});
