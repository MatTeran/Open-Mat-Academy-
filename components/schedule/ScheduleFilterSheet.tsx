import * as Haptics from 'expo-haptics';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  SCHEDULE_FILTERS,
  SCHEDULE_GI_FILTERS,
} from '../../lib/data/schedule';
import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { fontFamilies, spacing, w1Radii, w1Shadow } from '../../lib/theme';
import type { ScheduleFilter, ScheduleGiFilter } from '../../types/schedule';
import { Text } from '../ui/Text';

interface ScheduleFilterSheetProps {
  visible: boolean;
  program: ScheduleFilter;
  gi: ScheduleGiFilter;
  onChangeProgram: (value: ScheduleFilter) => void;
  onChangeGi: (value: ScheduleGiFilter) => void;
  onClose: () => void;
}

export function ScheduleFilterSheet({
  visible,
  program,
  gi,
  onChangeProgram,
  onChangeGi,
  onClose,
}: ScheduleFilterSheetProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.root} pointerEvents="box-none">
        <Pressable
          style={[styles.backdrop, { backgroundColor: colors.overlay }]}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Dismiss filters"
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
          <Text style={[styles.eyebrow, { color: colors.goldAccent }]}>
            SCHEDULE
          </Text>
          <Text style={[styles.title, { color: colors.text }]}>Filters</Text>

          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            <Text
              variant="caption"
              style={{ color: colors.secondaryText, marginBottom: spacing.sm }}
            >
              Program
            </Text>
            <View style={styles.chips}>
              {SCHEDULE_FILTERS.map((item) => {
                const active = item.key === program;
                return (
                  <Pressable
                    key={item.key}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    onPress={() => {
                      void Haptics.selectionAsync();
                      onChangeProgram(item.key);
                    }}
                    style={[
                      styles.chip,
                      {
                        borderColor: active ? colors.goldAccent : colors.border,
                        backgroundColor: active
                          ? colors.goldMuted
                          : colors.primaryBackground,
                      },
                    ]}
                  >
                    <Text
                      variant="caption"
                      style={{
                        color: active ? colors.goldAccent : colors.secondaryText,
                        fontFamily: active
                          ? fontFamilies.semibold
                          : fontFamilies.regular,
                      }}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text
              variant="caption"
              style={{
                color: colors.secondaryText,
                marginTop: spacing.lg,
                marginBottom: spacing.sm,
              }}
            >
              BJJ format
            </Text>
            <View style={styles.chips}>
              {SCHEDULE_GI_FILTERS.map((item) => {
                const active = item.key === gi;
                return (
                  <Pressable
                    key={item.key}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    onPress={() => {
                      void Haptics.selectionAsync();
                      onChangeGi(item.key);
                    }}
                    style={[
                      styles.chip,
                      {
                        borderColor: active ? colors.goldAccent : colors.border,
                        backgroundColor: active
                          ? colors.goldMuted
                          : colors.primaryBackground,
                      },
                    ]}
                  >
                    <Text
                      variant="caption"
                      style={{
                        color: active ? colors.goldAccent : colors.secondaryText,
                        fontFamily: active
                          ? fontFamilies.semibold
                          : fontFamilies.regular,
                      }}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Done"
            onPress={onClose}
            style={({ pressed }) => [
              styles.done,
              {
                backgroundColor: colors.goldAccent,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text
              style={{
                color: colors.cardBackground,
                fontFamily: fontFamilies.semibold,
                fontSize: 15,
              }}
            >
              Done
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    maxHeight: '78%',
    borderTopLeftRadius: w1Radii.card,
    borderTopRightRadius: w1Radii.card,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    marginBottom: spacing.md,
  },
  eyebrow: {
    fontFamily: fontFamilies.semibold,
    fontSize: 11,
    letterSpacing: 1.4,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 24,
    letterSpacing: -0.3,
    marginTop: 4,
    marginBottom: spacing.md,
  },
  scroll: {
    flexGrow: 0,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    borderWidth: 1,
    borderRadius: w1Radii.chip,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
  },
  done: {
    marginTop: spacing.lg,
    borderRadius: w1Radii.chip,
    alignItems: 'center',
    paddingVertical: 14,
  },
});
