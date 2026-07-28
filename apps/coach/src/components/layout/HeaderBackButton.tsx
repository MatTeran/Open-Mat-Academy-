import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet, Text } from 'react-native';

import { fontFamilies, spacing, useAppTheme } from '@openmat/shared';

interface HeaderBackButtonProps {
  /** Override label. Defaults to "Back". */
  label?: string;
}

/**
 * Explicit header back control for Coach stack screens.
 * Native stack back can be easy to miss on dark B&W chrome.
 */
export function HeaderBackButton({ label = 'Back' }: HeaderBackButtonProps) {
  const navigation = useNavigation();
  const { colors } = useAppTheme();

  if (!navigation.canGoBack()) {
    return null;
  }

  return (
    <Pressable
      onPress={() => navigation.goBack()}
      accessibilityRole="button"
      accessibilityLabel="Go back to previous screen"
      hitSlop={12}
      style={({ pressed }) => [styles.pressable, pressed ? styles.pressed : null]}
    >
      <Ionicons name="chevron-back" size={22} color={colors.goldAccent} />
      <Text style={[styles.label, { color: colors.goldAccent }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingRight: spacing.sm,
    marginLeft: -spacing.xs,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    letterSpacing: 0.2,
  },
});
