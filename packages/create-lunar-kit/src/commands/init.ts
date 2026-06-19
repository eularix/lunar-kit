import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find the core package directory robustly, regardless of whether we're in dist/index.js,
// dist/commands/init.js, or src/commands/init.ts
const isFlattened = __dirname.endsWith('dist');
const numLevelsUp = isFlattened ? '../..' : '../../..';
const PACKAGES_DIR = path.resolve(__dirname, numLevelsUp);
const CORE_ROOT = path.join(PACKAGES_DIR, 'core', 'src');
const CORE_TEMPLATES_PATH = path.join(CORE_ROOT, 'templates');
const CORE_SOURCE_PATH = CORE_ROOT;
const CORE_COMPONENTS_PATH = path.join(CORE_ROOT, 'components');

/**
 * Helper: copy a template file from core to the target project
 */
function copyTemplate(templatePath: string, destPath: string) {
  const fullPath = path.join(CORE_TEMPLATES_PATH, templatePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Template not found: ${fullPath}`);
  }
  const content = fs.readFileSync(fullPath);
  fs.writeFileSync(destPath, content);
}

function copySource(sourcePath: string, destPath: string) {
  const fullPath = path.join(CORE_SOURCE_PATH, sourcePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Source not found: ${fullPath}`);
  }
  const content = fs.readFileSync(fullPath);
  fs.writeFileSync(destPath, content);
}

// ============================================================
// Project Structure
// ============================================================

export async function createSrcStructure(projectPath: string, navigation: string) {
  const dirs = [
    'src/modules',
    'src/components/ui',
    'src/lib',
    'src/hooks',
    'src/providers',
    'src/stores',
    'src/types',
  ];

  // Add screens directory for React Navigation projects
  if (navigation === 'react-navigation') {
    dirs.push('src/screens');
  }

  for (const dir of dirs) {
    await fs.ensureDir(path.join(projectPath, dir));
  }

  // Create barrel exports
  await createBarrelExport(path.join(projectPath, 'src/components'), 'index.ts');
  await createBarrelExport(path.join(projectPath, 'src/hooks'), 'index.ts');
  await createBarrelExport(path.join(projectPath, 'src/stores'), 'index.ts');
}

async function createBarrelExport(dir: string, filename: string) {
  const content = `// Auto-generated barrel export\n// This file is managed by Lunar Kit CLI\n`;
  await fs.writeFile(path.join(dir, filename), content);
}

// ============================================================
// App Entry Point
// ============================================================

export async function setupAppEntry(projectPath: string, navigation: string) {
  if (navigation === 'expo-router') {
    // Delete App.tsx and index files (not needed for expo-router)
    for (const file of ['App.tsx', 'index.ts', 'index.js']) {
      const filePath = path.join(projectPath, file);
      if (fs.existsSync(filePath)) await fs.remove(filePath);
    }

    // Update package.json to use expo-router entry
    const pkgPath = path.join(projectPath, 'package.json');
    const pkg = await fs.readJson(pkgPath);
    pkg.main = 'expo-router/entry';
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });

  } else {
    // Delete index files
    for (const file of ['index.ts', 'index.js']) {
      const filePath = path.join(projectPath, file);
      if (fs.existsSync(filePath)) await fs.remove(filePath);
    }

    // Copy App.tsx entry point
    copyTemplate('scaffolding/App.tsx', path.join(projectPath, 'App.tsx'));

    // Update package.json — remove main field
    const pkgPath = path.join(projectPath, 'package.json');
    const pkg = await fs.readJson(pkgPath);
    if (pkg.main) delete pkg.main;
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });

    // Update app.json entryPoint
    const appJsonPath = path.join(projectPath, 'app.json');
    if (fs.existsSync(appJsonPath)) {
      const appJson = await fs.readJson(appJsonPath);
      if (!appJson.expo) appJson.expo = {};
      appJson.expo.entryPoint = './App.tsx';
      await fs.writeJson(appJsonPath, appJson, { spaces: 2 });
    }

    // Copy Main.tsx (basic version, may be overwritten by react-navigation setup)
    copyTemplate('scaffolding/Main.tsx', path.join(projectPath, 'src', 'Main.tsx'));
  }
}

// ============================================================
// App Config (app.json)
// ============================================================

export async function setupAppConfig(projectPath: string, name: string) {
  const appJsonPath = path.join(projectPath, 'app.json');
  if (fs.existsSync(appJsonPath)) {
    const appJson = await fs.readJson(appJsonPath);
    if (!appJson.expo) appJson.expo = {};

    // Add default scheme if not present (required for Expo Router / Linking)
    if (!appJson.expo.scheme) {
      appJson.expo.scheme = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    await fs.writeJson(appJsonPath, appJson, { spaces: 2 });
  }
}

// ============================================================
// Navigation Setup
// ============================================================

export async function setupExpoRouterSrc(projectPath: string) {
  const appDir = path.join(projectPath, 'app');
  await fs.ensureDir(appDir);

  copyTemplate('expo-router/_layout.tsx', path.join(appDir, '_layout.tsx'));
  copyTemplate('expo-router/index.tsx', path.join(appDir, 'index.tsx'));
}

export async function setupReactNavigationSrc(projectPath: string) {
  // Copy Navigation.tsx
  copyTemplate('react-navigation/Navigation.tsx', path.join(projectPath, 'src', 'Navigation.tsx'));

  // Copy HomeScreen.tsx
  await fs.ensureDir(path.join(projectPath, 'src', 'screens'));
  copyTemplate('react-navigation/HomeScreen.tsx', path.join(projectPath, 'src', 'screens', 'HomeScreen.tsx'));

  // Overwrite Main.tsx with react-navigation version
  copyTemplate('scaffolding/Main.react-navigation.tsx', path.join(projectPath, 'src', 'Main.tsx'));
}

// ============================================================
// Feature Setup
// ============================================================

export async function setupAuthSrc(projectPath: string, navigation: string) {
  const authDir = navigation === 'expo-router' 
    ? path.join(projectPath, 'app', '(auth)')
    : path.join(projectPath, 'src', 'screens', 'auth');
  
  await fs.ensureDir(authDir);
  copyTemplate('auth/login.tsx', path.join(authDir, 'login.tsx'));
}

export async function setupDarkModeSrc(projectPath: string, navigation: string) {
  // Provider
  await fs.ensureDir(path.join(projectPath, 'src', 'providers'));
  copySource('providers/theme-provider.tsx', path.join(projectPath, 'src', 'providers', 'theme-provider.tsx'));

  // Store
  await fs.ensureDir(path.join(projectPath, 'src', 'stores'));
  copySource('stores/theme.ts', path.join(projectPath, 'src', 'stores', 'theme.ts'));

  // Update barrel export
  const storesIndexPath = path.join(projectPath, 'src', 'stores', 'index.ts');
  const storesIndexContent = `// Auto-generated barrel export\n// This file is managed by Lunar Kit CLI\nexport * from './theme';\n`;
  await fs.writeFile(storesIndexPath, storesIndexContent);

  // Hooks
  await fs.ensureDir(path.join(projectPath, 'src', 'hooks'));
  const toolbarSource = navigation === 'expo-router'
    ? 'hooks/useToolbar.tsx'
    : 'hooks/useToolbar.react-navigation.tsx';
  copySource(toolbarSource, path.join(projectPath, 'src', 'hooks', 'useToolbar.tsx'));
  copySource('hooks/useTheme.ts', path.join(projectPath, 'src', 'hooks', 'useTheme.ts'));
  copySource('hooks/useThemeColors.ts', path.join(projectPath, 'src', 'hooks', 'useThemeColors.ts'));

  // Lib
  await fs.ensureDir(path.join(projectPath, 'src', 'lib'));
  copySource('lib/theme.ts', path.join(projectPath, 'src', 'lib', 'theme.ts'));
}

export async function setupFormsSrc(projectPath: string) {
  await fs.ensureDir(path.join(projectPath, 'src', 'hooks'));
  copyTemplate('forms/useForm.ts', path.join(projectPath, 'src', 'hooks', 'useForm.ts'));
}

export async function setupStateSrc(projectPath: string) {
  await fs.ensureDir(path.join(projectPath, 'src', 'stores'));
  copyTemplate('state/app-store.ts', path.join(projectPath, 'src', 'stores', 'app.ts'));
}

// ============================================================
// @lunar-kit/css Setup
// ============================================================

export async function setupLunarCSS(projectPath: string) {
  // Config files
  copyTemplate('config/metro.config.js', path.join(projectPath, 'metro.config.js'));
  copyTemplate('config/babel.config.js', path.join(projectPath, 'babel.config.js'));
  copyTemplate('config/tsconfig.json', path.join(projectPath, 'tsconfig.json'));

  // Copy lib utilities from core source
  await fs.ensureDir(path.join(projectPath, 'src', 'lib'));
  copySource('lib/utils.ts', path.join(projectPath, 'src', 'lib', 'utils.ts'));
  copySource('lib/theme.ts', path.join(projectPath, 'src', 'lib', 'theme.ts'));

  // Copy base UI components from core
  await fs.ensureDir(path.join(projectPath, 'src', 'components', 'ui'));
  const buttonContent = fs.readFileSync(path.join(CORE_COMPONENTS_PATH, 'ui', 'button.tsx'));
  const textContent = fs.readFileSync(path.join(CORE_COMPONENTS_PATH, 'ui', 'text.tsx'));
  await fs.writeFile(path.join(projectPath, 'src', 'components', 'ui', 'button.tsx'), buttonContent);
  await fs.writeFile(path.join(projectPath, 'src', 'components', 'ui', 'text.tsx'), textContent);
}

/** @deprecated Use `setupLunarCSS`. */
export const setupNativeWind = setupLunarCSS;

// ============================================================
// Dependencies
// ============================================================

export async function updatePackageJson(projectPath: string, navigation: string, features: string[]) {
  const pkgPath = path.join(projectPath, 'package.json');
  const pkg = await fs.readJson(pkgPath);
  
  pkg.dependencies = {
    ...pkg.dependencies,
    '@lunar-kit/css': '^0.3.0',
    'clsx': '^2.1.1',
    'tailwind-merge': '^3.4.0',
    'class-variance-authority': '^0.7.1',
    '@react-native-async-storage/async-storage': '^2.2.0',
    'lucide-react-native': '^0.562.0',
    'react-native-gesture-handler': '^2.28.0',
    'react-native-reanimated': '~4.1.1',
    'react-native-safe-area-context': '^5.6.2',
    'react-native-screens': '~4.16.0',
    'react-native-worklets': '0.5.1',
    'zustand': '^5.0.3',
  };

  if (navigation === 'expo-router') {
    pkg.dependencies['expo-router'] = '^6.0.23';
  }

  if (navigation === 'react-navigation') {
    pkg.dependencies['@react-navigation/native'] = '^7.0.14';
    pkg.dependencies['@react-navigation/native-stack'] = '^7.1.10';
  }

  if (features.includes('api')) {
    pkg.dependencies['axios'] = '^1.9.0';
  }

  if (features.includes('env')) {
    pkg.dependencies['expo-constants'] = '~18.0.8';
  }

  if (features.includes('forms')) {
    pkg.dependencies['react-hook-form'] = '^7.71.1';
    pkg.dependencies['@hookform/resolvers'] = '^5.2.2';
    pkg.dependencies['zod'] = '^4.3.6';
  }
  
  pkg.devDependencies = {
    ...pkg.devDependencies,
    '@expo/metro-config': '^54.0.14',
  };

  await fs.writeJson(pkgPath, pkg, { spaces: 2 });
}

// ============================================================
// Config
// ============================================================

export async function createConfig(projectPath: string, navigation: string, features: string[], packageManager: string) {
  const config: Record<string, any> = {
    navigation,
    features,
    architecture: 'modular',
    srcDir: 'src',
    modulesDir: 'src/modules',
    componentsDir: 'src/components',
    hooksDir: 'src/hooks',
    storesDir: 'src/stores',
    uiComponentsDir: 'src/components/ui',
    packageManager,
    namingConvention: {
      files: 'snake_case',
      exports: 'PascalCase',
      hooks: 'camelCase',
    },
    autoRouting: true,
    autoImport: true,
    autoBarrelExport: true,
  };

  if (features.includes('localization')) {
    config.localization = {
      defaultLocale: 'en',
      locales: ['en'],
      localesDir: 'src/locales',
    };
  }

  await fs.writeJson(path.join(projectPath, 'kit.config.json'), config, { spaces: 2 });
}

// ============================================================
// Localization
// ============================================================

export async function setupLocalizationSrc(projectPath: string) {
  const localesDir = path.join(projectPath, 'src', 'locales');
  await fs.ensureDir(localesDir);

  // Copy locale files from core
  copySource('locales/index.ts', path.join(localesDir, 'index.ts'));
  copySource('locales/en.ts', path.join(localesDir, 'en.ts'));

  // Copy locale store
  await fs.ensureDir(path.join(projectPath, 'src', 'stores'));
  copySource('locales/locale-store.ts', path.join(projectPath, 'src', 'stores', 'locale.ts'));

  // Register English locale in index.ts
  const indexPath = path.join(localesDir, 'index.ts');
  let indexFile = await fs.readFile(indexPath, 'utf-8');
  indexFile += `\nregisterLocale('en', () => import('./en'));\n`;
  await fs.writeFile(indexPath, indexFile);
}

// ============================================================
// Environment Config
// ============================================================

export async function setupEnvConfig(projectPath: string) {
  // Create .env files
  const envContent = `# App Environment\nEXPO_PUBLIC_APP_ENV=development\nEXPO_PUBLIC_API_URL=http://localhost:3000\n`;
  await fs.writeFile(path.join(projectPath, '.env'), envContent);

  const envExampleContent = `# Copy this file to .env and fill in your values\nEXPO_PUBLIC_APP_ENV=development\nEXPO_PUBLIC_API_URL=http://localhost:3000\n`;
  await fs.writeFile(path.join(projectPath, '.env.example'), envExampleContent);

  // Copy env.ts utility from core templates
  await fs.ensureDir(path.join(projectPath, 'src', 'lib'));
  copyTemplate('env.ts', path.join(projectPath, 'src', 'lib', 'env.ts'));

  // Add .env to .gitignore
  const gitignorePath = path.join(projectPath, '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    let gitignore = await fs.readFile(gitignorePath, 'utf-8');
    if (!gitignore.includes('.env')) {
      gitignore += '\n# Environment\n.env\n.env.local\n';
      await fs.writeFile(gitignorePath, gitignore);
    }
  }
}

// ============================================================
// API Client
// ============================================================

export async function setupApiClient(projectPath: string) {
  await fs.ensureDir(path.join(projectPath, 'src', 'lib'));
  copyTemplate('api.ts', path.join(projectPath, 'src', 'lib', 'api.ts'));
}
