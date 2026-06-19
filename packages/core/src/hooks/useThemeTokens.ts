// hooks/useThemeTokens.ts
import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useThemeStore } from '@/stores/theme';
import { getThemeColors, type Palette, type Mode, type ThemeColors } from '@/lib/theme';

export type { ThemeColors };
export type ColorMode = Mode;

export interface ThemeTokens {
  colors: ThemeColors;
  palette: Palette;
  mode: ColorMode;
}

/** Resolved color tokens for active palette + mode. */
export function useThemeTokens(): ThemeTokens {
  const deviceTheme = useColorScheme();
  const palette = useThemeStore((s) => s.palette);
  const theme = useThemeStore((s) => s.theme);

  return useMemo(() => {
    const mode: ColorMode =
      theme === 'system'
        ? (deviceTheme === 'dark' ? 'dark' : 'light')
        : (theme === 'dark' ? 'dark' : 'light');
    return {
      colors: getThemeColors(palette, mode),
      palette,
      mode,
    };
  }, [palette, theme, deviceTheme]);
}
