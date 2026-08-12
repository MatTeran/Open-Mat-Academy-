import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { fontFamilies, spacing } from '../../../lib/theme';
import { SectionLabel } from './SectionLabel';
import { SurfaceCard } from './SurfaceCard';

const eventImage = require('../../../assets/home-hero.png');

interface UpcomingEventCardProps {
  eyebrow?: string;
  title: string;
  whenLabel: string;
  onPress: () => void;
}

export function UpcomingEventCard({
  eyebrow = 'Upcoming Seminar',
  title,
  whenLabel,
  onPress,
}: UpcomingEventCardProps) {
  const { colors } = useAppTheme();

  return (
    <SurfaceCard
      padded={false}
      onPress={onPress}
      accessibilityLabel={`${eyebrow}: ${title}, ${whenLabel}`}
    >
      <View style={styles.row}>
        <View style={styles.copy}>
          <SectionLabel>{eyebrow}</SectionLabel>
          <Text
            style={[styles.title, { color: colors.text }]}
            numberOfLines={2}
          >
            {title.toUpperCase()}
          </Text>
          <View style={styles.whenRow}>
            <Ionicons
              name="calendar-outline"
              size={13}
              color={colors.secondaryText}
            />
            <Text
              style={[styles.when, { color: colors.secondaryText }]}
              numberOfLines={1}
            >
              {whenLabel}
            </Text>
          </View>
        </View>

        <View style={styles.mediaWrap}>
          <Image source={eventImage} style={styles.media} />
          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.secondaryText}
          />
        </View>
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 108,
    paddingRight: spacing.sm,
  },
  copy: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    gap: 6,
    minWidth: 0,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    letterSpacing: 0.4,
    lineHeight: 21,
  },
  whenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  when: {
    flex: 1,
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    letterSpacing: 0.3,
  },
  mediaWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  media: {
    width: 76,
    height: 76,
    borderRadius: 16,
  },
});
