import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { fontFamilies, spacing } from '../../../lib/theme';
import { SectionLabel } from './SectionLabel';
import { SurfaceCard } from './SurfaceCard';

interface AcademyAnnouncementCardProps {
  title: string;
  body: string;
  authorName: string;
  whenLabel: string;
  onPress: () => void;
}

/**
 * Home feed row — academy announcement preview.
 */
export function AcademyAnnouncementCard({
  title,
  body,
  authorName,
  whenLabel,
  onPress,
}: AcademyAnnouncementCardProps) {
  const { colors } = useAppTheme();

  return (
    <SurfaceCard
      onPress={onPress}
      accessibilityLabel={`Academy announcement: ${title}`}
    >
      <View style={styles.header}>
        <SectionLabel tone="accent">Academy Announcements</SectionLabel>
        <Text style={[styles.when, { color: colors.secondaryText }]}>
          {whenLabel}
        </Text>
      </View>

      <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
        {title}
      </Text>

      <Text
        style={[styles.body, { color: colors.secondaryText }]}
        numberOfLines={2}
      >
        {body}
      </Text>

      <View style={styles.footer}>
        <Text
          style={[styles.author, { color: colors.secondaryText }]}
          numberOfLines={1}
        >
          {authorName}
        </Text>
        <View style={styles.cta}>
          <Text style={[styles.ctaLabel, { color: colors.goldAccent }]}>
            View
          </Text>
          <Ionicons
            name="chevron-forward"
            size={14}
            color={colors.goldAccent}
          />
        </View>
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: 8,
  },
  when: {
    fontFamily: fontFamilies.medium,
    fontSize: 11,
    letterSpacing: 0.2,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    letterSpacing: 0.2,
    lineHeight: 21,
  },
  body: {
    marginTop: 6,
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  author: {
    flex: 1,
    fontFamily: fontFamilies.medium,
    fontSize: 12,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ctaLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
