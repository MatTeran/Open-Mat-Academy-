import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  Banner,
  Button,
  Input,
  Screen,
  Spacer,
  Text,
  radii,
  spacing,
  useAppTheme,
  type AnnouncementAudience,
  type AnnouncementCategory,
} from '@openmat/shared';

import { useCoachData } from '../../lib/providers/CoachDataProvider';
import type { DashboardStackParamList } from '../../navigation/types';
import type { MoreStackParamList } from '../../navigation/types';

type Props =
  | NativeStackScreenProps<MoreStackParamList, 'AnnouncementForm'>
  | NativeStackScreenProps<DashboardStackParamList, 'AnnouncementForm'>;

const CATEGORIES: AnnouncementCategory[] = [
  'general',
  'schedule',
  'competition',
  'promotion',
  'facility',
  'urgent',
];

const AUDIENCES: AnnouncementAudience[] = [
  'all',
  'adults',
  'kids',
  'competitors',
  'coaches',
];

export function AnnouncementFormScreen({ navigation, route }: Props) {
  const { colors } = useAppTheme();
  const { announcements, createAnnouncement, updateAnnouncement, publishAnnouncement } =
    useCoachData();

  const existing = announcements.find(
    (item) => item.id === route.params?.announcementId,
  );

  const [title, setTitle] = useState(existing?.title ?? '');
  const [body, setBody] = useState(existing?.body ?? '');
  const [category, setCategory] = useState<AnnouncementCategory>(
    existing?.category ?? 'general',
  );
  const [audience, setAudience] = useState<AnnouncementAudience>(
    existing?.audience ?? 'all',
  );
  const [scheduledAt, setScheduledAt] = useState(existing?.scheduledAt ?? '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSave = useMemo(
    () => title.trim().length > 0 && body.trim().length > 0,
    [body, title],
  );

  const onSave = async (publish: boolean) => {
    setError(null);
    if (!canSave) {
      setError('Title and body are required.');
      return;
    }
    setLoading(true);
    try {
      if (existing) {
        await updateAnnouncement(existing.id, {
          title,
          body,
          category,
          audience,
          scheduledAt: scheduledAt || null,
          publish,
        });
        if (publish) {
          await publishAnnouncement(existing.id);
        }
      } else {
        await createAnnouncement({
          title,
          body,
          category,
          audience,
          scheduledAt: scheduledAt || null,
          publish,
          pushEnabled: false,
        });
      }
      navigation.goBack();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to save announcement.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll keyboard>
      <Text variant="title">
        {existing ? 'Edit Announcement' : 'New Announcement'}
      </Text>
      <Spacer size="xs" />
      <Text variant="body" muted>
        Publishes to the community feed. Push notifications are prepared for a
        later phase.
      </Text>
      <Spacer size="lg" />

      {error ? (
        <>
          <Banner message={error} />
          <Spacer size="md" />
        </>
      ) : null}

      <Input label="Title" value={title} onChangeText={setTitle} />
      <Spacer size="md" />
      <Input
        label="Body"
        value={body}
        onChangeText={setBody}
        multiline
        style={{ minHeight: 120, textAlignVertical: 'top' }}
      />
      <Spacer size="md" />
      <Input
        label="Schedule (ISO optional)"
        placeholder="2026-07-28T18:00:00.000Z"
        value={scheduledAt}
        onChangeText={setScheduledAt}
        autoCapitalize="none"
      />

      <Spacer size="lg" />
      <Text variant="label">Category</Text>
      <Spacer size="xs" />
      <View style={styles.chips}>
        {CATEGORIES.map((item) => {
          const active = item === category;
          return (
            <Pressable
              key={item}
              onPress={() => setCategory(item)}
              style={[
                styles.chip,
                {
                  backgroundColor: active
                    ? colors.goldMuted
                    : colors.cardBackground,
                  borderColor: active ? colors.goldAccent : colors.border,
                },
              ]}
            >
              <Text
                variant="caption"
                style={{
                  color: active ? colors.goldAccent : colors.secondaryText,
                }}
              >
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Spacer size="md" />
      <Text variant="label">Audience</Text>
      <Spacer size="xs" />
      <View style={styles.chips}>
        {AUDIENCES.map((item) => {
          const active = item === audience;
          return (
            <Pressable
              key={item}
              onPress={() => setAudience(item)}
              style={[
                styles.chip,
                {
                  backgroundColor: active
                    ? colors.goldMuted
                    : colors.cardBackground,
                  borderColor: active ? colors.goldAccent : colors.border,
                },
              ]}
            >
              <Text
                variant="caption"
                style={{
                  color: active ? colors.goldAccent : colors.secondaryText,
                }}
              >
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Spacer size="xl" />
      <Button
        label="Publish"
        loading={loading}
        disabled={!canSave}
        onPress={() => onSave(true)}
      />
      <Spacer size="sm" />
      <Button
        label="Save Draft"
        variant="secondary"
        loading={loading}
        disabled={!canSave}
        onPress={() => onSave(false)}
      />
      <Spacer size="xl" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
});
