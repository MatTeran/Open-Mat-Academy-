import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { fontFamilies } from '../../../lib/theme';

interface MetricItemProps {
  label: string;
  value: string;
  icon?: keyof typeof Ionicons.glyphMap;
  /** Mockup order: icon → label → value */
  layout?: 'value-first' | 'label-first';
}

export function MetricItem({
  label,
  value,
  icon,
  layout = 'label-first',
}: MetricItemProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.wrap} accessibilityLabel={`${label}: ${value}`}>
      {icon ? (
        <Ionicons name={icon} size={14} color={colors.goldAccent} />
      ) : null}
      {layout === 'label-first' ? (
        <>
          <Text
            style={[styles.label, { color: colors.secondaryText }]}
            numberOfLines={2}
          >
            {label}
          </Text>
          <Text
            style={[styles.value, { color: colors.text }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            {value}
          </Text>
        </>
      ) : (
        <>
          <Text
            style={[styles.value, { color: colors.text }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            {value}
          </Text>
          <Text
            style={[styles.label, { color: colors.secondaryText }]}
            numberOfLines={2}
          >
            {label}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 2,
  },
  value: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    letterSpacing: 0.1,
    textAlign: 'center',
  },
  label: {
    fontFamily: fontFamilies.medium,
    fontSize: 8,
    letterSpacing: 0.35,
    lineHeight: 10,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});
