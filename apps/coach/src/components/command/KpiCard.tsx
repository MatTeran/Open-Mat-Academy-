import { Pressable, StyleSheet, View } from 'react-native';

import {
  Card,
  IconBadge,
  Text,
  Spacer,
  spacing,
  useAppTheme,
  type IconName,
} from '@openmat/shared';

import { FadeInItem } from '../ui/Motion';

interface KpiCardProps {
  label: string;
  value: string;
  icon: IconName;
  tint: string;
  trendLabel?: string;
  index?: number;
  onPress?: () => void;
}

export function KpiCard({
  label,
  value,
  icon,
  tint,
  trendLabel,
  index = 0,
  onPress,
}: KpiCardProps) {
  const { colors } = useAppTheme();

  return (
    <FadeInItem index={index} style={styles.wrap}>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityHint={onPress ? 'Opens detailed insights' : undefined}
        style={({ pressed }) => [
          styles.pressable,
          pressed && onPress ? styles.pressed : null,
        ]}
      >
        <Card elevated style={styles.card}>
          <View style={styles.top}>
            <IconBadge name={icon} tint={tint} />
            {onPress ? (
              <Text variant="caption" gold>
                View
              </Text>
            ) : null}
          </View>
          <Spacer size="sm" />
          <Text variant="title">{value}</Text>
          <Text variant="caption" muted style={styles.label}>
            {label}
          </Text>
          {trendLabel ? (
            <Text variant="caption" gold style={styles.trend}>
              {trendLabel}
            </Text>
          ) : null}
          {onPress ? (
            <Text
              variant="caption"
              muted
              style={[styles.trend, { color: colors.secondaryText }]}
            >
              Tap for insights
            </Text>
          ) : null}
        </Card>
      </Pressable>
    </FadeInItem>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '48.5%',
  },
  pressable: {
    width: '100%',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  card: {
    minHeight: 132,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    marginTop: 2,
  },
  trend: {
    marginTop: spacing.xxs,
  },
});
