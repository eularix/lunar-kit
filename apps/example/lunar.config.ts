import { defineConfig } from '@lunar-kit/css'

/* Default (light) theme tokens for @lunar-kit/core. Concrete sRGB hex — NOT
   CSS `var(--x)`, which LunarCSS cannot resolve on native (no var() cascade).
   ThemeProvider swaps the whole set at runtime via updateTheme() for dark mode
   (see apps/example/src/lib/theme.ts). Keep these in sync with lightTokens. */
export default defineConfig({
  tailwindVersion: 3,
  theme: {
    extend: {
      colors: {
        border: '#e2e8f0',
        input: '#e2e8f0',
        ring: '#18181b',
        background: '#ffffff',
        foreground: '#020817',
        primary: '#18181b',
        'primary-foreground': '#fafafa',
        secondary: '#f1f5f9',
        'secondary-foreground': '#0f172a',
        destructive: '#ef4444',
        'destructive-foreground': '#f8fafc',
        muted: '#f1f5f9',
        'muted-foreground': '#64748b',
        accent: '#f1f5f9',
        'accent-foreground': '#0f172a',
        card: '#ffffff',
        'card-foreground': '#020817',
      },
    },
  },
})
