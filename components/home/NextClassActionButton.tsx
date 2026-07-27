import { StyleSheet, ViewStyle } from 'react-native';

import type { NextClassReservationStatus } from '../../types/home';
import { Button, type ButtonVariant } from '../ui/Button';

interface NextClassActionButtonProps {
  status: NextClassReservationStatus;
  classTitle: string;
  onPress: () => void;
  loading?: boolean;
  style?: ViewStyle;
}

function resolvePresentation(status: NextClassReservationStatus): {
  label: string;
  loadingLabel: string;
  variant: ButtonVariant;
  disabled: boolean;
} {
  switch (status) {
    case 'reserved':
      return {
        label: 'Reserved',
        loadingLabel: 'Reserving...',
        variant: 'reserved',
        disabled: true,
      };
    case 'check_in':
      return {
        label: 'Check In',
        loadingLabel: 'Checking in...',
        variant: 'primaryGold',
        disabled: false,
      };
    case 'checked_in':
      return {
        label: 'Checked In',
        loadingLabel: 'Checking in...',
        variant: 'reserved',
        disabled: true,
      };
    case 'class_full':
      return {
        label: 'Join Waitlist',
        loadingLabel: 'Joining...',
        variant: 'outlineGold',
        disabled: false,
      };
    default:
      return {
        label: 'Reserve Spot',
        loadingLabel: 'Reserving...',
        variant: 'primaryGold',
        disabled: false,
      };
  }
}

export function NextClassActionButton({
  status,
  classTitle,
  onPress,
  loading = false,
  style,
}: NextClassActionButtonProps) {
  const presentation = resolvePresentation(status);
  const accessibilityLabel =
    status === 'available'
      ? `Reserve spot in ${classTitle}`
      : status === 'check_in'
        ? `Check in to ${classTitle}`
        : status === 'class_full'
          ? `Join waitlist for ${classTitle}`
          : `${presentation.label} for ${classTitle}`;

  return (
    <Button
      label={presentation.label}
      loadingLabel={presentation.loadingLabel}
      variant={presentation.variant}
      loading={loading}
      disabled={presentation.disabled}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={
        status === 'available'
          ? 'Reserves your spot for this class. Mock reservation only.'
          : status === 'check_in'
            ? 'Checks you into this class and awards experience points.'
            : status === 'class_full'
              ? 'Adds you to the waitlist for this class. Mock action only.'
              : undefined
      }
      style={[styles.button, style]}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
  },
});
