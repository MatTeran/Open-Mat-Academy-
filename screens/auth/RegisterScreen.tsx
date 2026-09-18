import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AuthScreen, Banner, Button, Input, Spacer } from '../../components';
import { useAuth } from '../../hooks';
import { spacing } from '../../lib/theme';
import type { AuthStackParamList } from '../../types';
import {
  getAuthErrorMessage,
  getConfirmPasswordError,
  getEmailError,
  getNameError,
  getPasswordError,
} from '../../utils';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const { signUp, isConfigured } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const nameError = submitted ? getNameError(fullName) : null;
  const emailError = submitted ? getEmailError(email) : null;
  const passwordError = submitted ? getPasswordError(password) : null;
  const confirmError = submitted
    ? getConfirmPasswordError(password, confirmPassword)
    : null;

  const handleRegister = async () => {
    setSubmitted(true);
    setFormError(null);
    setSuccessMessage(null);

    if (
      getNameError(fullName) ||
      getEmailError(email) ||
      getPasswordError(password) ||
      getConfirmPasswordError(password, confirmPassword)
    ) {
      return;
    }

    if (!isConfigured) {
      setFormError(
        'Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.',
      );
      return;
    }

    setLoading(true);
    try {
      const result = await signUp({ email, password, fullName });
      if (result.needsEmailConfirmation) {
        setSuccessMessage(
          'Account created. Check your email to confirm, then sign in.',
        );
      }
      // If a session is returned, RootNavigator routes to Home automatically.
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen
      title="Join My Gi"
      subtitle="Create your athlete profile and start logging mat time."
      footer={
        <View>
          <Button
            label="Create Account"
            loading={loading}
            onPress={handleRegister}
          />
          <Spacer size="sm" />
          <Button
            label="Already have an account"
            variant="ghost"
            disabled={loading}
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      }
    >
      {!isConfigured ? (
        <>
          <Banner
            tone="info"
            message="Connect Supabase via .env to enable live authentication."
          />
          <Spacer size="md" />
        </>
      ) : null}

      {formError ? (
        <>
          <Banner message={formError} />
          <Spacer size="md" />
        </>
      ) : null}

      {successMessage ? (
        <>
          <Banner tone="success" message={successMessage} />
          <Spacer size="md" />
        </>
      ) : null}

      <View style={styles.form}>
        <Input
          label="Full name"
          autoComplete="name"
          textContentType="name"
          value={fullName}
          onChangeText={setFullName}
          error={nameError}
          placeholder="Your name"
          editable={!loading}
          returnKeyType="next"
        />
        <Spacer size="md" />
        <Input
          label="Email"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          value={email}
          onChangeText={setEmail}
          error={emailError}
          placeholder="you@email.com"
          editable={!loading}
          returnKeyType="next"
        />
        <Spacer size="md" />
        <Input
          label="Password"
          secureTextEntry
          autoComplete="new-password"
          textContentType="newPassword"
          value={password}
          onChangeText={setPassword}
          error={passwordError}
          placeholder="At least 8 characters"
          editable={!loading}
          returnKeyType="next"
        />
        <Spacer size="md" />
        <Input
          label="Confirm password"
          secureTextEntry
          autoComplete="new-password"
          textContentType="newPassword"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={confirmError}
          placeholder="Re-enter password"
          editable={!loading}
          returnKeyType="done"
          onSubmitEditing={handleRegister}
        />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    marginBottom: spacing.md,
  },
});
