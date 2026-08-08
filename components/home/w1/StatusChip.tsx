import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { fontFamilies, w1Radii } from '../../../lib/theme';

interface StatusChipProps {
  label: string;
}

export function StatusChip({ label }: StatusChipProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: colors.goldMuted,
        },
      ]}
    >
      <Text style={[styles.text, { color: colors.goldAccent }]}>{label}</Text>
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
