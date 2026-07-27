import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';

import {
  Banner,
  Button,
  Input,
  Screen,
  Spacer,
  Text,
  type CreateNotificationDraftInput,
  type NotificationDraft,
  type NotificationKind,
} from '@openmat/shared';

import { ChipRow } from '../../components/ui/Phase2Controls';
import { usePhase2Data } from '../../lib/providers/Phase2DataProvider';
import type { MoreStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MoreStackParamList, 'NotificationForm'>;
type Audience = NotificationDraft['audience'];

const KINDS: NotificationKind[] = [
  'announcement',
  'challenge_reminder',
  'event_reminder',
  'technique_of_the_week',
  'competition_reminder',
];

const AUDIENCES: Audience[] = [
  'all',
  'adults',
  'kids',
  'competitors',
  'coaches',
];

export function NotificationFormScreen({ navigation }: Props) {
  const { createNotification } = usePhase2Data();
  const [kind, setKind] = useState<NotificationKind>('announcement');
  const [audience, setAudience] = useState<Audience>('all');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [relatedEntityId, setRelatedEntityId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loadingMode, setLoadingMode] = useState<'draft' | 'simulate' | null>(
    null,
  );

  const payload = useMemo<CreateNotificationDraftInput>(
    () => ({
      kind,
      title,
      body,
      audience,
      scheduledAt: scheduledAt.trim() || null,
      relatedEntityId: relatedEntityId.trim() || null,
    }),
    [audience, body, kind, relatedEntityId, scheduledAt, title],
  );

  const onSave = async (simulateSend: boolean) => {
    setError(null);
    if (!title.trim() || !body.trim()) {
      setError('Title and body are required.');
      return;
    }
    setLoadingMode(simulateSend ? 'simulate' : 'draft');
    try {
      await createNotification({
        ...payload,
        simulateSend,
      });
      navigation.goBack();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to save notification.',
      );
    } finally {
      setLoadingMode(null);
    }
  };

  return (
    <Screen scroll keyboard>
      <Text variant="title">New Notification</Text>
      <Spacer size="xs" />
      <Text variant="body" muted>
        Save a draft, schedule by ISO time, or simulate a send for QA.
      </Text>
      <Spacer size="lg" />

      <Banner
        tone="info"
        message="Delivery backend is a future phase. Simulated sends do not notify members."
      />
      <Spacer size="md" />
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
        style={{ minHeight: 130, textAlignVertical: 'top' }}
      />
      <Spacer size="md" />
      <Input
        label="Schedule ISO (optional)"
        value={scheduledAt}
        onChangeText={setScheduledAt}
        autoCapitalize="none"
        placeholder="2026-07-28T18:00:00.000Z"
      />
      <Spacer size="md" />
      <Input
        label="Related entity ID (optional)"
        value={relatedEntityId}
        onChangeText={setRelatedEntityId}
        autoCapitalize="none"
      />

      <Spacer size="lg" />
      <Text variant="label">Kind</Text>
      <Spacer size="xs" />
      <ChipRow options={KINDS} value={kind} onChange={setKind} />

      <Spacer size="md" />
      <Text variant="label">Audience</Text>
      <Spacer size="xs" />
      <ChipRow options={AUDIENCES} value={audience} onChange={setAudience} />

      <Spacer size="xl" />
      <Button
        label="Save Draft"
        loading={loadingMode === 'draft'}
        onPress={() => onSave(false)}
      />
      <Spacer size="sm" />
      <Button
        label="Simulate Send"
        variant="secondary"
        loading={loadingMode === 'simulate'}
        onPress={() => onSave(true)}
      />
      <Spacer size="xl" />
    </Screen>
  );
}
