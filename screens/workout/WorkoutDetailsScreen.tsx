import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Banner,
  Button,
  ChipSelect,
  DurationStepper,
  OptionSheet,
  Screen,
  SelectorField,
  SessionDateField,
  Spacer,
} from '../../components';
import { useAppTheme } from '../../hooks';
import {
  CLASS_TYPE_OPTIONS,
  getClassTypeLabel,
  INSTRUCTOR_OPTIONS,
  INTENSITY_OPTIONS,
  SELF_TRAINING_INSTRUCTOR,
  TECHNIQUE_OPTIONS,
} from '../../lib/data/workoutOptions';
import { createEmptyWorkoutDraft } from '../../lib/mocks/workouts';
import { useWorkouts } from '../../lib/providers/WorkoutProvider';
import {
  fontFamilies,
  spacing,
  w1Radii,
  w1Shadow,
} from '../../lib/theme';
import type { WorkoutStackParamList } from '../../types/navigation';
import type {
  TechniqueId,
  TrainingIntensity,
  WorkoutClassType,
  WorkoutDraft,
} from '../../types/workout';
import {
  formatClassesSectionLabel,
  formatScheduleMeta,
  getScheduledClassesForSessionDate,
  isScheduleClassAlreadyLogged,
  prefillDraftFromSchedule,
} from '../../utils/workoutLog';

type Props = NativeStackScreenProps<WorkoutStackParamList, 'WorkoutDetails'>;

type SheetKind = 'classType' | 'instructor' | 'techniques' | null;

/**
 * Compact progressive Log Workout flow — session date, schedule prefills,
 * sheet selectors, sticky save. Local mock persistence (no DB migration).
 */
export function WorkoutDetailsScreen({ navigation, route }: Props) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { getWorkout, saveWorkout, workouts } = useWorkouts();
  const existing = route.params?.workoutId
    ? getWorkout(route.params.workoutId)
    : undefined;

  const initial = useMemo<WorkoutDraft>(() => {
    if (existing) {
      return {
        ...existing,
        createdAt: existing.createdAt || existing.date,
        scheduleClassId: existing.scheduleClassId ?? null,
      };
    }
    return createEmptyWorkoutDraft();
  }, [existing]);

  const [draft, setDraft] = useState<WorkoutDraft>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(Boolean(existing));
  const [showMore, setShowMore] = useState(false);
  const [sheet, setSheet] = useState<SheetKind>(null);

  const isEditing = Boolean(existing);
  const scheduledClasses = useMemo(
    () => getScheduledClassesForSessionDate(draft.date),
    [draft.date],
  );

  const update = <K extends keyof WorkoutDraft>(
    key: K,
    value: WorkoutDraft[K],
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const handleSelectScheduleClass = (classId: string) => {
    const item = scheduledClasses.find((entry) => entry.id === classId);
    if (!item) {
      return;
    }
    if (
      isScheduleClassAlreadyLogged(
        workouts,
        item.id,
        draft.date,
        existing?.id,
      )
    ) {
      setError('This class is already logged for this date.');
      return;
    }
    setError(null);
    setDraft((current) => prefillDraftFromSchedule(current, item, current.date));
    setManualMode(true);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSave = () => {
    setError(null);

    if (!draft.classType) {
      setError('Choose a class type.');
      return;
    }
    if (draft.durationMinutes < 5) {
      setError('Enter a valid duration.');
      return;
    }

    const className =
      draft.className.trim() || getClassTypeLabel(draft.classType);
    const instructor = draft.instructor.trim() || SELF_TRAINING_INSTRUCTOR;

    if (
      draft.scheduleClassId &&
      isScheduleClassAlreadyLogged(
        workouts,
        draft.scheduleClassId,
        draft.date,
        existing?.id,
      )
    ) {
      setError('This class is already logged for this date.');
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
          instructor,
          favoriteTechnique: favorite,
          rounds: draft.rounds > 0 ? draft.rounds : 1,
          createdAt: existing?.createdAt || draft.createdAt || new Date().toISOString(),
        },
        existing?.id,
      );
      setSaving(false);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    }, 350);
  };

  const techniqueSummary =
    draft.techniques.length === 0
      ? ''
      : draft.techniques.length === 1
        ? TECHNIQUE_OPTIONS.find((item) => item.value === draft.techniques[0])
            ?.label ?? '1 technique'
        : `${draft.techniques.length} techniques`;

  return (
    <View style={[styles.root, { backgroundColor: colors.primaryBackground }]}>
      <Screen
        scroll
        keyboard
        padded={false}
        contentStyle={styles.scrollContent}
      >
        <View style={styles.page}>
          <Text style={[styles.hero, { color: colors.text }]}>
            {isEditing ? 'Edit Workout' : 'New Workout'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
            Capture the session while it’s fresh.
          </Text>

          {error ? (
            <>
              <Spacer size="md" />
              <Banner message={error} />
            </>
          ) : null}

          <Spacer size="lg" />

          <SessionDateField
            valueIso={draft.date}
            onChange={(iso) => {
              update('date', iso);
              update('scheduleClassId', null);
              setManualMode(false);
              setError(null);
            }}
          />

          <Spacer size="lg" />

          <Text style={[styles.sectionLabel, { color: colors.goldAccent }]}>
            {formatClassesSectionLabel(draft.date)}
          </Text>
          <Spacer size="sm" />

          {scheduledClasses.length === 0 ? (
            <View
              style={[
                styles.emptyCard,
                w1Shadow.soft,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No academy classes found for this date.
              </Text>
              <Spacer size="sm" />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Enter workout manually"
                onPress={() => setManualMode(true)}
              >
                <Text style={[styles.link, { color: colors.goldAccent }]}>
                  Enter Workout Manually
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.classList}>
              {scheduledClasses.map((item) => {
                const alreadyLogged = isScheduleClassAlreadyLogged(
                  workouts,
                  item.id,
                  draft.date,
                  existing?.id,
                );
                const selected = draft.scheduleClassId === item.id;
                return (
                  <Pressable
                    key={item.id}
                    accessibilityRole="button"
                    accessibilityState={{
                      selected,
                      disabled: alreadyLogged,
                    }}
                    accessibilityLabel={`${item.title}. ${formatScheduleMeta(item)}`}
                    disabled={alreadyLogged}
                    onPress={() => handleSelectScheduleClass(item.id)}
                    style={({ pressed }) => [
                      styles.classCard,
                      w1Shadow.soft,
                      {
                        backgroundColor: selected
                          ? colors.goldMuted
                          : colors.cardBackground,
                        borderColor: selected
                          ? colors.goldAccent
                          : colors.border,
                        opacity: pressed ? 0.94 : 1,
                      },
                    ]}
                  >
                    <View style={styles.classCopy}>
                      <Text
                        style={[styles.classTitle, { color: colors.text }]}
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>
                      <Text
                        style={[
                          styles.classMeta,
                          { color: colors.secondaryText },
                        ]}
                        numberOfLines={1}
                      >
                        {formatScheduleMeta(item)}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.classAction,
                        {
                          color: alreadyLogged
                            ? colors.secondaryText
                            : colors.goldAccent,
                        },
                      ]}
                    >
                      {alreadyLogged
                        ? 'Already logged'
                        : selected
                          ? 'Selected'
                          : 'Select'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          {!manualMode ? (
            <>
              <Spacer size="md" />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Can't find your session? Enter workout manually"
                onPress={() => setManualMode(true)}
                style={styles.manualLink}
              >
                <Text
                  style={[styles.manualHint, { color: colors.secondaryText }]}
                >
                  Can’t find your session?
                </Text>
                <Text style={[styles.link, { color: colors.goldAccent }]}>
                  Enter workout manually
                </Text>
              </Pressable>
            </>
          ) : null}

          {manualMode ? (
            <>
              <Spacer size="xl" />
              <Text style={[styles.sectionLabel, { color: colors.goldAccent }]}>
                Session Details
              </Text>
              <Spacer size="md" />

              <SelectorField
                label="Class Type"
                valueLabel={getClassTypeLabel(draft.classType)}
                onPress={() => setSheet('classType')}
              />
              <Spacer size="md" />
              <SelectorField
                label="Instructor"
                valueLabel={draft.instructor || SELF_TRAINING_INSTRUCTOR}
                onPress={() => setSheet('instructor')}
              />
              <Spacer size="md" />
              <DurationStepper
                value={draft.durationMinutes}
                onChange={(minutes) => update('durationMinutes', minutes)}
              />
              <Spacer size="md" />

              <Text style={[styles.sectionLabel, { color: colors.goldAccent }]}>
                How was training?
              </Text>
              <View style={styles.intensityRow}>
                {INTENSITY_OPTIONS.map((option) => {
                  const active = draft.intensity === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                      accessibilityLabel={option.label}
                      onPress={() =>
                        update(
                          'intensity',
                          option.value as TrainingIntensity,
                        )
                      }
                      style={[
                        styles.intensityChip,
                        {
                          borderColor: active
                            ? colors.goldAccent
                            : colors.border,
                          backgroundColor: active
                            ? colors.goldMuted
                            : colors.cardBackground,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.intensityLabel,
                          {
                            color: active
                              ? colors.goldAccent
                              : colors.secondaryText,
                          },
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Spacer size="md" />
              <SelectorField
                label="Techniques"
                valueLabel={techniqueSummary}
                placeholder="+ Add techniques"
                onPress={() => setSheet('techniques')}
              />
              <Spacer size="md" />

              <Text style={[styles.sectionLabel, { color: colors.goldAccent }]}>
                Notes
              </Text>
              <Spacer size="xs" />
              <TextInput
                multiline
                textAlignVertical="top"
                value={draft.notes}
                onChangeText={(notes) => update('notes', notes)}
                placeholder="What did you work on?"
                placeholderTextColor={colors.secondaryText}
                style={[
                  styles.notes,
                  w1Shadow.soft,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
              />

              <Spacer size="md" />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  showMore ? 'Hide more details' : 'Show more details'
                }
                onPress={() => setShowMore((current) => !current)}
              >
                <Text style={[styles.link, { color: colors.goldAccent }]}>
                  {showMore ? 'Hide more details' : 'More details'}
                </Text>
              </Pressable>

              {showMore ? (
                <>
                  <Spacer size="md" />
                  <ChipSelect
                    label="Gi or No-Gi"
                    multi={false}
                    options={[
                      { value: 'gi', label: 'Gi' },
                      { value: 'no_gi', label: 'No-Gi' },
                    ]}
                    values={[draft.giType]}
                    onChange={(values) =>
                      update('giType', values[0] ?? 'gi')
                    }
                  />
                </>
              ) : null}
            </>
          ) : null}

          <View style={{ height: 120 + insets.bottom }} />
        </View>
      </Screen>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.primaryBackground,
            borderTopColor: colors.border,
            paddingBottom: Math.max(insets.bottom, spacing.md),
          },
        ]}
      >
        <Button
          label="Log Workout"
          loading={saving}
          loadingLabel="Saving…"
          onPress={handleSave}
        />
      </View>

      <OptionSheet
        visible={sheet === 'classType'}
        title="Select Class Type"
        value={draft.classType}
        options={CLASS_TYPE_OPTIONS}
        onClose={() => setSheet(null)}
        onSelect={(value) => {
          update('classType', value as WorkoutClassType);
          update('className', getClassTypeLabel(value as WorkoutClassType));
          update('scheduleClassId', null);
        }}
      />

      <OptionSheet
        visible={sheet === 'instructor'}
        title="Select Instructor"
        value={(draft.instructor || SELF_TRAINING_INSTRUCTOR) as string}
        options={INSTRUCTOR_OPTIONS.map((name) => ({
          value: name,
          label: name,
        }))}
        searchable
        searchPlaceholder="Search coaches…"
        onClose={() => setSheet(null)}
        onSelect={(value) => {
          update('instructor', value);
          update('scheduleClassId', null);
        }}
      />

      <OptionSheet
        visible={sheet === 'techniques'}
        title="Add Techniques"
        value={null}
        values={draft.techniques}
        options={TECHNIQUE_OPTIONS}
        closeOnSelect={false}
        onClose={() => setSheet(null)}
        onSelect={(value) => {
          const technique = value as TechniqueId;
          setDraft((current) => {
            const exists = current.techniques.includes(technique);
            const techniques = exists
              ? current.techniques.filter((item) => item !== technique)
              : [...current.techniques, technique];
            return { ...current, techniques };
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  page: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  hero: {
    fontFamily: fontFamilies.bold,
    fontSize: 28,
    letterSpacing: 0.4,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontFamily: fontFamilies.medium,
    fontSize: 15,
    lineHeight: 21,
  },
  sectionLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  classList: {
    gap: spacing.sm,
  },
  classCard: {
    minHeight: 72,
    borderRadius: w1Radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  classCopy: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  classTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
  },
  classMeta: {
    fontFamily: fontFamilies.regular,
    fontSize: 13,
  },
  classAction: {
    fontFamily: fontFamilies.semibold,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  emptyCard: {
    borderRadius: w1Radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.md,
  },
  emptyTitle: {
    fontFamily: fontFamilies.medium,
    fontSize: 15,
    lineHeight: 21,
  },
  manualLink: {
    gap: 4,
  },
  manualHint: {
    fontFamily: fontFamilies.regular,
    fontSize: 13,
  },
  link: {
    fontFamily: fontFamilies.semibold,
    fontSize: 14,
  },
  intensityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  intensityChip: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intensityLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: 13,
  },
  notes: {
    minHeight: 110,
    borderRadius: w1Radii.control,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    lineHeight: 22,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
});
