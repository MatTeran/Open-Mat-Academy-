import { Switch, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { spacing } from '../../lib/theme';
import { Text } from '../ui/Text';

interface SettingToggleRowProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
}

export function SettingToggleRow({
  label,
  description,
  value,
  onValueChange,
}: SettingToggleRowProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <Text variant="body">{label}</Text>
        {description ? (
          <Text variant="caption">{description}</Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.goldMuted }}
        thumbColor={value ? colors.goldAccent : colors.secondaryText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
});
