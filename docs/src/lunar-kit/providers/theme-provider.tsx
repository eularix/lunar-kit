'use client';
import * as React from 'react';
import { Platform, View, useColorScheme as useDeviceColorScheme } from 'react-native';
import { useColorScheme as useNwColorScheme } from 'nativewind';
import { resolveNativeTheme, themeVars, type ColorMode } from '../lib/theme';
import { useThemeStore } from '../stores/theme';

interface Props {
  children: React.ReactNode;
}

/**
 * Docs ThemeProvider — applies active theme tokens to children.
 * Web-only (docs site); skips StatusBar wiring used by the RN provider.
 */
export function ThemeProvider({ children }: Props) {
  const deviceScheme = useDeviceColorScheme();
  const { setColorScheme: setNwScheme } = useNwColorScheme();
  const { theme, colorScheme } = useThemeStore();

  const activeMode: ColorMode = React.useMemo(() => {
    if (colorScheme === 'system') return deviceScheme === 'dark' ? 'dark' : 'light';
    return colorScheme;
  }, [colorScheme, deviceScheme]);

  const activeTheme = React.useMemo(() => {
    if (theme === 'native') return resolveNativeTheme(Platform.OS);
    return theme;
  }, [theme]);

  React.useEffect(() => {
    setNwScheme(activeMode);
  }, [activeMode, setNwScheme]);

  const tokens = themeVars[activeTheme][activeMode];

  return (
    <View style={tokens} className="bg-background text-foreground">
      {children}
    </View>
  );
}
