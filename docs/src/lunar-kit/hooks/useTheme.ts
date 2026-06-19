// hooks/useTheme.ts (docs mirror)
import { Platform, useColorScheme as useDeviceColorScheme } from 'react-native';
import { useThemeStore } from '../stores/theme';
import { resolveNativeTheme, type ColorMode } from '../lib/theme';

export function useTheme() {
  const deviceScheme = useDeviceColorScheme();
  const { theme, colorScheme, setTheme, setColorScheme } = useThemeStore();

  const mode: ColorMode =
    colorScheme === 'system' ? (deviceScheme === 'dark' ? 'dark' : 'light') : colorScheme;

  const resolvedTheme = theme === 'native' ? resolveNativeTheme(Platform.OS) : theme;

  return {
    theme,
    resolvedTheme,
    colorScheme,
    mode,
    setTheme,
    setColorScheme,
  };
}
