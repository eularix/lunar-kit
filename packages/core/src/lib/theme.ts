// lib/theme.ts — 5-palette system from Claude Design (LUNAR-DESIGN-V2.md)
// Palettes: space (default) | forest | sunset | aurora | mono
//
// OKLCH primitives → sRGB hex at module load. Reanimated `interpolateColor`,
// RN `placeholderTextColor`, `tintColor` etc. accept hex universally.
import { lunarTheme as vars } from '@lunar-kit/css';

export type Palette = 'space' | 'forest' | 'sunset' | 'aurora' | 'mono';
export type Mode = 'light' | 'dark';
export const PALETTES: readonly Palette[] = ['space', 'forest', 'sunset', 'aurora', 'mono'] as const;

/* ---------- OKLCH → sRGB hex conversion (Björn Ottosson 2020) ---------- */

function oklchToHex(s: string): string {
  if (!s.startsWith('oklch')) return s; /* passthrough hex/rgb literals */
  const m = s.match(/oklch\(\s*([^/)]+?)(?:\s*\/\s*([^)]+))?\s*\)/);
  if (!m) return s;
  const parts = m[1].trim().split(/\s+/).map(Number.parseFloat);
  const [L, C, H] = parts;
  const alpha = m[2] ? Math.max(0, Math.min(1, Number.parseFloat(m[2]))) : 1;
  const a = Math.cos((H * Math.PI) / 180) * C;
  const b = Math.sin((H * Math.PI) / 180) * C;
  const lp = L + 0.3963377774 * a + 0.2158037573 * b;
  const mp = L - 0.1055613458 * a - 0.0638541728 * b;
  const sp = L - 0.0894841775 * a - 1.291485548  * b;
  const l3 = lp ** 3, m3 = mp ** 3, s3 = sp ** 3;
  let r =  4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  let bl = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;
  const toByte = (v: number) => {
    const c = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(Math.max(v, 0), 1 / 2.4) - 0.055;
    return Math.round(Math.max(0, Math.min(1, c)) * 255).toString(16).padStart(2, '0');
  };
  const hex = `#${toByte(r)}${toByte(g)}${toByte(bl)}`;
  if (alpha < 1) return `${hex}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
  return hex;
}

/* ---------- PRIMITIVE: per-palette gray + brand ramps (OKLCH) ---------- */

type Ramp = Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>;

const grayRamps: Record<Palette, Ramp> = {
  space: {
    50:  'oklch(0.985 0.003 270)', 100: 'oklch(0.965 0.005 270)', 200: 'oklch(0.928 0.008 270)',
    300: 'oklch(0.873 0.011 270)', 400: 'oklch(0.715 0.014 270)', 500: 'oklch(0.575 0.017 270)',
    600: 'oklch(0.475 0.018 270)', 700: 'oklch(0.380 0.020 270)', 800: 'oklch(0.275 0.022 270)',
    900: 'oklch(0.195 0.024 270)', 950: 'oklch(0.135 0.022 270)',
  },
  forest: {
    50:  'oklch(0.985 0.004 150)', 100: 'oklch(0.962 0.006 150)', 200: 'oklch(0.922 0.008 150)',
    300: 'oklch(0.865 0.010 150)', 400: 'oklch(0.705 0.013 150)', 500: 'oklch(0.560 0.015 150)',
    600: 'oklch(0.460 0.017 150)', 700: 'oklch(0.365 0.019 150)', 800: 'oklch(0.260 0.020 150)',
    900: 'oklch(0.180 0.022 150)', 950: 'oklch(0.120 0.020 150)',
  },
  sunset: {
    50:  'oklch(0.987 0.006 60)', 100: 'oklch(0.965 0.010 60)', 200: 'oklch(0.928 0.014 60)',
    300: 'oklch(0.870 0.018 55)', 400: 'oklch(0.708 0.022 50)', 500: 'oklch(0.565 0.024 45)',
    600: 'oklch(0.465 0.025 40)', 700: 'oklch(0.370 0.024 35)', 800: 'oklch(0.265 0.022 30)',
    900: 'oklch(0.190 0.022 25)', 950: 'oklch(0.130 0.022 25)',
  },
  aurora: {
    50:  'oklch(0.985 0.004 200)', 100: 'oklch(0.962 0.007 200)', 200: 'oklch(0.924 0.009 200)',
    300: 'oklch(0.867 0.011 200)', 400: 'oklch(0.708 0.014 200)', 500: 'oklch(0.565 0.016 200)',
    600: 'oklch(0.465 0.018 200)', 700: 'oklch(0.370 0.020 200)', 800: 'oklch(0.265 0.022 200)',
    900: 'oklch(0.185 0.024 200)', 950: 'oklch(0.125 0.022 200)',
  },
  mono: {
    50: 'oklch(0.985 0 0)', 100: 'oklch(0.965 0 0)', 200: 'oklch(0.928 0 0)',
    300: 'oklch(0.873 0 0)', 400: 'oklch(0.715 0 0)', 500: 'oklch(0.575 0 0)',
    600: 'oklch(0.475 0 0)', 700: 'oklch(0.380 0 0)', 800: 'oklch(0.275 0 0)',
    900: 'oklch(0.195 0 0)', 950: 'oklch(0.130 0 0)',
  },
};

const brandRampsLight: Record<Palette, Ramp> = {
  space: {
    50:  'oklch(0.972 0.018 280)', 100: 'oklch(0.940 0.040 280)', 200: 'oklch(0.880 0.080 280)',
    300: 'oklch(0.800 0.130 280)', 400: 'oklch(0.700 0.180 280)', 500: 'oklch(0.600 0.200 280)',
    600: 'oklch(0.520 0.205 280)', 700: 'oklch(0.450 0.195 280)', 800: 'oklch(0.370 0.165 280)',
    900: 'oklch(0.290 0.130 280)', 950: 'oklch(0.205 0.090 280)',
  },
  forest: {
    50:  'oklch(0.972 0.025 155)', 100: 'oklch(0.940 0.055 155)', 200: 'oklch(0.880 0.105 155)',
    300: 'oklch(0.795 0.150 155)', 400: 'oklch(0.690 0.170 155)', 500: 'oklch(0.580 0.155 155)',
    600: 'oklch(0.490 0.140 155)', 700: 'oklch(0.405 0.120 155)', 800: 'oklch(0.320 0.095 155)',
    900: 'oklch(0.245 0.075 155)', 950: 'oklch(0.170 0.055 155)',
  },
  sunset: {
    50:  'oklch(0.975 0.022 50)', 100: 'oklch(0.945 0.050 45)', 200: 'oklch(0.890 0.100 40)',
    300: 'oklch(0.815 0.155 35)', 400: 'oklch(0.720 0.185 32)', 500: 'oklch(0.640 0.190 30)',
    600: 'oklch(0.560 0.190 28)', 700: 'oklch(0.475 0.175 26)', 800: 'oklch(0.385 0.150 24)',
    900: 'oklch(0.295 0.115 22)', 950: 'oklch(0.205 0.085 22)',
  },
  aurora: {
    50:  'oklch(0.972 0.025 195)', 100: 'oklch(0.940 0.055 195)', 200: 'oklch(0.880 0.100 195)',
    300: 'oklch(0.800 0.140 195)', 400: 'oklch(0.720 0.155 195)', 500: 'oklch(0.625 0.150 195)',
    600: 'oklch(0.535 0.140 195)', 700: 'oklch(0.445 0.125 195)', 800: 'oklch(0.355 0.105 195)',
    900: 'oklch(0.270 0.080 195)', 950: 'oklch(0.190 0.060 195)',
  },
  mono: {
    50: 'oklch(0.965 0 0)', 100: 'oklch(0.928 0 0)', 200: 'oklch(0.873 0 0)',
    300: 'oklch(0.715 0 0)', 400: 'oklch(0.475 0 0)', 500: 'oklch(0.275 0 0)',
    600: 'oklch(0.195 0 0)', 700: 'oklch(0.155 0 0)', 800: 'oklch(0.115 0 0)',
    900: 'oklch(0.080 0 0)', 950: 'oklch(0.040 0 0)',
  },
};

/* mono brand inverts in dark mode so primary buttons read */
const monoBrandDark: Ramp = {
  50: 'oklch(0.040 0 0)', 100: 'oklch(0.080 0 0)', 200: 'oklch(0.155 0 0)',
  300: 'oklch(0.275 0 0)', 400: 'oklch(0.475 0 0)', 500: 'oklch(0.715 0 0)',
  600: 'oklch(0.873 0 0)', 700: 'oklch(0.928 0 0)', 800: 'oklch(0.962 0 0)',
  900: 'oklch(0.985 0 0)', 950: 'oklch(1.000 0 0)',
};

function brandRamp(palette: Palette, mode: Mode): Ramp {
  if (palette === 'mono' && mode === 'dark') return monoBrandDark;
  return brandRampsLight[palette];
}

/* ---------- PRIMITIVE: shared state ramps (palette-agnostic) ---------- */

const red = { 100: 'oklch(0.945 0.030 20)', 500: 'oklch(0.625 0.220 22)', 600: 'oklch(0.555 0.230 22)' };

/* ---------- SEMANTIC: shadcn-shaped tokens per palette × mode ---------- */

export type ThemeVars = {
  '--background': string; '--foreground': string;
  '--card': string; '--card-foreground': string;
  '--primary': string; '--primary-foreground': string;
  '--secondary': string; '--secondary-foreground': string;
  '--muted': string; '--muted-foreground': string;
  '--accent': string; '--accent-foreground': string;
  '--destructive': string; '--destructive-foreground': string;
  '--border': string; '--input': string; '--ring': string;
};

/* dark surfaces — all palettes share cool-indigo dark surfaces (per design spec) */
const DARK_SURFACES = {
  base:    'oklch(0.155 0.020 275)',
  raised:  'oklch(0.195 0.022 275)',
  sunken:  'oklch(0.125 0.018 275)',
  border:  'oklch(0.305 0.024 275)',
  fieldBorder: 'oklch(0.305 0.024 275)',
  secondary:   'oklch(0.265 0.022 275)',
};

function buildVars(palette: Palette, mode: Mode): ThemeVars {
  const gray = grayRamps[palette];
  const brand = brandRamp(palette, mode);
  const isMono = palette === 'mono';

  const raw: ThemeVars =
    mode === 'light'
      ? {
          '--background': gray[50],
          '--foreground': gray[950],
          '--card': '#ffffff',
          '--card-foreground': gray[950],
          '--primary': brand[600],
          '--primary-foreground': 'oklch(0.985 0.003 270)',
          '--secondary': gray[100],
          '--secondary-foreground': gray[900],
          '--muted': gray[100],
          '--muted-foreground': gray[600],
          '--accent': gray[100],
          '--accent-foreground': gray[900],
          '--destructive': red[600],
          '--destructive-foreground': '#ffffff',
          '--border': gray[300],
          '--input': gray[300],
          '--ring': brand[600],
        }
      : {
          '--background': DARK_SURFACES.base,
          '--foreground': gray[50],
          '--card': DARK_SURFACES.raised,
          '--card-foreground': gray[50],
          '--primary': brand[500],
          '--primary-foreground': isMono ? gray[950] : 'oklch(0.985 0.003 270)',
          '--secondary': DARK_SURFACES.secondary,
          '--secondary-foreground': gray[100],
          '--muted': DARK_SURFACES.sunken,
          '--muted-foreground': gray[400],
          '--accent': DARK_SURFACES.secondary,
          '--accent-foreground': gray[100],
          '--destructive': red[500],
          '--destructive-foreground': '#ffffff',
          '--border': DARK_SURFACES.border,
          '--input': DARK_SURFACES.fieldBorder,
          '--ring': brand[400],
        };

  /* Convert all OKLCH strings to sRGB hex for universal RN/Reanimated compat. */
  const out = {} as ThemeVars;
  for (const k of Object.keys(raw) as Array<keyof ThemeVars>) {
    out[k] = oklchToHex(raw[k]);
  }
  return out;
}

/* ---------- Public exports ---------- */

type ThemePack = Record<Palette, { light: ReturnType<typeof vars>; dark: ReturnType<typeof vars> }>;

function buildPack(): ThemePack {
  const out = {} as ThemePack;
  for (const p of PALETTES) {
    out[p] = {
      light: vars(buildVars(p, 'light')),
      dark: vars(buildVars(p, 'dark')),
    };
  }
  return out;
}

export const themeVars = buildPack();

/** Resolve raw token map for (palette, mode). Used by useThemeTokens. */
export function getThemeVars(palette: Palette, mode: Mode): ThemeVars {
  return buildVars(palette, mode);
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

export function getThemeColors(palette: Palette, mode: Mode): ThemeColors {
  const v = buildVars(palette, mode);
  return {
    background: v['--background'], foreground: v['--foreground'],
    card: v['--card'], cardForeground: v['--card-foreground'],
    primary: v['--primary'], primaryForeground: v['--primary-foreground'],
    secondary: v['--secondary'], secondaryForeground: v['--secondary-foreground'],
    muted: v['--muted'], mutedForeground: v['--muted-foreground'],
    accent: v['--accent'], accentForeground: v['--accent-foreground'],
    destructive: v['--destructive'], destructiveForeground: v['--destructive-foreground'],
    border: v['--border'], input: v['--input'], ring: v['--ring'],
  };
}

/** @deprecated Use `themeVars.space.light`. */
export const lightTheme = themeVars.space.light;
/** @deprecated Use `themeVars.space.dark`. */
export const darkTheme = themeVars.space.dark;
/** @deprecated Use `getThemeColors('space', 'light')`. */
export const lightThemeColors = getThemeColors('space', 'light');
/** @deprecated Use `getThemeColors('space', 'dark')`. */
export const darkThemeColors = getThemeColors('space', 'dark');
