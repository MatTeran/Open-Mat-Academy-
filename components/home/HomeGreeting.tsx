import { StyleSheet, View } from 'react-native';

import { spacing } from '../../lib/theme';
import { Text } from '../ui/Text';

interface HomeGreetingProps {
  greeting: string;
  firstName: string;
  motivationalMessage: string;
  tone?: 'default' | 'hero';
}

export function HomeGreeting({
  greeting,
  firstName,
  motivationalMessage,
  tone = 'default',
}: HomeGreetingProps) {
  const isHero = tone === 'hero';

  return (
    <View
      accessible
      accessibilityRole="header"
      accessibilityLabel={`${greeting}, ${firstName}. ${motivationalMessage}`}
      style={styles.wrap}
    >
      <Text
        variant="title"
        style={[styles.greeting, isHero && styles.heroGreeting]}
      >
        {greeting}, {firstName}
      </Text>
      <Text
        variant="bodyMuted"
        style={[styles.support, isHero && styles.heroSupport]}
      >
        {motivationalMessage}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs,
  },
  greeting: {
    fontSize: 28,
    lineHeight: 34,
  },
  support: {
    fontSize: 15,
    lineHeight: 22,
  },
  heroGreeting: {
    // Keep light text for readability on the dark photo overlay.
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.55)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  heroSupport: {
    color: '#C8C8C8',
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
});
