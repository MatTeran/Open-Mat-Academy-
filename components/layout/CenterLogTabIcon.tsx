import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';

interface CenterLogTabIconProps {
  focused: boolean;
}

/**
 * Raised center ⊕ for the Log tab — My Gi W.1 bronze accent.
 */
export function CenterLogTabIcon({ focused }: CenterLogTabIconProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: focused ? colors.goldPressed : colors.goldAccent,
          borderColor: colors.cardBackground,
          shadowColor: colors.goldAccent,
        },
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Ionicons name="add" size={28} color={colors.cardBackground} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    borderWidth: 4,
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
});
