import { StyleSheet, View } from 'react-native';

import {
  Card,
  IconBadge,
  Text,
  Spacer,
  spacing,
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
}

export function KpiCard({
  label,
  value,
  icon,
  tint,
  trendLabel,
  index = 0,
}: KpiCardProps) {
  return (
    <FadeInItem index={index} style={styles.wrap}>
      <Card elevated style={styles.card}>
        <IconBadge name={icon} tint={tint} />
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
      </Card>
    </FadeInItem>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '48.5%',
  },
  card: {
    minHeight: 132,
  },
  label: {
    marginTop: 2,
  },
  trend: {
    marginTop: spacing.xxs,
  },
});
