import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';

import { Button, Card, Screen, Spacer, Text } from '../../components';
import {
  formatMembershipPlan,
  formatMembershipStatus,
} from '../../lib/mocks/profile';
import { useProfile } from '../../lib/providers/ProfileProvider';
import { radii, spacing } from '../../lib/theme';
import { useThemedStyles } from '../../lib/theme/useThemedStyles';
import type { ProfileStackParamList } from '../../types/navigation';
import { formatShortDate } from '../../utils';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Membership'>;

export function MembershipScreen({ navigation }: Props) {
  const { hub } = useProfile();
  const { membership } = hub;

  const styles = useThemedStyles((colors) => ({
    content: {},
    statusPill: {
      alignSelf: 'flex-start' as const,
      backgroundColor: colors.goldMuted,
      borderRadius: radii.pill,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
    },
    statusText: {
      color: colors.goldAccent,
    },
    detailRow: {
      paddingVertical: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: 4,
    },
  }));

  return (
    <Screen scroll contentStyle={styles.content}>
      <Button label="Back" variant="ghost" onPress={() => navigation.goBack()} />
      <Spacer size="md" />
      <Text variant="hero">Membership</Text>
      <Spacer size="sm" />
      <Text variant="bodyMuted">Your My Gi membership details.</Text>

      <Spacer size="xl" />

      <Card>
        <Text variant="caption" gold>
          {membership.academyName}
        </Text>
        <Spacer size="xs" />
        <Text variant="title">{formatMembershipPlan(membership.plan)}</Text>
        <Spacer size="sm" />
        <View style={styles.statusPill}>
          <Text variant="caption" style={styles.statusText}>
            {formatMembershipStatus(membership.status)}
          </Text>
        </View>
        <Spacer size="lg" />
        <View style={styles.detailRow}>
          <Text variant="caption">Price</Text>
          <Text variant="body">{membership.priceLabel}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text variant="caption">Member since</Text>
          <Text variant="body">{formatShortDate(membership.memberSince)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text variant="caption">Renews on</Text>
          <Text variant="body">{formatShortDate(membership.renewsOn)}</Text>
        </View>
      </Card>

      <Spacer size="lg" />
      <Text variant="caption">
        Billing changes and plan upgrades will connect to Stripe in a later
        release.
      </Text>
    </Screen>
  );
}
