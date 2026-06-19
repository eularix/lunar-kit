# Lunar Kit — Design v2 (Palette System + LunarCSS Migration)

> **Source.** Handoff bundle from [claude.ai/design](https://claude.ai/design). Project name: _Lunar Kit Design System_. Bundle ID `RCbllLbKa1EIoeI9hhVNpA`. Primary file: `themes.html`. Iterated 2026-05-03.
> **Status.** Spec only. No code touched yet.
> **Goal.** Lock the palette system + token model, then migrate from NativeWind to a custom CSS layer (`@lunar-kit/css`).

---

## 1. Decision log

The user iterated through three directions during the design session. Final landing point:

| Iteration | Outcome |
|-----------|---------|
| 1. Three platform themes (`lunar` / `ios` / `android`) | Rejected — only color/radius swapped, did not feel native |
| 2. Truly native chrome (SwiftUI + Material 3 markup per platform) | Rejected — too much divergence; lost design identity |
| 3. **One design language, multiple recolor palettes** | **Accepted** |

**Rule:** Palettes are color-only. Typography, density, spacing, radii, motion, and elevation never change with palette — those belong to the design language. Only `--brand-*`, `--gray-*` hue, and a few accent state tokens shift.

---

## 2. Palette catalog

Five palettes ship in v2. All values OKLCH.

| Palette | Brand hue | Gray hue | Vibe |
|---------|-----------|----------|------|
| `space` (default) | indigo 280 | cool 270 | Serious, modern. Replaces old `lunar` theme. |
| `forest` | green 155 | green-tinted 150 | Calm, grounded, outdoorsy. |
| `sunset` | terracotta 28–30 | warm 25–60 | Editorial, warm. |
| `aurora` | teal-cyan 195 | cool 200 | Technical, futuristic. Magenta `state-info` accent. |
| `mono` | graphite (no chroma) | pure neutral | Maximum restraint. Brand inverts in dark mode. |

### 2.1 Brand ramps (OKLCH)

```css
/* space (default) — indigo 280 */
--brand-50:  oklch(0.972 0.018 280);
--brand-500: oklch(0.600 0.200 280);
--brand-600: oklch(0.520 0.205 280);   /* primary action */
--brand-950: oklch(0.205 0.090 280);

/* forest — green 155 */
--brand-500: oklch(0.580 0.155 155);
--brand-600: oklch(0.490 0.140 155);

/* sunset — terracotta 28–30 */
--brand-500: oklch(0.640 0.190 30);
--brand-600: oklch(0.560 0.190 28);

/* aurora — teal-cyan 195 + magenta info */
--brand-500: oklch(0.625 0.150 195);
--brand-600: oklch(0.535 0.140 195);
--state-info: oklch(0.560 0.220 340);   /* magenta */

/* mono — graphite */
--brand-500: oklch(0.275 0 0);
--brand-600: oklch(0.195 0 0);
/* dark mode: ramp inverts so primary buttons read on dark surfaces */
```

Full 11-step ramps (50/100/200/300/400/500/600/700/800/900/950) live in `tokens.css` of the design bundle.

### 2.2 Adding a palette

Drop a single CSS block — brand ramp + optional gray hue shift. Everything else inherits.

```css
[data-theme="ocean"] {
  --gray-50:  oklch(0.985 0.004 220);
  --gray-500: oklch(0.575 0.016 220);
  --gray-950: oklch(0.130 0.022 220);

  --brand-500: oklch(0.620 0.150 225);
  --brand-600: oklch(0.530 0.140 225);
  --brand-950: oklch(0.190 0.060 225);
}
[data-theme="ocean"][data-mode="dark"] { /* optional surface tweaks */ }
```

---

## 3. Token model — three layers

```
Primitive  →  Semantic  →  Component
(raw)         (purpose)    (consumed)
```

### 3.1 Primitive (per-palette)
- `--gray-50…950` — neutrals (hue varies by palette)
- `--brand-50…950` — palette brand
- `--green-*`, `--amber-*`, `--red-*`, `--blue-*` — state ramps (palette-agnostic)
- `--violet-400/500/600` — shared accent

### 3.2 Semantic (palette-agnostic, references primitives)

| Domain | Tokens |
|--------|--------|
| Surface | `--surface-base`, `--surface-raised`, `--surface-overlay`, `--surface-sunken`, `--surface-inverse` (each + `-fg`) |
| Action | `--action-primary`, `--action-secondary` (each + `-fg`, `-hover`, `-pressed`) |
| State | `--state-success`, `--state-warning`, `--state-danger`, `--state-info` (each + `-fg`, `-subtle`) |
| Text | `--text-body`, `--text-muted`, `--text-placeholder`, `--text-link`, `--text-disabled`, `--text-icon`, `--text-icon-muted` |
| Border | `--border-subtle`, `--border-default`, `--border-strong`, `--border-focus`, `--divider` |
| Field | `--field-bg`, `--field-border`, `--field-border-focus`, `--field-border-error` |

### 3.3 Component (sibling `*.tokens.ts` per component)

Pattern (replaces the dual-CVA mirror):

```ts
// button.tokens.ts
export const buttonTokens = {
  default:     { bg: 'action.primary',  fg: 'action.primary.fg' },
  destructive: { bg: 'state.danger',    fg: 'state.danger.fg' },
};

// button.tsx
const variants = variantsFromTokens(buttonTokens);  // fg paired automatically
```

### 3.4 Non-color token families

| Family | Sample | Notes |
|--------|--------|-------|
| Space | `--space-0` … `--space-24` (4px grid) | Fixed across palettes |
| Radius | `--radius-xs` (2px) → `--radius-3xl` (24px), `--radius-full`. Semantic: `--radius-control` `-card` `-sheet` `-chip` | Fixed |
| Type | Geist sans + Geist Mono only. Scale `--text-xs` (11px) → `--text-6xl` (60px), each with `-lh`. Weights 400/500/600/700. Tracking `tight/snug/normal/wide` | **No platform fonts** |
| Motion | `--duration-instant/fast/normal/slow/slower` (0/150/200/300/450ms). Easing `linear/in/out/in-out/emphasized` | Fixed |
| Z-index | `--z-base` … `--z-tooltip` (0/1000/1100/1200/1300/1400/1500/1600/1700) | Fixed |
| Density | `--control-h-sm/md/lg`, `--control-px-sm/md/lg`. Two modes: `comfortable` (default) and `compact` | Toggle, not palette |
| Elevation | `--shadow-0` … `--shadow-4`. Web only. Native uses layered surface tints (no `shadow*` props) | Per project rule |

---

## 4. Color count — by the numbers

| | Before | After |
|---|---:|---:|
| Semantic color tokens | 17 | 30+ |
| Token layers | 0 (flat) | 3 (primitive → semantic → component) |
| Density modes | 1 | 2 (comfortable + compact) |
| Token families | 1 (color) | 6 (color, space, radius, type, motion, elevation) |
| Themes | 3 (`lunar` / `ios` / `android`) | 5 palettes (`space` / `forest` / `sunset` / `aurora` / `mono`) |

---

## 5. NativeWind → LunarCSS migration

### 5.1 Why move off NativeWind

- Locked to Tailwind v3 (NativeWind v4 incompatible with v4)
- Dual CVA definitions required (one for `View`, one for `Text`) — can't be DRY'd in NativeWind
- Token model is flat HSL strings; no semantic layering
- Web bundle ships unused Tailwind utility classes
- Metro config patching is fragile; `expo start --clear` is a frequent escape hatch

### 5.2 What `@lunar-kit/css` is

Custom small CSS engine targeting RN + web. Owns:

1. The token system from §3
2. A `variantsFromTokens()` helper that pairs `bg ↔ fg` automatically (no mirrored CVA)
3. Native StyleSheet generation from token names (mirrors web CSS vars)
4. CLI for project init + token codegen

### 5.3 Token rename map (one minor version of aliases)

| Old (NativeWind / shadcn) | New (LunarCSS) |
|---|---|
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
| `--accent` | `--action-secondary` |
| `--accent-foreground` | `--action-secondary-fg` |
| `--destructive` | `--state-danger` |
| `--destructive-foreground` | `--state-danger-fg` |
| `--border` | `--border-default` |
| `--input` | `--field-border` |
| `--ring` | `--border-focus` |

Old names ship as aliases for **one minor version**. Codemod available for hard cut.

### 5.4 Theme name rename

| Old | New |
|---|---|
| `lunar` | `space` |
| `ios` | _(removed)_ |
| `android` | _(removed)_ |
| `native` (resolver) | _(removed; `Platform.OS` no longer picks a theme)_ |
| — | `forest`, `sunset`, `aurora`, `mono` (new) |

Affected files in current repo:
- `packages/core/src/lib/theme.ts`
- `packages/core/src/hooks/useTheme.ts`
- `packages/core/src/hooks/useThemeColors.ts`
- `packages/core/src/providers/theme-provider.tsx`
- `packages/core/src/stores/theme.ts`
- Mirror copies under `docs/src/lunar-kit/`
- `apps/example/` consumers

### 5.5 Consumer migration steps (apps using Lunar Kit)

1. `npx lunar-css init` — patches metro config, generates `lunar.config.ts`, wires types
2. Delete `tailwind.config.js`, `nativewind-env.d.ts`, `global.css`, `nativewind/babel` plugin entry
3. `expo start --clear` once
4. Audit `className` strings — old token names keep working via aliases; codemod for hard cut

### 5.6 Phase plan

| # | Phase | Deliverable | Status |
|---|-------|-------------|:------:|
| 0a | Design intake | This doc + `themes.html` | done |
| 0b | Token spec lock | `tokens.css` populated for 5 palettes × 2 modes | done |
| 0c | Component token registry | `*.tokens.ts` sibling per component | next |
| 1 | Migration | NativeWind → `@lunar-kit/css`. Codemod alias map applied | queued |
| 2 | CVA cleanup | Replace dual CVA with `variantsFromTokens()` | queued |
| 3 | Density rollout | Density prop wired through `ThemeProvider` | queued |

---

## 6. Open questions — answered

| Q | A |
|---|---|
| Brand color | Indigo 600 `oklch(0.520 0.205 280)` + violet accent (default `space` palette). |
| Density default | Comfortable on native. Compact on web at desktop widths. Toolbar toggle. |
| Typography | One stack: Geist sans + Geist Mono. Google Fonts on web; bundled on native. Fixed across palettes. |
| Backwards-compat window | One minor version. All 17 old tokens alias to new names. |
| Component token files | Sibling `*.tokens.ts`. Easier to grep + override. |
| State colors | All four added now: success / warning / danger / info. Each paired with `-fg` and `-subtle`. |
| Native elevation | Layered surface tints on native; `box-shadow` on web only. Honors no-`shadow*`-props rule. |

---

## 7. What this doc does **not** cover

- Per-component spec (use the design bundle's `components.html`)
- Typography scale rationale (use `typography.html`)
- Foundations page (motion curves, z-index ladder — see `foundations.html`)
- Implementation details of `@lunar-kit/css` runtime (separate RFC)

---

## 8. Reference files in design bundle

```
lunar-kit-design-system/
├── README.md
├── chats/chat1.md           # full design conversation transcript
└── project/
    ├── themes.html          # PRIMARY — palette showcase
    ├── tokens.css           # all 5 palettes, light + dark
    ├── tokens.html          # live resolved-token table
    ├── foundations.html     # motion, z-index, elevation, density
    ├── typography.html      # type scale, weights, mono
    ├── components.html      # all 38 components, interactive
    ├── migration.html       # alias map + phase plan
    ├── shell.css/.js        # nav + theme toolbar
    ├── components.css       # component primitives
    └── index.html           # overview hero
```

Local extracted copy: `/tmp/anthropic-design/lunar-kit-design-system/`.
