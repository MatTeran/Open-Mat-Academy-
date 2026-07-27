import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import { Text } from '../ui/Text';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface ProfileMenuRowProps {
  icon: IconName;
  label: string;
  value?: string;
  onPress: () => void;
  showDivider?: boolean;
  /** @deprecated Icons are gold by default for readability. */
  accent?: boolean;
}

/**
 * Horizontal settings row.
 * Layout styles live on an inner View — NativeWind can drop flexDirection on Pressable.
 */
export function ProfileMenuRow({
  icon,
  label,
  value,
  onPress,
  showDivider = false,
}: ProfileMenuRowProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.shell}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={value ? `${label}, ${value}` : label}
        onPress={onPress}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        <View style={styles.row}>
          <View
            style={[
              styles.iconWrap,
              { backgroundColor: colors.goldMuted },
            ]}
          >
            <Ionicons name={icon} size={18} color={colors.goldAccent} />
          </View>

          <View style={styles.copy}>
            <Text
              variant="body"
              numberOfLines={1}
              style={{ color: colors.text }}
            >
              {label}
            </Text>
            {value ? (
              <Text
                variant="caption"
                numberOfLines={1}
                style={{ color: colors.secondaryText, marginTop: 2 }}
              >
                {value}
              </Text>
            ) : null}
          </View>

          <View style={styles.chevron}>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.secondaryText}
            />
          </View>
        </View>
      </Pressable>
      {showDivider ? (
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: '100%',
  },
  pressed: {
    opacity: 0.88,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 64,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    paddingRight: spacing.sm,
  },
  chevron: {
    marginLeft: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: spacing.md + 36 + spacing.md,
  },
});
