import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import { Text } from './Text';

type BannerTone = 'error' | 'success' | 'info';

export interface BannerProps {
  message: string;
  tone?: BannerTone;
}

/**
 * Inline feedback strip for forms — errors, success, and info.
 */
export function Banner({ message, tone = 'error' }: BannerProps) {
  const { colors } = useAppTheme();

  const toneStyle =
    tone === 'error'
      ? {
          backgroundColor: 'rgba(255, 77, 77, 0.12)',
          borderColor: 'rgba(255, 77, 77, 0.35)',
        }
      : tone === 'success'
        ? {
            backgroundColor: 'rgba(34, 197, 94, 0.12)',
            borderColor: 'rgba(34, 197, 94, 0.35)',
          }
        : {
            backgroundColor: colors.goldMuted,
            borderColor: 'rgba(45, 212, 191, 0.35)',
          };

  const textColor =
    tone === 'error'
      ? colors.error
      : tone === 'success'
        ? colors.success
        : colors.secondaryText;

  return (
    <View style={[styles.base, toneStyle]}>
      <Text variant="caption" style={[styles.text, { color: textColor }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
  },
  text: {
    lineHeight: 18,
  },
});
