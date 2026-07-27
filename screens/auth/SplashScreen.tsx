import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, View } from 'react-native';

import { Text } from '../../components';
import { useAppTheme } from '../../hooks';
import { APP_TAGLINE, AUTH_SPLASH_DURATION_MS } from '../../lib/constants';
import { spacing } from '../../lib/theme';
import type { AuthStackParamList } from '../../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

/**
 * Branded launch moment — then soft transition into Login.
 */
export function SplashScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, AUTH_SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [navigation, opacity, translateY]);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.primaryBackground }]}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <Image
          source={require('../../assets/brand-logo.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Open Mat"
        />
        <Text variant="bodyMuted" style={styles.tagline}>
          {APP_TAGLINE}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 220,
    height: 220,
    marginBottom: spacing.md,
  },
  tagline: {
    textAlign: 'center',
  },
});
