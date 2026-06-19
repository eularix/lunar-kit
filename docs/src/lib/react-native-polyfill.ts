'use client';
// Polyfill for React Native globals required by react-native-web and related packages.
// Must run on BOTH server and client. The bare module-side-effect ensures both
// SSR and the client bundle see __DEV__ defined.

(globalThis as unknown as { __DEV__: boolean }).__DEV__ =
  process.env.NODE_ENV !== 'production';

export {};
