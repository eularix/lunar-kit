import fs from 'fs-extra';
import path from 'node:path';
import chalk from 'chalk';
import ora, { Ora } from 'ora';
import { loadConfig, assertWithin } from '../utils/helpers.js';
import { execFileNoThrow } from '../utils/execFileNoThrow.js';
import {
  LOCAL_REGISTRY_PATH,
  LOCAL_COMPONENTS_PATH
} from '@lunar-kit/core/cli-utils';

interface ComponentRegistry {
  name: string;
  type: string;
  description?: string;
  files: Array<{
    path: string;
    type: string;
  }>;
  dependencies: string[];
  devDependencies?: string[];
  registryDependencies: string[];
}

/**
 * Add Command Registry
 * 
 * Centralized table for handling different "add" subcommands
 * Each feature registers its handler here
 */
const addCommandHandlers: Record<string, (args: string[]) => Promise<void>> = {
  'locale': addLocaleEntry,
  'locale:update': updateLocaleTranslations,
  // Future: add more handlers here
  // 'theme': addTheme,
  // 'icon': addIcon,
  // 'config': addConfig,
};

/**
 * Main add command dispatcher
 * Routes to appropriate handler based on arguments
 */
export async function addCommand(args: string[]) {
  if (!args || args.length === 0) {
    showAddHelp();
    return;
  }

  const [subcommand, ...restArgs] = args;

  // Handle compound subcommands like 'locale update'
  if (subcommand === 'locale' && restArgs[0] === 'update') {
    const handler = addCommandHandlers['locale:update'];
    if (handler) {
      await handler(restArgs);
      return;
    }
  }

  // Handle simple subcommands like 'locale'
  const handler = addCommandHandlers[subcommand];
  if (handler) {
    await handler(restArgs);
    return;
  }

  // Not a recognized subcommand - treat as component name (legacy behavior)
  await addComponent(subcommand);
}

/**
 * Show help for add subcommands
 */
function showAddHelp() {
  console.log(`
${chalk.bold('Usage:')} lunar add <subcommand> [options]

${chalk.bold('Subcommands:')}
  ${chalk.green('locale')}                                    Add a translation entry to all locale files
  ${chalk.green('<component>')}                               Add a UI component (e.g., button, dialog)

${chalk.bold('Examples:')}
  ${chalk.dim('$ lunar add locale')}
  ${chalk.dim('$ lunar add button')}
  ${chalk.dim('$ lunar add dialog')}
`);
}

/**
 * Get registry source (local or remote)
 */
async function getRegistryPath(): Promise<string> {
  // Check if local registry exists (from @lunar-kit/core package)
  if (await fs.pathExists(LOCAL_REGISTRY_PATH)) {
    return LOCAL_REGISTRY_PATH;
  }

  // Fallback to remote (will need to fetch via axios)
  throw new Error('Local registry not found. Remote registry not yet implemented.');
}

async function getComponentsPath(): Promise<string> {
  if (await fs.pathExists(LOCAL_COMPONENTS_PATH)) {
    return LOCAL_COMPONENTS_PATH;
  }

  throw new Error('Local components not found.');
}

/**
 * Install registry dependencies recursively
 */

// Track installed components to avoid circular dependencies
const installedComponents = new Set<string>();

async function installRegistryDependencies(
  dependencies: string[],
  componentsDir: string,
  spinner: Ora,
  registryPath: string,
  componentsPath: string
): Promise<void> {
  for (const dep of dependencies) {
    if (installedComponents.has(dep)) {
      spinner.text = chalk.dim(`Skipping ${dep} (already installed)`);
      continue;
    }

    spinner.text = `Installing registry dependency: ${chalk.cyan(dep)}`;

    const depRegistryPath = path.join(registryPath, 'ui', `${dep}.json`);

    if (!await fs.pathExists(depRegistryPath)) {
      spinner.warn(`Registry dependency "${dep}" not found. Skipping...`);
      continue;
    }

    const depRegistry: ComponentRegistry = await fs.readJson(depRegistryPath);

    // Recursively install dependencies first
    if (depRegistry.registryDependencies?.length > 0) {
      await installRegistryDependencies(
        depRegistry.registryDependencies,
        componentsDir,
        spinner,
        registryPath,
        componentsPath
      );
    }

    // Copy component files
    for (const file of depRegistry.files) {
      const srcPath = path.join(componentsPath, file.path);
      // Defense-in-depth: registry file paths must stay inside the dest dir.
      const destPath = assertWithin(componentsDir, path.join(componentsDir, file.path));

      if (await fs.pathExists(srcPath)) {
        await fs.ensureDir(path.dirname(destPath));
        await fs.copy(srcPath, destPath);
        spinner.text = `Copied ${chalk.cyan(file.path)}`;
      }
    }

    installedComponents.add(dep);
  }
}

/**
 * Add UI component (legacy behavior - direct component name)
 */
export async function addComponent(componentName: string) {
  const spinner = ora(`Adding ${componentName}...`).start();

  try {
    const config = await loadConfig();
    if (!config) {
      spinner.fail('kit.config.json not found. Run `lunar init` first.');
      return;
    }

    // Get registry and components path from @lunar-kit/core
    const registryPath = await getRegistryPath();
    const componentsPath = await getComponentsPath();

    const componentsDir = path.join(process.cwd(), config.uiComponentsDir || 'src/components/ui');

    // Auto create folder if not exists
    if (!await fs.pathExists(componentsDir)) {
      spinner.text = `Creating directory: ${config.uiComponentsDir}`;
      await fs.ensureDir(componentsDir);
      spinner.succeed(`Created ${chalk.green(config.uiComponentsDir)}`);
      spinner.start(`Adding ${componentName}...`);
    }

    const componentRegistryPath = path.join(registryPath, 'ui', `${componentName}.json`);

    if (!await fs.pathExists(componentRegistryPath)) {
      spinner.fail(`Component "${componentName}" not found in registry`);
      console.log(chalk.dim('Available components:'));
      
      const registryFiles = await fs.readdir(path.join(registryPath, 'ui'));
      const availableComponents = registryFiles
        .filter(f => f.endsWith('.json'))
        .map(f => f.replace('.json', ''));
      
      availableComponents.forEach(comp => {
        console.log(chalk.dim(`  - ${comp}`));
      });
      return;
    }

    const componentRegistry: ComponentRegistry = await fs.readJson(componentRegistryPath);

    // Install registry dependencies first
    if (componentRegistry.registryDependencies?.length > 0) {
      await installRegistryDependencies(
        componentRegistry.registryDependencies,
        componentsDir,
        spinner,
        registryPath,
        componentsPath
      );
    }

    // Copy component files
    for (const file of componentRegistry.files) {
      const srcPath = path.join(componentsPath, file.path);
      // Defense-in-depth: registry file paths must stay inside the dest dir.
      const destPath = assertWithin(componentsDir, path.join(componentsDir, file.path));

      if (await fs.pathExists(srcPath)) {
        await fs.ensureDir(path.dirname(destPath));
        await fs.copy(srcPath, destPath);
        spinner.text = `Copied ${chalk.cyan(file.path)}`;
      }
    }

    installedComponents.add(componentName);

    // Install npm dependencies
    if (componentRegistry.dependencies?.length > 0) {
      spinner.text = 'Installing dependencies...';
      const packageManager = config.packageManager || 'pnpm';
      const [cmd, ...baseArgs] = packageManager === 'npm'
        ? ['npm', 'install']
        : [packageManager, 'add'];

      const result = await execFileNoThrow(cmd, [...baseArgs, ...componentRegistry.dependencies], {
        cwd: process.cwd(),
      });

      if (!result.success) {
        spinner.fail('Failed to install dependencies');
        console.log(chalk.dim(`Run: ${cmd} ${baseArgs.join(' ')} ${componentRegistry.dependencies.join(' ')}`));
        return;
      }
    }

    spinner.succeed(chalk.green(`Component "${componentName}" added successfully`));
    console.log(chalk.dim('Import it in your code:'));
    console.log(chalk.cyan(`  import { ${componentName} } from '${componentsDir}';`));

  } catch (error) {
    spinner.fail('Failed to add component');
    console.error(error);
  }
}

/**
 * Add locale entry (subcommand handler)
 */
async function addLocaleEntry(): Promise<void> {
  // Import dynamically to avoid circular dependency
  const { addLocaleEntry: localeHandler } = await import('./localization.js');
  await localeHandler();
}

/**
 * Update locale translations (subcommand handler)
 */
async function updateLocaleTranslations(): Promise<void> {
  // Import dynamically to avoid circular dependency
  const { updateLocaleTranslations: updateHandler } = await import('./localization.js');
  await updateHandler();
}
