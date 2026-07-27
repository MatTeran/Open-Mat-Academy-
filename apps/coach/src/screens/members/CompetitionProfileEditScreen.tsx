import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';

import {
  Banner,
  Button,
  Input,
  Screen,
  Spacer,
  Text,
  COMPETITION_DIVISIONS,
  COMPETITION_EXPERIENCES,
  COMPETITION_RULE_SETS,
  COMPETITION_TEAM_STATUSES,
  competitionRuleSetLabel,
  type CompetitionDivision,
  type CompetitionExperience,
  type CompetitionRuleSet,
  type CompetitionTeamStatus,
  type MemberDevelopmentBundle,
} from '@openmat/shared';

import { ChipRow } from '../../components/ui/Phase2Controls';
import { useMemberDevelopment } from '../../lib/providers/MemberDevelopmentProvider';
import type { MembersStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<
  MembersStackParamList,
  'CompetitionProfileEdit'
>;

export function CompetitionProfileEditScreen({ navigation, route }: Props) {
  const { getBundle, updateCompetitionProfile } = useMemberDevelopment();
  const [bundle, setBundle] = useState<MemberDevelopmentBundle | null>(null);
  const [ruleSet, setRuleSet] = useState<CompetitionRuleSet>('ibjjf');
  const [division, setDivision] = useState<CompetitionDivision>('adult');
  const [weightClass, setWeightClass] = useState('');
  const [preferredWeight, setPreferredWeight] = useState('');
  const [teamStatus, setTeamStatus] =
    useState<CompetitionTeamStatus>('inactive');
  const [experience, setExperience] =
    useState<CompetitionExperience>('beginner');
  const [eligibilityNotes, setEligibilityNotes] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void getBundle(route.params.memberId).then((next) => {
      setBundle(next);
      if (next?.competition) {
        setRuleSet(next.competition.preferredRuleSet);
        setDivision(next.competition.division);
        setWeightClass(next.competition.weightClass);
        setPreferredWeight(
          next.competition.preferredWeightKg != null
            ? String(next.competition.preferredWeightKg)
            : '',
        );
        setTeamStatus(next.competition.teamStatus);
        setExperience(next.competition.experience);
        setEligibilityNotes(next.competition.eligibilityNotes ?? '');
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

  return (
    <Screen scroll keyboard>
      <Text variant="hero">Competition Profile</Text>
      <Text variant="body" muted>
        Separate from belt rank. Used for tournament eligibility.
      </Text>
      <Spacer size="lg" />

      {message ? (
        <>
          <Banner tone="success" message={message} />
          <Spacer size="sm" />
        </>
      ) : null}

      <Text variant="label">Preferred Rule Set</Text>
      <Spacer size="xs" />
      <ChipRow
        options={[...COMPETITION_RULE_SETS]}
        value={ruleSet}
        onChange={setRuleSet}
        labelFor={competitionRuleSetLabel}
      />

      <Spacer size="md" />
      <Text variant="label">Division</Text>
      <Spacer size="xs" />
      <ChipRow
        options={[...COMPETITION_DIVISIONS]}
        value={division}
        onChange={setDivision}
        labelFor={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
      />

      <Spacer size="md" />
      <Input
        label="Weight Class"
        value={weightClass}
        onChangeText={setWeightClass}
        placeholder="Light / Middle / …"
      />
      <Spacer size="md" />
      <Input
        label="Preferred Competition Weight (kg)"
        value={preferredWeight}
        onChangeText={setPreferredWeight}
        placeholder="70"
        keyboardType="decimal-pad"
      />

      <Spacer size="md" />
      <Text variant="label">Competition Team</Text>
      <Spacer size="xs" />
      <ChipRow
        options={[...COMPETITION_TEAM_STATUSES]}
        value={teamStatus}
        onChange={setTeamStatus}
        labelFor={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
      />

      <Spacer size="md" />
      <Text variant="label">Experience</Text>
      <Spacer size="xs" />
      <ChipRow
        options={[...COMPETITION_EXPERIENCES]}
        value={experience}
        onChange={setExperience}
        labelFor={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
      />

      <Spacer size="md" />
      <Input
        label="Eligibility Notes"
        value={eligibilityNotes}
        onChangeText={setEligibilityNotes}
        placeholder="Future tournament eligibility…"
        multiline
      />

      <Spacer size="lg" />
      <Button
        label="Save Competition Profile"
        variant="primaryGold"
        loading={loading}
        onPress={async () => {
          setLoading(true);
          try {
            const weight = preferredWeight.trim()
              ? Number(preferredWeight)
              : null;
            await updateCompetitionProfile({
              memberId: route.params.memberId,
              preferredRuleSet: ruleSet,
              division,
              weightClass,
              preferredWeightKg:
                weight != null && !Number.isNaN(weight) ? weight : null,
              teamStatus,
              experience,
              eligibilityNotes,
            });
            setMessage('Competition profile saved.');
            navigation.goBack();
          } finally {
            setLoading(false);
          }
        }}
      />
      <Spacer size="xl" />
    </Screen>
  );
}
