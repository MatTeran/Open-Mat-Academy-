import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';

import {
  Banner,
  Button,
  Input,
  Screen,
  Spacer,
  Text,
  type ChallengeKind,
  type ChallengePeriod,
  type ChallengeStatus,
  type CreateChallengeInput,
} from '@openmat/shared';

import {
  ChipRow,
  ToggleChip,
} from '../../components/ui/Phase2Controls';
import { usePhase2Data } from '../../lib/providers/Phase2DataProvider';
import type { MoreStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MoreStackParamList, 'ChallengeForm'>;

const KINDS: ChallengeKind[] = [
  'attendance',
  'competition',
  'open_mat',
  'kids',
  'womens',
  'custom',
];

const PERIODS: ChallengePeriod[] = ['weekly', 'monthly'];
const STATUSES: ChallengeStatus[] = ['draft', 'active', 'completed', 'archived'];

function splitComma(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function ChallengeFormScreen({ navigation, route }: Props) {
  const { challenges, createChallenge, updateChallenge } = usePhase2Data();
  const existing = challenges.find(
    (item) => item.id === route.params?.challengeId,
  );

  const [name, setName] = useState(existing?.name ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [kind, setKind] = useState<ChallengeKind>(
    existing?.kind ?? 'attendance',
  );
  const [period, setPeriod] = useState<ChallengePeriod>(
    existing?.period ?? 'weekly',
  );
  const [status, setStatus] = useState<ChallengeStatus>(
    existing?.status ?? 'draft',
  );
  const [xpReward, setXpReward] = useState(
    String(existing?.xpReward ?? 250),
  );
  const [badgeName, setBadgeName] = useState(existing?.badgeName ?? '');
  const [startDate, setStartDate] = useState(
    existing?.startDate ?? new Date().toISOString().slice(0, 10),
  );
  const [endDate, setEndDate] = useState(existing?.endDate ?? '');
  const [eligibleAll, setEligibleAll] = useState(
    existing?.eligibleMemberIds === undefined ||
      existing?.eligibleMemberIds === 'all',
  );
  const [eligibleMemberIds, setEligibleMemberIds] = useState(
    Array.isArray(existing?.eligibleMemberIds)
      ? existing.eligibleMemberIds.join(', ')
      : '',
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const payload = useMemo<CreateChallengeInput>(
    () => ({
      name,
      description,
      kind,
      period,
      xpReward: Number(xpReward) || 0,
      badgeId: badgeName.trim()
        ? `badge-${badgeName.trim().toLowerCase().replace(/\s+/g, '-')}`
        : null,
      badgeName: badgeName.trim() || null,
      startDate,
      endDate,
      eligibleMemberIds: eligibleAll ? 'all' : splitComma(eligibleMemberIds),
      status,
    }),
    [
      badgeName,
      description,
      eligibleAll,
      eligibleMemberIds,
      endDate,
      kind,
      name,
      period,
      startDate,
      status,
      xpReward,
    ],
  );

  const onSave = async () => {
    setError(null);
    if (!name.trim() || !description.trim()) {
      setError('Name and description are required.');
      return;
    }
    if (!startDate.trim() || !endDate.trim()) {
      setError('Start and end dates are required.');
      return;
    }
    if (Number(xpReward) <= 0) {
      setError('XP reward must be greater than zero.');
      return;
    }
    setLoading(true);
    try {
      if (existing) {
        await updateChallenge(existing.id, payload);
      } else {
        await createChallenge(payload);
      }
      navigation.goBack();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to save challenge.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll keyboard>
      <Text variant="title">
        {existing ? 'Edit Challenge' : 'New Challenge'}
      </Text>
      <Spacer size="xs" />
      <Text variant="body" muted>
        Define the goal window, XP reward, badge, and eligible members.
      </Text>
      <Spacer size="lg" />

      {error ? (
        <>
          <Banner message={error} />
          <Spacer size="md" />
        </>
      ) : null}

      <Input label="Name" value={name} onChangeText={setName} />
      <Spacer size="md" />
      <Input
        label="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{ minHeight: 110, textAlignVertical: 'top' }}
      />
      <Spacer size="md" />
      <Input
        label="XP reward"
        value={xpReward}
        onChangeText={setXpReward}
        keyboardType="number-pad"
      />
      <Spacer size="md" />
      <Input
        label="Badge name"
        value={badgeName}
        onChangeText={setBadgeName}
        placeholder="Optional"
      />
      <Spacer size="md" />
      <Input
        label="Start date (YYYY-MM-DD)"
        value={startDate}
        onChangeText={setStartDate}
      />
      <Spacer size="md" />
      <Input
        label="End date (YYYY-MM-DD)"
        value={endDate}
        onChangeText={setEndDate}
      />

      <Spacer size="lg" />
      <Text variant="label">Kind</Text>
      <Spacer size="xs" />
      <ChipRow options={KINDS} value={kind} onChange={setKind} />

      <Spacer size="md" />
      <Text variant="label">Period</Text>
      <Spacer size="xs" />
      <ChipRow options={PERIODS} value={period} onChange={setPeriod} />

      <Spacer size="md" />
      <Text variant="label">Status</Text>
      <Spacer size="xs" />
      <ChipRow options={STATUSES} value={status} onChange={setStatus} />

      <Spacer size="md" />
      <ToggleChip
        label="Eligible all"
        active={eligibleAll}
        onPress={() => setEligibleAll((current) => !current)}
      />
      {!eligibleAll ? (
        <>
          <Spacer size="md" />
          <Input
            label="Eligible member IDs (comma separated)"
            value={eligibleMemberIds}
            onChangeText={setEligibleMemberIds}
            autoCapitalize="none"
          />
        </>
      ) : null}

      <Spacer size="xl" />
      <Button
        label={existing ? 'Save Challenge' : 'Create Challenge'}
        loading={loading}
        onPress={onSave}
      />
      <Spacer size="xl" />
    </Screen>
  );
}
