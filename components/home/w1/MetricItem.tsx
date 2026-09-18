import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { tileType } from './tileLayout';

interface MetricItemProps {
  label: string;
  value: string;
  icon?: keyof typeof Ionicons.glyphMap;
  compact?: boolean;
  accessibilityLabel?: string;
}

export function MetricItem({
  label,
  value,
  icon,
  compact = false,
  accessibilityLabel,
}: MetricItemProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[styles.wrap, compact && styles.compact]}
      accessibilityLabel={accessibilityLabel ?? `${label}: ${value}`}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={compact ? 12 : 14}
          color={colors.goldAccent}
        />
      ) : null}
      <Text
        style={[
          compact ? tileType.metricValue : styles.value,
          { color: colors.text },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
      >
        {value}
      </Text>
      <Text
        style={[
          compact ? tileType.metricLabel : styles.label,
          { color: colors.secondaryText },
        ]}
        numberOfLines={1}
      >
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
    paddingVertical: 4,
    minWidth: 0,
  },
  compact: {
    gap: 2,
    paddingVertical: 0,
  },
  value: {
    fontFamily: tileType.metricValue.fontFamily,
    fontSize: 16,
    letterSpacing: 0.2,
  },
  label: {
    fontFamily: tileType.metricLabel.fontFamily,
    fontSize: 9,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});
