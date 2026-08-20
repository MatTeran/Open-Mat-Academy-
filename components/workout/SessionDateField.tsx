import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { fontFamilies, spacing, w1Radii, w1Shadow } from '../../lib/theme';
import {
  addLocalDays,
  applySessionDay,
  formatSessionDateLabel,
  isFutureLocalDay,
  startOfLocalDay,
} from '../../utils/workoutLog';

interface SessionDateFieldProps {
  valueIso: string;
  onChange: (iso: string) => void;
}

/**
 * Editable session date with Today / Yesterday / Choose Date shortcuts.
 * Blocks future dates for completed workout logs.
 */
export function SessionDateField({ valueIso, onChange }: SessionDateFieldProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const valueDate = startOfLocalDay(new Date(valueIso));
  const label = formatSessionDateLabel(valueIso);

  const commitDay = (day: Date) => {
    if (isFutureLocalDay(day)) {
      return;
    }
    onChange(applySessionDay(valueIso, day));
    setSheetOpen(false);
    setPickerOpen(false);
  };

  const onPickerChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setPickerOpen(false);
      if (event.type === 'dismissed' || !date) {
        return;
      }
      commitDay(date);
      return;
    }
    if (date) {
      onChange(applySessionDay(valueIso, date));
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: colors.goldAccent }]}>
        Session Date
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Session date, ${label}`}
        accessibilityHint="Opens date options"
        onPress={() => setSheetOpen(true)}
        style={({ pressed }) => [
          styles.field,
          w1Shadow.soft,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            opacity: pressed ? 0.92 : 1,
          },
        ]}
      >
        <Text style={[styles.value, { color: colors.text }]} numberOfLines={1}>
          {label}
        </Text>
        <Ionicons name="calendar-outline" size={20} color={colors.goldAccent} />
      </Pressable>

      <Modal
        visible={sheetOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setSheetOpen(false)}
      >
        <Pressable
          style={[styles.backdrop, { backgroundColor: colors.overlay }]}
          onPress={() => setSheetOpen(false)}
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
          <Text style={[styles.sheetTitle, { color: colors.text }]}>
            Session Date
          </Text>

          <QuickDateRow
            label="Today"
            onPress={() => commitDay(new Date())}
            colors={colors}
          />
          <QuickDateRow
            label="Yesterday"
            onPress={() => commitDay(addLocalDays(new Date(), -1))}
            colors={colors}
          />
          <QuickDateRow
            label="Choose Date"
            onPress={() => setPickerOpen(true)}
            colors={colors}
          />

          {pickerOpen ? (
            <View style={styles.pickerWrap}>
              <DateTimePicker
                value={valueDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={startOfLocalDay(new Date())}
                onChange={onPickerChange}
              />
              {Platform.OS === 'ios' ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Done choosing date"
                  onPress={() => {
                    setPickerOpen(false);
                    setSheetOpen(false);
                  }}
                  style={[
                    styles.doneBtn,
                    { backgroundColor: colors.goldAccent },
                  ]}
                >
                  <Text
                    style={[
                      styles.doneLabel,
                      { color: colors.cardBackground },
                    ]}
                  >
                    Done
                  </Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}
        </View>
      </Modal>
    </View>
  );
}

function QuickDateRow({
  label,
  onPress,
  colors,
}: {
  label: string;
  onPress: () => void;
  colors: { text: string; border: string; goldMuted: string; primaryBackground: string };
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickRow,
        {
          borderColor: colors.border,
          backgroundColor: pressed
            ? colors.goldMuted
            : colors.primaryBackground,
        },
      ]}
    >
      <Text style={[styles.quickLabel, { color: colors.text }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs,
  },
  label: {
    fontFamily: fontFamilies.semibold,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  field: {
    minHeight: 56,
    borderRadius: w1Radii.control,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  value: {
    flex: 1,
    fontFamily: fontFamilies.medium,
    fontSize: 16,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
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
  sheetTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    marginBottom: spacing.md,
  },
  quickRow: {
    minHeight: 52,
    borderRadius: w1Radii.control,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  quickLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: 16,
  },
  pickerWrap: {
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  doneBtn: {
    minHeight: 48,
    borderRadius: w1Radii.control,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: 15,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
