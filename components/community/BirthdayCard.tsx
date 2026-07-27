import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { spacing } from '../../lib/theme';
import type { MemberBirthday } from '../../types/community';
import { Card } from '../ui/Card';
import { Text } from '../ui/Text';

interface BirthdayCardProps {
  birthdays: MemberBirthday[];
}

export function BirthdayCard({ birthdays }: BirthdayCardProps) {
  const { colors } = useAppTheme();

  return (
    <Card padded={false}>
      {birthdays.map((person, index) => (
        <View
          key={person.id}
          style={[
            styles.row,
            index < birthdays.length - 1 && {
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <View
            style={[styles.avatar, { backgroundColor: colors.goldMuted }]}
          >
            <Text variant="subtitle" gold>
              {person.name.charAt(0)}
            </Text>
          </View>
          <View style={styles.copy}>
            <Text variant="body">{person.name}</Text>
            <Text variant="caption">
              {person.dateLabel}
              {person.belt ? ` · ${person.belt} Belt` : ''}
            </Text>
          </View>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
});
