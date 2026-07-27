import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import { Card } from '../ui/Card';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';

interface StreaksMiniCardProps {
  weeklyStreak: number;
  onPress: () => void;
}

export function StreaksMiniCard({
  weeklyStreak,
  onPress,
}: StreaksMiniCardProps) {
  const { colors } = useAppTheme();

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text variant="subtitle">Streaks</Text>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={colors.secondaryText}
        />
      </View>

      <Spacer size="md" />

      <View style={styles.flameWrap}>
        <Ionicons name="flame" size={44} color={colors.goldAccent} />
        <Text variant="title" style={styles.streakValue}>
          {weeklyStreak}
        </Text>
      </View>
      <Spacer size="xs" />
      <Text variant="caption" muted style={styles.center}>
        Weeks
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    minHeight: 168,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flameWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  streakValue: {
    position: 'absolute',
    fontSize: 18,
    marginTop: 6,
  },
  center: {
    textAlign: 'center',
  },
});
