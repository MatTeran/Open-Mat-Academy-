import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { spacing } from '../../lib/theme';
import { SettingToggleRow } from '../profile/SettingToggleRow';
import { Text } from '../ui/Text';

interface NotificationPreferenceRowProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
  disabled?: boolean;
}

/**
 * Preference row with accessible labels for VoiceOver / TalkBack.
 */
export function NotificationPreferenceRow({
  label,
  description,
  value,
  onValueChange,
  disabled = false,
}: NotificationPreferenceRowProps) {
  const { colors } = useAppTheme();

  return (
    <View
      accessible
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityHint={description}
      accessibilityState={{ checked: value, disabled }}
      style={[styles.wrap, disabled && styles.disabled]}
      pointerEvents={disabled ? 'none' : 'auto'}
    >
      <SettingToggleRow
        label={label}
        description={description}
        value={value}
        onValueChange={onValueChange}
      />
      {disabled ? (
        <Text variant="caption" style={{ color: colors.secondaryText }}>
          Turn on master notifications to edit this.
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs,
  },
  disabled: {
    opacity: 0.55,
  },
});
