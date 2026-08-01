import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  Banner,
  Button,
  Card,
  Input,
  Spacer,
  Text,
  academyRoleLabel,
  canEditMemberDevelopment,
  competitionRuleSetLabel,
  ACADEMY_ROLE_KEYS,
  useAuth,
  spacing,
  useAppTheme,
  type AcademyRoleKey,
  type CoachNote,
  type MemberDevelopmentBundle,
} from '@openmat/shared';

import { BeltBadge } from '../../components/development/BeltBadge';
import { MemberSummaryCard } from '../../components/development/MemberSummaryCard';
import { PromotionTimeline } from '../../components/development/PromotionTimeline';
import { ToggleChip } from '../../components/ui/Phase2Controls';
import { SectionHeader } from '../../components/ui/Motion';
import { useMemberDevelopment } from '../../lib/providers/MemberDevelopmentProvider';

interface MemberDevelopmentPanelProps {
  memberId: string;
  onAddStripe: () => void;
  onPromoteBelt: () => void;
  onEditCompetition: () => void;
  /** When false, hide the belt visual (shown in the member header instead). */
  showBeltVisual?: boolean;
}

export function MemberDevelopmentPanel({
  memberId,
  onAddStripe,
  onPromoteBelt,
  onEditCompetition,
  showBeltVisual = true,
}: MemberDevelopmentPanelProps) {
  const { colors } = useAppTheme();
  const { user } = useAuth();
  const canEdit = canEditMemberDevelopment(user);
  const {
    getBundle,
    setAcademyRoles,
    addNote,
    updateNote,
    removeNote,
    searchNotes,
    revision,
  } = useMemberDevelopment();

  const [bundle, setBundle] = useState<MemberDevelopmentBundle | null>(null);
  const [noteQuery, setNoteQuery] = useState('');
  const [notes, setNotes] = useState<CoachNote[]>([]);
  const [noteDraft, setNoteDraft] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingBody, setEditingBody] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const reload = useCallback(async () => {
    const next = await getBundle(memberId);
    setBundle(next);
    const listed = await searchNotes(memberId, noteQuery);
    setNotes(listed);
  }, [getBundle, memberId, noteQuery, searchNotes]);

  useEffect(() => {
    void reload();
  }, [reload, revision]);

  const selectedRoles = useMemo(
    () => new Set(bundle?.roles.map((item) => item.role) ?? []),
    [bundle?.roles],
  );

  if (!bundle) {
    return (
      <Card>
        <Text variant="caption" muted>
          Loading member development…
        </Text>
      </Card>
    );
  }

  const { development, history, competition, summary } = bundle;

  return (
    <View style={styles.root}>
      <MemberSummaryCard summary={summary} />

      <Spacer size="md" />
      <Card elevated>
        <SectionHeader
          title="Member Development"
          subtitle="Official academy progression record"
        />
        {showBeltVisual ? (
          <>
            <Spacer size="md" />
            <BeltBadge belt={development.belt} stripes={development.stripes} />
          </>
        ) : null}
        <Spacer size="md" />
        <View style={styles.metaGrid}>
          <Meta
            label="Promotion Date"
            value={development.promotionDate ?? '—'}
          />
          <Meta
            label="Promoted By"
            value={development.promotedByName ?? '—'}
          />
          <Meta
            label="Time at Current Belt"
            value={summary.timeAtCurrentBeltLabel}
          />
        </View>

        {canEdit ? (
          <>
            <Spacer size="md" />
            <View style={styles.actions}>
              <View style={styles.actionGrow}>
                <Button
                  label="Add Stripe"
                  variant="outlineGold"
                  onPress={onAddStripe}
                  disabled={development.stripes >= 4}
                />
              </View>
              <View style={styles.actionGrow}>
                <Button
                  label="Promote Belt"
                  variant="primaryGold"
                  onPress={onPromoteBelt}
                />
              </View>
            </View>
            <Spacer size="xs" />
            <Text variant="caption" muted>
              Direct edits are disabled. Use promotion actions to update the
              official record.
            </Text>
          </>
        ) : null}
      </Card>

      <Spacer size="md" />
      <Card>
        <SectionHeader
          title="Promotion History"
          subtitle="Newest first · coach-authored"
        />
        <Spacer size="sm" />
        <PromotionTimeline entries={history} />
      </Card>

      <Spacer size="md" />
      <Card>
        <SectionHeader
          title="Competition Profile"
          subtitle="Separate from belt rank"
          actionLabel={canEdit ? 'Edit' : undefined}
          onAction={canEdit ? onEditCompetition : undefined}
        />
        <Spacer size="sm" />
        {competition ? (
          <View style={styles.metaGrid}>
            <Meta
              label="Rule Set"
              value={competitionRuleSetLabel(competition.preferredRuleSet)}
            />
            <Meta
              label="Division"
              value={
                competition.division.charAt(0).toUpperCase() +
                competition.division.slice(1)
              }
            />
            <Meta label="Weight Class" value={competition.weightClass || '—'} />
            <Meta
              label="Preferred Weight"
              value={
                competition.preferredWeightKg != null
                  ? `${competition.preferredWeightKg} kg`
                  : '—'
              }
            />
            <Meta
              label="Competition Team"
              value={
                competition.teamStatus.charAt(0).toUpperCase() +
                competition.teamStatus.slice(1)
              }
            />
            <Meta
              label="Experience"
              value={
                competition.experience.charAt(0).toUpperCase() +
                competition.experience.slice(1)
              }
            />
          </View>
        ) : (
          <Text variant="caption" muted>
            No competition profile on file.
          </Text>
        )}
        {competition?.eligibilityNotes ? (
          <>
            <Spacer size="sm" />
            <Text variant="caption" muted>
              {competition.eligibilityNotes}
            </Text>
          </>
        ) : null}
      </Card>

      <Spacer size="md" />
      <Card>
        <SectionHeader
          title="Academy Roles"
          subtitle="Multiple selections supported"
        />
        <Spacer size="sm" />
        <View style={styles.roleWrap}>
          {ACADEMY_ROLE_KEYS.map((role) => {
            const active = selectedRoles.has(role);
            return (
              <ToggleChip
                key={role}
                label={academyRoleLabel(role)}
                active={active}
                onPress={() => {
                  if (!canEdit || busy) {
                    return;
                  }
                  const next = new Set(selectedRoles);
                  if (active) {
                    next.delete(role);
                  } else {
                    next.add(role);
                  }
                  setBusy(true);
                  void setAcademyRoles({
                    memberId,
                    roles: Array.from(next) as AcademyRoleKey[],
                  }).finally(() => setBusy(false));
                }}
              />
            );
          })}
        </View>
        {!canEdit ? (
          <>
            <Spacer size="xs" />
            <Text variant="caption" muted>
              Read only
            </Text>
          </>
        ) : null}
      </Card>

      <Spacer size="md" />
      <Card elevated>
        <SectionHeader
          title="Private Coach Notes"
          subtitle="Never shown in the Member app"
        />
        <Spacer size="sm" />
        {message ? (
          <>
            <Banner tone="success" message={message} />
            <Spacer size="sm" />
          </>
        ) : null}
        <Input
          label="Search notes"
          value={noteQuery}
          onChangeText={setNoteQuery}
          placeholder="Search by text or coach…"
        />
        <Spacer size="sm" />
        {notes.length === 0 ? (
          <Text variant="caption" muted>
            No private notes.
          </Text>
        ) : (
          notes.map((note) => (
            <View
              key={note.id}
              style={[styles.note, { borderColor: colors.border }]}
            >
              {editingNoteId === note.id ? (
                <>
                  <Input
                    label="Edit note"
                    value={editingBody}
                    onChangeText={setEditingBody}
                    multiline
                  />
                  <Spacer size="sm" />
                  <View style={styles.actions}>
                    <Button
                      label="Save"
                      variant="primaryGold"
                      onPress={async () => {
                        await updateNote(note.id, editingBody);
                        setEditingNoteId(null);
                        setMessage('Note updated.');
                      }}
                    />
                    <Button
                      label="Cancel"
                      variant="ghost"
                      onPress={() => setEditingNoteId(null)}
                    />
                  </View>
                </>
              ) : (
                <>
                  <Text variant="body">{note.body}</Text>
                  <Text variant="caption" muted>
                    {note.authorName} ·{' '}
                    {new Date(note.createdAt).toLocaleString()}
                  </Text>
                  {canEdit ? (
                    <View style={styles.noteActions}>
                      <Pressable
                        onPress={() => {
                          setEditingNoteId(note.id);
                          setEditingBody(note.body);
                        }}
                      >
                        <Text variant="caption" gold>
                          Edit
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={async () => {
                          await removeNote(note.id);
                          setMessage('Note deleted.');
                        }}
                      >
                        <Text variant="caption" style={{ color: colors.error }}>
                          Delete
                        </Text>
                      </Pressable>
                    </View>
                  ) : null}
                </>
              )}
            </View>
          ))
        )}
        {canEdit ? (
          <>
            <Spacer size="sm" />
            <Input
              label="Add note"
              value={noteDraft}
              onChangeText={setNoteDraft}
              placeholder="Excellent training partner…"
              multiline
            />
            <Spacer size="sm" />
            <Button
              label="Save Note"
              loading={busy}
              disabled={!noteDraft.trim()}
              onPress={async () => {
                setBusy(true);
                try {
                  await addNote({ memberId, body: noteDraft });
                  setNoteDraft('');
                  setMessage('Private note saved.');
                } finally {
                  setBusy(false);
                }
              }}
            />
          </>
        ) : null}
      </Card>
    </View>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.meta}>
      <Text variant="caption" muted>
        {label}
      </Text>
      <Text variant="body">{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 0,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  meta: {
    width: '47%',
    minWidth: 140,
    gap: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionGrow: {
    flex: 1,
  },
  roleWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  note: {
    gap: 6,
    marginBottom: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  noteActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: 4,
  },
});
