import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { SUGGESTED_PARTNERS } from '../../lib/data/workoutOptions';
import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';

interface PartnerInputProps {
  partners: string[];
  onChange: (partners: string[]) => void;
  recentPartners?: string[];
}

export function PartnerInput({
  partners,
  onChange,
  recentPartners = [],
}: PartnerInputProps) {
  const { colors } = useAppTheme();
  const [name, setName] = useState('');

  const suggestions = useMemo(() => {
    const selected = new Set(partners.map((item) => item.toLowerCase()));
    const ordered: string[] = [];
    const pushUnique = (value: string) => {
      const key = value.toLowerCase();
      if (selected.has(key) || ordered.some((item) => item.toLowerCase() === key)) {
        return;
      }
      ordered.push(value);
    };
    recentPartners.forEach(pushUnique);
    SUGGESTED_PARTNERS.forEach(pushUnique);
    return ordered.slice(0, 8);
  }, [partners, recentPartners]);

  const addPartner = (raw?: string) => {
    const trimmed = (raw ?? name).trim();
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

  const query = name.trim().toLowerCase();
  const filteredSuggestions = query
    ? suggestions.filter((item) => item.toLowerCase().includes(query))
    : suggestions;

  return (
    <View>
      <Text variant="label">Training Partners</Text>
      <Spacer size="xs" />
      <Text variant="caption" muted>
        Optional · Multi-select from recent partners or search
      </Text>
      <Spacer size="sm" />
      <Input
        placeholder="Search or add a partner"
        value={name}
        onChangeText={setName}
        onSubmitEditing={() => addPartner()}
        returnKeyType="done"
      />
      {filteredSuggestions.length > 0 ? (
        <>
          <Spacer size="sm" />
          <Text variant="caption" muted>
            {recentPartners.length > 0 ? 'Recent & suggested' : 'Suggested'}
          </Text>
          <Spacer size="xs" />
          <View style={styles.wrap}>
            {filteredSuggestions.map((partner) => (
              <Pressable
                key={partner}
                accessibilityRole="button"
                accessibilityLabel={`Add ${partner}`}
                onPress={() => addPartner(partner)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: colors.elevatedSurface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text variant="caption" style={{ color: colors.secondaryText }}>
                  + {partner}
                </Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : null}
      <Spacer size="sm" />
      <Button
        label="Add Partner"
        variant="secondary"
        onPress={() => addPartner()}
      />
      {partners.length > 0 ? (
        <>
          <Spacer size="md" />
          <View style={styles.wrap}>
            {partners.map((partner) => (
              <Pressable
                key={partner}
                onPress={() => removePartner(partner)}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${partner}`}
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
