import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';

import {
  Button,
  FamilyMemberCard,
  Screen,
  Spacer,
  Text,
} from '../../components';
import { useProfile } from '../../lib/providers/ProfileProvider';
import { spacing } from '../../lib/theme';
import type { ProfileStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<ProfileStackParamList, 'LinkedFamily'>;

export function LinkedFamilyScreen({ navigation }: Props) {
  const { hub, unlinkFamilyMember, addFamilyMember } = useProfile();

  return (
    <Screen scroll contentStyle={styles.content}>
      <Button label="Back" variant="ghost" onPress={() => navigation.goBack()} />
      <Spacer size="md" />
      <Text variant="hero">Linked Family</Text>
      <Spacer size="sm" />
      <Text variant="bodyMuted">
        Manage family members under your membership.
      </Text>

      <Spacer size="xl" />

      {hub.familyMembers.length === 0 ? (
        <Text variant="bodyMuted">No family members linked yet.</Text>
      ) : (
        <View style={styles.list}>
          {hub.familyMembers.map((member) => (
            <FamilyMemberCard
              key={member.id}
              member={member}
              onUnlink={() => unlinkFamilyMember(member.id)}
            />
          ))}
        </View>
      )}

      <Spacer size="xl" />
      <Button
        label="Link family member"
        onPress={() =>
          addFamilyMember({
            fullName: 'New Athlete',
            relationship: 'Family',
            belt: 'white',
            stripes: 0,
            membershipPlan: 'Kids Program',
          })
        }
      />
      <Spacer size="md" />
      <Text variant="caption">
        Invite links and guardian approvals will land with the membership
        backend.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {},
  list: {
    gap: spacing.md,
  },
});
