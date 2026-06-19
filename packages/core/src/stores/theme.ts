// stores/theme.ts — palette + mode
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Palette } from '@/lib/theme';

type ColorScheme = 'light' | 'dark' | 'system';

interface ThemeState {
  /** Active palette: space (default) | forest | sunset | aurora | mono. */
  palette: Palette;
  /** Color mode preference. 'system' follows device. */
  theme: ColorScheme;
  setPalette: (p: Palette) => void;
  setTheme: (t: ColorScheme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      palette: 'space',
      theme: 'system',
      setPalette: (palette) => set({ palette }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
