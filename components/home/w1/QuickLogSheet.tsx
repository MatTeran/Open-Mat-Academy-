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
  | 'addNote'
  | 'viewLog';

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
    label: 'Log Training',
    subtitle: 'Rounds, mat time, and notes',
    icon: 'barbell-outline',
  },
  {
    id: 'logTechnique',
    label: 'Log Technique',
    subtitle: 'Capture what you learned',
    icon: 'bulb-outline',
  },
  {
    id: 'logCompetition',
    label: 'Log Competition',
    subtitle: 'Matches, results, and reflections',
    icon: 'trophy-outline',
  },
  {
    id: 'addNote',
    label: 'Add Note',
    subtitle: 'Quick thoughts from the mat',
    icon: 'create-outline',
  },
  {
    id: 'viewLog',
    label: 'Open Training Log',
    subtitle: 'See progress and past sessions',
    icon: 'list-outline',
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
      <Pressable
        style={[styles.backdrop, { backgroundColor: colors.overlay }]}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Dismiss quick log"
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
        <Text style={[styles.title, { color: colors.text }]}>Quick Log</Text>
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
          Capture your Jiu-Jitsu journey in a moment.
        </Text>

        <View style={styles.list}>
          {ACTIONS.map((action) => (
            <Pressable
              key={action.id}
              accessibilityRole="button"
              accessibilityLabel={action.label}
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onAction(action.id);
              }}
              style={({ pressed }) => [
                styles.row,
                {
                  borderColor: colors.border,
                  backgroundColor: pressed
                    ? colors.goldMuted
                    : colors.primaryBackground,
                },
              ]}
            >
              <View
                style={[styles.iconWrap, { backgroundColor: colors.goldMuted }]}
              >
                <Ionicons
                  name={action.icon}
                  size={20}
                  color={colors.goldAccent}
                />
              </View>
              <View style={styles.copy}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>
                  {action.label}
                </Text>
                <Text
                  style={[styles.rowSubtitle, { color: colors.secondaryText }]}
                >
                  {action.subtitle}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={colors.secondaryText}
              />
            </Pressable>
          ))}
        </View>
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
    fontSize: 22,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    marginTop: 4,
    marginBottom: spacing.md,
  },
  list: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    padding: spacing.sm,
    minHeight: 64,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: 15,
  },
  rowSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
  },
});
