import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';

interface CenterLogTabIconProps {
  focused: boolean;
}

/**
 * Raised center ⊕ for the Log tab (Open Mat uses white accent).
 */
export function CenterLogTabIcon({ focused }: CenterLogTabIconProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: focused ? colors.goldPressed : colors.goldAccent,
          borderColor: colors.primaryBackground,
          shadowColor: '#000000',
        },
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Ionicons name="add" size={30} color={colors.primaryBackground} />
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
    marginTop: -18,
    borderWidth: 4,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
});
