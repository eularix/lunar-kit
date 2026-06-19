# Migrate `@lunar-kit/core` from NativeWind to `@lunar-kit/css`

This document briefs an AI agent (Claude Opus 4.7 or similar) on migrating the
`@lunar-kit/core` UI component library from **NativeWind** to **`@lunar-kit/css`**
(this project — a Tailwind v4 styling engine for React Native and Web).

## Context

- **Source**: `@lunar-kit/core` — a React Native reusable component library
  (similar in spirit to `react-native-reusables`). Currently styled via
  NativeWind v4. Components use `className` props and rely on NativeWind's
  babel plugin + runtime.
- **Target**: same components, same public API (`className` prop), styled via
  `@lunar-kit/css`. Drop NativeWind entirely.
- **Why**: cross-platform parity (NativeWind has known web edge cases,
  `@lunar-kit/css` runs the same resolver on iOS/Android/web), single brand
  family with the rest of the `@lunar-kit/*` scope, smaller runtime footprint.

The two libraries share intent but differ in mechanics. The migration is
mostly about swapping config + dependencies. Component source code uses
`className` strings on RN intrinsics — that contract is preserved.

## Pre-conditions

Before starting:

- The `lunar-kit` repo's monorepo / package layout is known. Components live
  under `packages/core/src/**/*.tsx` (or equivalent).
- `tsup` / `expo-modules` / similar build pipeline ships the package.
- Tests currently pass against NativeWind. Capture baseline counts before
  changing anything.

## Package surface diff

| Concern | NativeWind | `@lunar-kit/css` |
| :-- | :-- | :-- |
| Install | `nativewind tailwindcss` | `@lunar-kit/css` (peer-dep `react-native`) |
| Babel plugin | `nativewind/babel` (auto via preset) | None — Metro transformer instead |
| Metro config wrapper | `withNativeWind(config, { input: './global.css' })` | `withLunarCSS(config)` |
| Tailwind config | `tailwind.config.js` | `lunar.config.ts` (different schema — see below) |
| Web pipeline | Tailwind CSS via PostCSS | NONE (`@lunar-kit/css` runs same resolver on web — react-native-web emits atomic CSS from style obj). Drop PostCSS / `global.css` / `@import "tailwindcss"` for web. |
| className transform target | `cssInterop` HOC at runtime | Build-time AST rewrite to `style={__lcssTw('...')}` |
| Custom tokens | `theme.extend.colors` etc in `tailwind.config.js` | `theme.extend.colors` etc in `lunar.config.ts` (similar shape, ts-typed) |

## Concrete migration steps

### 1. Dependency swap

Remove NativeWind + Tailwind:

```bash
pnpm remove nativewind tailwindcss
# also: tailwind preset/plugin, postcss-related deps if any
```

Install `@lunar-kit/css`:

```bash
pnpm add @lunar-kit/css
```

In monorepo: add to the package(s) that consume `className`. Typically
`packages/core/package.json` and any consuming app.

### 2. Drop NativeWind config files

Delete:

- `tailwind.config.{js,ts}` (replaced by `lunar.config.ts`)
- `nativewind-env.d.ts` if present
- `global.css` if it only contained `@tailwind base/components/utilities`
- `app/_layout.tsx` `import './global.css'` line — `@lunar-kit/css` does NOT
  need a CSS import on web. The runtime hydrates tokens automatically.

### 3. Run `lunar-css init` in each consuming app

`@lunar-kit/css` ships a CLI:

```bash
npx lunar-css init
```

Does the equivalent of NativeWind's setup:

- creates `lunar.config.ts` (token source of truth)
- patches `metro.config.js` to call `withLunarCSS(...)` (idempotent — preserves
  existing config via AST merge)
- adds `.lunarcss/` to `.gitignore`
- wires `lunar-css/types` ambient TS module so `className` prop is typed on
  every RN component (no need to manually augment View/Text/etc.)

DO NOT modify the generated files unless required. Re-running the CLI is safe.

### 4. Translate `tailwind.config.js` → `lunar.config.ts`

NativeWind's tailwind config:

```js
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        accent: '#f59e0b',
      },
      spacing: {
        card: '24px',
      },
    },
  },
  presets: [require('nativewind/preset')],
}
```

becomes:

```ts
import { defineConfig } from '@lunar-kit/css'

export default defineConfig({
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        accent: '#f59e0b',
      },
      spacing: {
        card: '24px',
      },
    },
  },
})
```

**Differences**:

- No `content` field — `@lunar-kit/css` transformer scans every JS/TS file
  Metro processes (skipping `node_modules`).
- No `presets` — `@lunar-kit/css` supports Tailwind v4's full default scale
  (incl. the v3 named palette as a fallback: `bg-zinc-900`, `text-slate-500`,
  etc.) without configuration.
- `borderRadius` → `borderRadius` (same key, same shape).
- `fontSize` ON HOLD: `@lunar-kit/css` uses `fontSize` as `[size, lineHeight]`
  tuples like Tailwind v4. Verify each entry. If NativeWind config used a
  string-only form, wrap as a tuple or split into separate `--text-...`
  + `--text-...--line-height` tokens.
- Modifiers like `dark:`, `ios:`, `android:`, `web:`, `active:`, `sm:` etc.
  work the same way — no change to className strings.

### 5. Remove NativeWind's babel preset entry

In `babel.config.js`, drop:

```js
plugins: [
  // remove
  'nativewind/babel',
]
```

`@lunar-kit/css` does NOT use a babel plugin — it runs at the Metro
transformer layer (after Babel), avoiding JSX-pipeline conflicts with
Reanimated. Keep `react-native-reanimated/plugin` LAST in the plugins array
if Reanimated is in use.

### 6. Audit component source for NativeWind-specific APIs

Search and replace these patterns:

| NativeWind API | Replacement |
| :-- | :-- |
| `import { cssInterop } from 'nativewind'` | DELETE the import. Use `styledComponent` from `@lunar-kit/css` for non-intrinsic components: `const Wrapped = styledComponent(MyComp, { styleProps: ['style', 'tintStyle'] })`. |
| `cssInterop(Component, { className: 'style' })` | `styledComponent(Component)` |
| `cssInterop(C, { className: 'style', otherStyle: { target: 'otherStyle', nativeStyleToProp: { ... } } })` | `styledComponent(C, { styleProps: ['style', 'otherStyle'] })`. Multi-style components automatically pair `<x>Style` ↔ `<x>ClassName`. |
| `import { useColorScheme } from 'nativewind'` | Use RN's built-in `useColorScheme` from `react-native`. `@lunar-kit/css` reads color scheme reactively via its own bridge (`Appearance.addChangeListener`); the `dark:` modifier just works. |
| `vars({ '--my-color': 'red' })` (NativeWind-specific) | `setTokens({ '--my-color': 'red' })` from `@lunar-kit/css`. |
| `useColorTheme()` runtime hooks | Use `useLunarCSS()` hook for `tw(classes)` and `token(name)` lookups in non-className contexts (StatusBar tints, animated values). |

**Key invariant to preserve**: components keep their `className` prop on the
public API. Consumers shouldn't notice the swap.

Whitelisted RN components that get `className` automatically (no wrapper
needed): View, Text, Image, ImageBackground, ScrollView, FlatList,
SectionList, VirtualizedList, TextInput, TouchableOpacity,
TouchableHighlight, TouchableWithoutFeedback, Pressable, SafeAreaView,
Modal, ActivityIndicator, KeyboardAvoidingView, Switch.

### 7. Multi-style prop components

NativeWind exposes `<x>Style` ↔ `<x>ClassName` via cssInterop config.
`@lunar-kit/css` does the same convention automatically:

| Component | Style props | className props |
| :-- | :-- | :-- |
| ScrollView, FlatList, SectionList, VirtualizedList | `style` `contentContainerStyle` | `className` `contentContainerClassName` |
| ImageBackground | `style` `imageStyle` | `className` `imageClassName` |
| Everything else | `style` | `className` |

For third-party components (LinearGradient, BlurView, etc.) wrap with
`styledComponent(C, { styleProps: ['style', 'tintStyle', ...] })`.

### 8. Animation / transitions

`@lunar-kit/css` transition utilities (`transition-colors`, `duration-300`,
`ease-in-out`, `delay-*`) declare CSS time strings (`"300ms"`) on the style
object. On web, RN-Web converts these into real CSS transitions. **On native,
`<View>` does NOT animate inline style changes** — same as NativeWind in
isolation.

If `@lunar-kit/core` has animated components, drive them with Reanimated:

```tsx
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated'
import { __lcssTw } from '@lunar-kit/css/runtime'

const baseStyle = __lcssTw('rounded-card bg-primary p-card')
const scale = useSharedValue(1)
const aStyle = useAnimatedStyle(() => ({ ...baseStyle, transform: [{ scale: scale.value }] }))

<Animated.View style={aStyle} />
```

NativeWind's `react-native-css-interop` runtime did some of this work
implicitly. Replace with explicit Reanimated drivers.

### 9. Web specifics

NativeWind shipped Tailwind via PostCSS for web. `@lunar-kit/css` does NOT.
If the consuming app:

- Was importing `global.css` for web only — DELETE the import.
- Had `postcss.config.js` only for NativeWind — DELETE it.
- Had `tailwind.config.js` only for web — DELETE it.

react-native-web atomic CSS is generated from the resolved style object —
no Tailwind needed on the DOM. (Reason: RN-Web strips `className` from
View/Text primitives at render time anyway, so even a fully-configured
Tailwind couldn't apply utilities to the DOM. Lunar resolver runs everywhere.)

### 10. Type augmentation

NativeWind's `nativewind-env.d.ts` augments RN core component types to accept
`className`. `@lunar-kit/css` does this via the `lunar-css/types` reference.

`lunar-css init` adds `/// <reference types="@lunar-kit/css/types" />` to the
project's entry file (e.g. `app/_layout.tsx` for Expo Router). If you have an
existing `tsconfig.json` with explicit `compilerOptions.types`, the CLI
appends `@lunar-kit/css/types` to the array instead. No manual augmentation
needed in component source.

### 11. Validation

After migration:

```bash
# 1. Build the package
pnpm build

# 2. Run library tests (Vitest, Jest, etc.)
pnpm test

# 3. Run the example/demo app for the library
pnpm dev   # or expo start --clear
```

**Required outcomes**:

- All component tests still pass.
- Demo app renders identically to the NativeWind version on iOS, Android,
  AND web.
- Hot-reload of `lunar.config.ts` token edits propagates without restart
  (saves a Metro restart vs NativeWind which had similar caveats).
- `tw -1 origin/main` shows no leaked NativeWind references.

### 12. Cleanup checklist

Before committing:

- [ ] `tailwind.config.{js,ts}` removed
- [ ] `nativewind-env.d.ts` removed
- [ ] `global.css` removed (or repurposed if app uses CSS for non-Tailwind)
- [ ] `babel.config.js` no longer references `nativewind/babel`
- [ ] `metro.config.js` calls `withLunarCSS(...)` instead of `withNativeWind(...)`
- [ ] No `import 'nativewind'` or `import { ... } from 'nativewind'` anywhere
- [ ] `package.json` deps list `@lunar-kit/css`, no `nativewind` / `tailwindcss`
- [ ] `lunar.config.ts` exists and contains all the project's tokens
- [ ] `npx lunar-css init` ran successfully and printed a green report
- [ ] First boot was preceded by `expo start --clear` (Metro cache clear is
      required ONCE after install — `lunar-css init` warns about this)

## Common pitfalls

1. **Forgetting `--clear` on first run.** Metro caches files transformed
   before the LunarCSS transformer was wired into `metro.config.js`. Skip
   the clear → classes appear unstyled until restart. Always `--clear` once
   after `lunar-css init`.

2. **Importing `nativewind` from a leftover file.** Search for `nativewind`
   in source after the swap; any residual import will fail at build time.

3. **Custom `cssInterop` configurations.** Each one needs a corresponding
   `styledComponent` wrapper. Map style prop names 1:1 — the convention
   `<x>Style` ↔ `<x>ClassName` is the same.

4. **Tailwind v3-only utilities.** NativeWind tracks Tailwind v3.
   `@lunar-kit/css` is built on Tailwind v4 syntax + the v3 named-palette
   fallback. Most utilities work identically; uncommon v3-only utilities
   may need an arbitrary value (`bg-[#abc]`) or token in `lunar.config.ts`.

5. **Web build pipeline assumptions.** NativeWind required Tailwind +
   PostCSS for web. `@lunar-kit/css` does NOT. If the project's web build
   currently has `@tailwindcss/postcss` etc. only because of NativeWind,
   remove all of them. Keep them only if other parts of the app
   independently use Tailwind CSS at the DOM level.

6. **Reanimated plugin order.** `react-native-reanimated/plugin` MUST be
   the LAST entry in `babel.config.js` plugins. NativeWind users were used
   to keeping it last; preserve that.

## Reference

- `@lunar-kit/css` docs: <https://github.com/eularixs/lunarcss>
- Migrate API table → see "Package surface diff" above.
- Multi-style prop convention → see step 7.
- `styledComponent` examples → see `docs/content/docs/features/styled-component.mdx`.
- Programmatic APIs (`useLunarCSS`, `vars`, `lunarTheme`) → see `docs/content/docs/features/programmatic-apis.mdx`.

## Out of scope for this migration

- Re-skinning components (visual changes). Keep the design 1:1 with the
  NativeWind version.
- Adding new components or props. Pure swap.
- Changing the build tool (tsup, expo-modules, etc.).
- Moving the package to a different monorepo or scope.

If any of those are needed, do them in separate PRs after the migration
lands clean.

---

**Hand-off note for the executing agent**: read the lunar-kit repo, run
the steps in order, run the validation suite after each major step (build,
test, demo). If a test breaks, FIX before moving on. Do NOT batch-skip
tests. The migration must keep the public API of every component
identical — the only change is the styling engine underneath.
