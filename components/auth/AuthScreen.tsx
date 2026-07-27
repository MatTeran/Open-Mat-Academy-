import { PropsWithChildren, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '../../lib/theme';
import { Screen } from '../ui/Screen';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';

interface AuthScreenProps extends PropsWithChildren {
  title: string;
  subtitle: string;
  brand?: boolean;
  footer?: ReactNode;
}

/**
 * Shared auth layout — brand, headline, form body, sticky actions.
 */
export function AuthScreen({
  title,
  subtitle,
  brand = false,
  footer,
  children,
}: AuthScreenProps) {
  return (
    <Screen scroll keyboard contentStyle={styles.content}>
      <View>
        <View style={styles.header}>
          <Text variant={brand ? 'brand' : 'hero'} gold={brand}>
            {title}
          </Text>
          <Spacer size="sm" />
          <Text variant="bodyMuted">{subtitle}</Text>
        </View>
        {children}
      </View>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'space-between',
    paddingBottom: spacing.xl,
  },
  header: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  footer: {
    marginTop: spacing.lg,
  },
});
