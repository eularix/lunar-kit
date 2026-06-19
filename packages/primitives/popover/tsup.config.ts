import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: false,
  clean: true,
  outDir: 'dist',
  target: 'es2022',
  external: ['react', 'react-native', '@lunar-primitive/adaptive-modal'],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
