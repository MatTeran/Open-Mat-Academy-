import { StyleSheet } from 'react-native';

import { spacing } from '../../lib/theme';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';

interface ProfileSectionHeaderProps {
  title: string;
}

export function ProfileSectionHeader({ title }: ProfileSectionHeaderProps) {
  return (
    <>
      <Text variant="label" style={styles.title}>
        {title}
      </Text>
      <Spacer size="sm" />
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    letterSpacing: 1.1,
    marginLeft: spacing.xxs,
  },
});
