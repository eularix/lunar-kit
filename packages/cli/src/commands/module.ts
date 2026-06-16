import fs from 'fs-extra';
import path from 'node:path';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import { loadConfig, toSnakeCase, toPascalCase, assertSafeRelativePath } from '../utils/helpers.js';
import { addToRouting } from '../utils/routing.js';

interface ModuleOptions {
  modulePath: string;
  isTabs?: boolean;
}

// DONE: Support nested modules (module-1/module-2/module-3)
export async function generateModule(modulePath: string) {
  const spinner = ora('Generating module...').start();

  try {
    const config = await loadConfig();
    if (!config) {
      spinner.fail('kit.config.json not found.');
      return;
    }

    const safeModulePath = assertSafeRelativePath(modulePath);
    const fullPath = path.join(process.cwd(), config.modulesDir, safeModulePath);

    // Check if module exists
    if (fs.existsSync(fullPath)) {
      spinner.fail(`Module ${modulePath} already exists`);
      return;
    }

    // DONE: Get last part of path as module name (support nested)
    const moduleName = path.basename(modulePath);
    const dirs = ['view', 'components', 'hooks', 'store'];

    for (const dir of dirs) {
      await fs.ensureDir(path.join(fullPath, dir));
    }

    // Generate default view
    const viewName = `${toSnakeCase(moduleName)}_view`;
    const viewContent = generateViewTemplate(toPascalCase(moduleName));
    await fs.writeFile(path.join(fullPath, 'view', `${viewName}.tsx`), viewContent);

    // Create barrel export
    const barrelContent = `// Auto-generated exports for ${moduleName} module
export { default as ${toPascalCase(moduleName)}View } from './view/${viewName}';
`;
    await fs.writeFile(path.join(fullPath, 'index.ts'), barrelContent);

    // DONE: Pass full modulePath to routing (support nested)
    await addToRouting(config, modulePath, viewName);

    spinner.succeed(chalk.green(`Module ${modulePath} created successfully!`));
    
    console.log(chalk.dim('\nGenerated:'));
    console.log(chalk.cyan(`  ${config.modulesDir}/${modulePath}/view/${viewName}.tsx`));
    console.log(chalk.cyan(`  ${config.modulesDir}/${modulePath}/index.ts`));
    
    // DONE: Show expo-router route file
    if (config.navigation === 'expo-router') {
      console.log(chalk.cyan(`  app/${moduleName}.tsx`));
    }

  } catch (error) {
    spinner.fail('Failed to generate module');
    console.error(error);
  }
}

// DONE: Support nested tabs modules (tabs-1/tabs-2)
export async function generateTabs(modulePath: string) {
  const spinner = ora('Generating tabs module...').start();

  try {
    const config = await loadConfig();
    if (!config) {
      spinner.fail('kit.config.json not found.');
      return;
    }

    spinner.stop();

    const response = await prompts([
      {
        type: 'confirm',
        name: 'generateTabs',
        message: 'Do you want to generate initial tabs?',
        initial: true,
      },
      {
        type: (prev) => (prev ? 'number' : null),
        name: 'tabCount',
        message: 'How many tabs?',
        initial: 3,
        min: 1,
        max: 10,
      },
      {
        type: (prev, values) => (values.generateTabs ? 'list' : null),
        name: 'tabNames',
        message: 'Tab names (comma-separated):',
        initial: 'home,profile,settings',
        separator: ',',
      },
    ]);

    spinner.start('Creating tabs module...');

    // DONE: Support nested path
    const fullModulePath = path.join(process.cwd(), config.modulesDir, modulePath);
    const moduleName = path.basename(modulePath);
    
    await fs.ensureDir(path.join(fullModulePath, 'tabs'));

    // ========================================
    // KONDISI: Generate tabs layout HANYA untuk React Navigation
    // ========================================
    if (config.navigation !== 'expo-router') {
      const layoutContent = generateTabsLayoutTemplate(moduleName, response.tabNames || []);
      await fs.writeFile(path.join(fullModulePath, 'tabs_layout.tsx'), layoutContent);
    }

    // Generate individual tab modules (sama untuk semua navigation)
    if (response.generateTabs && response.tabNames) {
      for (const tabName of response.tabNames) {
        const tabPath = path.join(fullModulePath, 'tabs', tabName);
        await generateTabModule(tabPath, tabName, config);
        spinner.text = `Generated tab: ${tabName}`;
      }
    }

    // ========================================
    // KONDISI: Barrel export sesuai navigation type
    // ========================================
    const exports = response.tabNames?.map((tab: string) => 
      `export { default as ${toPascalCase(tab)}Tab } from './tabs/${tab}/view/${toSnakeCase(tab)}_view';`
    ).join('\n') || '';

    let barrelContent = `// Auto-generated exports for ${moduleName} tabs module\n`;
    
    // Hanya export TabsLayout untuk React Navigation
    if (config.navigation !== 'expo-router') {
      barrelContent += `export { default as TabsLayout } from './tabs_layout';\n`;
    }
    
    barrelContent += exports + '\n';

    await fs.writeFile(path.join(fullModulePath, 'index.ts'), barrelContent);

    // ========================================
    // KONDISI: Create expo-router layout di app/
    // ========================================
    if (config.navigation === 'expo-router') {
      // DONE: Pass full modulePath to support nested
      await createExpoRouterTabsLayout(config, modulePath, response.tabNames || []);
    }

    spinner.succeed(chalk.green(`Tabs module ${modulePath} created successfully!`));

    console.log(chalk.dim('\nGenerated:'));
    
    // Conditional logging
    if (config.navigation !== 'expo-router') {
      console.log(chalk.cyan(`  ${config.modulesDir}/${modulePath}/tabs_layout.tsx`));
    } else {
      console.log(chalk.cyan(`  app/(${moduleName})/_layout.tsx`));
      if (response.tabNames) {
        response.tabNames.forEach((tab: string) => {
          console.log(chalk.cyan(`  app/(${moduleName})/${tab}.tsx`));
        });
      }
    }
    
    if (response.tabNames) {
      response.tabNames.forEach((tab: string) => {
        console.log(chalk.cyan(`  ${config.modulesDir}/${modulePath}/tabs/${tab}/`));
      });
    }

  } catch (error) {
    spinner.fail('Failed to generate tabs module');
    console.error(error);
  }
}

async function generateTabModule(tabPath: string, tabName: string, config: any) {
  const dirs = ['view', 'components', 'hooks', 'store'];

  for (const dir of dirs) {
    await fs.ensureDir(path.join(tabPath, dir));
  }

  // Generate view
  const viewName = `${toSnakeCase(tabName)}_view`;
  const viewContent = generateViewTemplate(toPascalCase(tabName));
  await fs.writeFile(path.join(tabPath, 'view', `${viewName}.tsx`), viewContent);

  // Create barrel
  const barrelContent = `export { default as ${toPascalCase(tabName)}View } from './view/${viewName}';
`;
  await fs.writeFile(path.join(tabPath, 'index.ts'), barrelContent);
}

function generateViewTemplate(componentName: string): string {
  return `import { View, Text } from 'react-native';

export default function ${componentName}View() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">${componentName}</Text>
    </View>
  );
}
`;
}

function generateTabsLayoutTemplate(moduleName: string, tabs: string[]): string {
  const imports = tabs.map(tab => 
    `import ${toPascalCase(tab)}Tab from './tabs/${tab}/view/${toSnakeCase(tab)}_view';`
  ).join('\n');

  const screens = tabs.map(tab => 
    `      <Tabs.Screen 
        name="${tab}" 
        component={${toPascalCase(tab)}Tab}
        options={{ title: '${toPascalCase(tab)}' }}
      />`
  ).join('\n');

  return `import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
${imports}

const Tabs = createBottomTabNavigator();

export default function ${toPascalCase(moduleName)}TabsLayout() {
  return (
    <Tabs.Navigator>
${screens}
    </Tabs.Navigator>
  );
}
`;
}

// DONE: Support nested tabs module path
async function createExpoRouterTabsLayout(config: any, modulePath: string, tabs: string[]) {
  const moduleName = path.basename(modulePath);
  const appDir = path.join(process.cwd(), 'app', `(${moduleName})`);
  await fs.ensureDir(appDir);

  // Create _layout.tsx for tabs
  const layoutContent = `import { Tabs } from 'expo-router';

export default function ${toPascalCase(moduleName)}Layout() {
  return (
    <Tabs>
${tabs.map(tab => `      <Tabs.Screen name="${tab}" options={{ title: '${toPascalCase(tab)}' }} />`).join('\n')}
    </Tabs>
  );
}
`;

  await fs.writeFile(path.join(appDir, '_layout.tsx'), layoutContent);

  // DONE: Create individual tab files with correct nested path
  for (const tab of tabs) {
    const tabContent = `export { default } from '@modules/${modulePath}/tabs/${tab}/view/${toSnakeCase(tab)}_view';`;
    await fs.writeFile(path.join(appDir, `${tab}.tsx`), tabContent);
  }
}
