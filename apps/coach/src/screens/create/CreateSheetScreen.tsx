import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import {
  IconBadge,
  Screen,
  Spacer,
  Text,
  radii,
  spacing,
  useAppTheme,
  type CreateSheetActionId,
  type IconName,
} from '@openmat/shared';

import { FadeInItem } from '../../components/ui/Motion';
import { useCoachData } from '../../lib/providers/CoachDataProvider';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateModal'>;

export function CreateSheetScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const { createActions } = useCoachData();

  const onSelect = (id: CreateSheetActionId, available: boolean) => {
    if (!available) {
      Alert.alert(
        'Coming soon',
        'This create action is reserved for a later phase.',
      );
      return;
    }

    navigation.goBack();
    setTimeout(() => {
      if (id === 'newClass') {
        navigation.navigate('Main', {
          screen: 'Schedule',
          params: { screen: 'ClassForm', params: undefined },
        });
      } else if (id === 'announcement') {
        navigation.navigate('Main', {
          screen: 'More',
          params: { screen: 'AnnouncementForm', params: undefined },
        });
      } else if (id === 'event') {
        navigation.navigate('Main', {
          screen: 'More',
          params: { screen: 'EventForm', params: undefined },
        });
      } else if (id === 'challenge') {
        navigation.navigate('Main', {
          screen: 'More',
          params: { screen: 'ChallengeForm', params: undefined },
        });
      } else if (id === 'technique') {
        navigation.navigate('Main', {
          screen: 'More',
          params: { screen: 'TechniqueForm', params: undefined },
        });
      }
    }, 180);
  };

  return (
    <Screen>
      <Text variant="hero">Create</Text>
      <Text variant="body" muted>
        Spin up the next thing your academy needs.
      </Text>
      <Spacer size="lg" />
      <View style={styles.list}>
        {createActions.map((action, index) => (
          <FadeInItem key={action.id} index={index}>
            <Pressable
              onPress={() => onSelect(action.id, action.available)}
              style={[
                styles.row,
                {
                  backgroundColor: colors.elevatedSurface,
                  borderColor: colors.border,
                  opacity: action.available ? 1 : 0.55,
                },
              ]}
            >
              <IconBadge name={action.icon as IconName} tint={action.tint} />
              <View style={styles.copy}>
                <Text variant="subtitle">{action.title}</Text>
                <Text variant="caption" muted>
                  {action.subtitle}
                </Text>
              </View>
            </Pressable>
          </FadeInItem>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
  row: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
});
