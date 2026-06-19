# Lunar Kit — Design System Specification

> **Audience:** an AI agent (Claude Opus 4.7+) that will design and harden the
> Lunar Kit visual system **before** the codebase is migrated from NativeWind
> to `@lunar-kit/css` (see `MIGRATE-LUNAR-KIT.md`).
>
> **Goal of this doc:** capture the current design state, identify gaps, and
> propose a coherent token + component design system that will be the source
> of truth for the migration. The migration itself does NOT redesign anything
> visually — it ports tokens and class strings 1:1. So whatever this doc lands
> on becomes the contract.

---

## 0. How to use this doc

1. Read **§1 — Existing Design Snapshot** end-to-end. Do not skip; the
   migration depends on understanding what is already shipped.
2. Read **§2 — Gaps & Pain Points** to understand what is missing or
   inconsistent today.
3. Use **§3 — Proposed Design System** as the design target. Before
   implementing, surface decisions to the user in a short write-up
   (3-5 bullets) and wait for sign-off.
4. After sign-off, encode the system into **§4 — Token Spec** in the format
   that will drop straight into `lunar.config.ts` (the `@lunar-kit/css`
   config). The migration agent will consume that section verbatim.
5. **Do not change component source code in this phase.** This doc precedes
   migration; component edits happen in the migration PR(s).

---

## 1. Existing Design Snapshot

### 1.1 Stack

- React Native components, NativeWind v4, Tailwind v3 (locked — see
  `CLAUDE.md`).
- 38 components in `packages/core/src/components/ui/` — full inventory with
  files / LOC / migration-risk tags in **§1.7** below.
- Variants authored with `class-variance-authority` (CVA).
- Styling pattern: NativeWind `className` strings + occasional inline
  `style={{...colors.x}}` reads via `useThemeTokens()` / `useThemeColors()`
  for things NativeWind cannot drive (e.g. `ActivityIndicator color`,
  `placeholderTextColor`).

### 1.2 Theme matrix

Source of truth: [packages/core/src/lib/theme.ts](packages/core/src/lib/theme.ts).

| Theme name | Provenance | Modes | Status |
| :-- | :-- | :-- | :-- |
| `lunar` | shadcn/ui zinc-style brand default | light, dark | shipped |
| `ios` | Apple HIG (systemBlue, neutral grays) | light, dark | shipped |
| `android` | Material 3 baseline (#6750A4 purple) | light, dark | shipped |
| `native` | runtime alias → resolves to `ios` / `android` / `lunar` (web) | n/a | shipped |

Each theme is a `TokenSet` of 17 keys (HSL triplets, no `hsl()` wrapper):

```
--background          --foreground
--card                --card-foreground
--primary             --primary-foreground
--secondary           --secondary-foreground
--muted               --muted-foreground
--accent              --accent-foreground
--destructive         --destructive-foreground
--border  --input  --ring
```

Tokens are pre-baked via NativeWind's `vars(...)` into `themeVars[theme][mode]`
and applied at the root `<View>` of `ThemeProvider`. There is also a
hex-mirrored `themeColors[theme][mode]` for places that need a literal
color (e.g. spinners, placeholders, status bar tint).

### 1.3 Theme provider behavior

[packages/core/src/providers/theme-provider.tsx](packages/core/src/providers/theme-provider.tsx):

- Reads `theme` (`lunar | ios | android | native`) and `colorScheme`
  (`light | dark | system`) from `useThemeStore()`.
- Resolves `native` via `Platform.OS`.
- Resolves `system` via RN `useColorScheme()`.
- Calls NativeWind's `useColorScheme().setColorScheme(activeMode)` to flip
  the `dark:` variant.
- Wraps children in a single `<View style={tokens}>` so `bg-background` /
  `text-foreground` resolve through the active token set.
- Drives `<StatusBar>` `barStyle` from active mode.

### 1.4 Component-level conventions (today)

From [packages/core/src/components/ui/button.tsx](packages/core/src/components/ui/button.tsx)
and [packages/core/src/components/ui/input.tsx](packages/core/src/components/ui/input.tsx):

- **CVA** for variant matrices (variant × size × disabled).
- **Two parallel CVA defs** are common: one for the wrapper, one for the
  inner text (`buttonVariants` + `buttonTextVariants`). The text variant
  must mirror the wrapper variant.
- **className-overridable**: every component accepts at minimum
  `className`; multi-region components add `<region>ClassName` siblings
  (e.g. `containerClassName` + `inputClassName`, `textClassName`).
- **Hex fallback for non-className surfaces:** `useThemeColors()` /
  `useThemeTokens()` return resolved hex values for spinners, placeholders,
  status bar, gesture overlays, etc.
- **Web overrides:** `web:h-10` style modifiers handle the consistent web
  height vs. the slightly taller native field (e.g. `web:h-9 h-10`).
- **Sizes:** components ship 3-4 sizes (`sm | md/default | lg`, plus
  occasional `icon`). No global density token — each component encodes its
  own size scale inline.

### 1.5 Spacing / radius / typography (implicit)

There is **no extended Tailwind theme** beyond colors. The current
`tailwind.config.js` only extends `colors`. Spacing, radius, font-size,
shadow, etc. all use Tailwind defaults. That means:

- Border radius: `rounded-md` (6px), `rounded-lg` (8px), `rounded-full`,
  hand-picked per component. No semantic radius tokens
  (`rounded-card`, `rounded-control`, etc.).
- Typography: `text-xs|sm|base|lg|xl|2xl` etc. with default Tailwind sizes.
  No semantic sizes (`text-body`, `text-caption`, `text-display`).
- Spacing: default Tailwind 4px scale. No semantic spacing
  (`p-card`, `gap-stack`, etc.).
- Shadow: `shadow-*` is unsafe on RN (forbidden per `CLAUDE.md`). Components
  that need elevation either use `boxShadow` in a `.web.tsx` fork or skip
  elevation entirely on native.

### 1.6 What works well today

- **Multi-platform theme matrix.** Lunar / iOS / Android with `native`
  auto-resolution is a strong differentiator. Keep this.
- **HSL-channel tokens.** Storing `H S L` triplets (no `hsl()` wrapper)
  enables alpha-channel composition (`bg-primary/50`). Keep.
- **Foreground-paired tokens.** Every surface ships a `*-foreground` mate.
  shadcn-style. Keep.
- **CVA per component.** Familiar pattern, easy to extend. Keep.

### 1.7 Component inventory

38 components shipped today, all under
[packages/core/src/components/ui/](packages/core/src/components/ui/).
Grouped by role for the design audit. **LOC** column is a rough
complexity signal (higher = more variants / platform-forks / state).

#### Primitives — display / typography

| Component | File | LOC | Notes |
| :-- | :-- | --: | :-- |
| Text | [text.tsx](packages/core/src/components/ui/text.tsx) | 229 | Typed wrapper over RN `Text`; entry point for typography tokens |
| Separator | [separator.tsx](packages/core/src/components/ui/separator.tsx) | 29 | 1px line, currently borrows `--border` |
| Skeleton | [skeleton.tsx](packages/core/src/components/ui/skeleton.tsx) | 54 | Loading shimmer placeholder |
| Avatar | [avatar.tsx](packages/core/src/components/ui/avatar.tsx) | 326 | Image + fallback + size matrix |
| Badge | [badge.tsx](packages/core/src/components/ui/badge.tsx) | 84 | Variant pill (default / secondary / destructive / outline) |
| Progress | [progress.tsx](packages/core/src/components/ui/progress.tsx) | 50 | Determinate horizontal bar |

#### Form — controls & inputs

| Component | File | LOC | Notes |
| :-- | :-- | --: | :-- |
| Button | [button.tsx](packages/core/src/components/ui/button.tsx) | 129 | 6 variants × 4 sizes; reference for CVA dual-def pattern |
| Input | [input.tsx](packages/core/src/components/ui/input.tsx) | 107 | outline / underline; sm/md/lg; prefix/suffix slots |
| Textarea | [textarea.tsx](packages/core/src/components/ui/textarea.tsx) | 77 | Multi-line input |
| Checkbox | [checkbox.tsx](packages/core/src/components/ui/checkbox.tsx) | 129 | |
| Radio | [radio.tsx](packages/core/src/components/ui/radio.tsx) | 109 | Single radio |
| RadioGroup | [radio-group.tsx](packages/core/src/components/ui/radio-group.tsx) | 123 | Grouped radio with context |
| Switch | [switch.tsx](packages/core/src/components/ui/switch.tsx) | 91 | Toggle |
| Slider | [slider.tsx](packages/core/src/components/ui/slider.tsx) | 108 | Range input |
| InputOTP | [input-otp.tsx](packages/core/src/components/ui/input-otp.tsx) | 104 | Multi-cell code input |
| SearchBar | [search-bar.tsx](packages/core/src/components/ui/search-bar.tsx) | 91 | Input + leading search icon + clear |
| Form | [form.tsx](packages/core/src/components/ui/form.tsx) | 139 | RHF wrappers (FormField, FormLabel, FormMessage) |
| Select | [select.tsx](packages/core/src/components/ui/select.tsx) | 268 | Web-style dropdown select |
| SelectSheet | [select-sheet.tsx](packages/core/src/components/ui/select-sheet.tsx) | 407 | Native-style bottom-sheet picker |
| DatePicker | [date-picker.tsx](packages/core/src/components/ui/date-picker.tsx) | 190 | Single date |
| DateRangePicker | [date-range-picker.tsx](packages/core/src/components/ui/date-range-picker.tsx) | 261 | Date range |
| Calendar | [calendar.tsx](packages/core/src/components/ui/calendar.tsx) | 502 | Month grid; powers DatePicker |

#### Layout & navigation

| Component | File | LOC | Notes |
| :-- | :-- | --: | :-- |
| Card | [card.tsx](packages/core/src/components/ui/card.tsx) | 163 | Header / Content / Footer compound |
| EmptyState | [empty-state.tsx](packages/core/src/components/ui/empty-state.tsx) | 49 | Illustration + title + body + CTA |
| KeyboardAvoidingView | [keyboard-avoiding-view.tsx](packages/core/src/components/ui/keyboard-avoiding-view.tsx) | 155 | RN keyboard wrapper, web no-op |
| StepIndicator | [step-indicator.tsx](packages/core/src/components/ui/step-indicator.tsx) | 140 | Numbered progress steps |
| Breadcrumb | [breadcrumb.tsx](packages/core/src/components/ui/breadcrumb.tsx) | 61 | Trail + separator |
| Tabs | [tabs.tsx](packages/core/src/components/ui/tabs.tsx) | 260 | Tab list + content panels |
| Accordion | [accordion.tsx](packages/core/src/components/ui/accordion.tsx) | 335 | Collapsible item group |
| Carousel | [carousel.tsx](packages/core/src/components/ui/carousel.tsx) | 120 | Horizontal swipe pager |

#### Overlays & feedback

| Component | File | LOC | Notes |
| :-- | :-- | --: | :-- |
| Alert | [alert.tsx](packages/core/src/components/ui/alert.tsx) | 108 | Inline banner with variants |
| Banner | [banner.tsx](packages/core/src/components/ui/banner.tsx) | 151 | Page-top notification |
| Dialog | [dialog.tsx](packages/core/src/components/ui/dialog.tsx) | 269 | Modal w/ adaptive-modal primitive |
| DropdownMenu | [dropdown-menu.tsx](packages/core/src/components/ui/dropdown-menu.tsx) | 660 | Compound menu — biggest component |
| BottomSheet | [bottom-sheet.tsx](packages/core/src/components/ui/bottom-sheet.tsx) | 424 | Wraps `@lunar-primitive/bottom-sheet` |
| Tooltip | [tooltip.tsx](packages/core/src/components/ui/tooltip.tsx) | 274 | Web hover + native long-press |
| Toast | [toast.tsx](packages/core/src/components/ui/toast.tsx) | 156 | Single toast unit |
| Toaster | [toaster.tsx](packages/core/src/components/ui/toaster.tsx) | 52 | Toast region / queue |

#### Migration risk per category

| Category | Risk | Why |
| :-- | :-- | :-- |
| Primitives | low | Color-only token swaps; no platform forks |
| Form controls | medium | Mix `className` + inline style for placeholders, indicators, spinners — every fallback path needs `useThemeColors()` audit |
| Layout & nav | medium | Gesture / scroll / transform interactions; verify Reanimated-driven views still pick up `__lcssTw` base styles |
| Overlays | high | DropdownMenu, BottomSheet, Dialog, Tooltip all rely on portal / measurement / animated overlays — biggest surface for visual regressions during the NativeWind → `@lunar-kit/css` swap. Treat as last to migrate, first to test on web |

#### Out-of-tree component dependencies

| Package | Used by |
| :-- | :-- |
| `@lunar-primitive/adaptive-modal` | Dialog, DropdownMenu, Tooltip |
| `@lunar-primitive/bottom-sheet` | BottomSheet, SelectSheet, DatePicker, DateRangePicker |

These primitive packages are out of scope for the design system tokens
themselves but consume `surface.overlay`, `surface.raised`, `border.default`,
and `motion.duration.*` — confirm their props expose enough hooks to
receive Lunar System tokens.

---

## 2. Gaps & Pain Points

These are the things the new design system should fix.

### 2.1 Token layer is too thin

Only **color** tokens exist. Spacing, radius, typography, motion, elevation,
z-index, breakpoints — all unowned. Every component re-invents its own
size scale. That makes it hard to:

- enforce visual rhythm across components,
- swap density (compact / cozy / comfortable),
- audit consistency,
- expose theming knobs to consumers without rewriting CVA defs.

### 2.2 No semantic typography scale

Components reach for `text-sm`, `text-base`, `text-lg` directly. There is
no `caption | body | label | title | display` taxonomy, and no per-theme
font-family hook (which iOS / Android theming would benefit from —
SF Pro vs Roboto vs default).

### 2.3 No state-color tokens

There is `destructive` but no `success`, `warning`, `info`. The Banner,
Alert, Toast, and Toaster components currently encode these inline via
hex or ad-hoc colors, which breaks when theming.

### 2.4 No surface elevation system

Cards, dialogs, bottom sheets, dropdowns all need a layered surface model
(base / raised / overlay). Today they each pick their own
`bg-card | bg-background | bg-muted` mapping. iOS-style theming
specifically wants tinted "grouped" backgrounds that the current 17-token
set cannot express.

### 2.5 Border / outline tokens are conflated

`--border`, `--input`, `--ring` overlap. Inputs sometimes use
`border-input`, sometimes `border` (which resolves to `--border`).
There is no `--divider` (subtle hairlines) or `--separator` (group
boundaries) — the Separator component just borrows `--border`.

### 2.6 No motion tokens

Toast slide-in, bottom-sheet expand, accordion open, dialog fade — every
component picks its own duration / easing. This is fine on native (where
most of these are gesture-driven via Reanimated) but inconsistent on web.

### 2.7 No icon-color contract

Components that take `leftIcon` / `rightIcon` (Button, Input, Banner) push
the responsibility of icon color onto the consumer. There is no
`text-icon` / `text-icon-muted` semantic class.

### 2.8 Density is unowned

`button.size: sm | default | lg | icon` matches `input.size: sm | md | lg`
**with different naming** (`default` vs `md`) and **independent height
constants**. A user cannot pick "compact density across the app" without
patching every component.

### 2.9 CVA duplication risk

Every component with text inside (Button, Banner, Alert, Toast, ...) ships
two CVA defs that must stay in lock-step. There is no shared utility for
"variant-matched text style." This is a code-quality issue but it surfaces
in the design system because it makes consistency drift cheap.

### 2.10 No focus / hover / pressed visual language

`focus-visible:ring-2 ring-ring` exists in places but is inconsistent.
On native, "pressed" state is not styled in CVA — components handle it
via `Pressable`'s style callback, which sidesteps the token system.

---

## 3. Proposed Design System

> **Naming:** internally call it **"Lunar System"**. The underlying CSS
> engine is `@lunar-kit/css`; the design language built on top is the
> **Lunar System**.

### 3.1 Principles

1. **Three-layer tokens.** Primitive → Semantic → Component. Components
   never touch primitives.
2. **Per-platform fidelity.** `lunar` is the brand default;
   `ios` and `android` are not "skins" — they reach for native-feeling
   typography, density, radius, and motion. The design system supports
   per-theme token overrides for **every** layer, not just colors.
3. **Density is a first-class axis.** Each component ships
   `compact | comfortable` (default) variants driven by a single
   `density` token, not per-component constants.
4. **Web parity is non-negotiable.** Everything renderable on web must
   match native within 1px. Shadows go through a `--elevation-N` token
   that resolves to `boxShadow` on web and a flat-or-elevated surface
   token on native (no Android-only `elevation` prop).
5. **Foreground-paired surfaces.** Every surface token comes with a
   contrast-correct foreground token. Consumers should never have to
   eyeball "does this read on top of `--card`?".
6. **Design tokens are TypeScript, not magic strings.** The eventual
   `lunar.config.ts` exports types so component CVA defs autocomplete.

### 3.2 Token layers

```
┌──────────────────────────────────────────────────────────┐
│  Component tokens     button.bg.default = {primary}      │  ← consumed by CVA
├──────────────────────────────────────────────────────────┤
│  Semantic tokens      surface.base, text.body, ...       │  ← swappable per theme
├──────────────────────────────────────────────────────────┤
│  Primitive tokens     gray-50 ... gray-950, blue-500     │  ← raw color/space scale
└──────────────────────────────────────────────────────────┘
```

#### 3.2.1 Primitive tokens (raw scales)

Not exposed to component authors. Defined once per theme.

- **Color ramps:** 12-step OKLCH-derived ramps for `gray`, `brand`,
  `red`, `green`, `yellow`, `blue`, `purple`. Steps `50, 100, 200, 300,
  400, 500, 600, 700, 800, 900, 950`. Per-theme overrides allowed
  (iOS uses bluer grays, Android uses M3 neutrals).
- **Spacing scale:** `0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40,
  48, 64` (in 4px units → px on output). Same for all themes.
- **Radius scale:** `none, xs(2), sm(4), md(6), lg(8), xl(12), 2xl(16),
  3xl(24), full`. iOS may bias higher (`md = 8`).
- **Font sizes:** `[size, lineHeight]` tuples — `xs(11/16), sm(13/18),
  base(15/22), md(16/24), lg(18/26), xl(20/28), 2xl(24/32), 3xl(30/38),
  4xl(36/44)`.
- **Font families:** `sans, mono`. Per theme:
  - lunar → `Inter, system-ui` / `JetBrains Mono`
  - ios → `-apple-system, SF Pro Text, San Francisco` / `SF Mono`
  - android → `Roboto, system-ui` / `Roboto Mono`
- **Weight:** `regular(400), medium(500), semibold(600), bold(700)`.
- **Z-index:** `base(0), dropdown(1000), sticky(1100), banner(1200),
  overlay(1300), modal(1400), popover(1500), toast(1600), tooltip(1700)`.
- **Motion durations:** `instant(0), fast(150), normal(200), slow(300),
  slower(450)` ms.
- **Motion easings:** `linear, ease-in, ease-out, ease-in-out,
  emphasized` (M3-style cubic-bezier).

#### 3.2.2 Semantic tokens (the public theme surface)

This is what `lunar.config.ts` actually defines per theme + mode.
Refactor of today's 17-key set, expanded:

```
# Surface
surface.base                surface.base.fg
surface.raised              surface.raised.fg     (= card today)
surface.overlay             surface.overlay.fg    (dialog/popover)
surface.sunken              surface.sunken.fg     (grouped iOS bg)
surface.inverse             surface.inverse.fg    (toast on dark in light theme)

# Brand / actions
action.primary              action.primary.fg
action.primary.hover        action.primary.pressed
action.secondary            action.secondary.fg
action.secondary.hover      action.secondary.pressed

# State
state.success               state.success.fg
state.warning               state.warning.fg
state.danger                state.danger.fg       (= destructive today)
state.info                  state.info.fg

# Text
text.body                   text.muted            text.placeholder
text.link                   text.disabled         text.icon       text.icon.muted

# Borders / dividers
border.subtle    border.default    border.strong   border.focus  (= ring today)
divider          (1px hairline, lighter than border.subtle)

# Field-specific
field.bg         field.border      field.border.focus  field.border.error
```

Total: ~30 semantic tokens per theme/mode. Today's 17 are a strict subset
and map cleanly (see §4.4).

#### 3.2.3 Component tokens

Each component declares the semantic tokens it consumes. Authored in
TypeScript alongside the component. Example:

```ts
// button.tokens.ts
export const buttonTokens = {
  default:     { bg: 'action.primary',   fg: 'action.primary.fg' },
  destructive: { bg: 'state.danger',     fg: 'state.danger.fg' },
  outline:     { bg: 'surface.base',     fg: 'text.body',
                 border: 'border.default' },
  secondary:   { bg: 'action.secondary', fg: 'action.secondary.fg' },
  ghost:       { bg: 'transparent',      fg: 'text.body' },
  link:        { bg: 'transparent',      fg: 'text.link' },
} as const;
```

These resolve at build time into the className strings the CVA def emits.
The CVA def becomes a thin wrapper:

```ts
const buttonVariants = cva('items-center justify-center rounded-md', {
  variants: {
    variant: variantsFromTokens(buttonTokens),
    // ...
  },
});
```

This kills the buttonVariants/buttonTextVariants duplication: the foreground
token is paired automatically.

### 3.3 Density

One axis, two values: `comfortable` (default) | `compact`. Drives a
single `--density-scale` multiplier:

| Property | comfortable | compact |
| :-- | :-- | :-- |
| Control height base | 40px | 32px |
| Vertical padding | space.2 | space.1 |
| Horizontal padding | space.4 | space.3 |
| Icon size | 20px | 16px |
| Stack gap | space.3 | space.2 |

Per-component `size` (sm/md/lg) still exists and stacks on top.
A user opts into compact density once via `<ThemeProvider density="compact">`.

### 3.4 Elevation

Four-step scale, mapped per platform:

| Token | Web (boxShadow) | Native iOS (style) | Native Android |
| :-- | :-- | :-- | :-- |
| `elevation-0` | none | flat | flat |
| `elevation-1` | `0 1px 2px rgb(0 0 0 / 0.06)` | shadowColor #000, opacity 0.04, radius 4 | bg=surface.raised |
| `elevation-2` | `0 4px 12px rgb(0 0 0 / 0.08)` | opacity 0.08, radius 8 | bg=surface.raised, border subtle |
| `elevation-3` | `0 12px 24px rgb(0 0 0 / 0.12)` | opacity 0.16, radius 16 | bg=surface.overlay |

On native Android, elevation is approximated with surface-tint changes
(M3 surface elevation behavior) since `shadow*` props are forbidden
project-wide (`CLAUDE.md`).

### 3.5 Motion

Component-level motion is **not** part of the className surface (RN does
not animate inline style). Motion tokens are exposed through
`useLunarCSS()` + Reanimated drivers. The token contract is just the
duration / easing constants. Each component documents which motion
tokens it consumes (e.g. Toast → `motion.duration.normal`,
`motion.easing.emphasized`).

### 3.6 Per-theme overrides

Every layer (primitive, semantic, component) is overridable per theme.
The merge order:

```
defaults (lunar.light)
  ← primitive overrides (theme.light)
  ← semantic overrides (theme.light)
  ← mode overrides (theme.dark)
  ← user lunar.config.ts overrides
```

Component tokens are **never** overridden per theme directly — if
something must change visually for iOS, change the semantic token it
consumes, not the component mapping.

### 3.7 Naming conventions

- **CSS custom properties** stay flat-kebab: `--surface-raised`,
  `--surface-raised-fg`. (Drop the `-foreground` suffix in favor of
  `-fg` to keep className lengths sane.)
- **Token paths in TS** use dots: `surface.raised`, `surface.raised.fg`.
- **Tailwind utility names** mirror the token path:
  `bg-surface-raised`, `text-surface-raised-fg`, `text-state-danger`,
  `border-border-strong`, `rounded-control`, `gap-stack`.
- Backwards-compat aliases: keep `bg-card`, `bg-primary`,
  `text-destructive` etc. as deprecated aliases mapped to the new
  semantic tokens for one minor version.

---

## 4. Token Spec (drop-in for `lunar.config.ts`)

> Fill these tables in during the design phase. The migration agent will
> read this section and translate it directly into a `defineConfig({...})`
> block. Numbers below are placeholders aligned to the current design;
> revisit before sign-off.

### 4.1 Primitive scales (theme-agnostic)

| Scale | Values |
| :-- | :-- |
| `space` | `0:0, 0.5:2, 1:4, 1.5:6, 2:8, 2.5:10, 3:12, 4:16, 5:20, 6:24, 8:32, 10:40, 12:48, 16:64` |
| `radius` | `none:0, xs:2, sm:4, md:6, lg:8, xl:12, 2xl:16, 3xl:24, full:9999` |
| `radius` (semantic) | `control:8, card:12, sheet:16, chip:9999` |
| `fontSize` | `xs:[11,16], sm:[13,18], base:[15,22], md:[16,24], lg:[18,26], xl:[20,28], 2xl:[24,32], 3xl:[30,38], 4xl:[36,44]` |
| `fontWeight` | `regular:400, medium:500, semibold:600, bold:700` |
| `zIndex` | `base:0, dropdown:1000, sticky:1100, banner:1200, overlay:1300, modal:1400, popover:1500, toast:1600, tooltip:1700` |
| `motion.duration` | `instant:0, fast:150, normal:200, slow:300, slower:450` (ms) |
| `motion.easing` | `linear, easeIn, easeOut, easeInOut, emphasized` |

### 4.2 Semantic tokens — `lunar` theme

| Token | Light | Dark |
| :-- | :-- | :-- |
| `surface.base` | `0 0% 100%` | `222.2 84% 4.9%` |
| `surface.base.fg` | `222.2 84% 4.9%` | `210 40% 98%` |
| `surface.raised` | `0 0% 100%` | `222.2 84% 4.9%` |
| `surface.raised.fg` | `222.2 84% 4.9%` | `210 40% 98%` |
| `surface.overlay` | `0 0% 100%` | `222.2 84% 8%` |
| `surface.overlay.fg` | `222.2 84% 4.9%` | `210 40% 98%` |
| `surface.sunken` | `210 40% 96.1%` | `217.2 32.6% 15%` |
| `surface.sunken.fg` | `222.2 47.4% 11.2%` | `210 40% 98%` |
| `action.primary` | `240 5.9% 10%` | `60 9.1% 97.8%` |
| `action.primary.fg` | `0 0% 98%` | `222.2 47.4% 11.2%` |
| `action.secondary` | `210 40% 96.1%` | `217.2 32.6% 17.5%` |
| `action.secondary.fg` | `222.2 47.4% 11.2%` | `210 40% 98%` |
| `state.success` | `142 76% 36%` | `142 71% 45%` |
| `state.success.fg` | `0 0% 100%` | `0 0% 100%` |
| `state.warning` | `38 92% 50%` | `48 96% 53%` |
| `state.warning.fg` | `0 0% 100%` | `0 0% 0%` |
| `state.danger` | `0 84.2% 60.2%` | `0 84% 60%` |
| `state.danger.fg` | `210 40% 98%` | `210 40% 98%` |
| `state.info` | `211 100% 50%` | `211 100% 56%` |
| `state.info.fg` | `0 0% 100%` | `0 0% 100%` |
| `text.body` | `222.2 84% 4.9%` | `210 40% 98%` |
| `text.muted` | `215.4 16.3% 46.9%` | `215 20.2% 65.1%` |
| `text.placeholder` | `215.4 16.3% 60%` | `215 20.2% 50%` |
| `text.link` | `211 100% 45%` | `211 100% 60%` |
| `text.disabled` | `215.4 16.3% 70%` | `215 20.2% 35%` |
| `border.subtle` | `214.3 31.8% 95%` | `217.2 32.6% 15%` |
| `border.default` | `214.3 31.8% 91.4%` | `217.2 32.6% 17.5%` |
| `border.strong` | `214.3 31.8% 80%` | `217.2 32.6% 30%` |
| `border.focus` | `240 5.9% 10%` | `60 9.1% 97.8%` |
| `divider` | `214.3 31.8% 96%` | `217.2 32.6% 12%` |
| `field.bg` | `0 0% 100%` | `222.2 84% 4.9%` |
| `field.border` | `214.3 31.8% 91.4%` | `217.2 32.6% 17.5%` |
| `field.border.focus` | `240 5.9% 10%` | `60 9.1% 97.8%` |
| `field.border.error` | `0 84.2% 60.2%` | `0 84% 60%` |

### 4.3 Theme overrides

For `ios` and `android` themes, fill the same table. Most values inherit
from `lunar`; document only the deltas. Examples:

- `ios.action.primary` = `211 100% 50%` (systemBlue, vs lunar's near-black).
- `ios.surface.sunken` = `240 4% 96%` (iOS grouped table background).
- `ios.fontFamily.sans` = `'-apple-system','SF Pro Text','San Francisco'`.
- `android.action.primary` = `256 35% 47%` (M3 primary).
- `android.surface.raised.elevation` = elevation-1 surface-tint.

### 4.4 Backwards-compat alias map

For one minor version we keep the old names. The codemod / runtime alias
table:

| Old | New |
| :-- | :-- |
| `--background` | `--surface-base` |
| `--foreground` | `--surface-base-fg` |
| `--card` | `--surface-raised` |
| `--card-foreground` | `--surface-raised-fg` |
| `--primary` | `--action-primary` |
| `--primary-foreground` | `--action-primary-fg` |
| `--secondary` | `--action-secondary` |
| `--secondary-foreground` | `--action-secondary-fg` |
| `--muted` | `--surface-sunken` |
| `--muted-foreground` | `--text-muted` |
| `--accent` | `--action-secondary` *(consolidate)* |
| `--accent-foreground` | `--action-secondary-fg` |
| `--destructive` | `--state-danger` |
| `--destructive-foreground` | `--state-danger-fg` |
| `--border` | `--border-default` |
| `--input` | `--field-border` |
| `--ring` | `--border-focus` |

### 4.5 Component token registry

One `*.tokens.ts` per component, sibling to the component file. Authoring
order follows the migration-risk groups in §1.7:

1. **Low risk first** (primitives): text, separator, skeleton, avatar,
   badge, progress.
2. **Medium** (form + layout): button, input, textarea, checkbox, radio,
   radio-group, switch, slider, input-otp, search-bar, form, select,
   select-sheet, date-picker, date-range-picker, calendar, card,
   empty-state, keyboard-avoiding-view, step-indicator, breadcrumb,
   tabs, accordion, carousel.
3. **High** (overlays — last): alert, banner, dialog, dropdown-menu,
   bottom-sheet, tooltip, toast, toaster.

For each: variants × regions (`bg`, `fg`, `border`, `icon`) → semantic
token path. No raw colors in component code after migration.

---

## 5. Phase plan

This doc covers Phase 0 (design). The actual migration is `MIGRATE-LUNAR-KIT.md`.

| Phase | Owner | Output |
| :-- | :-- | :-- |
| 0a — Design intake | this doc | §1, §2, §3 confirmed by user |
| 0b — Token spec lock | this doc | §4 tables fully populated for all 3 themes |
| 0c — Component token registry | this doc + small PR | `*.tokens.ts` files added (no behavior change yet — still NativeWind) |
| 1 — Migration | `MIGRATE-LUNAR-KIT.md` | Swap NativeWind → `@lunar-kit/css`, codemod token names via §4.4 alias map |
| 2 — CVA cleanup | follow-up PR | Replace dual CVA defs with `variantsFromTokens()` helper |
| 3 — Density rollout | follow-up PR | Wire `density` prop through `ThemeProvider`, expose via store |

Phase 0b and 0c may be batched into a single design PR if scope allows.

---

## 6. Open questions for the user

Surface these BEFORE writing code:

1. **Primary brand color.** Lunar default today is near-black (`240 5.9% 10%`).
   Is that intentional (shadcn-zinc), or do we want a true brand hue
   (proposed: a lunar-purple/blue) to differentiate from shadcn defaults?
2. **Density default.** `comfortable` everywhere, or `compact` on web /
   `comfortable` on native?
3. **Typography per theme.** OK to ship 3 separate font stacks
   (system / SF Pro / Roboto), or stay system-default to keep bundle size
   down on Expo Go?
4. **Backwards-compat window.** Keep `--primary`, `--background` etc. as
   aliases for one minor version, or hard-cut at the migration commit
   and ship a codemod?
5. **Component token files.** Add `<name>.tokens.ts` siblings, or inline
   the token map at the top of each component file?
6. **State colors.** Add `success / warning / info` now (Phase 0c) or
   defer to a follow-up?
7. **Elevation on Android native.** Approximate via surface tint
   (proposed §3.4) or carve out a single allowed `elevation` prop usage
   despite the no-`shadow*` rule?

Answers to these gate Phase 0b. Do not invent values — ask.

---

## 7. Out of scope for this design phase

- Re-skinning the look of any component (visual changes).
- Adding new components.
- Web design system docs site changes (those follow component changes,
  not the other way around).
- Renaming the package or moving to a new monorepo.
- Replacing CVA with a different variant lib.

If a follow-up PR needs any of the above, file it separately after Phase 1
lands clean.

---

## 8. Reference files

- Existing tokens: [packages/core/src/lib/theme.ts](packages/core/src/lib/theme.ts)
- Theme provider: [packages/core/src/providers/theme-provider.tsx](packages/core/src/providers/theme-provider.tsx)
- Tailwind config (to be replaced): [packages/core/src/tailwind.config.js](packages/core/src/tailwind.config.js)
- Component examples: [button.tsx](packages/core/src/components/ui/button.tsx),
  [input.tsx](packages/core/src/components/ui/input.tsx)
- Migration spec (next phase): [MIGRATE-LUNAR-KIT.md](MIGRATE-LUNAR-KIT.md)
- Project rules: [CLAUDE.md](CLAUDE.md)

---

**Hand-off note for the executing agent:** read §1 and §2 first; then
present §6 as a numbered list to the user, get answers, and only then
fill §4 with final values. Do NOT modify component source in this phase
— this is a spec doc, not a code change. The migration agent picks up
where this leaves off.
