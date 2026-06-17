// lib/theme.ts (docs mirror — kept in sync with packages/core/src/lib/theme.ts)
import { vars } from 'nativewind';

export type ThemeName = 'lunar' | 'ios' | 'android' | 'native';
export type ColorMode = 'light' | 'dark';

const TOKEN_KEYS = [
  '--background', '--foreground',
  '--card', '--card-foreground',
  '--primary', '--primary-foreground',
  '--secondary', '--secondary-foreground',
  '--muted', '--muted-foreground',
  '--accent', '--accent-foreground',
  '--destructive', '--destructive-foreground',
  '--border', '--input', '--ring',
] as const;

type TokenKey = typeof TOKEN_KEYS[number];
type TokenSet = Record<TokenKey, string>;

const lunarLight: TokenSet = {
  '--background': '0 0% 100%',
  '--foreground': '222.2 84% 4.9%',
  '--card': '0 0% 100%',
  '--card-foreground': '222.2 84% 4.9%',
  '--primary': '240 5.9% 10%',
  '--primary-foreground': '0 0% 98%',
  '--secondary': '210 40% 96.1%',
  '--secondary-foreground': '222.2 47.4% 11.2%',
  '--muted': '210 40% 96.1%',
  '--muted-foreground': '215.4 16.3% 46.9%',
  '--accent': '210 40% 96.1%',
  '--accent-foreground': '222.2 47.4% 11.2%',
  '--destructive': '0 84.2% 60.2%',
  '--destructive-foreground': '210 40% 98%',
  '--border': '214.3 31.8% 91.4%',
  '--input': '214.3 31.8% 91.4%',
  '--ring': '240 5.9% 10%',
};

const lunarDark: TokenSet = {
  '--background': '222.2 84% 4.9%',
  '--foreground': '210 40% 98%',
  '--card': '222.2 84% 4.9%',
  '--card-foreground': '210 40% 98%',
  '--primary': '60 9.1% 97.8%',
  '--primary-foreground': '222.2 47.4% 11.2%',
  '--secondary': '217.2 32.6% 17.5%',
  '--secondary-foreground': '210 40% 98%',
  '--muted': '217.2 32.6% 17.5%',
  '--muted-foreground': '215 20.2% 65.1%',
  '--accent': '217.2 32.6% 17.5%',
  '--accent-foreground': '210 40% 98%',
  '--destructive': '0 84% 60%',
  '--destructive-foreground': '210 40% 98%',
  '--border': '217.2 32.6% 17.5%',
  '--input': '217.2 32.6% 17.5%',
  '--ring': '60 9.1% 97.8%',
};

const iosLight: TokenSet = {
  '--background': '0 0% 100%',
  '--foreground': '0 0% 0%',
  '--card': '0 0% 100%',
  '--card-foreground': '0 0% 0%',
  '--primary': '211 100% 50%',
  '--primary-foreground': '0 0% 100%',
  '--secondary': '240 6% 90%',
  '--secondary-foreground': '0 0% 0%',
  '--muted': '240 5% 96%',
  '--muted-foreground': '240 4% 46%',
  '--accent': '211 100% 50%',
  '--accent-foreground': '0 0% 100%',
  '--destructive': '4 90% 58%',
  '--destructive-foreground': '0 0% 100%',
  '--border': '240 6% 88%',
  '--input': '240 6% 88%',
  '--ring': '211 100% 50%',
};

const iosDark: TokenSet = {
  '--background': '0 0% 0%',
  '--foreground': '0 0% 100%',
  '--card': '240 4% 10%',
  '--card-foreground': '0 0% 100%',
  '--primary': '211 100% 56%',
  '--primary-foreground': '0 0% 100%',
  '--secondary': '240 4% 16%',
  '--secondary-foreground': '0 0% 100%',
  '--muted': '240 4% 14%',
  '--muted-foreground': '240 4% 64%',
  '--accent': '211 100% 56%',
  '--accent-foreground': '0 0% 100%',
  '--destructive': '4 90% 62%',
  '--destructive-foreground': '0 0% 100%',
  '--border': '240 4% 20%',
  '--input': '240 4% 20%',
  '--ring': '211 100% 56%',
};

const androidLight: TokenSet = {
  '--background': '300 25% 99%',
  '--foreground': '270 7% 11%',
  '--card': '300 25% 99%',
  '--card-foreground': '270 7% 11%',
  '--primary': '256 35% 47%',
  '--primary-foreground': '0 0% 100%',
  '--secondary': '270 12% 90%',
  '--secondary-foreground': '270 7% 18%',
  '--muted': '300 9% 94%',
  '--muted-foreground': '270 5% 30%',
  '--accent': '256 35% 47%',
  '--accent-foreground': '0 0% 100%',
  '--destructive': '0 75% 42%',
  '--destructive-foreground': '0 0% 100%',
  '--border': '270 5% 75%',
  '--input': '270 5% 75%',
  '--ring': '256 35% 47%',
};

const androidDark: TokenSet = {
  '--background': '270 7% 11%',
  '--foreground': '300 15% 90%',
  '--card': '270 7% 14%',
  '--card-foreground': '300 15% 90%',
  '--primary': '256 65% 80%',
  '--primary-foreground': '256 100% 18%',
  '--secondary': '270 7% 26%',
  '--secondary-foreground': '270 12% 88%',
  '--muted': '270 5% 22%',
  '--muted-foreground': '270 5% 70%',
  '--accent': '256 65% 80%',
  '--accent-foreground': '256 100% 18%',
  '--destructive': '6 86% 80%',
  '--destructive-foreground': '0 75% 18%',
  '--border': '270 5% 32%',
  '--input': '270 5% 32%',
  '--ring': '256 65% 80%',
};

const TOKEN_SETS = {
  lunar: { light: lunarLight, dark: lunarDark },
  ios: { light: iosLight, dark: iosDark },
  android: { light: androidLight, dark: androidDark },
} as const;

export type ResolvableTheme = Exclude<ThemeName, 'native'>;

export function resolveNativeTheme(platformOS: 'ios' | 'android' | 'web' | string): ResolvableTheme {
  if (platformOS === 'ios') return 'ios';
  if (platformOS === 'android') return 'android';
  return 'lunar';
}

export function getTokenSet(theme: ResolvableTheme, mode: ColorMode): TokenSet {
  return TOKEN_SETS[theme][mode];
}

export const themeVars = {
  lunar: { light: vars(lunarLight), dark: vars(lunarDark) },
  ios: { light: vars(iosLight), dark: vars(iosDark) },
  android: { light: vars(androidLight), dark: vars(androidDark) },
} as const;

// @deprecated
export const lightTheme = themeVars.lunar.light;
// @deprecated
export const darkTheme = themeVars.lunar.dark;

function hslToHex(hsl: string): string {
  const [h, s, l] = hsl.split(' ').map(Number.parseFloat);
  // s, l are 0-100, so normalize by /100 — the earlier /10000 desaturated every
  // color (e.g. the iOS blue accent rendered washed-out grey).
  const a = (s * Math.min(l, 100 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round((255 * color) / 100)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export type ThemeColors = {
  background: string; foreground: string;
  card: string; cardForeground: string;
  primary: string; primaryForeground: string;
  secondary: string; secondaryForeground: string;
  muted: string; mutedForeground: string;
  accent: string; accentForeground: string;
  destructive: string; destructiveForeground: string;
  border: string; input: string; ring: string;
};

function tokenSetToHex(set: TokenSet): ThemeColors {
  return {
    background: hslToHex(set['--background']),
    foreground: hslToHex(set['--foreground']),
    card: hslToHex(set['--card']),
    cardForeground: hslToHex(set['--card-foreground']),
    primary: hslToHex(set['--primary']),
    primaryForeground: hslToHex(set['--primary-foreground']),
    secondary: hslToHex(set['--secondary']),
    secondaryForeground: hslToHex(set['--secondary-foreground']),
    muted: hslToHex(set['--muted']),
    mutedForeground: hslToHex(set['--muted-foreground']),
    accent: hslToHex(set['--accent']),
    accentForeground: hslToHex(set['--accent-foreground']),
    destructive: hslToHex(set['--destructive']),
    destructiveForeground: hslToHex(set['--destructive-foreground']),
    border: hslToHex(set['--border']),
    input: hslToHex(set['--input']),
    ring: hslToHex(set['--ring']),
  };
}

export const themeColors = {
  lunar: { light: tokenSetToHex(lunarLight), dark: tokenSetToHex(lunarDark) },
  ios: { light: tokenSetToHex(iosLight), dark: tokenSetToHex(iosDark) },
  android: { light: tokenSetToHex(androidLight), dark: tokenSetToHex(androidDark) },
} as const;

// @deprecated
export const lightThemeColors = themeColors.lunar.light;
// @deprecated
export const darkThemeColors = themeColors.lunar.dark;
