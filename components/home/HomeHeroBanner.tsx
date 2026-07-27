import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  ImageBackground,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '../../lib/providers/ThemeProvider';
import { radii, spacing } from '../../lib/theme';
import { HomeGreeting } from './HomeGreeting';

const HERO_IMAGE = require('../../assets/home-hero.png');
const BANNER_BODY_HEIGHT = 240;

interface HomeHeroBannerProps {
  greeting: string;
  firstName: string;
  motivationalMessage: string;
}

export function HomeHeroBanner({
  greeting,
  firstName,
  motivationalMessage,
}: HomeHeroBannerProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

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
  }, [opacity, translateY]);

  return (
    <Animated.View
      style={[
        styles.shell,
        {
          height: BANNER_BODY_HEIGHT + insets.top,
          backgroundColor: colors.secondaryBackground,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <ImageBackground
        source={HERO_IMAGE}
        resizeMode="cover"
        style={styles.image}
        imageStyle={styles.imageStyle}
        accessibilityIgnoresInvertColors
      >
        <LinearGradient
          colors={[
            'rgba(13,13,13,0.15)',
            'rgba(13,13,13,0.45)',
            'rgba(13,13,13,0.88)',
            'rgba(13,13,13,1)',
          ]}
          locations={[0, 0.35, 0.72, 1]}
          style={styles.gradient}
        >
          <View
            style={[
              styles.content,
              {
                paddingTop: insets.top + spacing.sm,
                paddingBottom: spacing.lg,
              },
            ]}
          >
            <View style={styles.greetingAnchor}>
              <HomeGreeting
                greeting={greeting}
                firstName={firstName}
                motivationalMessage={motivationalMessage}
                tone="hero"
              />
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: '100%',
    overflow: 'hidden',
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
  },
  image: {
    flex: 1,
    width: '100%',
  },
  imageStyle: {
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
  },
  greetingAnchor: {
    maxWidth: '92%',
  },
});
