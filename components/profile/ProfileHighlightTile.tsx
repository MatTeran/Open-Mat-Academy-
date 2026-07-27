import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import { Text } from '../ui/Text';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface ProfileHighlightTileProps {
  label: string;
  title: string;
  subtitle?: string;
  icon: IconName;
  onPress: () => void;
  media?: ReactNode;
}

export function ProfileHighlightTile({
  label,
  title,
  subtitle,
  icon,
  onPress,
  media,
}: ProfileHighlightTileProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${title}`}
      onPress={onPress}
      style={({ pressed }) => [{ flex: 1 }, pressed && styles.pressed]}
    >
      <View
        style={[
          styles.tile,
          {
            backgroundColor: colors.secondaryBackground,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.header}>
          <Text variant="caption" style={{ color: colors.goldAccent }}>
            {label}
          </Text>
          <Ionicons name={icon} size={16} color={colors.goldAccent} />
        </View>

        {media ? <View style={styles.media}>{media}</View> : null}

        <Text
          variant="subtitle"
          numberOfLines={1}
          style={[styles.title, { color: colors.text }]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            variant="caption"
            numberOfLines={2}
            style={[styles.subtitle, { color: colors.secondaryText }]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.92,
  },
  tile: {
    minHeight: 132,
    borderRadius: radii.xl,
    borderWidth: 1,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  media: {
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 17,
  },
  subtitle: {
    marginTop: 4,
    lineHeight: 18,
  },
});
