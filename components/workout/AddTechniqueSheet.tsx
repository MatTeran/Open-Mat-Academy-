import { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  SUBCATEGORY_BY_CATEGORY,
  TECHNIQUE_CATEGORY_OPTIONS,
  TECHNIQUE_FORMAT_OPTIONS,
  TECHNIQUE_POSITION_OPTIONS,
} from '../../lib/data/techniqueMeta';
import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { useTechniques } from '../../lib/providers/TechniqueProvider';
import { fontFamilies, radii, spacing } from '../../lib/theme';
import type {
  CreateMemberTechniqueInput,
  MemberTechnique,
  TechniqueCategory,
  TechniqueFormat,
} from '../../types/technique';
import { Button } from '../ui/Button';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';

interface AddTechniqueSheetProps {
  visible: boolean;
  initialName?: string;
  editing?: MemberTechnique | null;
  onClose: () => void;
  onSaved: (technique: MemberTechnique) => void;
}

export function AddTechniqueSheet({
  visible,
  initialName = '',
  editing = null,
  onClose,
  onSaved,
}: AddTechniqueSheetProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { createTechnique, updateTechnique, findByName } = useTechniques();

  const [name, setName] = useState(initialName);
  const [category, setCategory] = useState<TechniqueCategory>('submission');
  const [subcategory, setSubcategory] = useState<string | null>(null);
  const [position, setPosition] = useState<string | null>(null);
  const [format, setFormat] = useState<TechniqueFormat>('both');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      return;
    }
    if (editing) {
      setName(editing.name);
      setCategory(editing.category);
      setSubcategory(editing.subcategory);
      setPosition(editing.position);
      setFormat(editing.format);
      setNotes(editing.notes);
      setError(null);
      return;
    }
    setName(initialName);
    setCategory('submission');
    setSubcategory(null);
    setPosition(null);
    setFormat('both');
    setNotes('');
    setError(null);
  }, [editing, initialName, visible]);

  const subcategoryOptions = useMemo(
    () => SUBCATEGORY_BY_CATEGORY[category] ?? [],
    [category],
  );

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Technique name is required.');
      return;
    }
    if (!category) {
      setError('Category is required.');
      return;
    }

    const duplicate = findByName(trimmed, { includeArchived: true });
    if (duplicate && duplicate.id !== editing?.id) {
      setError(`“${duplicate.name}” already exists. Select it instead.`);
      return;
    }

    const payload: CreateMemberTechniqueInput = {
      name: trimmed,
      category,
      subcategory,
      position,
      format,
      notes,
    };

    if (editing) {
      if (editing.sourceType !== 'user') {
        setError('System techniques can’t be edited.');
        return;
      }
      const updated = updateTechnique(editing.id, payload);
      if (!updated) {
        setError('Unable to update this technique.');
        return;
      }
      onSaved(updated);
      onClose();
      return;
    }

    const created = createTechnique(payload);
    onSaved(created);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            {
              backgroundColor: colors.cardBackground,
              paddingBottom: Math.max(insets.bottom, spacing.lg),
              maxHeight: '92%',
            },
          ]}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <Text variant="subtitle">
            {editing ? 'Edit Technique' : 'Add Technique'}
          </Text>
          <Spacer size="xs" />
          <Text variant="caption" muted>
            Suggest, don’t restrict — name it the way you train it.
          </Text>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Spacer size="md" />
            <Text variant="label">Technique Name</Text>
            <Spacer size="xs" />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Kiss of the Dragon"
              placeholderTextColor={colors.secondaryText}
              style={[
                styles.input,
                {
                  backgroundColor: colors.secondaryBackground,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
            />

            <Spacer size="md" />
            <Text variant="label">Category</Text>
            <Spacer size="xs" />
            <View style={styles.wrap}>
              {TECHNIQUE_CATEGORY_OPTIONS.map((option) => {
                const active = category === option.value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      setCategory(option.value);
                      setSubcategory(null);
                    }}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: active
                          ? colors.goldAccent
                          : colors.elevatedSurface,
                        borderColor: active
                          ? colors.goldAccent
                          : colors.border,
                      },
                    ]}
                  >
                    <Text
                      variant="caption"
                      style={{
                        color: active
                          ? colors.elevatedSurface
                          : colors.secondaryText,
                      }}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {subcategoryOptions.length > 0 ? (
              <>
                <Spacer size="md" />
                <Text variant="label">Subcategory</Text>
                <Spacer size="xxs" />
                <Text variant="caption" muted>
                  Optional
                </Text>
                <Spacer size="xs" />
                <View style={styles.wrap}>
                  {subcategoryOptions.map((option) => {
                    const active = subcategory === option;
                    return (
                      <Pressable
                        key={option}
                        onPress={() =>
                          setSubcategory(active ? null : option)
                        }
                        style={[
                          styles.chip,
                          {
                            backgroundColor: active
                              ? colors.goldMuted
                              : colors.elevatedSurface,
                            borderColor: active
                              ? colors.goldAccent
                              : colors.border,
                          },
                        ]}
                      >
                        <Text
                          variant="caption"
                          style={{
                            color: active
                              ? colors.goldAccent
                              : colors.secondaryText,
                          }}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            ) : null}

            <Spacer size="md" />
            <Text variant="label">Position</Text>
            <Spacer size="xxs" />
            <Text variant="caption" muted>
              Optional
            </Text>
            <Spacer size="xs" />
            <View style={styles.wrap}>
              {TECHNIQUE_POSITION_OPTIONS.map((option) => {
                const active = position === option;
                return (
                  <Pressable
                    key={option}
                    onPress={() => setPosition(active ? null : option)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: active
                          ? colors.goldMuted
                          : colors.elevatedSurface,
                        borderColor: active
                          ? colors.goldAccent
                          : colors.border,
                      },
                    ]}
                  >
                    <Text
                      variant="caption"
                      style={{
                        color: active
                          ? colors.goldAccent
                          : colors.secondaryText,
                      }}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Spacer size="md" />
            <Text variant="label">Gi / No-Gi</Text>
            <Spacer size="xs" />
            <View style={styles.wrap}>
              {TECHNIQUE_FORMAT_OPTIONS.map((option) => {
                const active = format === option.value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => setFormat(option.value)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: active
                          ? colors.goldAccent
                          : colors.elevatedSurface,
                        borderColor: active
                          ? colors.goldAccent
                          : colors.border,
                      },
                    ]}
                  >
                    <Text
                      variant="caption"
                      style={{
                        color: active
                          ? colors.elevatedSurface
                          : colors.secondaryText,
                      }}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Spacer size="md" />
            <Text variant="label">Notes</Text>
            <Spacer size="xxs" />
            <Text variant="caption" muted>
              Optional
            </Text>
            <Spacer size="xs" />
            <TextInput
              multiline
              textAlignVertical="top"
              value={notes}
              onChangeText={setNotes}
              placeholder="Enter from reverse DLR when opponent pressures forward."
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

            {error ? (
              <>
                <Spacer size="md" />
                <Text variant="caption" style={{ color: colors.error }}>
                  {error}
                </Text>
              </>
            ) : null}

            <Spacer size="lg" />
            <Button
              label={editing ? 'Save Changes' : 'Save Technique'}
              onPress={handleSave}
            />
            <Spacer size="sm" />
            <Button label="Cancel" variant="ghost" onPress={onClose} />
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(20, 18, 14, 0.35)',
  },
  sheet: {
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    marginBottom: spacing.md,
  },
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingBottom: spacing.md,
  },
  input: {
    minHeight: 48,
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    fontFamily: fontFamilies.regular,
    fontSize: 16,
  },
  notes: {
    minHeight: 96,
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fontFamilies.regular,
    fontSize: 15,
    lineHeight: 22,
  },
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
});
