import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import {
  AddTechniqueSheet,
  Button,
  Card,
  Screen,
  Spacer,
  Text,
} from '../../components';
import {
  getCategoryLabel,
  getFormatLabel,
} from '../../lib/data/techniqueMeta';
import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { useTechniques } from '../../lib/providers/TechniqueProvider';
import { useWorkouts } from '../../lib/providers/WorkoutProvider';
import { fontFamilies, radii, spacing } from '../../lib/theme';
import type { WorkoutStackParamList } from '../../types/navigation';
import { formatShortDate } from '../../utils';
import { buildTechniquePersonalStats } from '../../utils/techniqueAnalytics';

type Props = NativeStackScreenProps<WorkoutStackParamList, 'TechniqueDetail'>;

export function TechniqueDetailScreen({ navigation, route }: Props) {
  const { colors } = useAppTheme();
  const { workouts } = useWorkouts();
  const {
    getTechnique,
    getPersonalNotes,
    setPersonalNotes,
    archiveTechnique,
    restoreTechnique,
  } = useTechniques();
  const technique = getTechnique(route.params.techniqueId);
  const [editOpen, setEditOpen] = useState(false);
  const [notesDraft, setNotesDraft] = useState(
    getPersonalNotes(route.params.techniqueId),
  );

  const stats = useMemo(
    () => buildTechniquePersonalStats(route.params.techniqueId, workouts),
    [route.params.techniqueId, workouts],
  );

  if (!technique) {
    return (
      <Screen>
        <Text variant="subtitle">Technique not found</Text>
        <Spacer size="md" />
        <Button label="Go Back" onPress={() => navigation.goBack()} />
      </Screen>
    );
  }

  const canEdit = technique.sourceType === 'user';

  return (
    <Screen scroll>
      <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
        <Text variant="caption" style={{ color: colors.goldAccent }}>
          ← Back
        </Text>
      </Pressable>
      <Spacer size="md" />
      <Text variant="hero">{technique.name}</Text>
      <Spacer size="xs" />
      <Text variant="bodyMuted">
        {getCategoryLabel(technique.category)}
        {technique.subcategory ? ` · ${technique.subcategory}` : ''}
        {technique.archived ? ' · Archived' : ''}
      </Text>
      <Spacer size="sm" />
      <View style={styles.metaRow}>
        <MetaChip
          label={technique.position ?? 'Position —'}
          colors={colors}
        />
        <MetaChip
          label={getFormatLabel(technique.format)}
          colors={colors}
        />
        <MetaChip
          label={
            technique.sourceType === 'system'
              ? 'System'
              : technique.sourceType === 'academy'
                ? 'Academy'
                : 'Custom'
          }
          colors={colors}
        />
      </View>

      <Spacer size="lg" />
      <Card>
        <Text variant="subtitle">Personal Stats</Text>
        <Spacer size="md" />
        <Stat label="Times Logged" value={`${stats.timesLogged}`} />
        <Spacer size="sm" />
        <Stat label="Sessions Used" value={`${stats.sessionsUsed}`} />
        <Spacer size="sm" />
        <Stat
          label="First Logged"
          value={
            stats.firstLogged ? formatShortDate(stats.firstLogged) : '—'
          }
        />
        <Spacer size="sm" />
        <Stat
          label="Last Logged"
          value={stats.lastLogged ? formatShortDate(stats.lastLogged) : '—'}
        />
        <Spacer size="sm" />
        <Stat label="Last 30 Days" value={`${stats.last30Days}`} />
      </Card>

      {stats.partners.length > 0 ? (
        <>
          <Spacer size="md" />
          <Card>
            <Text variant="subtitle">Partners Most Practiced With</Text>
            <Spacer size="md" />
            {stats.partners.map((partner) => (
              <View key={partner.name} style={styles.partnerRow}>
                <Text variant="body">{partner.name}</Text>
                <Text variant="caption" muted>
                  {partner.sessions} session
                  {partner.sessions === 1 ? '' : 's'}
                </Text>
              </View>
            ))}
          </Card>
        </>
      ) : null}

      <Spacer size="md" />
      <Card>
        <Text variant="subtitle">Training History</Text>
        <Spacer size="md" />
        {stats.history.length === 0 ? (
          <Text variant="bodyMuted">
            No sessions logged with this technique yet.
          </Text>
        ) : (
          stats.history.map((item) => (
            <Pressable
              key={item.workoutId}
              onPress={() =>
                navigation.navigate('WorkoutDetails', {
                  workoutId: item.workoutId,
                })
              }
              style={styles.historyRow}
            >
              <View style={{ flex: 1 }}>
                <Text variant="caption" muted>
                  {formatShortDate(item.date)}
                </Text>
                <Text variant="body">{item.className}</Text>
              </View>
              <Text variant="caption" muted>
                {item.rounds} rounds
              </Text>
            </Pressable>
          ))
        )}
      </Card>

      <Spacer size="md" />
      <Card>
        <Text variant="subtitle">Personal Notes</Text>
        <Spacer size="xs" />
        <Text variant="caption" muted>
          Private reminders for your game
        </Text>
        <Spacer size="sm" />
        <TextInput
          multiline
          textAlignVertical="top"
          value={notesDraft}
          onChangeText={setNotesDraft}
          placeholder="Knee needs to stay behind shoulder before turning the corner."
          placeholderTextColor={colors.secondaryText}
          style={[
            styles.notes,
            {
              backgroundColor: colors.secondaryBackground,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
        />
        <Spacer size="sm" />
        <Button
          label="Save Notes"
          variant="secondary"
          onPress={() => setPersonalNotes(technique.id, notesDraft)}
        />
      </Card>

      <Spacer size="lg" />
      {canEdit ? (
        <>
          <Button
            label="Edit Technique"
            variant="outlineGold"
            onPress={() => setEditOpen(true)}
          />
          <Spacer size="sm" />
          {technique.archived ? (
            <Button
              label="Restore Technique"
              variant="secondary"
              onPress={() => restoreTechnique(technique.id)}
            />
          ) : (
            <Button
              label="Archive Technique"
              variant="ghost"
              onPress={() => {
                archiveTechnique(technique.id);
                navigation.goBack();
              }}
            />
          )}
        </>
      ) : (
        <Text variant="caption" muted style={styles.center}>
          System techniques can’t be edited by members.
        </Text>
      )}

      <View style={{ height: spacing.xl }} />

      <AddTechniqueSheet
        visible={editOpen}
        editing={technique}
        onClose={() => setEditOpen(false)}
        onSaved={() => setEditOpen(false)}
      />
    </Screen>
  );
}

function MetaChip({
  label,
  colors,
}: {
  label: string;
  colors: { goldMuted: string; goldAccent: string };
}) {
  return (
    <View
      style={[
        styles.metaChip,
        {
          backgroundColor: colors.goldMuted,
          borderColor: colors.goldAccent,
        },
      ]}
    >
      <Text variant="caption" style={{ color: colors.goldAccent }}>
        {label}
      </Text>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statRow}>
      <Text variant="caption" muted>
        {label}
      </Text>
      <Text variant="subtitle">{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  metaChip: {
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  partnerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 8,
  },
  notes: {
    minHeight: 110,
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fontFamilies.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  statRow: {
    gap: 2,
  },
  center: {
    textAlign: 'center',
  },
});
