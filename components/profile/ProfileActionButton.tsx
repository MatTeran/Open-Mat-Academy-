import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import { Text } from '../ui/Text';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface ProfileActionButtonProps {
  label: string;
  icon: IconName;
  onPress: () => void;
  variant?: 'filled' | 'outline';
}

/**
 * Equal-width profile CTA.
 * Layout lives on an inner View so NativeWind cannot drop flex row styles.
 */
export function ProfileActionButton({
  label,
  icon,
  onPress,
  variant = 'outline',
}: ProfileActionButtonProps) {
  const { colors } = useAppTheme();
  const filled = variant === 'filled';
  const labelColor = filled ? colors.primaryBackground : colors.goldAccent;
  const iconColor = filled ? colors.primaryBackground : colors.goldAccent;

  return (
    <View style={styles.slot}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        <View
          style={[
            styles.button,
            {
              borderColor: colors.goldAccent,
              backgroundColor: filled ? colors.goldAccent : 'transparent',
            },
          ]}
        >
          <Ionicons name={icon} size={16} color={iconColor} />
          <Text
            variant="body"
            numberOfLines={1}
            style={[styles.label, { color: labelColor }]}
          >
            {label}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    flex: 1,
    minWidth: 0,
  },
  pressed: {
    opacity: 0.88,
  },
  button: {
    width: '100%',
    minHeight: 48,
    borderWidth: 1.5,
    borderRadius: radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  label: {
    fontSize: 15,
    flexShrink: 1,
  },
});
