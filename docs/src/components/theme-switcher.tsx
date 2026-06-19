'use client';
import * as React from 'react';
import { useThemeStore } from '@/lunar-kit/stores/theme';
import type { ThemeName } from '@/lunar-kit/lib/theme';
import type { ColorScheme } from '@/lunar-kit/stores/theme';

const THEMES: { value: ThemeName; label: string }[] = [
  { value: 'lunar', label: 'Lunar' },
  { value: 'ios', label: 'iOS' },
  { value: 'android', label: 'Android' },
  { value: 'native', label: 'Native' },
];

const MODES: { value: ColorScheme; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

interface Props {
  /** Visual style. `compact` → small inline pill, `full` → labeled dropdowns. */
  variant?: 'compact' | 'full';
}

export function ThemeSwitcher({ variant = 'compact' }: Props) {
  const { theme, colorScheme, setTheme, setColorScheme } = useThemeStore();

  return (
    <div className="flex items-center gap-2 text-xs">
      {variant === 'full' && <span className="text-fd-muted-foreground">Theme</span>}
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as ThemeName)}
        className="rounded-md border border-fd-border bg-fd-background px-2 py-1 text-fd-foreground"
        aria-label="Theme"
      >
        {THEMES.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>
      {variant === 'full' && <span className="text-fd-muted-foreground ml-2">Mode</span>}
      <select
        value={colorScheme}
        onChange={(e) => setColorScheme(e.target.value as ColorScheme)}
        className="rounded-md border border-fd-border bg-fd-background px-2 py-1 text-fd-foreground"
        aria-label="Color mode"
      >
        {MODES.map((m) => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>
    </div>
  );
}
