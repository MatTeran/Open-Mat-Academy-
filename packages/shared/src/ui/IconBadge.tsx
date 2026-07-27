import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

import { radii } from '../theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

export interface IconBadgeProps {
  name: IconName;
  tint: string;
  size?: number;
}

/** Vibrant icon container — preferred over colorful page backgrounds. */
export function IconBadge({ name, tint, size = 20 }: IconBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: `${tint}22` }]}>
      <Ionicons name={name} size={size} color={tint} />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export type { IconName };
