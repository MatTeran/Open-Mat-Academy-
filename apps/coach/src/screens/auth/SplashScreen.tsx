import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Text, spacing, useAppTheme } from '@openmat/shared';

import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 700 });
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 1400);
    return () => clearTimeout(timer);
  }, [navigation, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.primaryBackground }]}>
      <Animated.View style={[styles.brand, animatedStyle]} entering={FadeIn}>
        <Image
          source={require('../../../assets/brand-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text variant="brand" gold>
          MY GI
        </Text>
        <Text variant="caption" muted>
          Coach
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
  },
  brand: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    width: 88,
    height: 88,
    marginBottom: spacing.sm,
  },
});
