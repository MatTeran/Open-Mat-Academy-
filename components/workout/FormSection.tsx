import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '../../lib/theme';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';

interface FormSectionProps extends PropsWithChildren {
  title: string;
}

export function FormSection({ title, children }: FormSectionProps) {
  return (
    <View style={styles.section}>
      <Text variant="subtitle">{title}</Text>
      <Spacer size="md" />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.xl,
  },
});
