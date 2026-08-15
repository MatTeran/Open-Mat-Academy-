import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { fontFamilies, spacing, w1Spacing } from '../../../lib/theme';

interface GreetingSectionProps {
  greeting: string;
  firstName: string;
  message: string;
}

export function GreetingSection({
  greeting,
  firstName,
  message,
}: GreetingSectionProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={styles.wrap}
      accessibilityLabel={`${greeting}, ${firstName}. ${message}`}
    >
      <Text style={[styles.greeting, { color: colors.text }]}>
        {`${greeting}, ${firstName}`.toUpperCase()}
      </Text>
      <Text style={[styles.message, { color: colors.secondaryText }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: w1Spacing.screenX,
    gap: 6,
  },
  greeting: {
    fontFamily: fontFamilies.bold,
    fontSize: 22,
    letterSpacing: 1.1,
    lineHeight: 28,
  },
  message: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    lineHeight: 20,
  },
});
