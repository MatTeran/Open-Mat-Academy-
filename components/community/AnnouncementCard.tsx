import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import type { Announcement } from '../../types/community';
import { formatShortDate } from '../../utils';
import { Card } from '../ui/Card';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';

interface AnnouncementCardProps {
  announcement: Announcement;
  onPress?: () => void;
  compact?: boolean;
}

export function AnnouncementCard({
  announcement,
  onPress,
  compact = false,
}: AnnouncementCardProps) {
  const { colors } = useAppTheme();

  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <Text variant="caption" gold>
          {formatShortDate(announcement.createdAt)}
        </Text>
        {announcement.pinned ? (
          <View style={[styles.pin, { backgroundColor: colors.goldMuted }]}>
            <Text variant="caption" style={{ color: colors.goldAccent }}>
              Pinned
            </Text>
          </View>
        ) : null}
      </View>
      <Spacer size="xs" />
      <Text variant="subtitle" numberOfLines={compact ? 2 : undefined}>
        {announcement.title}
      </Text>
      <Spacer size="xs" />
      <Text variant="bodyMuted" numberOfLines={compact ? 2 : 4}>
        {announcement.body}
      </Text>
      <Spacer size="sm" />
      <Text variant="caption">
        {announcement.authorName}
        {announcement.comments.length > 0
          ? ` · ${announcement.comments.length} comment${
              announcement.comments.length === 1 ? '' : 's'
            }`
          : ''}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pin: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
});
