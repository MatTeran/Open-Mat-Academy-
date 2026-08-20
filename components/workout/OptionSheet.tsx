import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { fontFamilies, spacing, w1Radii, w1Shadow } from '../../lib/theme';

export interface OptionSheetItem<T extends string> {
  value: T;
  label: string;
  subtitle?: string;
}

interface OptionSheetProps<T extends string> {
  visible: boolean;
  title: string;
  options: OptionSheetItem<T>[];
  value: T | null;
  values?: T[];
  onSelect: (value: T) => void;
  onClose: () => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  closeOnSelect?: boolean;
}

/**
 * Warm bottom-sheet option picker — mirrors QuickLogSheet pattern.
 */
export function OptionSheet<T extends string>({
  visible,
  title,
  options,
  value,
  values,
  onSelect,
  onClose,
  searchable = false,
  searchPlaceholder = 'Search…',
  closeOnSelect = true,
}: OptionSheetProps<T>) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const filtered = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : options;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      onShow={() => setQuery('')}
    >
      <Pressable
        style={[styles.backdrop, { backgroundColor: colors.overlay }]}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Dismiss"
      />
      <View
        style={[
          styles.sheet,
          w1Shadow.card,
          {
            backgroundColor: colors.cardBackground,
            paddingBottom: Math.max(insets.bottom, spacing.md),
          },
        ]}
      >
        <View style={[styles.handle, { backgroundColor: colors.border }]} />
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          {!closeOnSelect ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Done"
              onPress={onClose}
              hitSlop={8}
            >
              <Text style={[styles.done, { color: colors.goldAccent }]}>
                Done
              </Text>
            </Pressable>
          ) : null}
        </View>

        {searchable ? (
          <View
            style={[
              styles.search,
              {
                backgroundColor: colors.primaryBackground,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="search" size={16} color={colors.secondaryText} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={searchPlaceholder}
              placeholderTextColor={colors.secondaryText}
              style={[styles.searchInput, { color: colors.text }]}
              autoCorrect={false}
            />
          </View>
        ) : null}

        <ScrollView
          style={styles.list}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {filtered.map((option) => {
            const active = values
              ? values.includes(option.value)
              : option.value === value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={option.label}
                onPress={() => {
                  onSelect(option.value);
                  if (closeOnSelect) {
                    onClose();
                  }
                }}
                style={({ pressed }) => [
                  styles.row,
                  {
                    borderColor: colors.border,
                    backgroundColor: active
                      ? colors.goldMuted
                      : pressed
                        ? colors.primaryBackground
                        : colors.cardBackground,
                  },
                ]}
              >
                <View style={styles.copy}>
                  <Text
                    style={[
                      styles.rowTitle,
                      { color: active ? colors.goldAccent : colors.text },
                    ]}
                  >
                    {option.label}
                  </Text>
                  {option.subtitle ? (
                    <Text
                      style={[
                        styles.rowSubtitle,
                        { color: colors.secondaryText },
                      ]}
                    >
                      {option.subtitle}
                    </Text>
                  ) : null}
                </View>
                {active ? (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={colors.goldAccent}
                  />
                ) : null}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '72%',
    borderTopLeftRadius: w1Radii.card,
    borderTopRightRadius: w1Radii.card,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    letterSpacing: 0.3,
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  done: {
    fontFamily: fontFamilies.semibold,
    fontSize: 15,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 48,
    borderRadius: w1Radii.control,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    paddingVertical: spacing.sm,
  },
  list: {
    flexGrow: 0,
  },
  row: {
    minHeight: 56,
    borderRadius: w1Radii.control,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: 16,
  },
  rowSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 13,
  },
});
