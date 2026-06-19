/// <reference types="@lunar-kit/css/types" />
import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '@/providers/theme-provider';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { colors } = useThemeColors();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
          key={colorScheme}
        />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
