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

import { createTheme, type ThemeVariant } from '../theme';
import type { ThemeColors } from '../theme/colors';
import type { TypographyVariant } from '../theme/typography';

export type AppearancePreference = 'system' | 'light' | 'dark';

type AppTheme = ReturnType<typeof createTheme>;

interface ThemeContextValue {
  preference: AppearancePreference;
  colorScheme: 'light' | 'dark';
  isDark: boolean;
  variant: ThemeVariant;
  colors: ThemeColors;
  typography: AppTheme['typography'];
  theme: AppTheme;
  setPreference: (preference: AppearancePreference) => Promise<void>;
  getTypographyStyle: (
    variant: TypographyVariant,
  ) => AppTheme['typography'][TypographyVariant];
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

interface ThemeProviderProps extends PropsWithChildren {
  variant?: ThemeVariant;
  storageKey?: string;
  /** Coach defaults to dark for the premium operations surface. */
  defaultPreference?: AppearancePreference;
}

export function ThemeProvider({
  children,
  variant = 'member',
  storageKey = '@open-mat/appearance-preference',
  defaultPreference = 'system',
}: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] =
    useState<AppearancePreference>(defaultPreference);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        const stored = await AsyncStorage.getItem(storageKey);
        if (
          mounted &&
          (stored === 'system' || stored === 'light' || stored === 'dark')
        ) {
          setPreferenceState(stored);
        }
      } catch {
        // Keep default.
      } finally {
        if (mounted) {
          setHydrated(true);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [storageKey]);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(() => {
      setPreferenceState((current) => current);
    });
    return () => subscription.remove();
  }, []);

  const setPreference = useCallback(
    async (next: AppearancePreference) => {
      setPreferenceState(next);
      try {
        await AsyncStorage.setItem(storageKey, next);
      } catch {
        // Keep in-memory preference if persistence fails.
      }
    },
    [storageKey],
  );

  const colorScheme = resolveScheme(preference, systemScheme);
  const theme = useMemo(
    () => createTheme(colorScheme, variant),
    [colorScheme, variant],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      colorScheme,
      isDark: colorScheme === 'dark',
      variant,
      colors: theme.colors,
      typography: theme.typography,
      theme,
      setPreference,
      getTypographyStyle: (token) => theme.typography[token],
    }),
    [colorScheme, preference, setPreference, theme, variant],
  );

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
