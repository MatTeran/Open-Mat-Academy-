import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';

import {
  Banner,
  Button,
  Input,
  Screen,
  Spacer,
  Text,
  BELT_STRIPE_COUNTS,
  type BeltStripeCount,
  type MemberDevelopmentBundle,
} from '@openmat/shared';

import { ChipRow } from '../../components/ui/Phase2Controls';
import { useMemberDevelopment } from '../../lib/providers/MemberDevelopmentProvider';
import type { MembersStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MembersStackParamList, 'AddStripe'>;

export function AddStripeScreen({ navigation, route }: Props) {
  const { getBundle, addStripe } = useMemberDevelopment();
  const [bundle, setBundle] = useState<MemberDevelopmentBundle | null>(null);
  const [toStripe, setToStripe] = useState<BeltStripeCount>(1);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void getBundle(route.params.memberId).then((next) => {
      setBundle(next);
      if (next) {
        const suggested = Math.min(4, next.development.stripes + 1) as BeltStripeCount;
        setToStripe(suggested);
      }
    });
  }, [getBundle, route.params.memberId]);

  if (!bundle) {
    return (
      <Screen>
        <Text variant="title">Loading…</Text>
      </Screen>
    );
  }

  const fromStripe = bundle.development.stripes;

  return (
    <Screen scroll keyboard>
      <Text variant="hero">Add Stripe</Text>
      <Text variant="body" muted>
        Official academy record — coach confirmation required.
      </Text>
      <Spacer size="lg" />

      {error ? (
        <>
          <Banner tone="error" message={error} />
          <Spacer size="sm" />
        </>
      ) : null}

      <Text variant="label">Current Stripe</Text>
      <Spacer size="xs" />
      <Text variant="subtitle">{fromStripe}</Text>

      <Spacer size="md" />
      <Text variant="label">New Stripe</Text>
      <Spacer size="xs" />
      <ChipRow
        options={BELT_STRIPE_COUNTS.filter((value) => value > fromStripe).map(
          String,
        )}
        value={String(toStripe)}
        onChange={(value) => setToStripe(Number(value) as BeltStripeCount)}
      />

      <Spacer size="md" />
      <Input
        label="Date"
        value={date}
        onChangeText={setDate}
        placeholder="YYYY-MM-DD"
      />
      <Spacer size="md" />
      <Input
        label="Coach"
        value="Current coach (signed in)"
        editable={false}
      />
      <Spacer size="md" />
      <Input
        label="Private Notes"
        value={notes}
        onChangeText={setNotes}
        placeholder="Optional observation…"
        multiline
      />

      <Spacer size="lg" />
      <Button
        label="Save Stripe"
        variant="primaryGold"
        loading={loading}
        disabled={toStripe <= fromStripe}
        onPress={async () => {
          setLoading(true);
          setError(null);
          try {
            await addStripe({
              memberId: route.params.memberId,
              fromStripe,
              toStripe,
              date,
              notes,
            });
            navigation.goBack();
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to save.');
          } finally {
            setLoading(false);
          }
        }}
      />
      <Spacer size="xl" />
    </Screen>
  );
}
