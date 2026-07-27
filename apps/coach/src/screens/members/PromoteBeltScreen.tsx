import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Banner,
  Button,
  Input,
  Screen,
  Spacer,
  Text,
  BELT_RANKS,
  type BeltRank,
  type MemberDevelopmentBundle,
} from '@openmat/shared';

import {
  ChipRow,
  ToggleChip,
} from '../../components/ui/Phase2Controls';
import { useMemberDevelopment } from '../../lib/providers/MemberDevelopmentProvider';
import type { MembersStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MembersStackParamList, 'PromoteBelt'>;

export function PromoteBeltScreen({ navigation, route }: Props) {
  const { getBundle, promoteBelt } = useMemberDevelopment();
  const [bundle, setBundle] = useState<MemberDevelopmentBundle | null>(null);
  const [toBelt, setToBelt] = useState<BeltRank>('blue');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [notifyMember, setNotifyMember] = useState(true);
  const [createAchievement, setCreateAchievement] = useState(true);
  const [postToCommunity, setPostToCommunity] = useState(false);
  const [generateShareCard, setGenerateShareCard] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void getBundle(route.params.memberId).then((next) => {
      setBundle(next);
      if (next) {
        const index = BELT_RANKS.indexOf(next.development.belt);
        const suggested =
          index >= 0 && index < BELT_RANKS.length - 1
            ? BELT_RANKS[index + 1]
            : next.development.belt;
        setToBelt(suggested);
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

  const fromBelt = bundle.development.belt;

  return (
    <Screen scroll keyboard>
      <Text variant="hero">Promote Belt</Text>
      <Text variant="body" muted>
        A coach must confirm every promotion. Open Mat never auto-promotes.
      </Text>
      <Spacer size="lg" />

      {error ? (
        <>
          <Banner tone="error" message={error} />
          <Spacer size="sm" />
        </>
      ) : null}

      <Text variant="label">Current Belt</Text>
      <Spacer size="xs" />
      <Text variant="subtitle">
        {fromBelt.charAt(0).toUpperCase() + fromBelt.slice(1)}
      </Text>

      <Spacer size="md" />
      <Text variant="label">New Belt</Text>
      <Spacer size="xs" />
      <ChipRow
        options={BELT_RANKS.filter((belt) => belt !== fromBelt)}
        value={toBelt}
        onChange={setToBelt}
        labelFor={(belt) => belt.charAt(0).toUpperCase() + belt.slice(1)}
      />

      <Spacer size="md" />
      <Input
        label="Promotion Date"
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
        label="Optional Notes"
        value={notes}
        onChangeText={setNotes}
        placeholder="Ceremony notes…"
        multiline
      />

      <Spacer size="lg" />
      <Text variant="label">Options</Text>
      <Spacer size="sm" />
      <View style={styles.options}>
        <ToggleChip
          label="Notify Member"
          active={notifyMember}
          onPress={() => setNotifyMember((value) => !value)}
        />
        <ToggleChip
          label="Create Achievement"
          active={createAchievement}
          onPress={() => setCreateAchievement((value) => !value)}
        />
        <ToggleChip
          label="Post to Community"
          active={postToCommunity}
          onPress={() => setPostToCommunity((value) => !value)}
        />
        <ToggleChip
          label="Generate Share Card (future)"
          active={generateShareCard}
          onPress={() => setGenerateShareCard((value) => !value)}
        />
      </View>

      <Spacer size="lg" />
      <Button
        label="Confirm Promotion"
        variant="primaryGold"
        loading={loading}
        onPress={async () => {
          setLoading(true);
          setError(null);
          try {
            await promoteBelt({
              memberId: route.params.memberId,
              fromBelt,
              toBelt,
              date,
              notes,
              notifyMember,
              createAchievement,
              postToCommunity,
              generateShareCard,
            });
            navigation.goBack();
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to promote.');
          } finally {
            setLoading(false);
          }
        }}
      />
      <Spacer size="xl" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  options: {
    gap: 10,
  },
});
