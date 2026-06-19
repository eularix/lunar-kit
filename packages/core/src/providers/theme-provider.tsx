// providers/theme-provider.tsx — applies palette + mode tokens via @lunar-kit/css
import React from 'react';
import { StatusBar, View, useColorScheme as useDeviceColorScheme } from 'react-native';
import { themeVars } from '@/lib/theme';
import { useThemeStore } from '@/stores/theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const deviceTheme = useDeviceColorScheme();
    const theme = useThemeStore((state) => state.theme);
    const palette = useThemeStore((state) => state.palette);

    const activeColorScheme: 'light' | 'dark' =
        theme === 'system'
            ? (deviceTheme === 'dark' ? 'dark' : 'light')
            : theme === 'dark' ? 'dark' : 'light';

    const tokens = themeVars[palette][activeColorScheme];

    return (
        <>
            <StatusBar
                barStyle={activeColorScheme === 'dark' ? 'light-content' : 'dark-content'}
                animated
            />
            <View style={tokens as any} className="flex-1 bg-background">
                {children}
            </View>
        </>
    );
}
