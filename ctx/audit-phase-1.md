# Lunar Kit — Phase 0/1 Audit Report

Date: 2026-04-26
Scope: Web support, Expo Go safety, primitives gaps, theme system readiness across `@lunar-kit/core`.

---

## 0. Doc-State Reality Check (CLAUDE.md drift)

CLAUDE.md is wrong on docs layout:
- Says `docs-v2/` is stable; **`docs-v2/` does not exist** on disk.
- Says `docs/` is "abandoned"; **`docs/` is the live site** (Fumadocs + Next.js).
- Real demo dir: `docs/src/demo/` — already has 38 demo files (1:1 with components).
- Real mdx dir: `docs/content/docs/components/` — 38 mdx files.

**Action (Phase 0 follow-up):** rewrite CLAUDE.md docs section before any docs work to avoid future Claude sessions misrouting.

---

## 1. adaptive-modal — Issues Found

File: `packages/primitives/adaptive-modal/src/components/adaptive-modal.tsx`

| # | Severity | Issue | Fix |
|---|---|---|---|
| 1 | med | `present()` ref method is a no-op (controlled by `visible` prop only) — misleading API surface | Either remove `present`/`dismiss` from ref, or drop `visible` prop in favor of imperative control. Recommend: remove ref entirely (props-only) |
| 2 | high | Web: no ESC-to-close handler | Add `keydown` listener while `visible` |
| 3 | high | Web: no focus trap, no `role="dialog"`, no `aria-modal` | Add focus trap + ARIA attrs |
| 4 | med | Web: no body scroll lock while open | Toggle `document.body.style.overflow` |
| 5 | low | `require('react-dom')` in `portal.tsx` — works under webpack/Turbopack, but fragile under strict ESM | Replace with conditional `import { createPortal } from 'react-dom'` at top, gated by `Platform.OS === 'web'` and `typeof document !== 'undefined'` |
| 6 | low | Backdrop `<div>` has `display: flex flexDirection: column` but content slot then re-applies — redundant | Simplify wrapper |
| 7 | low | `closeOnBackdropPress` on native is wired to `onRequestClose` (Android back btn) — but no actual backdrop press on native. Caller responsible. Document this. | Add JSDoc clarifying native backdrop is caller's responsibility |
| 8 | med | No `animationType` story on web — flag exists but ignored on web path | Either implement web fade/slide via CSS transition, or document as native-only |

**Recommended Phase 2 fix order:** 1, 2, 3, 5, 4 (functional first, polish last).

---

## 2. bottom-sheet primitive — Critical Web Gap

File: `packages/primitives/bottom-sheet/src/components/bottom-sheet.tsx`

- Uses `Modal` from `react-native` directly (not `AdaptiveModal`).
- `react-native-web`'s `Modal` is partial/broken; sheets will not render correctly on web.
- Uses `GestureHandlerRootView` — RNGH supports web but root view must wrap docs site.

**Required:** swap raw `Modal` for `AdaptiveModal` (or inline web portal path), verify gesture-handler web setup in docs root.

---

## 3. Theme System — Current State vs Target

### Current (2-mode)
- `lib/theme.ts`: `lightTheme` / `darkTheme` via NativeWind `vars()`
- `stores/theme.ts`: `'light' | 'dark' | 'system'`
- `useThemeColors`: returns hex map for native APIs (icons, status bar)
- `ThemeProvider`: wraps app in View with token vars

### Target (4-theme × 2-mode = 8 token sets)
```
themes: {
  native:  { light, dark }   // alias → resolves to ios|android|lunar at runtime
  android: { light, dark }   // Material 3 tokens
  ios:     { light, dark }   // HIG tokens (system blue, less radius)
  lunar:   { light, dark }   // brand (default on web/tauri)
}
```

### Resolution rule
- `theme === 'native'`:
  - `Platform.OS === 'ios'` → ios tokens
  - `Platform.OS === 'android'` → android tokens
  - `Platform.OS === 'web'` → lunar tokens (web has no "native" platform UI)

### Token surface — what changes per theme

Color tokens (existing 17): differ per theme.

**New tokens needed beyond color** (some components need shape/size differences, not just color):
- `--radius-sm` / `--radius-md` / `--radius-lg` (ios = sharper, android = rounded, lunar = brand)
- `--font-family-sans` (ios SF, android Roboto, lunar = brand stack)
- `--btn-height-sm/md/lg` (ios slimmer, android beefier)

**Open question for user:** scope — start with color-only and add radius later, or do colors+radius+font in one pass? Recommend color+radius first; font requires asset wiring.

### Components affected by theme expansion (count)
- All 40. Token-driven via Tailwind classes already, so most update for free.
- Outliers (hard-coded hex via `useThemeColors`): 14 (see §5).

---

## 4. Component Audit Matrix (40 components)

Legend:
- **Web**: ✅ works as-is / ⚠️ minor fix / ❌ blocker
- **Expo Go**: ✅ safe / ⚠️ verify / ❌ needs prebuild
- **Primitive**: existing primitive used, or "—" if pure
- **Theme**: tokens-only / hex via hook / hardcoded
- **Tier**: 1 simple → 3 complex

| # | Component | Web | Expo Go | Primitive | Theme | Tier | Notes |
|---|-----------|-----|---------|-----------|-------|------|-------|
| 1 | text | ✅ | ✅ | — | tokens | 1 | RN Text → RNW Text. |
| 2 | separator | ✅ | ✅ | — | tokens | 1 | Pure View. |
| 3 | badge | ✅ | ✅ | — | tokens | 1 | View+Text. |
| 4 | avatar | ✅ | ✅ | — | tokens | 1 | RN Image → RNW. |
| 5 | skeleton | ⚠️ | ✅ | — | tokens | 1 | Reanimated web works; verify shimmer. |
| 6 | card | ✅ | ✅ | — | tokens | 1 | `shadow-*` Tailwind translates via NW. |
| 7 | empty-state | ✅ | ✅ | — | tokens | 1 | Composition only. |
| 8 | breadcrumb | ✅ | ✅ | — | hex | 1 | Pressable rows. |
| 9 | step-indicator | ✅ | ✅ | — | hex | 1 | View grid. |
| 10 | progress | ⚠️ | ✅ | — | tokens | 1 | Reanimated bar; verify width interp on web. |
| 11 | button | ✅ | ✅ | — | tokens | 1 | Pressable; pilot for theme rollout. |
| 12 | alert | ✅ | ✅ | — | hex | 1 | lucide icons RN→web OK. |
| 13 | banner | ✅ | ✅ | — | hex | 1 | Pressable close. |
| 14 | input | ⚠️ | ✅ | — | hex | 2 | `Platform.select` for ios/android padding; web falls through to default — verify. |
| 15 | textarea | ⚠️ | ✅ | — | hex | 2 | Same as input. |
| 16 | checkbox | ✅ | ✅ | — | hex | 2 | Pressable. |
| 17 | radio | ✅ | ✅ | — | tokens | 2 | Pressable. |
| 18 | radio-group | ✅ | ✅ | — | tokens | 2 | Composition. |
| 19 | switch | ⚠️ | ✅ | — | hex | 2 | Reanimated thumb; `shadow-sm` on white thumb — works. |
| 20 | search-bar | ⚠️ | ✅ | — | hex | 2 | Same input concerns. |
| 21 | input-otp | ⚠️ | ✅ | — | tokens | 2 | Reanimated cursor blink; verify. |
| 22 | tabs | ⚠️ | ✅ | — | tokens | 2 | RN Animated (not Reanimated) `useNativeDriver:false` — web OK. |
| 23 | accordion | ⚠️ | ✅ | — | hex | 2 | Reanimated height; verify layout anim on web. |
| 24 | toast | ⚠️ | ✅ | — | hex | 2 | RNGH swipe-to-dismiss; web needs `GestureHandlerRootView`. |
| 25 | toaster | ⚠️ | ✅ | — | tokens | 2 | safe-area-context — RNW polyfilled. |
| 26 | form | ✅ | ✅ | — | tokens | 2 | react-hook-form pure JS. |
| 27 | slider | ⚠️ | ✅ | — | tokens | 2 | RNGH pan; web needs root view. |
| 28 | carousel | ⚠️ | ✅ | — | tokens | 2 | FlatList → RNW renders as div w/ scroll; verify snap. |
| 29 | keyboard-avoiding-view | ⚠️ | ✅ | needs primitive? | tokens | 2 | Concept doesn't exist on web — should noop. Today it runs Keyboard listeners which RNW polyfills to no-events. **Action:** explicit `if (Platform.OS === 'web') return children`. |
| 30 | calendar | ✅ | ✅ | — | hex | 3 | dayjs pure JS. |
| 31 | date-picker | ✅* | ✅ | adaptive-modal (via Dialog) | hex | 3 | Inherits Dialog issues. |
| 32 | date-range-picker | ✅* | ✅ | adaptive-modal (via Dialog) | hex | 3 | Inherits Dialog issues. |
| 33 | dialog | ⚠️ | ✅ | adaptive-modal | tokens | 3 | RN `Animated` for entrance; web should keep transparent + use AdaptiveModal web path. |
| 34 | tooltip | ⚠️ | ✅ | adaptive-modal | tokens | 3 | Position calc uses RN measure; web works but verify scroll offset. |
| 35 | dropdown-menu | ⚠️ | ✅ | adaptive-modal | hex | 3 | Uses `StatusBar.currentHeight` android-only; OK fallback. |
| 36 | bottom-sheet | ❌ | ✅ | bottom-sheet (broken on web) | tokens | 3 | Primitive uses raw `Modal` → web broken. **Blocker.** |
| 37 | select-sheet | ❌ | ✅ | bottom-sheet (broken on web) | hex | 3 | Inherits bottom-sheet web break. |
| 38 | select | ⚠️ | ✅ | adaptive-modal (via Dialog) | hex | 3 | OK. |

*= works only after dialog/adaptive-modal a11y fixes

### Hex-via-`useThemeColors` outliers
14 components: alert, banner, breadcrumb, calendar, checkbox, date-picker, date-range-picker, dropdown-menu, input, search-bar, select, select-sheet, step-indicator, switch, textarea, toast, accordion.

These use hex colors for: lucide icon `color` prop, native input `placeholderTextColor`/`selectionColor`, etc. `useThemeColors` must extend to return all 4 themes' palettes. Refactor target: `useThemeTokens()` returning `{ colors, radii, fonts }` for active theme+mode.

---

## 5. Primitives — Gap Analysis

| Primitive | Status | Need |
|-----------|--------|------|
| `adaptive-modal` | exists, has issues | fix a11y + esc + scroll lock + ref API |
| `bottom-sheet` | exists, **web-broken** | swap raw `Modal` for AdaptiveModal/Portal path; verify RNGH on web |
| `tooltip-position` | none | optional — could extract floating-ui style positioning helper. Skip unless re-used elsewhere. |
| `popover` | none | dropdown-menu + tooltip share positioning logic. Could DRY into `@lunar-primitive/popover`. **Recommend defer until 2nd consumer emerges** (YAGNI). |

**No new primitives required for Phase 2/3** beyond bottom-sheet fix. Defer popover extraction.

---

## 6. Expo Go Safety — Full Sweep Result

Peer deps reviewed:
- `react-native-reanimated` — Expo Go ✅
- `react-native-gesture-handler` — Expo Go ✅
- `react-native-safe-area-context` — Expo Go ✅
- `react-native-screens` — Expo Go ✅
- `lucide-react-native` — Expo Go ✅
- `@react-native-async-storage/async-storage` — Expo Go ✅
- `nativewind` — Expo Go ✅

**No prebuild-required deps detected.** All 40 components are Expo Go safe.

---

## 7. Tier-Based Rollout Plan (Phase 3)

Phase 3 = component-by-component implementation. Tiers picked by complexity & dependency order.

### Tier 0 — Foundation (do first, blocks all)
1. Fix CLAUDE.md (docs path)
2. Fix adaptive-modal issues 1,2,3,5
3. Fix bottom-sheet primitive web path
4. Implement 4-theme system in `lib/theme.ts` + `stores/theme.ts` + `ThemeProvider`
5. Refactor `useThemeColors` → `useThemeTokens`
6. Wire docs root: `GestureHandlerRootView` + `ThemeProvider` + theme switcher UI

### Tier 1 — Primitives (token-only refresh, low risk)
text · separator · badge · avatar · skeleton · card · empty-state · breadcrumb · step-indicator · progress · button · alert · banner

### Tier 2 — Form & interactive (uses hooks/animations)
input · textarea · checkbox · radio · radio-group · switch · search-bar · input-otp · tabs · accordion · toast · toaster · form · slider · carousel · keyboard-avoiding-view

### Tier 3 — Modal-driven (depends on Tier 0 fixes)
calendar · date-picker · date-range-picker · dialog · tooltip · dropdown-menu · bottom-sheet · select-sheet · select

### Per-component checklist (Phase 3 unit of work)
1. Web compat verified in browser
2. Expo Go safe (already confirmed for all — re-verify no regression)
3. Hex outliers migrated to `useThemeTokens`
4. 4-theme tokens applied
5. Demo updated at `docs/src/demo/{X}Demo.tsx` with theme switcher
6. mdx updated at `docs/content/docs/components/{x}.mdx` with platform badges (🌐 📱 🖥️)
7. `bun changeset:create` (patch for theme refresh, minor if API changed)

---

## 8. Open Decisions Needed Before Phase 2

1. **Theme token surface:** colors-only first, or colors+radii+font in one pass?
2. **`useThemeColors` rename:** OK to rename to `useThemeTokens` (breaking import for consumers)? Or add new hook + deprecate?
3. **adaptive-modal `present()`/`dismiss()` ref:** remove (breaking) or keep no-op + deprecate?
4. **Popover primitive extraction:** defer (recommended) or do now?
5. **Tauri detection:** confirmed `Platform.OS === 'web'` is sufficient — no Tauri-specific branch needed.
6. **Theme switcher UX in docs:** dropdown in nav, or per-demo embedded switcher, or both?
7. **Default theme on web/tauri:** lunar (per spec) — confirm.
8. **`native` theme on web:** falls back to `lunar` — confirm (alternative: render native ios/android tokens on web for preview purposes).

---

## 9. Estimate

- Tier 0: 1–2 sessions (theme system is the bulk).
- Tier 1: 1 session (13 components, mostly token refresh + demo theme switcher).
- Tier 2: 2 sessions (16 components, animations to verify).
- Tier 3: 1–2 sessions (9 components, depends on Tier 0).

Total: ~5–7 focused sessions for full rollout.

---

## 10. Recommended Next Action

User decides §8 questions → proceed to **Phase 2 (Tier 0 foundation)**:
1. Fix CLAUDE.md docs paths
2. Fix adaptive-modal a11y issues
3. Fix bottom-sheet primitive web path
4. Implement 4-theme infra
5. Pilot on `button` (most-used component) end-to-end before scaling.
