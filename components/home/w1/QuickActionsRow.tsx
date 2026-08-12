import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { useAppTheme } from '../../../lib/providers/ThemeProvider';
import { fontFamilies, spacing, w1Radii, w1Shadow } from '../../../lib/theme';
import type { QuickAction, QuickActionId } from '../../../types/home';
import { SectionLabel } from './SectionLabel';

interface QuickActionsRowProps {
  actions: QuickAction[];
  onAction: (id: QuickActionId) => void;
}

export function QuickActionsRow({ actions, onAction }: QuickActionsRowProps) {
  const { colors } = useAppTheme();
  const items = actions.slice(0, 4);

  return (
    <View>
      <SectionLabel style={styles.sectionLabel}>Quick Actions</SectionLabel>
      <View style={styles.row}>
        {items.map((action) => (
          <Pressable
            key={action.id}
            accessibilityRole="button"
            accessibilityLabel={action.label}
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onAction(action.id);
            }}
            style={({ pressed }) => [
              styles.tile,
              w1Shadow.card,
              {
                backgroundColor: colors.cardBackground,
                borderColor: 'rgba(28, 26, 23, 0.05)',
                opacity: pressed ? 0.92 : 1,
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
            <Text
              style={[styles.label, { color: colors.text }]}
              numberOfLines={2}
            >
              {action.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tile: {
    flex: 1,
    minHeight: 96,
    borderRadius: w1Radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: w1Radii.control,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fontFamilies.semibold,
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
  },
});
