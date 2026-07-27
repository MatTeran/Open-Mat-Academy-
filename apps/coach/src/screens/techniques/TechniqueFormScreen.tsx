import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';

import {
  Banner,
  Button,
  Input,
  Screen,
  Spacer,
  Text,
  type CreateTechniqueInput,
  type TechniqueDifficulty,
  type TechniquePosition,
} from '@openmat/shared';

import {
  ChipRow,
  ToggleChip,
} from '../../components/ui/Phase2Controls';
import { usePhase2Data } from '../../lib/providers/Phase2DataProvider';
import type { MoreStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MoreStackParamList, 'TechniqueForm'>;

const DIFFICULTIES: TechniqueDifficulty[] = [
  'beginner',
  'intermediate',
  'advanced',
  'competition',
];

const POSITIONS: TechniquePosition[] = [
  'guard',
  'mount',
  'side_control',
  'back',
  'standing',
  'turtle',
  'knee_on_belly',
  'other',
];

function splitComma(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitLines(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function TechniqueFormScreen({ navigation, route }: Props) {
  const { techniques, createTechnique, updateTechnique } = usePhase2Data();
  const existing = techniques.find(
    (item) => item.id === route.params?.techniqueId,
  );

  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [difficulty, setDifficulty] = useState<TechniqueDifficulty>(
    existing?.difficulty ?? 'beginner',
  );
  const [position, setPosition] = useState<TechniquePosition>(
    existing?.position ?? 'guard',
  );
  const [tags, setTags] = useState(existing?.tags.join(', ') ?? '');
  const [commonMistakes, setCommonMistakes] = useState(
    existing?.commonMistakes.join('\n') ?? '',
  );
  const [videoUri, setVideoUri] = useState(existing?.videoUri ?? '');
  const [isFavorite, setIsFavorite] = useState(existing?.isFavorite ?? false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const payload = useMemo<CreateTechniqueInput>(
    () => ({
      title,
      description,
      difficulty,
      position,
      tags: splitComma(tags),
      commonMistakes: splitLines(commonMistakes),
      videoUri: videoUri.trim() || null,
      imageUris: existing?.imageUris ?? [],
      isFavorite,
    }),
    [
      commonMistakes,
      description,
      difficulty,
      existing?.imageUris,
      isFavorite,
      position,
      tags,
      title,
      videoUri,
    ],
  );

  const onSave = async () => {
    setError(null);
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }
    setLoading(true);
    try {
      if (existing) {
        await updateTechnique(existing.id, payload);
      } else {
        await createTechnique(payload);
      }
      navigation.goBack();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to save technique.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll keyboard>
      <Text variant="title">
        {existing ? 'Edit Technique' : 'New Technique'}
      </Text>
      <Spacer size="xs" />
      <Text variant="body" muted>
        Add concise coaching notes, tags, common mistakes, and optional video.
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
      <Input
        label="Tags (comma separated)"
        value={tags}
        onChangeText={setTags}
        autoCapitalize="none"
      />
      <Spacer size="md" />
      <Input
        label="Common mistakes (one per line)"
        value={commonMistakes}
        onChangeText={setCommonMistakes}
        multiline
        style={{ minHeight: 120, textAlignVertical: 'top' }}
      />
      <Spacer size="md" />
      <Input
        label="Video URI placeholder"
        placeholder="https://example.com/video.mp4"
        value={videoUri}
        onChangeText={setVideoUri}
        autoCapitalize="none"
      />

      <Spacer size="lg" />
      <Text variant="label">Difficulty</Text>
      <Spacer size="xs" />
      <ChipRow
        options={DIFFICULTIES}
        value={difficulty}
        onChange={setDifficulty}
      />

      <Spacer size="md" />
      <Text variant="label">Position</Text>
      <Spacer size="xs" />
      <ChipRow options={POSITIONS} value={position} onChange={setPosition} />

      <Spacer size="md" />
      <ToggleChip
        label="Favorite"
        active={isFavorite}
        onPress={() => setIsFavorite((current) => !current)}
      />

      <Spacer size="xl" />
      <Button
        label={existing ? 'Save Technique' : 'Create Technique'}
        loading={loading}
        onPress={onSave}
      />
      <Spacer size="xl" />
    </Screen>
  );
}
