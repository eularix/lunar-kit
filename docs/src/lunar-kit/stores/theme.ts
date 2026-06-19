// stores/theme.ts (docs mirror)
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ThemeName } from '../lib/theme';

export type ColorScheme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: ThemeName;
  colorScheme: ColorScheme;
  setTheme: (theme: ThemeName) => void;
  setColorScheme: (scheme: ColorScheme) => void;
}

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'lunar',
      colorScheme: 'system',
      setTheme: (theme) => set({ theme }),
      setColorScheme: (colorScheme) => set({ colorScheme }),
    }),
    {
      name: 'lunar-kit-theme',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? window.localStorage : (noopStorage as unknown as Storage)
      ),
    }
  )
);
