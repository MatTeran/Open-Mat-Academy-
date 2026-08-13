import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  Banner,
  Button,
  Card,
  NotificationPreferenceRow,
  Screen,
  Spacer,
  Text,
} from '../../components';
import { useNotifications } from '../../hooks';
import {
  CLASS_REMINDER_OPTIONS,
  type ClassReminderOffsetMinutes,
  type DevTestKind,
} from '../../lib/notifications';
import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import type { ProfileStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<
  ProfileStackParamList,
  'NotificationSettings'
>;

function SectionTitle({ label }: { label: string }) {
  return (
    <>
      <Text variant="subtitle">{label}</Text>
      <Spacer size="sm" />
    </>
  );
}

function Divider() {
  const { colors } = useAppTheme();
  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
}

export function NotificationSettingsScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const {
    preferences,
    updatePreferences,
    permissionStatus,
    enableNotifications,
    openSettings,
    runDevTest,
  } = useNotifications();

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const masterOff = !preferences.masterEnabled;

  const onToggle =
    (key: keyof typeof preferences) => (value: boolean) => {
      void updatePreferences({ [key]: value });
    };

  const setReminderOffset = (value: ClassReminderOffsetMinutes) => {
    void updatePreferences({ classReminderOffsetMinutes: value });
  };

  const handleEnable = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const result = await enableNotifications();
      setMessage(result.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDevTest = async (kind: DevTestKind) => {
    setMessage(null);
    await runDevTest(kind);
    setMessage('Test notification added to your inbox.');
  };

  return (
    <Screen scroll contentStyle={styles.content}>
      <Button label="Back" variant="ghost" onPress={() => navigation.goBack()} />
      <Spacer size="md" />
      <Text variant="hero">Notification Settings</Text>
      <Spacer size="sm" />
      <Text variant="bodyMuted">
        Control what My Gi can notify you about. Preferences save on this
        device first.
      </Text>

      <Spacer size="lg" />

      {message ? (
        <>
          <Banner message={message} tone="info" />
          <Spacer size="md" />
        </>
      ) : null}

      <Card>
        <NotificationPreferenceRow
          label="Master notifications"
          description="Turn off to pause all My Gi alerts."
          value={preferences.masterEnabled}
          onValueChange={onToggle('masterEnabled')}
        />
        <Divider />
        <NotificationPreferenceRow
          label="Quiet hours"
          description="Silence banners during your rest window."
          value={preferences.quietHoursEnabled}
          onValueChange={onToggle('quietHoursEnabled')}
          disabled={masterOff}
        />
        {preferences.quietHoursEnabled ? (
          <Text
            variant="caption"
            style={{ color: colors.secondaryText, marginTop: spacing.xs }}
          >
            Quiet hours {preferences.quietHoursStart} –{' '}
            {preferences.quietHoursEnd} (edit times in a future release).
          </Text>
        ) : null}
      </Card>

      <Spacer size="md" />

      <Card>
        <Text variant="body" style={{ marginBottom: spacing.sm }}>
          Device permission:{' '}
          <Text variant="body" style={{ color: colors.goldAccent }}>
            {permissionStatus}
          </Text>
        </Text>
        {permissionStatus === 'granted' ? (
          <Text variant="caption" style={{ color: colors.secondaryText }}>
            Notifications are enabled for this device.
          </Text>
        ) : permissionStatus === 'denied' ? (
          <Button
            label="Open Settings"
            variant="outlineGold"
            onPress={() => {
              void openSettings();
            }}
          />
        ) : (
          <Button
            label="Enable Notifications"
            variant="primaryGold"
            loading={busy}
            onPress={() => {
              void handleEnable();
            }}
          />
        )}
      </Card>

      <Spacer size="xl" />
      <SectionTitle label="Training" />
      <Card>
        <NotificationPreferenceRow
          label="Class reminders"
          description="Before reserved classes start."
          value={preferences.classReminders}
          onValueChange={onToggle('classReminders')}
          disabled={masterOff}
        />
        <Divider />
        <NotificationPreferenceRow
          label="Reservation updates"
          description="Confirmations and cancellations."
          value={preferences.reservationUpdates}
          onValueChange={onToggle('reservationUpdates')}
          disabled={masterOff}
        />
        <Divider />
        <NotificationPreferenceRow
          label="Waitlist openings"
          description="When a spot frees up in a waitlisted class."
          value={preferences.waitlistOpenings}
          onValueChange={onToggle('waitlistOpenings')}
          disabled={masterOff}
        />
        <Divider />
        <NotificationPreferenceRow
          label="Schedule changes"
          description="Time or location updates."
          value={preferences.scheduleChanges}
          onValueChange={onToggle('scheduleChanges')}
          disabled={masterOff}
        />
      </Card>

      <Spacer size="md" />
      <Text variant="caption" style={{ color: colors.secondaryText }}>
        Class reminder timing
      </Text>
      <Spacer size="sm" />
      <View style={styles.offsetRow}>
        {CLASS_REMINDER_OPTIONS.map((option) => {
          const selected =
            preferences.classReminderOffsetMinutes === option.value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={option.label}
              disabled={masterOff || !preferences.classReminders}
              onPress={() => setReminderOffset(option.value)}
              style={({ pressed }) => [pressed && styles.pressed]}
            >
              <View
                style={[
                  styles.offsetChip,
                  {
                    borderColor: selected ? colors.goldAccent : colors.border,
                    backgroundColor: selected
                      ? colors.goldMuted
                      : colors.elevatedSurface,
                  },
                ]}
              >
                <Text
                  variant="caption"
                  style={{
                    color: selected ? colors.goldAccent : colors.text,
                  }}
                >
                  {option.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <Spacer size="xl" />
      <SectionTitle label="Journey" />
      <Card>
        <NotificationPreferenceRow
          label="XP and achievements"
          value={preferences.xpAndAchievements}
          onValueChange={onToggle('xpAndAchievements')}
          disabled={masterOff}
        />
        <Divider />
        <NotificationPreferenceRow
          label="Weekly goal progress"
          value={preferences.weeklyGoalProgress}
          onValueChange={onToggle('weeklyGoalProgress')}
          disabled={masterOff}
        />
        <Divider />
        <NotificationPreferenceRow
          label="Streak reminders"
          description="Only when you opt in — never automatic guilt pings."
          value={preferences.streakReminders}
          onValueChange={onToggle('streakReminders')}
          disabled={masterOff}
        />
        <Divider />
        <NotificationPreferenceRow
          label="Monthly challenges"
          value={preferences.monthlyChallenges}
          onValueChange={onToggle('monthlyChallenges')}
          disabled={masterOff}
        />
      </Card>

      <Spacer size="xl" />
      <SectionTitle label="Academy" />
      <Card>
        <NotificationPreferenceRow
          label="Coach announcements"
          value={preferences.coachAnnouncements}
          onValueChange={onToggle('coachAnnouncements')}
          disabled={masterOff}
        />
        <Divider />
        <NotificationPreferenceRow
          label="Events and seminars"
          value={preferences.eventsAndSeminars}
          onValueChange={onToggle('eventsAndSeminars')}
          disabled={masterOff}
        />
        <Divider />
        <NotificationPreferenceRow
          label="Academy media"
          value={preferences.academyMedia}
          onValueChange={onToggle('academyMedia')}
          disabled={masterOff}
        />
      </Card>

      <Spacer size="xl" />
      <SectionTitle label="Competition" />
      <Card>
        <NotificationPreferenceRow
          label="Competition countdowns"
          value={preferences.competitionCountdowns}
          onValueChange={onToggle('competitionCountdowns')}
          disabled={masterOff}
        />
        <Divider />
        <NotificationPreferenceRow
          label="Registration deadlines"
          value={preferences.registrationDeadlines}
          onValueChange={onToggle('registrationDeadlines')}
          disabled={masterOff}
        />
        <Divider />
        <NotificationPreferenceRow
          label="Match-day reminders"
          value={preferences.matchDayReminders}
          onValueChange={onToggle('matchDayReminders')}
          disabled={masterOff}
        />
      </Card>

      <Spacer size="xl" />
      <SectionTitle label="Recovery" />
      <Card>
        <NotificationPreferenceRow
          label="Recovery suggestions"
          value={preferences.recoverySuggestions}
          onValueChange={onToggle('recoverySuggestions')}
          disabled={masterOff}
        />
        <Divider />
        <NotificationPreferenceRow
          label="Hydration and stretching"
          value={preferences.hydrationAndStretching}
          onValueChange={onToggle('hydrationAndStretching')}
          disabled={masterOff}
        />
      </Card>

      {__DEV__ ? (
        <>
          <Spacer size="xl" />
          <SectionTitle label="Developer tests" />
          <Card>
            <Text
              variant="caption"
              style={{ color: colors.secondaryText, marginBottom: spacing.sm }}
            >
              Local / mock only — does not prove remote Expo Push delivery.
            </Text>
            {(
              [
                ['class_reminder', 'Test Class Reminder'],
                ['waitlist', 'Test Waitlist Opening'],
                ['achievement', 'Test Achievement'],
                ['weekly_goal', 'Test Weekly Goal'],
                ['academy', 'Test Academy Announcement'],
                ['competition', 'Test Competition Reminder'],
              ] as Array<[DevTestKind, string]>
            ).map(([kind, label], index, arr) => (
              <View key={kind}>
                <Button
                  label={label}
                  variant="secondary"
                  onPress={() => {
                    void handleDevTest(kind);
                  }}
                />
                {index < arr.length - 1 ? <Spacer size="sm" /> : null}
              </View>
            ))}
          </Card>
        </>
      ) : null}

      <View style={styles.bottomSpace} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {},
  divider: {
    height: 1,
    marginVertical: spacing.xs,
  },
  offsetRow: {
    gap: spacing.sm,
  },
  offsetChip: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.9,
  },
  bottomSpace: {
    height: spacing.xl,
  },
});
