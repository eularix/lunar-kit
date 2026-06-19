/// <reference types="@lunar-kit/css/types" />
import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useThemeColors, Toaster } from '@lunar-kit/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { colors } = useThemeColors();
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
            }}
            key={colorScheme}
          />
          <Toaster />
        </ThemeProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
