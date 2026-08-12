import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { fontFamilies, w1Radii } from '../../../lib/theme';

interface StatusChipProps {
  label: string;
  /** Filled bronze chip with light text — matches mockup Gi badge. */
  variant?: 'soft' | 'filled';
}

export function StatusChip({ label, variant = 'soft' }: StatusChipProps) {
  const { colors } = useAppTheme();
  const filled = variant === 'filled';

  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: filled ? colors.goldAccent : colors.goldMuted,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: filled ? '#FFFFFF' : colors.goldAccent },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: w1Radii.chip,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  text: {
    fontFamily: fontFamilies.semibold,
    fontSize: 10,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
});
