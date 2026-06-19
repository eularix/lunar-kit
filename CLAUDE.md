# Lunar Kit - Project Context

**Vision:** Lunar Colony — a visual builder for React Native (like Flutter Flow or Figma for RN). Users create mobile apps visually while maintaining code access.

---

## Project Structure

### Core Monorepo
```
lunar-kit/
├── packages/
│   ├── core/                 # @lunar-kit/core - Main UI component library
│   ├── cli/                  # @lunar-kit/cli - CLI tool for scaffolding
│   ├── create-lunar-kit/    # create-lunar-kit - Initial project template
│   └── primitives/
│       ├── adaptive-modal/   # @lunar-primitive/adaptive-modal
│       └── bottom-sheet/     # @lunar-primitive/bottom-sheet
├── docs/                     # OFFICIAL DOCS (Fumadocs + Next.js 16)
└── apps/
    ├── example/              # React Native example app
    └── showcase/             # Showcase app
```

### Key Facts

- **Monorepo:** Bun workspaces (`workspace:*` dependencies)
- **Stack:** React Native components, NativeWind v4 (Tailwind v3), TypeScript
- **Docs:** docs is the stable, working documentation site
- **Build:** Bun, tsup for packages, Next.js 16 for docs

---

## Documentation (docs/)

**Status:** WORKING - Use this as the reference.

### Setup
```bash
cd docs
bun install
bun dev  # http://localhost:3000
```

### Key Files
- `next.config.ts` — Turbopack + webpack aliasing for react-native→react-native-web
- `package.json` — Uses Fumadocs 14.7.7 (Tailwind v3 compatible)
- `content/docs/` — MDX component documentation
- `src/demo/*.tsx` — Live component demos (imported in MDX)

### Component Documentation Pattern
Each component has:
```
content/docs/components/button.mdx
├── Demo component (imported)
├── Installation instructions
├── Usage examples (code blocks)
├── Variants showcase
└── API reference (props table)
```

Demo imports: `import ButtonDemo from '@/demo/ButtonDemo'`

### Critical Config (next.config.ts)
```typescript
// React Native → Web aliasing
turbopack.resolveAlias = {
  "react-native": "react-native-web",
}

// Allow .web.* extensions
resolveExtensions: [".web.js", ".web.jsx", ".web.ts", ".web.tsx", ...]

// Transpile these packages
transpilePackages: ["nativewind", "react-native", "react-native-web", ...]
```

---

## Components (@lunar-kit/core)

**Location:** `packages/core/src/components/ui/`

### Auto-Discovery
Components are exported from `packages/core/src/components/ui/index.ts`:
```typescript
export * from "./button";
export * from "./dialog";
// ... 35+ components
```

### When Adding Components
1. Create component in `packages/core/src/components/ui/{component}/`
2. Ensure index.ts exports
3. Create changeset: `bun changeset:create`
4. Docs are **manual** — create `content/docs/components/{component}.mdx` with demo

---

## Primitives (packages/primitives/)

**Separate, library-only packages** for complex behaviors:
- `adaptive-modal` — Modal compatibility layer (RN Modal → web Portal)
- `bottom-sheet` — Bottom sheet primitive with gesture handling

### Usage in Docs
- Import from `@lunar-primitive/adaptive-modal`
- Can use as stubs in other packages if needed

---

## Changesets & Releases

### Creating Changesets
```bash
bun changeset:create    # Interactive prompt
# OR
bun changeset           # Official Changesets CLI
```

### Workflow
1. Make changes to library
2. Create changeset documenting bump type (major/minor/patch)
3. Commit & push (CI validates changeset exists)
4. Merge to `main`
5. Release workflow bumps versions, publishes to npm, generates CHANGELOG

### CI/CD
- **changeset-check.yml** — Blocks PRs without changesets
- **release.yml** — Auto-publishes when changesets merge to main

---

## NativeWind & Tailwind

**Constraint:** NativeWind v4 REQUIRES Tailwind v3.
- Current: `tailwindcss@3.4.19`
- Do not upgrade to Tailwind v4 (breaks NativeWind v4)
- Fumadocs v14.7.7 is the latest compatible version

---

## Common Issues & Fixes

### "Next.js package not found" (Turbopack)
**Fix:** Use `.mjs` for next.config, not `.ts`

### React Native Flow syntax parse errors
**Fix:** Use proper webpack aliasing in next.config:
```js
config.resolve.alias["react-native$"] = "react-native-web"
```

### Missing component exports
**Fix:** Check `packages/core/src/components/ui/index.ts` exports the component

---

## Development Workflow

### Local Development
```bash
# Watch components
cd packages/core
bun dev

# Run docs
cd docs
bun dev
```

### Testing Docs Locally
- Component demos in `docs/src/demo/` are TSX
- Import into MDX: `import ButtonDemo from '@/demo/ButtonDemo'`
- Edit demo → hot reload in browser

### Adding New Component Docs
1. Create `ButtonDemo.tsx` in `src/demo/` (or copy existing)
2. Create `content/docs/components/button.mdx`
3. Import demo in MDX
4. Use `<DynamicCodeBlock>` for code examples
5. Add to sidebar (frontmatter: `sidebar_position: N`)

---

## Gotchas

- **docs/** is the official docs site (Fumadocs + Next.js 16). Use as reference.
- **Component documentation is manual** — no auto-generation from source yet
- **Changesets required** on all PRs (CI enforces)
- **Turbopack + react-native** conflict — keep webpack aliasing correct
- **Tailwind v3 lock** — don't upgrade, breaks NativeWind

---

## Useful Commands

```bash
# Root monorepo
bun build              # Build all packages
bun changeset:create   # Interactive changeset
bun release:check      # Check pending releases

# Docs
cd docs
bun dev                # Start dev server
bun build              # Build production
bun lint               # Run eslint

# Package development
cd packages/core
bun dev                # Watch mode
bun build              # One-time build
```

---

## Web Support Strategy

### Platform Detection
- Use `Platform.OS === 'web'` for runtime checks
- Use `.web.tsx` file extensions for full platform forks
- Prefer `.web.tsx` over inline Platform.select for complex components

### Web Compatibility Rules
- NO: `shadow*` props (shadowColor, shadowOffset, etc.) → use `boxShadow` in web StyleSheet
- NO: Native-only libraries without web fallback (check expo.dev/go compatibility)
- OK: `react-native-reanimated` v3 (web supported)
- OK: `react-native-gesture-handler` (web supported, needs GestureHandlerRootView)
- OK: NativeWind v4 (web supported via className)

### Primitives Pattern (reference: @lunar-primitive/adaptive-modal)
When a component needs platform-specific behavior, create a primitives package:
- `packages/primitives/{name}/`
- Export a unified interface, implement per platform
- Native: use RN native APIs
- Web: use DOM/Portal/CSS equivalents

### Expo Go Constraints
- Zero native modules requiring prebuild
- All dependencies must be available in Expo SDK (verify at expo.dev/go)
- If library not in Expo Go → create primitives with graceful fallback

### Tauri v2 Notes
- Tauri renders webview, treat as `Platform.OS === 'web'`
- Mouse + touch events must both work
- No platform-specific Tauri detection needed