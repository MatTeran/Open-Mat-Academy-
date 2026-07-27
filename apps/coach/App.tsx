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
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { coachDarkColors } from '@openmat/shared';

import { AppProviders } from './src/lib/providers/AppProviders';
import { RootNavigator } from './src/navigation/RootNavigator';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

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
    return (
      <View
        style={{ flex: 1, backgroundColor: coachDarkColors.primaryBackground }}
      />
    );
  }

  return (
    <AppProviders>
      <StatusBar style="light" />
      <RootNavigator />
    </AppProviders>
  );
}
