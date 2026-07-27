import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';

import {
  Banner,
  Button,
  Input,
  Screen,
  Spacer,
  Text,
  type CreateMediaItemInput,
  type MediaKind,
} from '@openmat/shared';

import { ChipRow } from '../../components/ui/Phase2Controls';
import { usePhase2Data } from '../../lib/providers/Phase2DataProvider';
import type { MoreStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MoreStackParamList, 'MediaUpload'>;

const KINDS: MediaKind[] = ['photo', 'video'];

function splitComma(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function MediaUploadScreen({ navigation }: Props) {
  const { albums, createMediaItem } = usePhase2Data();
  const [kind, setKind] = useState<MediaKind>('photo');
  const [title, setTitle] = useState('');
  const [uri, setUri] = useState('');
  const [albumId, setAlbumId] = useState('');
  const [tags, setTags] = useState('');
  const [classId, setClassId] = useState('');
  const [eventId, setEventId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const payload = useMemo<CreateMediaItemInput>(
    () => ({
      kind,
      title,
      uri,
      albumId: albumId.trim() || null,
      tags: splitComma(tags),
      classId: classId.trim() || null,
      eventId: eventId.trim() || null,
      memberShareEnabled: false,
    }),
    [albumId, classId, eventId, kind, tags, title, uri],
  );

  const onSave = async () => {
    setError(null);
    if (!title.trim() || !uri.trim()) {
      setError('Title and URI are required.');
      return;
    }
    setLoading(true);
    try {
      await createMediaItem(payload);
      navigation.goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to upload media.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll keyboard>
      <Text variant="title">Upload Media</Text>
      <Spacer size="xs" />
      <Text variant="body" muted>
        Add a photo or video placeholder URI and optional academy tags.
      </Text>
      <Spacer size="lg" />

      <Banner
        tone="info"
        message="Member sharing is prepared for a future phase and stays off here."
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
        label="URI placeholder"
        value={uri}
        onChangeText={setUri}
        autoCapitalize="none"
        placeholder="https://example.com/media/photo.jpg"
      />
      <Spacer size="md" />
      <Input
        label="Album ID (optional)"
        value={albumId}
        onChangeText={setAlbumId}
        autoCapitalize="none"
        placeholder={albums[0]?.id ?? 'alb-1'}
      />
      <Spacer size="md" />
      <Input
        label="Tags (comma separated)"
        value={tags}
        onChangeText={setTags}
        autoCapitalize="none"
        placeholder="competition, team"
      />
      <Spacer size="md" />
      <Input
        label="Class tag ID (optional)"
        value={classId}
        onChangeText={setClassId}
        autoCapitalize="none"
      />
      <Spacer size="md" />
      <Input
        label="Event tag ID (optional)"
        value={eventId}
        onChangeText={setEventId}
        autoCapitalize="none"
      />

      <Spacer size="lg" />
      <Text variant="label">Kind</Text>
      <Spacer size="xs" />
      <ChipRow options={KINDS} value={kind} onChange={setKind} />

      <Spacer size="xl" />
      <Button label="Save Upload" loading={loading} onPress={onSave} />
      <Spacer size="xl" />
    </Screen>
  );
}
