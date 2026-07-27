import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';

interface PartnerInputProps {
  partners: string[];
  onChange: (partners: string[]) => void;
}

export function PartnerInput({ partners, onChange }: PartnerInputProps) {
  const { colors } = useAppTheme();
  const [name, setName] = useState('');

  const addPartner = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    if (partners.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
      setName('');
      return;
    }
    onChange([...partners, trimmed]);
    setName('');
  };

  const removePartner = (partner: string) => {
    onChange(partners.filter((item) => item !== partner));
  };

  return (
    <View>
      <Text variant="label">Rolling Partners</Text>
      <Spacer size="sm" />
      <Input
        placeholder="Add a partner name"
        value={name}
        onChangeText={setName}
        onSubmitEditing={addPartner}
        returnKeyType="done"
      />
      <Spacer size="sm" />
      <Button label="Add Partner" variant="secondary" onPress={addPartner} />
      {partners.length > 0 ? (
        <>
          <Spacer size="md" />
          <View style={styles.wrap}>
            {partners.map((partner) => (
              <Pressable
                key={partner}
                onPress={() => removePartner(partner)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: colors.goldMuted,
                    borderColor: colors.goldAccent,
                  },
                ]}
              >
                <Text variant="caption" style={{ color: colors.goldAccent }}>
                  {partner}  ×
                </Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
});
