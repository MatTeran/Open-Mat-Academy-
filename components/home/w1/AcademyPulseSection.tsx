import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { fontFamilies, spacing, w1Radii } from '../../../lib/theme';
import type { Announcement, Seminar } from '../../../types/community';
import { SectionLabel } from './SectionLabel';
import { SurfaceCard } from './SurfaceCard';

const eventImage = require('../../../assets/home-hero.png');

interface AcademyPulseSectionProps {
  announcement: Announcement | null;
  seminar: Seminar | null;
  announcementUnread?: boolean;
  onSeeAll: () => void;
  onPressAnnouncement: () => void;
  onPressSeminar: () => void;
}

function seminarStatusLabel(seminar: Seminar): string {
  if (seminar.registered) {
    return 'Registered';
  }
  if (seminar.spotsLeft <= 0) {
    return 'Waitlist';
  }
  return `${seminar.spotsLeft} spots left`;
}

/**
 * Grouped Home feed: Announcements + Seminars under one “Academy Pulse” header.
 */
export function AcademyPulseSection({
  announcement,
  seminar,
  announcementUnread = false,
  onSeeAll,
  onPressAnnouncement,
  onPressSeminar,
}: AcademyPulseSectionProps) {
  const { colors } = useAppTheme();

  if (!announcement && !seminar) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <SectionLabel tone="accent">Academy Pulse</SectionLabel>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="See all academy pulse"
          onPress={onSeeAll}
          hitSlop={8}
          style={styles.seeAll}
        >
          <Text style={[styles.seeAllLabel, { color: colors.goldAccent }]}>
            See all
          </Text>
          <Ionicons
            name="chevron-forward"
            size={14}
            color={colors.goldAccent}
          />
        </Pressable>
      </View>

      <SurfaceCard padded={false}>
        {announcement ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Announcement: ${announcement.title}`}
            onPress={onPressAnnouncement}
            style={styles.announcement}
          >
            <View style={styles.announcementHeader}>
              <View style={styles.badges}>
                {announcement.pinned ? (
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: colors.goldMuted },
                    ]}
                  >
                    <Ionicons
                      name="pin"
                      size={10}
                      color={colors.goldAccent}
                    />
                    <Text
                      style={[styles.badgeText, { color: colors.goldAccent }]}
                    >
                      Pinned
                    </Text>
                  </View>
                ) : null}
                {announcementUnread ? (
                  <View style={styles.unreadRow}>
                    <View
                      style={[
                        styles.unreadDot,
                        { backgroundColor: colors.goldAccent },
                      ]}
                    />
                    <Text
                      style={[styles.badgeText, { color: colors.goldAccent }]}
                    >
                      New
                    </Text>
                  </View>
                ) : null}
                {!announcement.pinned && !announcementUnread ? (
                  <Text
                    style={[styles.kind, { color: colors.secondaryText }]}
                  >
                    Announcement
                  </Text>
                ) : null}
              </View>
            </View>

            <Text
              style={[styles.title, { color: colors.text }]}
              numberOfLines={2}
            >
              {announcement.title}
            </Text>
            <Text
              style={[styles.body, { color: colors.secondaryText }]}
              numberOfLines={2}
            >
              {announcement.body}
            </Text>
          </Pressable>
        ) : null}

        {announcement && seminar ? (
          <View
            style={[styles.divider, { backgroundColor: colors.border }]}
          />
        ) : null}

        {seminar ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Seminar: ${seminar.title}, ${seminarStatusLabel(seminar)}`}
            onPress={onPressSeminar}
            style={styles.seminar}
          >
            <View style={styles.seminarCopy}>
              <Text
                style={[styles.kind, { color: colors.secondaryText }]}
              >
                Seminar
              </Text>
              <Text
                style={[styles.title, { color: colors.text }]}
                numberOfLines={2}
              >
                {seminar.title}
              </Text>
              <Text style={[styles.when, { color: colors.secondaryText }]}>
                {`${seminar.dateLabel} · ${seminar.timeLabel}`}
              </Text>
              <View
                style={[
                  styles.statusChip,
                  {
                    backgroundColor: seminar.registered
                      ? colors.goldMuted
                      : colors.goldTintSurface,
                    borderColor: colors.goldAccent,
                  },
                ]}
              >
                <Text
                  style={[styles.statusText, { color: colors.goldAccent }]}
                >
                  {seminarStatusLabel(seminar)}
                </Text>
              </View>
            </View>
            <Image source={eventImage} style={styles.media} />
          </Pressable>
        ) : null}
      </SurfaceCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: 12,
    letterSpacing: 0.3,
  },
  announcement: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: 6,
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: w1Radii.chip,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontFamily: fontFamilies.semibold,
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  unreadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  kind: {
    fontFamily: fontFamilies.semibold,
    fontSize: 10,
    letterSpacing: 1.0,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    letterSpacing: 0.2,
    lineHeight: 21,
  },
  body: {
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: spacing.md,
  },
  seminar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  seminarCopy: {
    flex: 1,
    minWidth: 0,
    gap: 5,
  },
  when: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    letterSpacing: 0.3,
  },
  statusChip: {
    alignSelf: 'flex-start',
    marginTop: 2,
    borderRadius: w1Radii.chip,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontFamily: fontFamilies.semibold,
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  media: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
});
