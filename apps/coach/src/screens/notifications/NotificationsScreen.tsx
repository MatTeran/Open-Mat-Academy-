import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';

import {
  Button,
  Card,
  IconBadge,
  Screen,
  Spacer,
  Text,
  spacing,
  type IconName,
  type NotificationDraft,
  type NotificationDraftStatus,
} from '@openmat/shared';

import {
  EmptyState,
  FadeInItem,
  SectionHeader,
  StatusPill,
} from '../../components/ui/Motion';
import { formatLabel } from '../../components/ui/Phase2Controls';
import { usePhase2Data } from '../../lib/providers/Phase2DataProvider';
import type { MoreStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MoreStackParamList, 'Notifications'>;

const STATUS_TINT: Record<NotificationDraftStatus, string> = {
  draft: '#B8B8B8',
  scheduled: '#38BDF8',
  sent_simulated: '#22C55E',
};

export function NotificationsScreen({ navigation }: Props) {
  const { notifications } = usePhase2Data();
  const scheduledCount = notifications.filter(
    (item) => item.status === 'scheduled',
  ).length;

  return (
    <Screen scroll>
      <Text variant="hero">Notifications</Text>
      <Text variant="body" muted>
        Prepare announcements, reminders, weekly techniques, and competition
        nudges.
      </Text>
      <Spacer size="lg" />
      <Button
        label="Create Notification"
        onPress={() => navigation.navigate('NotificationForm')}
      />

      <Spacer size="xl" />
      <SectionHeader
        title="Drafts & Simulations"
        subtitle={`${scheduledCount} scheduled / ${notifications.length} total`}
      />
      <View style={styles.stack}>
        {notifications.length === 0 ? (
          <EmptyState
            title="No notifications yet"
            subtitle="Create a draft or simulate a send to test messaging."
          />
        ) : (
          notifications.map((notification, index) => (
            <FadeInItem key={notification.id} index={index}>
              <NotificationCard notification={notification} />
            </FadeInItem>
          ))
        )}
      </View>
      <Spacer size="xl" />
    </Screen>
  );
}

function NotificationCard({
  notification,
}: {
  notification: NotificationDraft;
}) {
  const tint = STATUS_TINT[notification.status];

  return (
    <Card elevated>
      <View style={styles.row}>
        <IconBadge name={'notifications-outline' as IconName} tint={tint} />
        <View style={styles.copy}>
          <View style={styles.titleRow}>
            <Text variant="subtitle" style={styles.flex}>
              {notification.title}
            </Text>
            <StatusPill
              label={formatLabel(notification.status)}
              color={tint}
            />
          </View>
          <Text variant="caption" muted>
            {notification.body}
          </Text>
        </View>
      </View>
      <Spacer size="md" />
      <View style={styles.metaRow}>
        <Text variant="caption" gold>
          {formatLabel(notification.kind)}
        </Text>
        <Text variant="caption" muted>
          Audience: {notification.audience}
        </Text>
        {notification.scheduledAt ? (
          <Text variant="caption" muted>
            {notification.scheduledAt}
          </Text>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  flex: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
