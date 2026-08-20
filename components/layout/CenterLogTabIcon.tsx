import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { w1Shadow } from '../../lib/theme';

interface CenterLogTabIconProps {
  focused: boolean;
}

/**
 * Raised center ⊕ for the Log tab — soft beige gradient FAB (Home mockup).
 */
export function CenterLogTabIcon({ focused }: CenterLogTabIconProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <View
      style={[styles.shadowHost, w1Shadow.fab]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <LinearGradient
        colors={
          isDark
            ? [colors.elevatedSurface, colors.goldTintSurface]
            : focused
              ? ['#F7F1E8', '#E4D9CA']
              : ['#FBF8F3', '#EDE4D8']
        }
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={[
          styles.wrap,
          {
            borderColor: isDark ? colors.border : '#F3F0EA',
          },
        ]}
      >
        <Ionicons name="add" size={28} color={colors.goldAccent} />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowHost: {
    width: 58,
    height: 58,
    borderRadius: 29,
    marginTop: -22,
  },
  wrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
});
