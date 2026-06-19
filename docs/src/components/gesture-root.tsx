'use client';
import '@/lib/react-native-polyfill';
import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface Props {
  children: React.ReactNode;
}

/** Wraps children in GestureHandlerRootView. Required on web for RNGH. */
export function GestureRoot({ children }: Props) {
  return (
    <GestureHandlerRootView style={{ flex: 1, minHeight: '100vh' as any }}>
      {children}
    </GestureHandlerRootView>
  );
}
