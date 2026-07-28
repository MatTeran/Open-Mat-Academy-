import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Button,
  NotificationCard,
  NotificationEmptyState,
  Screen,
  Spacer,
  Text,
} from '../../components';
import { useNotifications } from '../../hooks';
import { spacing } from '../../lib/theme';
import type { OpenMatNotification } from '../../lib/notifications';
import type { ProfileStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Notifications'>;

type HistoryGroup = {
  key: string;
  label: string;
  items: OpenMatNotification[];
};

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function groupNotifications(items: OpenMatNotification[]): HistoryGroup[] {
  const now = new Date();
  const today = startOfDay(now).getTime();
  const yesterday = today - 24 * 60 * 60 * 1000;

  const buckets: Record<string, OpenMatNotification[]> = {
    today: [],
    yesterday: [],
    earlier: [],
  };

  for (const item of items) {
    const day = startOfDay(new Date(item.createdAt)).getTime();
    if (day === today) {
      buckets.today.push(item);
    } else if (day === yesterday) {
      buckets.yesterday.push(item);
    } else {
      buckets.earlier.push(item);
    }
  }

  const groups: HistoryGroup[] = [];
  if (buckets.today.length) {
    groups.push({ key: 'today', label: 'Today', items: buckets.today });
  }
  if (buckets.yesterday.length) {
    groups.push({
      key: 'yesterday',
      label: 'Yesterday',
      items: buckets.yesterday,
    });
  }
  if (buckets.earlier.length) {
    groups.push({ key: 'earlier', label: 'Earlier', items: buckets.earlier });
  }
  return groups;
}

function actionLabelFor(item: OpenMatNotification): string | undefined {
  if (item.eventType === 'waitlist_opening') {
    return 'Reserve Spot';
  }
  if (item.eventType === 'achievement_unlocked') {
    return 'View Journey';
  }
  if (item.category === 'training') {
    return 'View Class';
  }
  return undefined;
}

export function NotificationsScreen({ navigation }: Props) {
  const {
    history,
    unreadCount,
    markRead,
    markAllRead,
    handleNotificationNavigation,
  } = useNotifications();

  const groups = useMemo(() => groupNotifications(history), [history]);

  return (
    <Screen scroll contentStyle={styles.content}>
      <View style={styles.headerRow}>
        <Button
          label="Back"
          variant="ghost"
          fullWidth={false}
          onPress={() => navigation.goBack()}
        />
        <Button
          label="Settings"
          variant="ghost"
          fullWidth={false}
          onPress={() => navigation.navigate('NotificationSettings')}
          accessibilityLabel="Open notification settings"
        />
      </View>

      <Spacer size="md" />
      <View style={styles.titleRow}>
        <Text variant="hero">Notifications</Text>
        {unreadCount > 0 ? (
          <Button
            label="Mark All Read"
            variant="outlineGold"
            fullWidth={false}
            onPress={() => {
              void markAllRead();
            }}
            accessibilityLabel={`Mark all ${unreadCount} notifications as read`}
          />
        ) : null}
      </View>

      <Spacer size="sm" />
      <Text variant="bodyMuted">
        Training updates, achievements, and academy news.
      </Text>

      <Spacer size="xl" />

      {groups.length === 0 ? (
        <NotificationEmptyState />
      ) : (
        groups.map((group) => (
          <View key={group.key} style={styles.group}>
            <Text variant="subtitle">{group.label}</Text>
            <Spacer size="sm" />
            <View style={styles.list}>
              {group.items.map((item) => (
                <NotificationCard
                  key={item.id}
                  title={item.title}
                  body={item.body}
                  category={item.category}
                  createdAt={item.createdAt}
                  isRead={item.isRead}
                  actionLabel={actionLabelFor(item)}
                  onPress={() => {
                    void markRead(item.id);
                    handleNotificationNavigation(item.data);
                  }}
                />
              ))}
            </View>
            <Spacer size="lg" />
          </View>
        ))
      )}

      <View style={styles.bottomSpace} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {},
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  group: {},
  list: {
    gap: spacing.md,
  },
  bottomSpace: {
    height: spacing.xl,
  },
});
