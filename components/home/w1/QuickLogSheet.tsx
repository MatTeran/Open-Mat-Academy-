import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { fontFamilies, spacing, w1Radii, w1Shadow } from '../../../lib/theme';

export type QuickLogActionId =
  | 'logTraining'
  | 'logTechnique'
  | 'logCompetition'
  | 'addNote';

interface QuickLogSheetProps {
  visible: boolean;
  onClose: () => void;
  onAction: (action: QuickLogActionId) => void;
}

const ACTIONS: Array<{
  id: QuickLogActionId;
  label: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  {
    id: 'logTraining',
    label: 'Training',
    subtitle: 'Rounds, mat time, notes',
    icon: 'barbell-outline',
  },
  {
    id: 'logTechnique',
    label: 'Technique',
    subtitle: 'What you learned',
    icon: 'bulb-outline',
  },
  {
    id: 'logCompetition',
    label: 'Competition',
    subtitle: 'Matches and results',
    icon: 'trophy-outline',
  },
  {
    id: 'addNote',
    label: 'Note',
    subtitle: 'Quick thought from the mat',
    icon: 'create-outline',
  },
];

export function QuickLogSheet({
  visible,
  onClose,
  onAction,
}: QuickLogSheetProps) {
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

          <View style={styles.header}>
            <Text style={[styles.eyebrow, { color: colors.goldAccent }]}>
              LOG
            </Text>
            <Text style={[styles.title, { color: colors.text }]}>Add entry</Text>
          </View>

          <View
            style={[
              styles.list,
              {
                borderColor: colors.border,
                backgroundColor: colors.primaryBackground,
              },
            ]}
          >
            {ACTIONS.map((action, index) => (
              <View key={action.id}>
                {index > 0 ? (
                  <View
                    style={[
                      styles.divider,
                      { backgroundColor: colors.border },
                    ]}
                  />
                ) : null}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={action.label}
                  onPress={() => {
                    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onAction(action.id);
                  }}
                  style={({ pressed }) => [
                    styles.row,
                    pressed && { backgroundColor: colors.goldMuted },
                  ]}
                >
                  <Ionicons
                    name={action.icon}
                    size={22}
                    color={colors.goldAccent}
                    style={styles.rowIcon}
                  />
                  <View style={styles.copy}>
                    <Text style={[styles.rowTitle, { color: colors.text }]}>
                      {action.label}
                    </Text>
                    <Text
                      style={[
                        styles.rowSubtitle,
                        { color: colors.secondaryText },
                      ]}
                    >
                      {action.subtitle}
                    </Text>
                  </View>
                </Pressable>
              </View>
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel"
            onPress={onClose}
            style={({ pressed }) => [
              styles.cancel,
              {
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text style={[styles.cancelLabel, { color: colors.secondaryText }]}>
              Cancel
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
  header: {
    marginBottom: spacing.md,
    gap: 4,
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
  },
  list: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    overflow: 'hidden',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: spacing.md + 22 + spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    minHeight: 58,
  },
  rowIcon: {
    width: 22,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: 16,
    letterSpacing: -0.2,
  },
  rowSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 13,
  },
  cancel: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
  },
  cancelLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 15,
  },
});
