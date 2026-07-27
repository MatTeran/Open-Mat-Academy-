import { StyleSheet, View } from 'react-native';

import type { Announcement } from '../../types/community';
import { formatShortDate } from '../../utils';
import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import { Card } from '../ui/Card';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';

interface LatestAnnouncementCardProps {
  announcement: Announcement;
  onPress?: () => void;
}

export function LatestAnnouncementCard({
  announcement,
  onPress,
}: LatestAnnouncementCardProps) {
  const { colors } = useAppTheme();

  return (
    <Card
      onPress={onPress}
      style={{ backgroundColor: colors.elevatedSurface }}
      padded={false}
    >
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text variant="label" gold>
            Latest
          </Text>
          <Text variant="caption">{formatShortDate(announcement.createdAt)}</Text>
        </View>
        <Spacer size="xs" />
        <Text variant="subtitle" numberOfLines={2} style={styles.title}>
          {announcement.title}
        </Text>
        <Spacer size="xxs" />
        <Text variant="bodyMuted" numberOfLines={2}>
          {announcement.body}
        </Text>
        <Spacer size="sm" />
        <View style={styles.footer}>
          <Text variant="caption" numberOfLines={1} style={styles.author}>
            {announcement.authorName}
          </Text>
          <View style={[styles.cta, { backgroundColor: colors.goldMuted }]}>
            <Text variant="caption" gold>
              View
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  inner: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  author: {
    flex: 1,
  },
  cta: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    minHeight: 28,
    justifyContent: 'center',
  },
});
