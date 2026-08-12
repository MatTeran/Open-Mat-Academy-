import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { fontFamilies, spacing, w1Radii } from '../../../lib/theme';
import type { Announcement } from '../../../types/community';
import { formatShortDate } from '../../../utils';
import { SectionLabel } from './SectionLabel';
import { SurfaceCard } from './SurfaceCard';

interface AcademyAnnouncementCardProps {
  announcement: Announcement;
  onPress: () => void;
}

export function AcademyAnnouncementCard({
  announcement,
  onPress,
}: AcademyAnnouncementCardProps) {
  const { colors } = useAppTheme();

  return (
    <SurfaceCard
      onPress={onPress}
      accessibilityLabel={`Academy announcement: ${announcement.title}`}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View
            style={[styles.iconWrap, { backgroundColor: colors.goldMuted }]}
          >
            <Ionicons
              name="megaphone-outline"
              size={14}
              color={colors.goldAccent}
            />
          </View>
          <SectionLabel>Academy Announcement</SectionLabel>
        </View>
        <Text style={[styles.date, { color: colors.secondaryText }]}>
          {formatShortDate(announcement.createdAt)}
        </Text>
      </View>

      <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
        {announcement.title}
      </Text>
      <Text
        style={[styles.body, { color: colors.secondaryText }]}
        numberOfLines={2}
      >
        {announcement.body}
      </Text>

      <View style={styles.footer}>
        <Text
          style={[styles.author, { color: colors.secondaryText }]}
          numberOfLines={1}
        >
          {announcement.authorName}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View announcement"
          onPress={onPress}
          style={[styles.viewBtn, { backgroundColor: colors.goldMuted }]}
        >
          <Text style={[styles.viewLabel, { color: colors.goldAccent }]}>
            View
          </Text>
        </Pressable>
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
    marginBottom: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexShrink: 1,
  },
  iconWrap: {
    width: 26,
    height: 26,
    borderRadius: w1Radii.control,
    alignItems: 'center',
    justifyContent: 'center',
  },
  date: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: 0.1,
    marginBottom: 6,
  },
  body: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  author: {
    flex: 1,
    fontFamily: fontFamilies.medium,
    fontSize: 13,
  },
  viewBtn: {
    borderRadius: w1Radii.chip,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    minHeight: 32,
    justifyContent: 'center',
  },
  viewLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: 13,
  },
});
