// hooks/useTheme.ts
import { useThemeStore } from '@/stores/theme';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import type { Palette, Mode } from '@/lib/theme';

export function useTheme() {
  const deviceTheme = useDeviceColorScheme();
  const { theme, setTheme, palette, setPalette } = useThemeStore();

  const colorScheme: Mode =
    theme === 'system'
      ? (deviceTheme === 'dark' ? 'dark' : 'light')
      : (theme === 'dark' ? 'dark' : 'light');

  return {
    /** Active palette (space | forest | sunset | aurora | mono). */
    palette,
    setPalette,
    /** Mode preference (light | dark | system). */
    theme,
    setTheme,
    /** Resolved color mode (light | dark). */
    colorScheme,
  };
}

export type { Palette, Mode };
