import { defineConfig } from 'tsup';
import path from 'path';
import alias from 'esbuild-plugin-alias';
import { cp } from 'fs/promises';

export default defineConfig({
  entry: ['src/index.ts', 'src/templates.ts', 'src/cli-utils.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  outDir: 'dist',
  // Externalize peer dependencies and external packages
  external: [
    'expo-router',
    'react',
    'react-native',
    'react-native-reanimated',
    'react-native-gesture-handler',
    'lucide-react-native',
    'class-variance-authority',
    '@lunar-kit/css',
    'clsx',
    'tailwind-merge',
    'react-hook-form',
    'dayjs',
    'dayjs/plugin/isBetween',
    'dayjs/plugin/customParseFormat',
    'dayjs/plugin/weekday',
    'dayjs/plugin/weekOfYear',
    'zustand'
  ],
  esbuildOptions(options) {
    options.jsx = 'automatic';
    options.plugins = [
      alias({
        '@': path.resolve(__dirname, './src'),
      })
    ];
  },
  async onSuccess() {
    // Copy registry files to dist for CLI access
    await cp(path.join(__dirname, 'src', 'registry'), path.join(__dirname, 'dist', 'registry'), { recursive: true });
  },
});
