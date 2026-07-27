import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AuthScreen, Banner, Button, Input, Spacer } from '../../components';
import { useAuth } from '../../hooks';
import { spacing } from '../../lib/theme';
import type { AuthStackParamList } from '../../types';
import { getAuthErrorMessage, getEmailError } from '../../utils';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
  const { resetPassword, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const emailError = submitted ? getEmailError(email) : null;

  const handleReset = async () => {
    setSubmitted(true);
    setFormError(null);
    setSuccessMessage(null);

    if (getEmailError(email)) {
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
      await resetPassword(email);
      setSuccessMessage(
        'If an account exists for that email, a reset link is on the way.',
      );
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen
      title="Reset password"
      subtitle="Enter your email and we’ll send a secure reset link."
      footer={
        <View>
          <Button
            label="Send Reset Link"
            loading={loading}
            onPress={handleReset}
          />
          <Spacer size="sm" />
          <Button
            label="Back to sign in"
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
            message="Connect Supabase via .env to enable password reset."
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
          returnKeyType="done"
          onSubmitEditing={handleReset}
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
