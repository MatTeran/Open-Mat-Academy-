import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import type { BeltRank } from '../../types/user';
import { Text } from '../ui/Text';
import { ProfileMiniBelt } from './ProfileMiniBelt';

interface ProfileBeltBarProps {
  belt: BeltRank;
  stripes: 0 | 1 | 2 | 3 | 4;
  beltLabel: string;
  stripesLabel: string;
  onPress: () => void;
}

/** Full-width belt highlight — rank + wide stripe bar. */
export function ProfileBeltBar({
  belt,
  stripes,
  beltLabel,
  stripesLabel,
  onPress,
}: ProfileBeltBarProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Belt: ${beltLabel}, ${stripesLabel}`}
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.secondaryBackground,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text variant="caption" style={{ color: colors.goldAccent }}>
              Belt
            </Text>
            <Ionicons
              name="ribbon-outline"
              size={16}
              color={colors.goldAccent}
              style={styles.headerIcon}
            />
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.secondaryText}
          />
        </View>

        <ProfileMiniBelt belt={belt} stripes={stripes} size="wide" />

        <View style={styles.copy}>
          <Text variant="subtitle" style={[styles.title, { color: colors.text }]}>
            {beltLabel}
          </Text>
          <Text
            variant="caption"
            style={[styles.subtitle, { color: colors.secondaryText }]}
          >
            {stripesLabel}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.92,
  },
  card: {
    width: '100%',
    borderRadius: radii.xl,
    borderWidth: 1,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 6,
  },
  copy: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  title: {
    fontSize: 20,
  },
  subtitle: {
    lineHeight: 18,
  },
});
