import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { useTechniques } from '../../lib/providers/TechniqueProvider';
import { useWorkouts } from '../../lib/providers/WorkoutProvider';
import { fontFamilies, radii, spacing } from '../../lib/theme';
import type { MemberTechnique, TechniqueId } from '../../types/technique';
import {
  recentTechniques,
  searchTechniques,
  suggestedTechniques,
} from '../../utils/techniqueSearch';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';
import { AddTechniqueSheet } from './AddTechniqueSheet';

interface TechniquesUsedFieldProps {
  values: TechniqueId[];
  onChange: (values: TechniqueId[]) => void;
}

function Chip({
  label,
  active,
  onPress,
  tone = 'default',
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
  tone?: 'default' | 'accent' | 'add';
}) {
  const { colors } = useAppTheme();
  const backgroundColor =
    tone === 'add'
      ? colors.goldMuted
      : active
        ? colors.goldMuted
        : colors.elevatedSurface;
  const borderColor =
    tone === 'add' || active ? colors.goldAccent : colors.border;
  const textColor =
    tone === 'add' || active ? colors.goldAccent : colors.secondaryText;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.chip, { backgroundColor, borderColor }]}
    >
      <Text variant="caption" style={{ color: textColor }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function TechniquesUsedField({
  values,
  onChange,
}: TechniquesUsedFieldProps) {
  const { colors } = useAppTheme();
  const { workouts } = useWorkouts();
  const { activeTechniques, getLabel } = useTechniques();
  const [query, setQuery] = useState('');
  const [selectedExpanded, setSelectedExpanded] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draftName, setDraftName] = useState('');

  const recent = useMemo(
    () => recentTechniques(activeTechniques, workouts, 6),
    [activeTechniques, workouts],
  );
  const suggested = useMemo(
    () => suggestedTechniques(activeTechniques, workouts, 5),
    [activeTechniques, workouts],
  );
  const results = useMemo(
    () =>
      searchTechniques({
        query,
        catalog: activeTechniques,
        workouts,
        limit: 24,
      }),
    [activeTechniques, query, workouts],
  );

  const toggle = (id: TechniqueId) => {
    if (values.includes(id)) {
      onChange(values.filter((item) => item !== id));
      return;
    }
    onChange([...values, id]);
  };

  const openAdd = (name = '') => {
    setDraftName(name);
    setSheetOpen(true);
  };

  const onSaved = (technique: MemberTechnique) => {
    if (!values.includes(technique.id)) {
      onChange([...values, technique.id]);
    }
    setQuery('');
  };

  const selectedVisible =
    selectedExpanded || values.length <= 6
      ? values
      : values.slice(0, 6);

  return (
    <View>
      <Text variant="label">Techniques Used</Text>
      <Spacer size="xs" />
      <Text variant="caption" muted>
        Optional · Suggest, don’t restrict
      </Text>

      {recent.length > 0 ? (
        <>
          <Spacer size="sm" />
          <Text variant="caption" muted>
            Recent
          </Text>
          <Spacer size="xs" />
          <View style={styles.wrap}>
            {recent.map((technique) => (
              <Chip
                key={technique.id}
                label={technique.name}
                active={values.includes(technique.id)}
                onPress={() => toggle(technique.id)}
              />
            ))}
          </View>
        </>
      ) : null}

      {suggested.length > 0 && !query.trim() ? (
        <>
          <Spacer size="sm" />
          <Text variant="caption" muted>
            Suggested
          </Text>
          <Spacer size="xs" />
          <View style={styles.wrap}>
            {suggested.map((technique) => (
              <Chip
                key={technique.id}
                label={technique.name}
                active={values.includes(technique.id)}
                onPress={() => toggle(technique.id)}
              />
            ))}
          </View>
        </>
      ) : null}

      <Spacer size="sm" />
      <Chip
        label="+ Add Technique"
        tone="add"
        onPress={() => openAdd(query.trim())}
      />

      <Spacer size="sm" />
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search techniques..."
        placeholderTextColor={colors.secondaryText}
        style={[
          styles.search,
          {
            backgroundColor: colors.secondaryBackground,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
      />

      {query.trim() ? (
        <>
          <Spacer size="sm" />
          {results.length === 0 ? (
            <View
              style={[
                styles.empty,
                {
                  backgroundColor: colors.goldMuted,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text variant="bodyMuted">No technique found.</Text>
              <Spacer size="sm" />
              <Chip
                label={`+ Add “${query.trim()}”`}
                tone="add"
                onPress={() => openAdd(query.trim())}
              />
            </View>
          ) : (
            <View style={styles.wrap}>
              {results.map((technique) => (
                <Chip
                  key={technique.id}
                  label={technique.name}
                  active={values.includes(technique.id)}
                  onPress={() => toggle(technique.id)}
                />
              ))}
            </View>
          )}
        </>
      ) : null}

      {values.length > 0 ? (
        <>
          <Spacer size="md" />
          <Text variant="caption" muted>
            Selected
          </Text>
          <Spacer size="xs" />
          <View style={styles.wrap}>
            {selectedVisible.map((id) => (
              <Chip
                key={id}
                label={`✓ ${getLabel(id)}`}
                active
                onPress={() => toggle(id)}
              />
            ))}
          </View>
          {values.length > 6 ? (
            <>
              <Spacer size="xs" />
              <Pressable
                onPress={() => setSelectedExpanded((current) => !current)}
              >
                <Text variant="caption" style={{ color: colors.goldAccent }}>
                  {selectedExpanded
                    ? 'Collapse selected'
                    : `Show all ${values.length} selected`}
                </Text>
              </Pressable>
            </>
          ) : null}
        </>
      ) : null}

      <AddTechniqueSheet
        visible={sheetOpen}
        initialName={draftName}
        onClose={() => setSheetOpen(false)}
        onSaved={onSaved}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
  },
  search: {
    minHeight: 48,
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    fontFamily: fontFamilies.regular,
    fontSize: 16,
  },
  empty: {
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.md,
  },
});
