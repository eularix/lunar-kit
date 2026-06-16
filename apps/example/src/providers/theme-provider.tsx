// providers/theme-provider.tsx
import React, { useEffect } from 'react';
import { StatusBar, View, useColorScheme as useDeviceColorScheme } from 'react-native';
import { updateTheme } from '@lunar-kit/css';
import { lightTokens, darkTokens } from '@/lib/theme';
import { useThemeStore } from '@/stores';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const deviceTheme = useDeviceColorScheme();
    const theme = useThemeStore((state) => state.theme);

    const activeColorScheme =
        theme === 'system'
            ? deviceTheme ?? 'light'
            : theme;

    // Swap the LunarCSS token registry on mode change (replaces NativeWind's
    // `vars()` + `setColorScheme`). updateTheme() sets the tokens, busts the
    // style cache, and emits a theme-change event.
    useEffect(() => {
        updateTheme(activeColorScheme === 'dark' ? darkTokens : lightTokens);
    }, [activeColorScheme]);

    return (
        <>
            <StatusBar
                barStyle={activeColorScheme === 'dark' ? 'light-content' : 'dark-content'}
                animated
            />
            {/* `key` remounts the subtree on mode change so every `__lcssTw`
                call re-resolves against the new tokens — LunarCSS resolves tokens
                to concrete values (no CSS-var cascade on native). */}
            <View key={activeColorScheme} className="flex-1 bg-background text-foreground">
                {children}
            </View>
        </>
    );
}
