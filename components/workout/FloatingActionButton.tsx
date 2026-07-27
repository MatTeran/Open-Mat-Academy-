import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { spacing } from '../../lib/theme';

interface FloatingActionButtonProps {
  onPress: () => void;
  label?: string;
}

export function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="New Workout"
      onPress={onPress}
      style={({ pressed }) => [
        styles.fab,
        {
          bottom: Math.max(insets.bottom, spacing.md) + 72,
          backgroundColor: colors.goldAccent,
        },
        pressed && styles.pressed,
      ]}
    >
      <Ionicons name="add" size={28} color={colors.primaryBackground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing.lg,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.96 }],
  },
});
