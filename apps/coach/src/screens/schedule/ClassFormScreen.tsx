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
  type ClassAudience,
  type ClassLevel,
  type CreateClassInput,
  type GiType,
  type RecurrenceRule,
} from '@openmat/shared';

import { useCoachData } from '../../lib/providers/CoachDataProvider';
import type { ScheduleStackParamList } from '../../navigation/types';
import type { DashboardStackParamList } from '../../navigation/types';

type Props =
  | NativeStackScreenProps<ScheduleStackParamList, 'ClassForm'>
  | NativeStackScreenProps<DashboardStackParamList, 'ClassForm'>;

const LEVELS: ClassLevel[] = [
  'fundamentals',
  'advanced',
  'kids',
  'competition',
  'open_mat',
  'seminar',
];
const AUDIENCES: ClassAudience[] = ['adults', 'kids', 'all'];
const GI_TYPES: GiType[] = ['gi', 'no_gi'];
const RECURRENCE: RecurrenceRule[] = ['none', 'weekly', 'biweekly', 'daily'];

export function ClassFormScreen({ navigation, route }: Props) {
  const { colors } = useAppTheme();
  const { getClass, createClass, updateClass } = useCoachData();
  const existing = route.params?.classId
    ? getClass(route.params.classId)
    : undefined;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [date, setDate] = useState(
    existing?.date ?? new Date().toISOString().slice(0, 10),
  );
  const [startTime, setStartTime] = useState(existing?.startTime ?? '18:00');
  const [endTime, setEndTime] = useState(existing?.endTime ?? '19:00');
  const [instructorName, setInstructorName] = useState(
    existing?.instructorName ?? 'Coach Rivera',
  );
  const [capacity, setCapacity] = useState(String(existing?.capacity ?? 20));
  const [level, setLevel] = useState<ClassLevel>(
    existing?.level ?? 'fundamentals',
  );
  const [audience, setAudience] = useState<ClassAudience>(
    existing?.audience ?? 'adults',
  );
  const [giType, setGiType] = useState<GiType>(existing?.giType ?? 'gi');
  const [recurrence, setRecurrence] = useState<RecurrenceRule>(
    existing?.recurrence ?? 'weekly',
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(existing);

  const payload = useMemo<CreateClassInput>(
    () => ({
      title,
      date,
      startTime,
      endTime,
      instructorName,
      giType,
      level,
      audience,
      capacity: Number(capacity) || 0,
      isOpenMat: level === 'open_mat',
      isSeminar: level === 'seminar',
      recurrence,
    }),
    [
      audience,
      capacity,
      date,
      endTime,
      giType,
      instructorName,
      level,
      recurrence,
      startTime,
      title,
    ],
  );

  const onSave = async () => {
    setError(null);
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!capacity || Number(capacity) <= 0) {
      setError('Capacity must be greater than zero.');
      return;
    }
    setLoading(true);
    try {
      if (isEditing && existing) {
        await updateClass(existing.id, payload);
      } else {
        await createClass(payload);
      }
      navigation.goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save class.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll keyboard>
      <Text variant="title">{isEditing ? 'Edit Class' : 'New Class'}</Text>
      <Spacer size="sm" />
      <Text variant="body" muted>
        Capacity, recurrence, gi type, and audience.
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
      <Input label="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} />
      <Spacer size="md" />
      <Input label="Start" value={startTime} onChangeText={setStartTime} />
      <Spacer size="md" />
      <Input label="End" value={endTime} onChangeText={setEndTime} />
      <Spacer size="md" />
      <Input
        label="Instructor"
        value={instructorName}
        onChangeText={setInstructorName}
      />
      <Spacer size="md" />
      <Input
        label="Capacity"
        keyboardType="number-pad"
        value={capacity}
        onChangeText={setCapacity}
      />

      <Spacer size="lg" />
      <Text variant="label">Level</Text>
      <Spacer size="xs" />
      <ChipRow
        options={LEVELS}
        value={level}
        onChange={setLevel}
        colors={colors}
      />

      <Spacer size="md" />
      <Text variant="label">Audience</Text>
      <Spacer size="xs" />
      <ChipRow
        options={AUDIENCES}
        value={audience}
        onChange={setAudience}
        colors={colors}
      />

      <Spacer size="md" />
      <Text variant="label">Gi / No-Gi</Text>
      <Spacer size="xs" />
      <ChipRow
        options={GI_TYPES}
        value={giType}
        onChange={setGiType}
        colors={colors}
      />

      <Spacer size="md" />
      <Text variant="label">Recurring</Text>
      <Spacer size="xs" />
      <ChipRow
        options={RECURRENCE}
        value={recurrence}
        onChange={setRecurrence}
        colors={colors}
      />

      <Spacer size="xl" />
      <Button
        label={isEditing ? 'Save Changes' : 'Create Class'}
        loading={loading}
        onPress={onSave}
      />
      <Spacer size="xl" />
    </Screen>
  );
}

function ChipRow<T extends string>({
  options,
  value,
  onChange,
  colors,
}: {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  colors: { goldMuted: string; cardBackground: string; goldAccent: string; border: string; secondaryText: string };
}) {
  return (
    <View style={styles.chips}>
      {options.map((option) => {
        const active = option === value;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
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
              {option.replace('_', ' ')}
            </Text>
          </Pressable>
        );
      })}
    </View>
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
