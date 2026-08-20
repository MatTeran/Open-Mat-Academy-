import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { fontFamilies, spacing, w1Radii, w1Spacing } from '../../../lib/theme';
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
          <SectionLabel tone="accent">{eyebrow}</SectionLabel>
          <Text
            style={[styles.title, { color: colors.text }]}
            numberOfLines={2}
          >
            {title.toUpperCase()}
          </Text>
          <Text style={[styles.when, { color: colors.secondaryText }]}>
            {whenLabel}
          </Text>
        </View>

        <View style={styles.mediaWrap}>
          <Image source={eventImage} style={styles.media} />
          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.secondaryText}
            accessibilityElementsHidden
            importantForAccessibility="no"
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
    paddingVertical: spacing.md,
    paddingLeft: w1Spacing.cardPad,
    paddingRight: spacing.md,
    gap: spacing.sm,
  },
  copy: {
    flex: 1,
    gap: 8,
    minWidth: 0,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    letterSpacing: 0.3,
    lineHeight: 21,
  },
  when: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    letterSpacing: 0.2,
  },
  mediaWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  media: {
    width: 72,
    height: 72,
    borderRadius: w1Radii.control,
  },
});
