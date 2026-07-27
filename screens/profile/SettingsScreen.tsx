import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  AppearanceSelector,
  Button,
  Card,
  Screen,
  SettingToggleRow,
  Spacer,
  Text,
} from '../../components';
import { useAppTheme } from '../../hooks';
import { useProfile } from '../../lib/providers/ProfileProvider';
import { radii, spacing } from '../../lib/theme';
import type { ProfileStackParamList } from '../../types/navigation';
import type { MeasurementUnits } from '../../types/profile';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Settings'>;

const UNITS: MeasurementUnits[] = ['imperial', 'metric'];

export function SettingsScreen({ navigation }: Props) {
  const { hub, updateSettings } = useProfile();
  const { settings } = hub;
  const { colors, preference, setPreference, colorScheme } = useAppTheme();

  return (
    <Screen scroll contentStyle={styles.content}>
      <Button label="Back" variant="ghost" onPress={() => navigation.goBack()} />
      <Spacer size="md" />
      <Text variant="hero">Settings</Text>
      <Spacer size="sm" />
      <Text variant="bodyMuted">App preferences for your account.</Text>

      <Spacer size="xl" />

      <Text variant="subtitle">Appearance</Text>
      <Spacer size="xs" />
      <Text variant="caption" style={{ color: colors.secondaryText }}>
        Currently using {colorScheme === 'dark' ? 'Dark' : 'Light'} mode
        {preference === 'system' ? ' (from device)' : ''}.
      </Text>
      <Spacer size="sm" />
      <AppearanceSelector
        value={preference}
        onChange={(next) => {
          void setPreference(next);
        }}
      />

      <Spacer size="xl" />

      <Card>
        <SettingToggleRow
          label="Check-in reminders"
          description="Nudge before your next reserved class."
          value={settings.checkInReminders}
          onValueChange={(checkInReminders) =>
            updateSettings({ checkInReminders })
          }
        />
        <View
          style={[styles.divider, { backgroundColor: colors.border }]}
        />
        <SettingToggleRow
          label="Share activity"
          description="Show recent training in Community highlights."
          value={settings.shareActivity}
          onValueChange={(shareActivity) => updateSettings({ shareActivity })}
        />
      </Card>

      <Spacer size="xl" />
      <Text variant="subtitle">Units</Text>
      <Spacer size="sm" />
      <View style={styles.chipRow}>
        {UNITS.map((option) => {
          const selected = option === settings.units;
          return (
            <Pressable
              key={option}
              onPress={() => updateSettings({ units: option })}
              style={({ pressed }) => [pressed && styles.pressed]}
            >
              <View
                style={[
                  styles.chip,
                  {
                    borderColor: selected ? colors.goldAccent : colors.border,
                    backgroundColor: selected
                      ? colors.goldMuted
                      : colors.secondaryBackground,
                  },
                ]}
              >
                <Text
                  variant="caption"
                  style={{
                    color: selected ? colors.goldAccent : colors.text,
                  }}
                >
                  {option === 'imperial' ? 'Imperial' : 'Metric'}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {},
  divider: {
    height: 1,
    marginVertical: spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  pressed: {
    opacity: 0.9,
  },
});
