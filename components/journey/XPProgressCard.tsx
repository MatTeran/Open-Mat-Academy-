import { StyleSheet, View } from 'react-native';

import { spacing } from '../../lib/theme';
import type { UserGamificationProfile } from '../../types/journey';
import {
  formatXp,
  getXpProgressPercentage,
} from '../../utils/journey';
import { Card } from '../ui/Card';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';
import { ProgressBar } from './ProgressBar';

interface XPProgressCardProps {
  profile: UserGamificationProfile;
}

export function XPProgressCard({ profile }: XPProgressCardProps) {
  const percent = getXpProgressPercentage(
    profile.currentLevelXP,
    profile.nextLevelXP,
  );
  const remaining = Math.max(0, profile.nextLevelXP - profile.currentLevelXP);

  return (
    <Card>
      <Text variant="caption" gold>
        Experience
      </Text>
      <Spacer size="xs" />
      <Text
        variant="hero"
        accessibilityRole="header"
        accessibilityLabel={`Level ${profile.level}`}
      >
        Level {profile.level}
      </Text>
      <Spacer size="sm" />
      <Text variant="body">
        {formatXp(profile.currentLevelXP)} / {formatXp(profile.nextLevelXP)} XP
      </Text>
      <Spacer size="md" />
      <ProgressBar
        progress={percent}
        height={10}
        accessibilityLabel={`Level progress ${Math.round(percent)} percent`}
      />
      <Spacer size="sm" />
      <View style={styles.footer}>
        <Text variant="caption" muted>
          {formatXp(remaining)} XP until Level {profile.level + 1}
        </Text>
        <Text variant="caption" muted>
          {formatXp(profile.totalXP)} total
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
});
