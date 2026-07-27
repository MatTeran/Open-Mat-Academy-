import { StyleSheet, View } from 'react-native';

import {
  formatBeltRank,
  formatStripeCount,
} from '../../lib/mocks/profile';
import { spacing } from '../../lib/theme';
import type { FamilyMember } from '../../types/profile';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';
import { BeltBadge } from './BeltBadge';

interface FamilyMemberCardProps {
  member: FamilyMember;
  onUnlink: () => void;
}

export function FamilyMemberCard({ member, onUnlink }: FamilyMemberCardProps) {
  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.copy}>
          <Text variant="subtitle">{member.fullName}</Text>
          <Text variant="caption">{member.relationship}</Text>
        </View>
        <Text variant="caption" gold>
          {member.membershipPlan}
        </Text>
      </View>
      <Spacer size="md" />
      <BeltBadge belt={member.belt} stripes={member.stripes} />
      <Spacer size="sm" />
      <Text variant="caption">
        {formatBeltRank(member.belt)} · {formatStripeCount(member.stripes)}
      </Text>
      <Spacer size="md" />
      <Button label="Unlink" variant="ghost" onPress={onUnlink} />
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
});
