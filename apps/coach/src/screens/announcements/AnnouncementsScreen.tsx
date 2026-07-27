import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';

import {
  Button,
  Card,
  Screen,
  Spacer,
  Text,
  spacing,
} from '@openmat/shared';

import {
  EmptyState,
  FadeInItem,
  StatusPill,
} from '../../components/ui/Motion';
import { useCoachData } from '../../lib/providers/CoachDataProvider';
import type { MoreStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MoreStackParamList, 'Announcements'>;

export function AnnouncementsScreen({ navigation }: Props) {
  const { announcements } = useCoachData();

  return (
    <Screen scroll>
      <View style={styles.top}>
        <View style={styles.copy}>
          <Text variant="title">Announcements</Text>
          <Text variant="caption" muted>
            Community feed + future push delivery
          </Text>
        </View>
        <Button
          label="New"
          fullWidth={false}
          onPress={() => navigation.navigate('AnnouncementForm', undefined)}
          style={styles.newButton}
        />
      </View>

      <Spacer size="lg" />

      {announcements.length === 0 ? (
        <EmptyState
          title="No announcements"
          subtitle="Create one to publish to the community feed."
        />
      ) : (
        <View style={styles.list}>
          {announcements.map((item, index) => (
            <FadeInItem key={item.id} index={index}>
              <Card
                onPress={() =>
                  navigation.navigate('AnnouncementForm', {
                    announcementId: item.id,
                  })
                }
              >
                <View style={styles.row}>
                  <Text variant="subtitle" style={styles.title}>
                    {item.title}
                  </Text>
                  <StatusPill
                    label={item.status}
                    color={
                      item.status === 'published' ? '#22C55E' : '#5EEAD4'
                    }
                  />
                </View>
                <Spacer size="xs" />
                <Text variant="body" muted numberOfLines={3}>
                  {item.body}
                </Text>
                <Spacer size="xs" />
                <Text variant="caption" muted>
                  {item.category} · {item.audience} · {item.authorName}
                </Text>
              </Card>
            </FadeInItem>
          ))}
        </View>
      )}
      <Spacer size="xl" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  newButton: {
    minWidth: 84,
  },
  list: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    flex: 1,
  },
});
