// hooks/useThemeTokens.ts (docs mirror)
import { useMemo } from 'react';
import { Platform } from 'react-native';
import { useColorScheme as useNwColorScheme } from 'nativewind';
import { resolveNativeTheme, themeColors, type ColorMode, type ThemeColors } from '../lib/theme';
import { useThemeStore } from '../stores/theme';

export interface ThemeTokens {
  colors: ThemeColors;
  theme: 'lunar' | 'ios' | 'android';
  mode: ColorMode;
}

export function useThemeTokens(): ThemeTokens {
  const { colorScheme: nwScheme } = useNwColorScheme();
  const themeName = useThemeStore((s) => s.theme);

  return useMemo(() => {
    const resolved = themeName === 'native' ? resolveNativeTheme(Platform.OS) : themeName;
    const mode: ColorMode = nwScheme === 'dark' ? 'dark' : 'light';
    return {
      colors: themeColors[resolved][mode],
      theme: resolved,
      mode,
    };
  }, [themeName, nwScheme]);
}
