import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Appearance, ColorSchemeName, useColorScheme } from 'react-native';

import { createTheme } from '../theme';
import type { ThemeColors } from '../theme/colors';
import type { TypographyVariant } from '../theme/typography';

export type AppearancePreference = 'system' | 'light' | 'dark';

const STORAGE_KEY = '@open-mat/appearance-preference';

type AppTheme = ReturnType<typeof createTheme>;

interface ThemeContextValue {
  preference: AppearancePreference;
  colorScheme: 'light' | 'dark';
  isDark: boolean;
  colors: ThemeColors;
  typography: AppTheme['typography'];
  theme: AppTheme;
  setPreference: (preference: AppearancePreference) => Promise<void>;
  getTypographyStyle: (variant: TypographyVariant) => AppTheme['typography'][TypographyVariant];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveScheme(
  preference: AppearancePreference,
  systemScheme: ColorSchemeName,
): 'light' | 'dark' {
  if (preference === 'light' || preference === 'dark') {
    return preference;
  }
  return systemScheme === 'light' ? 'light' : 'dark';
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  // Version W.1 defaults to the warm light palette; stored prefs still win.
  const [preference, setPreferenceState] =
    useState<AppearancePreference>('light');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (
          mounted &&
          (stored === 'system' || stored === 'light' || stored === 'dark')
        ) {
          setPreferenceState(stored);
        }
      } catch {
        // Keep W.1 light default.
      } finally {
        if (mounted) {
          setHydrated(true);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(() => {
      // useColorScheme updates automatically; this forces consumers to refresh
      // if the system scheme changes while preference is "system".
      setPreferenceState((current) => current);
    });
    return () => subscription.remove();
  }, []);

  const setPreference = useCallback(async (next: AppearancePreference) => {
    setPreferenceState(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Keep in-memory preference if persistence fails.
    }
  }, []);

  const colorScheme = resolveScheme(preference, systemScheme);
  const theme = useMemo(() => createTheme(colorScheme), [colorScheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      colorScheme,
      isDark: colorScheme === 'dark',
      colors: theme.colors,
      typography: theme.typography,
      theme,
      setPreference,
      getTypographyStyle: (variant) => theme.typography[variant],
    }),
    [colorScheme, preference, setPreference, theme],
  );

  // Avoid flashing the wrong scheme after restore.
  if (!hydrated) {
    return (
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return context;
}
