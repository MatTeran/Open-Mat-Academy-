import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { TextInput, View } from 'react-native';

import {
  Banner,
  Button,
  ChipSelect,
  DropdownField,
  FormSection,
  MoodSelector,
  PartnerInput,
  Screen,
  Spacer,
  StarRating,
  Text,
} from '../../components';
import { useAppTheme } from '../../hooks';
import {
  CLASS_TYPE_OPTIONS,
  getClassTypeLabel,
  INSTRUCTOR_OPTIONS,
  INTENSITY_OPTIONS,
  TECHNIQUE_OPTIONS,
} from '../../lib/data/workoutOptions';
import { createEmptyWorkoutDraft } from '../../lib/mocks/workouts';
import { useWorkouts } from '../../lib/providers/WorkoutProvider';
import { fontFamilies, radii, spacing } from '../../lib/theme';
import { useThemedStyles } from '../../lib/theme/useThemedStyles';
import type { WorkoutStackParamList } from '../../types/navigation';
import type {
  GiType,
  TechniqueId,
  TrainingIntensity,
  WorkoutClassType,
  WorkoutDraft,
  WorkoutMood,
} from '../../types/workout';
import { formatShortDate } from '../../utils';

type Props = NativeStackScreenProps<WorkoutStackParamList, 'WorkoutDetails'>;

export function WorkoutDetailsScreen({ navigation, route }: Props) {
  const { colors } = useAppTheme();
  const { getWorkout, saveWorkout } = useWorkouts();
  const existing = route.params?.workoutId
    ? getWorkout(route.params.workoutId)
    : undefined;

  const initial = useMemo<WorkoutDraft>(
    () => existing ?? createEmptyWorkoutDraft(),
    [existing],
  );

  const [draft, setDraft] = useState<WorkoutDraft>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const styles = useThemedStyles((themeColors) => ({
    content: {},
    row: {
      flexDirection: 'row' as const,
      gap: spacing.md,
    },
    half: {
      flex: 1,
    },
    numberInput: {
      minHeight: 52,
      borderRadius: radii.md,
      paddingHorizontal: spacing.md,
      backgroundColor: themeColors.secondaryBackground,
      borderWidth: 1,
      borderColor: themeColors.border,
      color: themeColors.text,
      fontFamily: fontFamilies.regular,
      fontSize: 16,
    },
    notes: {
      minHeight: 140,
      borderRadius: radii.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      backgroundColor: themeColors.secondaryBackground,
      borderWidth: 1,
      borderColor: themeColors.border,
      color: themeColors.text,
      fontFamily: fontFamilies.regular,
      fontSize: 16,
      lineHeight: 24,
    },
    photoPlaceholder: {
      minHeight: 120,
      borderRadius: radii.lg,
      borderWidth: 1,
      borderColor: themeColors.border,
      borderStyle: 'dashed' as const,
      backgroundColor: themeColors.secondaryBackground,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      padding: spacing.lg,
    },
    center: {
      textAlign: 'center' as const,
    },
    bottomSpace: {
      height: spacing.xl,
    },
  }));

  const isEditing = Boolean(existing);
  const className =
    draft.className || getClassTypeLabel(draft.classType);

  const update = <K extends keyof WorkoutDraft>(
    key: K,
    value: WorkoutDraft[K],
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const handleSave = () => {
    setError(null);

    if (!draft.instructor.trim()) {
      setError('Choose an instructor.');
      return;
    }
    if (draft.durationMinutes <= 0) {
      setError('Enter a valid duration.');
      return;
    }
    if (draft.rounds <= 0) {
      setError('Enter at least one round.');
      return;
    }

    setSaving(true);
    setTimeout(() => {
      const favorite =
        draft.favoriteTechnique &&
        draft.techniques.includes(draft.favoriteTechnique)
          ? draft.favoriteTechnique
          : draft.techniques[0] ?? null;

      saveWorkout(
        {
          ...draft,
          className,
          favoriteTechnique: favorite,
        },
        existing?.id,
      );
      setSaving(false);
      navigation.goBack();
    }, 400);
  };

  return (
    <Screen scroll keyboard contentStyle={styles.content}>
      <Text variant="hero">{isEditing ? 'Edit Workout' : 'New Workout'}</Text>
      <Spacer size="sm" />
      <Text variant="bodyMuted">
        {formatShortDate(draft.date)} · Capture the session while it’s fresh.
      </Text>

      {error ? (
        <>
          <Spacer size="md" />
          <Banner message={error} />
        </>
      ) : null}

      <Spacer size="xl" />

      <FormSection title="Session">
        <DropdownField
          label="Class Type"
          value={draft.classType}
          options={CLASS_TYPE_OPTIONS}
          onChange={(value: WorkoutClassType) => {
            update('classType', value);
            update('className', getClassTypeLabel(value));
          }}
        />
        <Spacer size="lg" />
        <DropdownField
          label="Instructor"
          value={draft.instructor as (typeof INSTRUCTOR_OPTIONS)[number]}
          options={INSTRUCTOR_OPTIONS.map((name) => ({
            value: name,
            label: name,
          }))}
          onChange={(value) => update('instructor', value)}
        />
        <Spacer size="lg" />
        <ChipSelect
          label="Gi or No-Gi"
          multi={false}
          options={[
            { value: 'gi' as GiType, label: 'Gi' },
            { value: 'no_gi' as GiType, label: 'No-Gi' },
          ]}
          values={[draft.giType]}
          onChange={(values) => update('giType', values[0] ?? 'gi')}
        />
      </FormSection>

      <FormSection title="Load">
        <View style={styles.row}>
          <View style={styles.half}>
            <Text variant="label">Duration (min)</Text>
            <Spacer size="sm" />
            <TextInput
              keyboardType="number-pad"
              value={String(draft.durationMinutes)}
              onChangeText={(text) =>
                update('durationMinutes', Number(text.replace(/[^0-9]/g, '')) || 0)
              }
              placeholderTextColor={colors.secondaryText}
              style={styles.numberInput}
            />
          </View>
          <View style={styles.half}>
            <Text variant="label">Rounds</Text>
            <Spacer size="sm" />
            <TextInput
              keyboardType="number-pad"
              value={String(draft.rounds)}
              onChangeText={(text) =>
                update('rounds', Number(text.replace(/[^0-9]/g, '')) || 0)
              }
              placeholderTextColor={colors.secondaryText}
              style={styles.numberInput}
            />
          </View>
        </View>
        <Spacer size="lg" />
        <ChipSelect
          label="Training Intensity"
          multi={false}
          options={INTENSITY_OPTIONS}
          values={[draft.intensity]}
          onChange={(values) =>
            update('intensity', (values[0] ?? 'moderate') as TrainingIntensity)
          }
        />
      </FormSection>

      <FormSection title="Partners">
        <PartnerInput
          partners={draft.partners}
          onChange={(partners) => update('partners', partners)}
        />
      </FormSection>

      <FormSection title="Techniques">
        <ChipSelect
          label="Techniques Practiced"
          options={TECHNIQUE_OPTIONS}
          values={draft.techniques}
          onChange={(techniques) =>
            update('techniques', techniques as TechniqueId[])
          }
        />
        {draft.techniques.length > 0 ? (
          <>
            <Spacer size="lg" />
            <ChipSelect
              label="Favorite Technique"
              multi={false}
              options={TECHNIQUE_OPTIONS.filter((item) =>
                draft.techniques.includes(item.value),
              )}
              values={
                draft.favoriteTechnique ? [draft.favoriteTechnique] : []
              }
              onChange={(values) =>
                update('favoriteTechnique', values[0] ?? null)
              }
            />
          </>
        ) : null}
      </FormSection>

      <FormSection title="Notes">
        <Text variant="label">Free Notes</Text>
        <Spacer size="sm" />
        <TextInput
          multiline
          textAlignVertical="top"
          value={draft.notes}
          onChangeText={(notes) => update('notes', notes)}
          placeholder="What clicked? What needs work?"
          placeholderTextColor={colors.secondaryText}
          style={styles.notes}
        />
      </FormSection>

      <FormSection title="Reflection">
        <StarRating
          value={draft.rating}
          onChange={(rating) => update('rating', rating)}
        />
        <Spacer size="lg" />
        <MoodSelector
          value={draft.mood}
          onChange={(mood: WorkoutMood) => update('mood', mood)}
        />
      </FormSection>

      <FormSection title="Photos">
        <View style={styles.photoPlaceholder}>
          <Text variant="subtitle" gold>
            Photos coming soon
          </Text>
          <Spacer size="xs" />
          <Text variant="caption" style={styles.center}>
            Attach mat photos in a future update.
          </Text>
        </View>
      </FormSection>

      <Button label="Save Workout" loading={saving} onPress={handleSave} />
      <Spacer size="sm" />
      <Button
        label="Cancel"
        variant="ghost"
        disabled={saving}
        onPress={() => navigation.goBack()}
      />

      <View style={styles.bottomSpace} />
    </Screen>
  );
}
