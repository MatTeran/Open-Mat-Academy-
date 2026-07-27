import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Banner,
  Button,
  Input,
  Screen,
  Spacer,
  Text,
  useAuth,
  spacing,
} from '@openmat/shared';

import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen(_props: Props) {
  const { signIn, continueAsGuest, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await signIn({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  const onGuest = async () => {
    setError(null);
    setGuestLoading(true);
    try {
      await continueAsGuest();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to continue.');
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <Screen scroll keyboard>
      <View style={styles.hero}>
        <Text variant="brand" gold>
          DARK MAT
        </Text>
        <Text variant="hero">Coach</Text>
        <Text variant="body" muted>
          Calm operations for your academy floor.
        </Text>
      </View>

      <Spacer size="xl" />

      {!isConfigured ? (
        <>
          <Banner
            tone="info"
            message="Supabase is not configured. Continue as guest to explore Phase 1."
          />
          <Spacer size="md" />
        </>
      ) : null}

      {error ? (
        <>
          <Banner message={error} />
          <Spacer size="md" />
        </>
      ) : null}

      <Input
        label="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholder="coach@openmat.com"
      />
      <Spacer size="md" />
      <Input
        label="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
      />
      <Spacer size="lg" />
      <Button
        label="Sign In"
        loading={loading}
        onPress={onSubmit}
        disabled={!email || !password}
      />
      <Spacer size="sm" />
      <Button
        label="Continue as Coach Guest"
        variant="secondary"
        loading={guestLoading}
        onPress={onGuest}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
});
