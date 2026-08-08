import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { fontFamilies, spacing } from '../../../lib/theme';

interface MetricItemProps {
  label: string;
  value: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function MetricItem({ label, value, icon }: MetricItemProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.wrap} accessibilityLabel={`${label}: ${value}`}>
      {icon ? (
        <Ionicons name={icon} size={14} color={colors.goldAccent} />
      ) : null}
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.secondaryText }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingVertical: spacing.xxs,
  },
  value: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    letterSpacing: 0.2,
  },
  label: {
    fontFamily: fontFamilies.medium,
    fontSize: 9,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});
