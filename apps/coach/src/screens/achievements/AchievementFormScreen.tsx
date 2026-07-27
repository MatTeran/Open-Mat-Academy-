import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';

import {
  Banner,
  Button,
  Input,
  Screen,
  Spacer,
  Text,
  type AchievementCategory,
  type AchievementRarity,
  type CreateAchievementInput,
} from '@openmat/shared';

import {
  ChipRow,
  ToggleChip,
} from '../../components/ui/Phase2Controls';
import { usePhase2Data } from '../../lib/providers/Phase2DataProvider';
import type { MoreStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MoreStackParamList, 'AchievementForm'>;

const CATEGORIES: AchievementCategory[] = [
  'attendance',
  'competition',
  'academy',
  'special',
];

const RARITIES: AchievementRarity[] = [
  'common',
  'rare',
  'elite',
  'legendary',
];

export function AchievementFormScreen({ navigation, route }: Props) {
  const { achievements, createAchievement, updateAchievement } =
    usePhase2Data();
  const existing = achievements.find(
    (item) => item.id === route.params?.achievementId,
  );

  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [category, setCategory] = useState<AchievementCategory>(
    existing?.category ?? 'attendance',
  );
  const [rarity, setRarity] = useState<AchievementRarity>(
    existing?.rarity ?? 'common',
  );
  const [icon, setIcon] = useState(existing?.icon ?? 'ribbon');
  const [tint, setTint] = useState(existing?.tint ?? '#FFFFFF');
  const [xpReward, setXpReward] = useState(
    String(existing?.xpReward ?? 100),
  );
  const [requirementLabel, setRequirementLabel] = useState(
    existing?.requirementLabel ?? '',
  );
  const [isActive, setIsActive] = useState(existing?.isActive ?? true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const payload = useMemo<CreateAchievementInput>(
    () => ({
      title,
      description,
      category,
      rarity,
      icon: icon.trim() || 'ribbon',
      tint: tint.trim() || '#FFFFFF',
      xpReward: Number(xpReward) || 0,
      requirementLabel,
      isActive,
    }),
    [
      category,
      description,
      icon,
      isActive,
      rarity,
      requirementLabel,
      tint,
      title,
      xpReward,
    ],
  );

  const onSave = async () => {
    setError(null);
    if (!title.trim() || !description.trim() || !requirementLabel.trim()) {
      setError('Title, description, and requirement are required.');
      return;
    }
    if (Number(xpReward) <= 0) {
      setError('XP reward must be greater than zero.');
      return;
    }
    setLoading(true);
    try {
      if (existing) {
        await updateAchievement(existing.id, payload);
      } else {
        await createAchievement(payload);
      }
      navigation.goBack();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to save achievement.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll keyboard>
      <Text variant="title">
        {existing ? 'Edit Achievement' : 'New Achievement'}
      </Text>
      <Spacer size="xs" />
      <Text variant="body" muted>
        Create a badge with rarity, icon, tint, XP, and requirement copy.
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
        label="Requirement label"
        value={requirementLabel}
        onChangeText={setRequirementLabel}
        placeholder="4 classes / week"
      />
      <Spacer size="md" />
      <Input
        label="Icon name"
        value={icon}
        onChangeText={setIcon}
        autoCapitalize="none"
        placeholder="ribbon"
      />
      <Spacer size="md" />
      <Input
        label="Tint"
        value={tint}
        onChangeText={setTint}
        autoCapitalize="none"
        placeholder="#FFFFFF"
      />
      <Spacer size="md" />
      <Input
        label="XP reward"
        value={xpReward}
        onChangeText={setXpReward}
        keyboardType="number-pad"
      />

      <Spacer size="lg" />
      <Text variant="label">Category</Text>
      <Spacer size="xs" />
      <ChipRow options={CATEGORIES} value={category} onChange={setCategory} />

      <Spacer size="md" />
      <Text variant="label">Rarity</Text>
      <Spacer size="xs" />
      <ChipRow options={RARITIES} value={rarity} onChange={setRarity} />

      <Spacer size="md" />
      <ToggleChip
        label="Active"
        active={isActive}
        onPress={() => setIsActive((current) => !current)}
      />

      <Spacer size="xl" />
      <Button
        label={existing ? 'Save Achievement' : 'Create Achievement'}
        loading={loading}
        onPress={onSave}
      />
      <Spacer size="xl" />
    </Screen>
  );
}
