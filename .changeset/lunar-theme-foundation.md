---
"@lunar-kit/core": minor
---

Add 4-theme system: `lunar` (default), `ios` (Apple HIG), `android` (Material 3), `native` (auto-resolves to platform). Each theme has light + dark color tokens.

- New `useThemeTokens()` hook returns `{ colors, theme, mode }` for the active resolved theme.
- `useThemeColors()` kept as a deprecated shim — delegates to `useThemeTokens`.
- `useThemeStore` now exposes `theme` (`lunar | ios | android | native`) and `colorScheme` (`light | dark | system`) separately. **Migration:** previous `theme: 'light' | 'dark' | 'system'` callers should now use `colorScheme` instead.
- `ThemeProvider` resolves the active theme + mode and applies token vars via NativeWind.
- New named exports from `@/lib/theme`: `themeVars`, `themeColors`, `getTokenSet`, `resolveNativeTheme`, types `ThemeName`, `ColorMode`, `ResolvableTheme`, `ThemeColors`.
- Old exports `lightTheme` / `darkTheme` / `lightThemeColors` / `darkThemeColors` retained as deprecated aliases for `lunar.light` / `lunar.dark`.
- `Button`: `ActivityIndicator` color now derived from theme tokens instead of hardcoded hex — adapts to active theme automatically.
- Added `DOM` to TS lib for web typings (transitive primitives).
- Fixed pre-existing pre-existing `StyleSheet.absoluteFillObject` typing in `dialog`/`dropdown-menu`/`tooltip`.
- Fixed pre-existing duplicate `SelectOption` export from `select` + `select-sheet`.
