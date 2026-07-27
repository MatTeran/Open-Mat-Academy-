import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import { Syne_700Bold } from '@expo-google-fonts/syne';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';

import './global.css';

import { RootNavigator } from './navigation';
import { AppProviders, colors } from './lib';

SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore if the splash screen is already managed by the native layer.
});

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Syne_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return <View style={{ flex: 1, backgroundColor: colors.primaryBackground }} />;
  }

  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
