import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AuthScreen, Banner, Button, Input, Spacer, Text } from '../../components';
import { useAuth } from '../../hooks';
import { APP_NAME } from '../../lib/constants';
import { DEMO_HINT_MEMBER, DEMO_PASSWORD } from '../../lib/demo/accounts';
import { spacing } from '../../lib/theme';
import type { AuthStackParamList } from '../../types';
import { getAuthErrorMessage, getEmailError, getPasswordError } from '../../utils';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { signIn, continueAsGuest } = useAuth();
  const [email, setEmail] = useState('mat.teran6@gmail.com');
  const [password, setPassword] = useState('OpenMat2026!');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const emailError = submitted ? getEmailError(email) : null;
  const passwordError = submitted ? getPasswordError(password) : null;
  const busy = loading || guestLoading;

  const handleLogin = async () => {
    setSubmitted(true);
    setFormError(null);

    const nextEmailError = getEmailError(email);
    const nextPasswordError = getPasswordError(password);
    if (nextEmailError || nextPasswordError) {
      return;
    }

    setLoading(true);
    try {
      await signIn({ email, password });
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setFormError(null);
    setGuestLoading(true);
    try {
      await continueAsGuest();
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <AuthScreen
      title={APP_NAME.toUpperCase()}
      subtitle="Sign in to your academy."
      brand
      footer={
        <View>
          <Button label="Sign In" loading={loading} disabled={busy} onPress={handleLogin} />
          <Spacer size="sm" />
          <Button
            label="Continue as Guest"
            variant="secondary"
            loading={guestLoading}
            disabled={busy}
            onPress={() => {
              void handleGuest();
            }}
            accessibilityHint="Opens My Gi as Alex Chen with sample academy data"
          />
          <Spacer size="xs" />
          <Text variant="caption" style={styles.guestHint}>
            {DEMO_HINT_MEMBER}
          </Text>
          <Spacer size="sm" />
          <Button
            label="Forgot password?"
            variant="ghost"
            disabled={busy}
            onPress={() => navigation.navigate('ForgotPassword')}
          />
          <Button
            label="Create account"
            variant="ghost"
            disabled={busy}
            onPress={() => navigation.navigate('Register')}
          />
        </View>
      }
    >
      <Banner
        tone="info"
        message="Supabase sign-in enabled. Use your email (prefilled) or alex@openmat.demo / demo1234."
      />
      <Spacer size="md" />

      {formError ? (
        <>
          <Banner message={formError} />
          <Spacer size="md" />
        </>
      ) : null}

      <View style={styles.form}>
        <Input
          label="Email"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          value={email}
          onChangeText={setEmail}
          error={emailError}
          placeholder="alex@openmat.demo"
          editable={!busy}
          returnKeyType="next"
        />
        <Spacer size="md" />
        <Input
          label="Password"
          secureTextEntry
          autoComplete="password"
          textContentType="password"
          value={password}
          onChangeText={setPassword}
          error={passwordError}
          placeholder="demo1234"
          editable={!busy}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    marginBottom: spacing.md,
  },
  guestHint: {
    textAlign: 'center',
  },
});
