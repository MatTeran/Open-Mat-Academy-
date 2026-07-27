import { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Text, radii, spacing, useAppTheme } from '@openmat/shared';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
}: SectionHeaderProps) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.header}>
      <View style={styles.headerCopy}>
        <Text variant="subtitle">{title}</Text>
        {subtitle ? (
          <Text variant="caption" muted>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text variant="caption" gold>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function FadeInItem({
  children,
  index = 0,
  style,
}: PropsWithChildren<{ index?: number; style?: StyleProp<ViewStyle> }>) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).springify()}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

export function FadeInHero({ children }: PropsWithChildren) {
  return <Animated.View entering={FadeInUp.springify()}>{children}</Animated.View>;
}

export function PressScale({
  children,
  onPress,
}: PropsWithChildren<{ onPress?: () => void }>) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.98);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
    >
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Pressable>
  );
}

export function StatusPill({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <View style={[styles.pill, { backgroundColor: `${color}22` }]}>
      <Text variant="caption" style={{ color }}>
        {label}
      </Text>
    </View>
  );
}

export function EmptyState({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const { colors } = useAppTheme();
  return (
    <View
      style={[
        styles.empty,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        },
      ]}
    >
      <Text variant="subtitle">{title}</Text>
      <Text variant="caption" muted>
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  headerCopy: {
    flex: 1,
    gap: spacing.xxs,
  },
  pill: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  empty: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
});
