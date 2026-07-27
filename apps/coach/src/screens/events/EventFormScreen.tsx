import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';

import {
  Banner,
  Button,
  Input,
  Screen,
  Spacer,
  Text,
  type CreateEventInput,
  type EventType,
} from '@openmat/shared';

import {
  ChipRow,
  ToggleChip,
} from '../../components/ui/Phase2Controls';
import { usePhase2Data } from '../../lib/providers/Phase2DataProvider';
import type { MoreStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MoreStackParamList, 'EventForm'>;

const TYPES: EventType[] = [
  'seminar',
  'competition',
  'holiday_closure',
  'promotion',
  'academy_bbq',
  'open_mat',
  'other',
];

export function EventFormScreen({ navigation, route }: Props) {
  const { events, createEvent, updateEvent } = usePhase2Data();
  const existing = events.find((item) => item.id === route.params?.eventId);

  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [type, setType] = useState<EventType>(existing?.type ?? 'seminar');
  const [location, setLocation] = useState(existing?.location ?? '');
  const [startAt, setStartAt] = useState(
    existing?.startAt ?? new Date().toISOString(),
  );
  const [endAt, setEndAt] = useState(existing?.endAt ?? '');
  const [capacity, setCapacity] = useState(
    existing?.capacity === null || existing?.capacity === undefined
      ? ''
      : String(existing.capacity),
  );
  const [allowRsvp, setAllowRsvp] = useState(existing?.allowRsvp ?? true);
  const [publish, setPublish] = useState(existing?.status === 'published');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const payload = useMemo<CreateEventInput>(
    () => ({
      title,
      description,
      type,
      location,
      startAt,
      endAt,
      capacity: capacity.trim() ? Number(capacity) || 0 : null,
      allowRsvp,
      status: publish ? 'published' : 'draft',
    }),
    [
      allowRsvp,
      capacity,
      description,
      endAt,
      location,
      publish,
      startAt,
      title,
      type,
    ],
  );

  const onSave = async () => {
    setError(null);
    if (!title.trim() || !description.trim() || !location.trim()) {
      setError('Title, description, and location are required.');
      return;
    }
    if (!startAt.trim() || !endAt.trim()) {
      setError('Start and end ISO timestamps are required.');
      return;
    }
    if (capacity.trim() && Number(capacity) < 0) {
      setError('Capacity cannot be negative.');
      return;
    }
    setLoading(true);
    try {
      if (existing) {
        await updateEvent(existing.id, payload);
      } else {
        await createEvent(payload);
      }
      navigation.goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll keyboard>
      <Text variant="title">{existing ? 'Edit Event' : 'New Event'}</Text>
      <Spacer size="xs" />
      <Text variant="body" muted>
        Publish events when details are ready; drafts stay internal.
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
        label="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{ minHeight: 110, textAlignVertical: 'top' }}
      />
      <Spacer size="md" />
      <Input label="Location" value={location} onChangeText={setLocation} />
      <Spacer size="md" />
      <Input
        label="Start ISO"
        value={startAt}
        onChangeText={setStartAt}
        autoCapitalize="none"
      />
      <Spacer size="md" />
      <Input
        label="End ISO"
        value={endAt}
        onChangeText={setEndAt}
        autoCapitalize="none"
      />
      <Spacer size="md" />
      <Input
        label="Capacity"
        value={capacity}
        onChangeText={setCapacity}
        keyboardType="number-pad"
        placeholder="Optional"
      />

      <Spacer size="lg" />
      <Text variant="label">Type</Text>
      <Spacer size="xs" />
      <ChipRow options={TYPES} value={type} onChange={setType} />

      <Spacer size="md" />
      <ToggleChip
        label="Allow RSVP"
        active={allowRsvp}
        onPress={() => setAllowRsvp((current) => !current)}
      />
      <Spacer size="md" />
      <ToggleChip
        label="Publish"
        active={publish}
        onPress={() => setPublish((current) => !current)}
      />

      <Spacer size="xl" />
      <Button
        label={existing ? 'Save Event' : 'Create Event'}
        loading={loading}
        onPress={onSave}
      />
      <Spacer size="xl" />
    </Screen>
  );
}
