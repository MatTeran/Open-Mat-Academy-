import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  Button,
  Card,
  IconBadge,
  Input,
  Screen,
  Spacer,
  Text,
  spacing,
  useAppTheme,
  type IconName,
  type Technique,
  type TechniqueDifficulty,
  type TechniquePosition,
} from '@openmat/shared';

import {
  EmptyState,
  FadeInItem,
  SectionHeader,
  StatusPill,
} from '../../components/ui/Motion';
import {
  FilterChipRow,
  ToggleChip,
  formatLabel,
} from '../../components/ui/Phase2Controls';
import { usePhase2Data } from '../../lib/providers/Phase2DataProvider';
import type { MoreStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MoreStackParamList, 'Techniques'>;

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

const DIFFICULTY_TINT: Record<TechniqueDifficulty, string> = {
  beginner: '#22C55E',
  intermediate: '#38BDF8',
  advanced: '#F59E0B',
  competition: '#FB7185',
};

export function TechniquesScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const { techniques, toggleTechniqueFavorite } = usePhase2Data();
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<TechniqueDifficulty | null>(
    null,
  );
  const [position, setPosition] = useState<TechniquePosition | null>(null);
  const [favoriteOnly, setFavoriteOnly] = useState(false);

  const filtered = useMemo(
    () =>
      techniques.filter((item) => {
        const query = search.trim().toLowerCase();
        const matchesSearch =
          query.length === 0 ||
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query));
        const matchesDifficulty = !difficulty || item.difficulty === difficulty;
        const matchesPosition = !position || item.position === position;
        const matchesFavorite = !favoriteOnly || item.isFavorite;
        return (
          matchesSearch &&
          matchesDifficulty &&
          matchesPosition &&
          matchesFavorite
        );
      }),
    [difficulty, favoriteOnly, position, search, techniques],
  );

  return (
    <Screen scroll>
      <Text variant="hero">Technique Library</Text>
      <Text variant="body" muted>
        Search coach-approved references and keep favorites close.
      </Text>
      <Spacer size="lg" />

      <Button
        label="Add Technique"
        onPress={() => navigation.navigate('TechniqueForm', undefined)}
      />
      <Spacer size="lg" />

      <Input
        label="Search"
        placeholder="Title, tag, or description"
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
      />

      <Spacer size="lg" />
      <SectionHeader title="Filters" subtitle="Difficulty, position, favorites" />
      <Text variant="label">Difficulty</Text>
      <Spacer size="xs" />
      <FilterChipRow
        options={DIFFICULTIES}
        value={difficulty}
        onChange={setDifficulty}
      />
      <Spacer size="md" />
      <Text variant="label">Position</Text>
      <Spacer size="xs" />
      <FilterChipRow
        options={POSITIONS}
        value={position}
        onChange={setPosition}
      />
      <Spacer size="md" />
      <ToggleChip
        label="Favorites only"
        active={favoriteOnly}
        onPress={() => setFavoriteOnly((current) => !current)}
      />

      <Spacer size="xl" />
      <SectionHeader
        title="Techniques"
        subtitle={`${filtered.length} of ${techniques.length} shown`}
      />
      <View style={styles.stack}>
        {filtered.length === 0 ? (
          <EmptyState
            title="No techniques found"
            subtitle="Try clearing a filter or create a new technique."
          />
        ) : (
          filtered.map((technique, index) => (
            <FadeInItem key={technique.id} index={index}>
              <TechniqueCard
                technique={technique}
                onEdit={() =>
                  navigation.navigate('TechniqueForm', {
                    techniqueId: technique.id,
                  })
                }
                onToggleFavorite={() => {
                  void toggleTechniqueFavorite(technique.id);
                }}
              />
            </FadeInItem>
          ))
        )}
      </View>
      <Spacer size="xl" />
    </Screen>
  );
}

function TechniqueCard({
  technique,
  onEdit,
  onToggleFavorite,
}: {
  technique: Technique;
  onEdit: () => void;
  onToggleFavorite: () => void;
}) {
  const { colors } = useAppTheme();
  const tint = DIFFICULTY_TINT[technique.difficulty];

  return (
    <Card elevated>
      <View style={styles.row}>
        <IconBadge name={'book-outline' as IconName} tint={tint} />
        <View style={styles.copy}>
          <View style={styles.titleRow}>
            <Text variant="subtitle" style={styles.flex}>
              {technique.title}
            </Text>
            <Pressable onPress={onToggleFavorite} hitSlop={8}>
              <Text
                variant="caption"
                style={{
                  color: technique.isFavorite
                    ? colors.goldAccent
                    : colors.secondaryText,
                }}
              >
                {technique.isFavorite ? 'Favorite' : 'Add favorite'}
              </Text>
            </Pressable>
          </View>
          <Text variant="caption" muted>
            {technique.description}
          </Text>
        </View>
      </View>
      <Spacer size="md" />
      <View style={styles.metaRow}>
        <StatusPill label={formatLabel(technique.difficulty)} color={tint} />
        <StatusPill
          label={formatLabel(technique.position)}
          color={colors.goldAccent}
        />
      </View>
      <Spacer size="sm" />
      <Text variant="caption" muted>
        {technique.tags.map((tag) => `#${tag}`).join('  ')}
      </Text>
      <Spacer size="md" />
      <Button label="Edit Technique" variant="outlineGold" onPress={onEdit} />
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
    gap: spacing.xs,
  },
});
