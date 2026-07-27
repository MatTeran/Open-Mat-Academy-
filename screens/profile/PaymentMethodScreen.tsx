import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';

import { Banner, Button, Card, Screen, Spacer, Text } from '../../components';
import { useProfile } from '../../lib/providers/ProfileProvider';
import { radii, spacing } from '../../lib/theme';
import { useThemedStyles } from '../../lib/theme/useThemedStyles';
import type { ProfileStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<ProfileStackParamList, 'PaymentMethod'>;

export function PaymentMethodScreen({ navigation }: Props) {
  const { hub, setPaymentMethod } = useProfile();
  const method = hub.paymentMethod;

  const styles = useThemedStyles((colors) => ({
    content: {},
    actions: {
      gap: spacing.sm,
    },
    note: {
      borderRadius: radii.md,
      backgroundColor: colors.secondaryBackground,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
    },
  }));

  return (
    <Screen scroll contentStyle={styles.content}>
      <Button label="Back" variant="ghost" onPress={() => navigation.goBack()} />
      <Spacer size="md" />
      <Text variant="hero">Payment Method</Text>
      <Spacer size="sm" />
      <Text variant="bodyMuted">Card on file for membership billing.</Text>

      <Spacer size="xl" />

      {method ? (
        <Card>
          <Text variant="caption" gold>
            Default
          </Text>
          <Spacer size="xs" />
          <Text variant="subtitle">
            {method.brand} ···· {method.last4}
          </Text>
          <Spacer size="sm" />
          <Text variant="caption">
            Expires {String(method.expMonth).padStart(2, '0')}/{method.expYear}
          </Text>
          <Spacer size="lg" />
          <View style={styles.actions}>
            <Button
              label="Replace card"
              onPress={() =>
                setPaymentMethod({
                  ...method,
                  brand: 'Mastercard',
                  last4: '4444',
                  expMonth: 12,
                  expYear: 2029,
                })
              }
            />
            <Button
              label="Remove"
              variant="secondary"
              onPress={() => setPaymentMethod(null)}
            />
          </View>
        </Card>
      ) : (
        <>
          <Banner message="No payment method on file." />
          <Spacer size="lg" />
          <Button
            label="Add card"
            onPress={() =>
              setPaymentMethod({
                id: `pm-${Date.now()}`,
                brand: 'Visa',
                last4: '4242',
                expMonth: 9,
                expYear: 2028,
                isDefault: true,
              })
            }
          />
        </>
      )}

      <Spacer size="lg" />
      <View style={styles.note}>
        <Text variant="caption">
          Stripe PaymentSheet wiring lives in services stubs and will replace
          this mock flow.
        </Text>
      </View>
    </Screen>
  );
}
